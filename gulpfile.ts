"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

import * as sysFs from "fs";
import * as sysPath from "path";
import * as sysProcess from "process";
import * as gulp from "gulp";
import * as rimraf from "rimraf";
import * as globule from "globule";
import { exec as sysExec } from "child_process";
const { series, parallel } = require('gulp');
import { fsix } from "./shared/vendor/fsix.js";
import { DevCfg } from "./shared/dev-config.js";
import { BuildDTsFiles } from "./shared/dev-builders/build-d-ts.js";


/** @module developer | This module won't be part of release version */

/**
 * ## Description
 *
 * This gulp file builds the release files, definition files, cleans and
 * updates data.
 *
 * To see all the usages run `gulp`
 *
 * @HINT: It's advisable to execute these gulp tasks via `npm run task`
 *
 */

// const __dirname = sysPath.resolve(sysPath.dirname((__filename)));
sysProcess.chdir(__dirname);

/** List of files and folders to typical preserve on `rm -rf` */
// const PRESERVE_FILES = ['README.md', 'README-dev.md', '.git', '.gitignore'];
const COPYRIGHTS = `
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
`;

const gulpMinify = require('gulp-minify');
const gulpReplace = require('gulp-replace');
const gulpPreserveTime = require('gulp-preservetime');
const gulpRename = require('gulp-rename');
const gulpConcat = require('gulp-concat');

const cfg = DevCfg.getConfig(__dirname);
const modulesList = fsix.loadJsonSync(cfg.paths.MODULES_LIST_FILE) as Shared.ModulesList;
const libModules = modulesList.libModules;
const pluginModules = modulesList.pluginModules;

const API_FOLDER = 'api';
const EN_LAST_VERSION_PATH = 'en';

// ------------------------------------------------------------------------
//                               Print Usage
// ------------------------------------------------------------------------

exports.default = function (cb) {
    console.log(`gulp [task]
  Where task is
    build - compiles all files

    build_release_latest - builds the release files where all the files are compiled and minify
      when: before publishing a new **stable** version and after testing

    update_test_list - updates test-list.json and package.json with the full list of tests
      when: every time there is a new test or a test change its name

    list_docs_files_as_links - outputs the console the list of document files in markdown link format

    list_paths_macros - lists paths & macros
`);
    cb();
}


exports.list_paths_macros = function (cb) {
    console.log(`cfg.paths: ${JSON.stringify(cfg.paths, undefined, 2)}`);
    console.log(`cfg.macros: ${JSON.stringify(cfg.macros, undefined, 2)}`);
    cb();
}

// ------------------------------------------------------------------------
//                               rimrafExcept
// ------------------------------------------------------------------------

/**
 * Recursive deletes files and folders except the ones defined in the except list
 * Only the direct children files and folders from the root are allowed
 * to be in except list
 * @param root Root folder
 * @param except list of file
 */
function rimrafExcept(root: string, except: string[]): void {
    if (!sysFs.existsSync(root)) { return; }

    sysFs.readdirSync(root).forEach(fileBase => {
        if (except.indexOf(fileBase) === -1) {
            const fileName = `${root}/${fileBase}`;
            rimraf.sync(`${fileName}`);
        }
    });
}

// ------------------------------------------------------------------------
//                               Build
// ------------------------------------------------------------------------

exports.build = function (cb) {
    const SRC_FILENAME = './package.json';
    const WARN_MSG = `
  // This file was generated via npx gulp bump_version
  // @WARN: Don't edit this file. See the ${SRC_FILENAME}
\n`;
    const [_, version] = fsix.readUtf8Sync(SRC_FILENAME).match(/"version": "([\d\.]+)"/) || ['', ''];
    if (!version) {
        throw `Unable to find the ${SRC_FILENAME} version`;
    }
    const VERSION_OUT = `export const VERSION = "${version}";`;
    console.log(`${SRC_FILENAME} version is ${version}`);
    sysFs.writeFileSync('./shared/version.ts', WARN_MSG + VERSION_OUT + '\n');
    sysFs.writeFileSync(`./${cfg.paths.JS_PATH}/version.ts`,
        WARN_MSG + `namespace BeamToIX {\n  ${VERSION_OUT}\n}\n`);

    build_shared(libModules, cfg.paths.JS_PATH, cfg.paths.SHARED_LIB_PATH, 'npx gulp build');
    build_dts_files_beamtoix(libModules, pluginModules, COPYRIGHTS, cfg);

    fsix.runExternal('npm run compile', () => {
        console.log('Build');
        cb();
    });
}

// ------------------------------------------------------------------------
//                               build_single_lib_file
// ------------------------------------------------------------------------

function build_single_lib_file(libModules: string[],
    srcPath: string, dstPath: string, dstFile: string,
    generateMsg: string, excludeIdList: string[], isDebug: boolean): void {

    const WARN_MSG = `
// This file was generated via ${generateMsg}
//
// @WARN: Don't edit this file.
`;

    const outputList = [];

    libModules.forEach(fileTitle => {
        const srcFileName = `${srcPath}/${fileTitle}.ts`;
        outputList.push(fsix.readUtf8Sync(srcFileName));
    });

    let output = WARN_MSG + '\nnamespace BeamToIX {'
        + outputList.join('\n')
            .replace(/}\s*\n+\s*"use strict";/g, '') // removes the inter namespaces
            .replace(/namespace BeamToIX\s*{/g, '')
            .replace(/export\s+(\w+)\s+_(\w+)/g, (all, tokType, id) =>
                excludeIdList.indexOf(id) === -1 ? `${tokType} _${id}` : all,
            );

    if (!isDebug) {
        output = output.replace(/\/\/\s*#debug-start(?:.|\n)*?\/\/\s*#debug-end/g,
            () => '');
    }

    fsix.mkdirpSync(dstPath);
    sysFs.writeFileSync(dstFile, output);
}

// ------------------------------------------------------------------------
//                               build_shared
// ------------------------------------------------------------------------

function build_shared(libSourceFileTitles: string[],
    srcPath: string, dstPath: string,
    generateMsg: string) {

    const WARN_MSG = `
// This file was generated via ${generateMsg}
//
// @WARN: Don't edit this file.
/** @see `;

    const sharedConsts = [];

    function parseSharedConsts(fileTitle: string, content: string): void {
        let found = false;
        let lastIdPart = '';

        function addConst(line: string): void {
            if (!found) {
                sharedConsts.push(`
  // -------------
  // ${fileTitle}
  // -------------
`);
                found = true;
            }

            // adds extra line if a different constant group
            const [, , id] = line.match(/^(\w+)\s+(\w+)/) || ['', '', ''];
            const idParts = id.split('_');
            if (lastIdPart && lastIdPart !== idParts[0]) {
                sharedConsts.push('');
            }
            lastIdPart = idParts[0];

            sharedConsts.push('  export ' + line);
        }

        // scans for consts and enums
        content.replace(/export\s+(const\s+[A-Z]\w+\s*=\s*[^;]+;|enum\s+\w+\s*{[^}]+})/g, (all, p) => {
            addConst(p.replace(/ as.*;/, ';'));
            return all;
        });
    }


    libSourceFileTitles.forEach(fileTitle => {
        const srcFileName = `${srcPath}/${fileTitle}.ts`;
        let content = fsix.readUtf8Sync(srcFileName);
        parseSharedConsts(fileTitle, content);
        if (content.match(/@module shared/)) {

            const outNameSpace = fileTitle[0].toUpperCase() + fileTitle.substr(1)
                .replace(/-(\w)/g, (all, p1) => p1.toUpperCase());
            content = content.replace(/namespace \w+/, `export namespace ${outNameSpace}`);
            content = content.replace(/[^\n]+@module shared[^\n]+/, `\n${WARN_MSG}${srcFileName} */\n`);

            const dstFileName = `${dstPath}/${fileTitle}.ts`;
            console.log(`writing ${dstFileName}`);
            sysFs.writeFileSync(dstFileName, content);
        }
    });


    // generates the dev consts file
    sysFs.writeFileSync(`${dstPath}/dev-consts.ts`,
        `"use strict";
// This file was generated ${generateMsg}
//
// @WARN: Don't edit this file.

export namespace DevConsts {
${sharedConsts.join('\n')}
}
`);
}

// ------------------------------------------------------------------------
//                               getDocsTargets
// ------------------------------------------------------------------------

let badgeLine = '';

const getDocsTargets = (cfg: DevCfg.DevConfig) => [
    {
        id: 'end-user',
        name: 'End User',
        dstPath: cfg.paths.DOCS_LATEST_END_USER_PATH,
        sourcePaths: [cfg.paths.DOCS_SOURCE_PATH],
        moduleTypes: ['end-user'],
        indexFile: './README.md',
        isEndUser: true,
        logFile: './build-docs-latest-end-user.log',
        processIndexPage: (data: string) => {
            return data
                .replace(/^(.*)developer-badge\.gif(.*)$/m, (all, p1, p2) => {
                    badgeLine = all;
                    return p1 + 'end-user-badge.gif' + p2;
                })
                .replace(new RegExp(`${cfg.webLinks.webDomain}/`, 'g'), '/');
        },
    },
    {
        id: 'dev',
        name: 'Developer',
        dstPath: cfg.paths.DOCS_LATEST_DEVELOPER_PATH,
        sourcePaths: [cfg.paths.DOCS_SOURCE_PATH, cfg.paths.DOCS_SOURCE_DEV_PATH],
        moduleTypes: ['end-user', 'developer', 'internal'],
        indexFile: `${cfg.paths.DOCS_SOURCE_PATH}-dev/README.md`,
        isEndUser: false,
        logFile: './build-docs-latest-dev.log',
        processIndexPage: (data: string) => {
            return data.replace(/^(# Description.*)$/m, (all) => {
                if (!badgeLine) {
                    throw `end-user should had been processed already.`;
                }
                return all + '\n' + badgeLine + '  \n';
            });
        },
    },
];

// ------------------------------------------------------------------------
//                               build_dts_files_beamtoix
// ------------------------------------------------------------------------

function build_dts_files_beamtoix(libModules: string[],
    pluginModules: string[],
    COPYRIGHTS: string,
    cfg: DevCfg.DevConfig) {

    const WARN_MSG = `
  // This file was generated via gulp build-definition-files
  //
  // @WARN: Don't edit this file.
  `;

    const libSourceFileNames = [...libModules
        .map(fileTitle => `${cfg.paths.JS_PATH}/${fileTitle}.ts`),
    ...pluginModules
        .map(fileTitle => `${cfg.paths.PLUGINS_PATH}/${fileTitle}/${fileTitle}.ts`)];

    [{
        uuid: 'bb85cc57-f5e3-4ae9-b498-7d13c07c8516',
        srcFiles: libSourceFileNames,
        docTarget: getDocsTargets(cfg).find(target => target.id === 'end-user'),
        namespace: 'BeamToIX',
        outFile: `${cfg.paths.TYPINGS_PATH}/beamtoix.d.ts`,
        description: `
  //
  // These are the class interfaces for the end-user and plugin creators
  // Any modification on these interfaces will require an increment in the high number version
  //`,
        acceptId: (id: string, idType: BuildDTsFiles.IdTypes) => {
            switch (idType) {
                case BuildDTsFiles.IdTypes.JsDocs:
                    return id.replace(/@(memberof|extends) _/g, '@$1 ');
                case BuildDTsFiles.IdTypes.ExtendsWords:
                    return id.replace(/\s_/, ' ');
                case BuildDTsFiles.IdTypes.ClassName:
                    return id.replace(/^_/, '');
                case BuildDTsFiles.IdTypes.FunctionName:
                    return '';
                case BuildDTsFiles.IdTypes.MethodName:
                case BuildDTsFiles.IdTypes.VarName:
                    return id[0] === '_' || id === 'constructor' ? '' : id;
            }
            return id;
        },
    },
    {
        uuid: 'a7d9ab44-f9b0-4108-b768-730d7afb20a4',
        srcFiles: libSourceFileNames,
        namespace: 'BeamToIX',
        docTarget: getDocsTargets(cfg).find(target => target.id === 'dev'),
        outFile: `${cfg.paths.TYPINGS_PATH}/beamtoix-dev.d.ts`,
        description: `
  //
  // These are the class interfaces for internal usage only
  // It won't be deployed on the release version
  // and it shouldn't be accessed by plugin creators
  // In theory, all of these class members should be have protected access
  // but due a lack of 'friend class' mechanism in TypeScript, they have
  // public access but both the interfaces as well as the members but all
  // must start with underscore
  //`,
        acceptId: (id: string, idType: BuildDTsFiles.IdTypes) => {
            switch (idType) {
                case BuildDTsFiles.IdTypes.ExtendsWords:
                    return '';
                case BuildDTsFiles.IdTypes.ClassName:
                    return id + 'Impl extends ' + id.replace(/^_/, '');
                case BuildDTsFiles.IdTypes.FunctionName:
                    return '';
                case BuildDTsFiles.IdTypes.MethodName:
                case BuildDTsFiles.IdTypes.VarName: return id[0] !== '_' ? '' : id;
            }
            return id;
        },
    },
    {
        uuid: '61a25ccf-dbe2-49cc-bb39-bc58b68ccbae',
        srcFiles: libSourceFileNames,
        tag: 'release',
        namespace: 'BeamToIX',
        outFile: `${cfg.paths.TYPINGS_PATH}/release/beamtoix-release.d.ts`,
        description: `
  //
  // This file contains about the compilation of all the exported types
  // targeted for the end-user
  // The source data is all information in each source code file defined between
  //      #export-section-start: release
  // and  #export-section-end: release
  //
  // This way the user will have access to all the public information in one file
  // It won't be used during the development phase.
  // And it's excluded in tsconfig
  //`,
        acceptId: (id: string, idType: BuildDTsFiles.IdTypes) => {
            return (idType === BuildDTsFiles.IdTypes.FunctionName && id[0] === '_') ? '' : id;
        },
    },
    ].forEach(target => {
        const outFile = target.outFile;

        let apiPath;
        if (target.docTarget) {
            apiPath = `${target.docTarget.dstPath}/${EN_LAST_VERSION_PATH}/${API_FOLDER}`;
            fsix.mkdirpSync(apiPath);
        }

        BuildDTsFiles.build(target.srcFiles,
            outFile,
            COPYRIGHTS + WARN_MSG + target.description
            + `\n\ndeclare namespace ${target.namespace} {\n\n`, '\n}\n',
            target.acceptId, target.tag, apiPath,
        );
        console.log(`Build ${outFile}`);
    });
}

// ------------------------------------------------------------------------
//                               Build Single Lib
// ------------------------------------------------------------------------

const SINGLE_LIB_MODES = [
    { folder: 'min', suffix: '', isDebug: false, path: '' },
    { folder: 'debug.min', suffix: '-debug', isDebug: true, path: '' },
].map(mode => {
    mode.path = `${cfg.paths.SINGLE_LIB_PATH}/${mode.folder}`;
    return mode;
});

const bs_clean = function (cb) {
    rimrafExcept(cfg.paths.SINGLE_LIB_PATH, []);
    cb();
}

const bs_copy = function (mode) {
    return function copy() {
        return gulp.src([
            './tsconfig.json',
            './client/lib/typings/**',
            '!./client/lib/typings/release/**',
        ], { base: '.' }).pipe(gulp.dest(mode.path))
    }
}

const bs_build_single_ts = function (mode) {
    return function build_single_ts(cb) {
        build_single_lib_file(libModules, cfg.paths.JS_PATH,
            `${mode.path}`, `${mode.path}/beamtoix${mode.suffix}.ts`,
            'npx gulp build_release_latest', [
            exports.Story, // story must always be exported
        ], mode.isDebug);
        cb();
    }
}

const bs_compile_single_ts = function (mode) {
    return function compile_single_ts(cb) {
        sysExec('tsc -p ./', { cwd: mode.path }, () => { cb() });
        // sysExec(`npx esbuild --format=cjs --sourcemap --outdir=${mode.path} ${mode.path}/**/*.ts`, {}, () => { cb() });
    }
}


const build_single_lib_internal = series(
    bs_clean,
    parallel(...SINGLE_LIB_MODES.map(mode => series(bs_copy(mode), bs_build_single_ts(mode),
        bs_compile_single_ts(mode))))
);

// ------------------------------------------------------------------------
//                               Build Release
// ------------------------------------------------------------------------

const rel_clean = function (cb) {
    rimrafExcept(cfg.paths.RELEASE_LATEST_PATH, ['.git']);
    cb();
}

const rel_client = function () {
    return gulp.src(DevCfg.expandArray(cfg.release.client))
        .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/client`))
        .pipe(gulpPreserveTime());
}

const rel_client_js_join = function () {
    return gulp.src(`${cfg.paths.SINGLE_LIB_PATH}/*/beamtoix*.js`)
        .pipe(gulpMinify({ noSource: true, ext: { min: '.min.js' } }))
        .pipe(gulpRename({ dirname: '' }))
        .pipe(gulpReplace(/^(.)/, COPYRIGHTS + '$1'))
        .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/${cfg.paths.JS_PATH}`));
}
const rel_gallery = function () {
    return gulp.src([
        `${cfg.paths.GALLERY_PATH}/${cfg.release.demosStr}/**`,
        `!${cfg.paths.GALLERY_PATH}/*/story-frames/*`,
    ], { base: cfg.paths.GALLERY_PATH })
        .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/gallery`))
        .pipe(gulpPreserveTime());
}


const rel_root = function () {
    return gulp.src(DevCfg.expandArray(cfg.release.root))
        .pipe(gulp.dest(cfg.paths.RELEASE_LATEST_PATH))
        .pipe(gulpPreserveTime());
}

const rel_README = function () {
    return gulp.src(['README.md'])
        .pipe(gulp.dest(cfg.paths.RELEASE_LATEST_PATH))
        .pipe(gulpPreserveTime());
}

const rel_minify = function () {
    // not required to preserve timestamp since `rel_add_copyrights` does the job
    return gulp.src(DevCfg.expandArray(cfg.jsFiles), { base: '.' })
        .pipe(gulpMinify({
            noSource: true, ext: { min: '.js' },
            ignoreFiles: ['beamtoix-cli.js']
        }))
        .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}`));
}

const rel_minify_cli = function () {
    // there is a bug on recent version of gulp-minify that has issues with mangle the cli file
    return gulp.src(DevCfg.expandArray(['cli/*.js']), { base: '.' })
        .pipe(gulpMinify({ noSource: true, mangle: false, ext: { min: '.js' } }))
        .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}`));
}

const rel_add_copyrights = function (cb) {
    globule.find(DevCfg.expandArray(cfg.jsFiles)).forEach(file => {
        const dstFileName = `${cfg.paths.RELEASE_LATEST_PATH}/${file}`;
        if (sysFs.existsSync(file) && sysFs.existsSync(dstFileName)) {
            let content = fsix.readUtf8Sync(dstFileName);
            content = content.replace(/("use strict";)/, (all) => `${all}\n` + COPYRIGHTS);
            sysFs.writeFileSync(dstFileName, content);
            const stat = sysFs.statSync(file);
            sysFs.utimesSync(dstFileName, stat.atime, stat.mtime);
        }
    });
    cb();
}

// copies package.json cleaning the unnecessary config
const rel_build_package_json = function (cb) {
    return gulp.src('./package.json')
        .pipe(gulpReplace(/^((?:.|\n)+)$/, (_all, p) => {
            const pkg = JSON.parse(p);

            // removes all dependencies
            pkg.devDependencies = {};

            // removes unnecessary scripts
            const scripts = {};
            [exports.compile, exports.watch, exports.beamtoix, exports.serve].forEach(key => {
                scripts[key] = pkg.scripts[key];
            });
            pkg.scripts = scripts;

            // sets only the repo for the release version.
            // homepage and issue will remain intact
            // pkg.repository.url = pkg.repository.url + '-release';

            return JSON.stringify(pkg, undefined, 2);
        }))
        .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}`))
        .pipe(gulpPreserveTime());
}

// copies tsconfig.ts to each demo cleaning the unnecessary config
const rel_build_tsconfig_ts = function (demo) {
    return function build_tsconfig_ts(cb) {
        return gulp.src('./tsconfig.json')
            .pipe(gulpReplace(/^((?:.|\n)+)$/, (_all, p) => {
                const tsconfig = JSON.parse(p);
                tsconfig.exclude = [];
                tsconfig["tslint.exclude"] = undefined;
                return JSON.stringify(tsconfig, undefined, 2);
            }))
            .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/gallery/${demo}`))
            .pipe(gulpPreserveTime());
    }
}

// creates a plugin list from modules-list.json
// don't use gulp-file in order to preserve the time-date
const rel_build_plugins_list_json = function (cb) {
    return gulp.src(cfg.paths.MODULES_LIST_FILE)
        .pipe(gulpReplace(/^((?:.|\n)+)$/, () => {
            return JSON.stringify(pluginModules, undefined, 2);
        }))
        .pipe(gulpRename('plugins-list.json'))
        .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/${cfg.paths.PLUGINS_PATH}`))
        .pipe(gulpPreserveTime());
    cb();
}

// joins beamtoix.d.ts and beamtoix-release.d.ts in a single file
const rel_build_beamtoix_d_ts = function (cb) {
    return gulp.src(`${cfg.paths.TYPINGS_PATH}/beamtoix.d.ts`)
        .pipe(gulpReplace(/declare namespace BeamToIX \{/, (all) => {
            const releaseDTs = fsix.readUtf8Sync(`${cfg.paths.TYPINGS_PATH}/release/beamtoix-release.d.ts`);
            return all + releaseDTs
                .replace(/^(?:.|\n)*declare namespace BeamToIX \{/, '').replace(/}(?:\s|\n)*$/, '');
        }))
        .pipe(gulp.dest(`${cfg.paths.RELEASE_LATEST_PATH}/${cfg.paths.TYPINGS_PATH}`))
        .pipe(gulpPreserveTime());
    cb();
}

const rel_gen_bundle_en = function () {
    const JS_PATH = `${cfg.paths.RELEASE_LATEST_PATH}/client/lib/js`;
    return gulp.src([`${JS_PATH}/vendor/jquery-easing/jquery.easing.min.js`,
    `${JS_PATH}/../messages/messages-en.js`, `${JS_PATH}/beamtoix.min.js`])
        .pipe(gulpConcat('beamtoix-bundle-en.min.js'))
        .pipe(gulp.dest(JS_PATH));
}

exports.build_release_latest = series(
    exports.build,
    build_single_lib_internal,
    rel_clean,
    rel_client,
    rel_gallery,
    rel_client_js_join,
    rel_root,
    rel_README,
    rel_minify,
    rel_minify_cli,
    rel_add_copyrights,
    rel_build_package_json,
    series(...cfg.release.demos.map(demo => rel_build_tsconfig_ts(demo))),
    rel_build_beamtoix_d_ts,
    rel_build_plugins_list_json,
    rel_gen_bundle_en
);

// ------------------------------------------------------------------------
//                               Updates Test List
// ------------------------------------------------------------------------

exports.update_test_list = function (cb) {
    const tests = [];

    sysFs.readdirSync(`./test/tests`).forEach(file => {
        file.replace(/(test-.*)\.ts/, (_all, testName) => {
            tests.push(testName);
            return '';
        });
    });


    interface TestListFile {
        disabled: string[];
        active: string[];
    }

    const TEST_LIST_FILE = `./test/test-list.json`;
    const curTestList: TestListFile = fsix.loadJsonSync(TEST_LIST_FILE);

    tests.forEach(test => {
        if (curTestList.active.indexOf(test) === -1 &&
            curTestList.disabled.indexOf(test) === -1) {
            console.log(`Adding test ${test} to ${TEST_LIST_FILE}`);
            curTestList.active.push(test);
        }
    });
    fsix.writeJsonSync(TEST_LIST_FILE, curTestList);
    console.log(`Updated ${TEST_LIST_FILE}`);

    const PACKAGE_FILE = `./package.json`;
    const pkg: { scripts: { [script: string]: string } } =
        fsix.loadJsonSync(PACKAGE_FILE);
    const scripts = pkg.scripts;

    tests.forEach(test => {
        if (scripts[test] === undefined) {
            console.log(`Adding test ${test} to ${PACKAGE_FILE}`);
            scripts[test] = `mocha test/tests/${test}.js`;
        }
    });

    fsix.writeJsonSync(PACKAGE_FILE, pkg);
    console.log(`Updated ${PACKAGE_FILE}`);
    cb();
}

// ------------------------------------------------------------------------
//                               Lists ./docs Files As Links
// ------------------------------------------------------------------------

exports.list_docs_files_as_links = function (cb) {
    sysFs.readdirSync(`./docs`).forEach(fileBase => {
        if (sysPath.extname(fileBase) !== '.md') { return; }
        const title = sysPath.parse(fileBase).name.replace(/-/g, ' ')
            .replace(/\b(\w)/, (_all, firstChar: string) => firstChar.toUpperCase());
        console.log(`- [${title}](${fileBase})`);
    });
    cb();
}

// ------------------------------------------------------------------------
//                               Lists ./docs Files As Links
// ------------------------------------------------------------------------

exports.prepare_docs = function (cb) {
    const pluginsFolders = sysFs.readdirSync(cfg.paths.PLUGINS_PATH)
        .map(fileBase => sysPath.join(cfg.paths.PLUGINS_PATH, fileBase));
    for (const path of [...[cfg.paths.JS_PATH, 'cli', 'server',
    cfg.paths.SHARED_LIB_PATH], ...pluginsFolders]) {
        sysFs.readdirSync(path).forEach(fileBase => {
            if (sysPath.extname(fileBase) !== '.ts') { return; }
            const fileName = sysPath.join(path, fileBase);
            let content = fsix.readUtf8Sync(fileName);
            const matches = content.match(/\/\*\* @module ([\w-]+)/);
            if (matches) {
                const folder = matches[1].replace('internal', 'developer');
                content = content
                    .replace(/^(.|\n)+?\/\*\*\s*\n \* #/, '/**\n * #')
                    .replace(/\*\/\n(export )*namespace \w+ \{/, '* @packageDocumentation\n*/\nconst module = 0;')
                    .replace(/\}(\n|\s)*$/, '');
                sysFs.writeFileSync(sysPath.join(`docs/ts`, `API - ${folder}`, fileBase), content);
            }
        });
    }
    cb();
}
