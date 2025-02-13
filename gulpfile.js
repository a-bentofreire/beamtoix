"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
var sysFs = require("fs");
var sysPath = require("path");
var sysProcess = require("process");
var gulp = require("gulp");
var rimraf = require("rimraf");
var globule = require("globule");
var child_process_1 = require("child_process");
var _a = require('gulp'), series = _a.series, parallel = _a.parallel;
var fsix_js_1 = require("./shared/vendor/fsix.js");
var dev_config_js_1 = require("./shared/dev-config.js");
var build_d_ts_js_1 = require("./shared/dev-builders/build-d-ts.js");
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
var COPYRIGHTS = "\n// ------------------------------------------------------------------------\n// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.\n// Licensed under the MIT License.\n// ------------------------------------------------------------------------\n";
var gulpMinify = require('gulp-minify');
var gulpReplace = require('gulp-replace');
var gulpPreserveTime = require('gulp-preservetime');
var gulpRename = require('gulp-rename');
var gulpConcat = require('gulp-concat');
var cfg = dev_config_js_1.DevCfg.getConfig(__dirname);
var modulesList = fsix_js_1.fsix.loadJsonSync(cfg.paths.MODULES_LIST_FILE);
var libModules = modulesList.libModules;
var pluginModules = modulesList.pluginModules;
var API_FOLDER = 'api';
var EN_LAST_VERSION_PATH = 'en';
// ------------------------------------------------------------------------
//                               Print Usage
// ------------------------------------------------------------------------
exports.default = function (cb) {
    console.log("gulp [task]\n  Where task is\n    build - compiles all files\n\n    build_release_latest - builds the release files where all the files are compiled and minify\n      when: before publishing a new **stable** version and after testing\n\n    update_test_list - updates test-list.json and package.json with the full list of tests\n      when: every time there is a new test or a test change its name\n\n    list_docs_files_as_links - outputs the console the list of document files in markdown link format\n\n    list_paths_macros - lists paths & macros\n");
    cb();
};
exports.list_paths_macros = function (cb) {
    console.log("cfg.paths: ".concat(JSON.stringify(cfg.paths, undefined, 2)));
    console.log("cfg.macros: ".concat(JSON.stringify(cfg.macros, undefined, 2)));
    cb();
};
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
function rimrafExcept(root, except) {
    if (!sysFs.existsSync(root)) {
        return;
    }
    sysFs.readdirSync(root).forEach(function (fileBase) {
        if (except.indexOf(fileBase) === -1) {
            var fileName = "".concat(root, "/").concat(fileBase);
            rimraf.sync("".concat(fileName));
        }
    });
}
// ------------------------------------------------------------------------
//                               Build
// ------------------------------------------------------------------------
exports.build = function (cb) {
    var SRC_FILENAME = './package.json';
    var WARN_MSG = "\n  // This file was generated via npx gulp bump_version\n  // @WARN: Don't edit this file. See the ".concat(SRC_FILENAME, "\n\n");
    var _a = fsix_js_1.fsix.readUtf8Sync(SRC_FILENAME).match(/"version": "([\d\.]+)"/) || ['', ''], _ = _a[0], version = _a[1];
    if (!version) {
        throw "Unable to find the ".concat(SRC_FILENAME, " version");
    }
    var VERSION_OUT = "export const VERSION = \"".concat(version, "\";");
    console.log("".concat(SRC_FILENAME, " version is ").concat(version));
    sysFs.writeFileSync('./shared/version.ts', WARN_MSG + VERSION_OUT + '\n');
    sysFs.writeFileSync("./".concat(cfg.paths.JS_PATH, "/version.ts"), WARN_MSG + "namespace BeamToIX {\n  ".concat(VERSION_OUT, "\n}\n"));
    build_shared(libModules, cfg.paths.JS_PATH, cfg.paths.SHARED_LIB_PATH, 'npx gulp build');
    build_dts_files_beamtoix(libModules, pluginModules, COPYRIGHTS, cfg);
    fsix_js_1.fsix.runExternal('npm run compile', function () {
        console.log('Build');
        cb();
    });
};
// ------------------------------------------------------------------------
//                               build_single_lib_file
// ------------------------------------------------------------------------
function build_single_lib_file(libModules, srcPath, dstPath, dstFile, generateMsg, excludeIdList, isDebug) {
    var WARN_MSG = "\n// This file was generated via ".concat(generateMsg, "\n//\n// @WARN: Don't edit this file.\n");
    var outputList = [];
    libModules.forEach(function (fileTitle) {
        var srcFileName = "".concat(srcPath, "/").concat(fileTitle, ".ts");
        outputList.push(fsix_js_1.fsix.readUtf8Sync(srcFileName));
    });
    var output = WARN_MSG + '\nnamespace BeamToIX {'
        + outputList.join('\n')
            .replace(/}\s*\n+\s*"use strict";/g, '') // removes the inter namespaces
            .replace(/namespace BeamToIX\s*{/g, '')
            .replace(/export\s+(\w+)\s+_(\w+)/g, function (all, tokType, id) {
            return excludeIdList.indexOf(id) === -1 ? "".concat(tokType, " _").concat(id) : all;
        });
    if (!isDebug) {
        output = output.replace(/\/\/\s*#debug-start(?:.|\n)*?\/\/\s*#debug-end/g, function () { return ''; });
    }
    fsix_js_1.fsix.mkdirpSync(dstPath);
    sysFs.writeFileSync(dstFile, output);
}
// ------------------------------------------------------------------------
//                               build_shared
// ------------------------------------------------------------------------
function build_shared(libSourceFileTitles, srcPath, dstPath, generateMsg) {
    var WARN_MSG = "\n// This file was generated via ".concat(generateMsg, "\n//\n// @WARN: Don't edit this file.\n/** @see ");
    var sharedConsts = [];
    function parseSharedConsts(fileTitle, content) {
        var found = false;
        var lastIdPart = '';
        function addConst(line) {
            if (!found) {
                sharedConsts.push("\n  // -------------\n  // ".concat(fileTitle, "\n  // -------------\n"));
                found = true;
            }
            // adds extra line if a different constant group
            var _a = line.match(/^(\w+)\s+(\w+)/) || ['', '', ''], id = _a[2];
            var idParts = id.split('_');
            if (lastIdPart && lastIdPart !== idParts[0]) {
                sharedConsts.push('');
            }
            lastIdPart = idParts[0];
            sharedConsts.push('  export ' + line);
        }
        // scans for consts and enums
        content.replace(/export\s+(const\s+[A-Z]\w+\s*=\s*[^;]+;|enum\s+\w+\s*{[^}]+})/g, function (all, p) {
            addConst(p.replace(/ as.*;/, ';'));
            return all;
        });
    }
    libSourceFileTitles.forEach(function (fileTitle) {
        var srcFileName = "".concat(srcPath, "/").concat(fileTitle, ".ts");
        var content = fsix_js_1.fsix.readUtf8Sync(srcFileName);
        parseSharedConsts(fileTitle, content);
        if (content.match(/@module shared/)) {
            var outNameSpace = fileTitle[0].toUpperCase() + fileTitle.substr(1)
                .replace(/-(\w)/g, function (all, p1) { return p1.toUpperCase(); });
            content = content.replace(/namespace \w+/, "export namespace ".concat(outNameSpace));
            content = content.replace(/[^\n]+@module shared[^\n]+/, "\n".concat(WARN_MSG).concat(srcFileName, " */\n"));
            var dstFileName = "".concat(dstPath, "/").concat(fileTitle, ".ts");
            console.log("writing ".concat(dstFileName));
            sysFs.writeFileSync(dstFileName, content);
        }
    });
    // generates the dev consts file
    sysFs.writeFileSync("".concat(dstPath, "/dev-consts.ts"), "\"use strict\";\n// This file was generated ".concat(generateMsg, "\n//\n// @WARN: Don't edit this file.\n\nexport namespace DevConsts {\n").concat(sharedConsts.join('\n'), "\n}\n"));
}
// ------------------------------------------------------------------------
//                               getDocsTargets
// ------------------------------------------------------------------------
var badgeLine = '';
var getDocsTargets = function (cfg) { return [
    {
        id: 'end-user',
        name: 'End User',
        dstPath: cfg.paths.DOCS_LATEST_END_USER_PATH,
        sourcePaths: [cfg.paths.DOCS_SOURCE_PATH],
        moduleTypes: ['end-user'],
        indexFile: './README.md',
        isEndUser: true,
        logFile: './build-docs-latest-end-user.log',
        processIndexPage: function (data) {
            return data
                .replace(/^(.*)developer-badge\.gif(.*)$/m, function (all, p1, p2) {
                badgeLine = all;
                return p1 + 'end-user-badge.gif' + p2;
            })
                .replace(new RegExp("".concat(cfg.webLinks.webDomain, "/"), 'g'), '/');
        },
    },
    {
        id: 'dev',
        name: 'Developer',
        dstPath: cfg.paths.DOCS_LATEST_DEVELOPER_PATH,
        sourcePaths: [cfg.paths.DOCS_SOURCE_PATH, cfg.paths.DOCS_SOURCE_DEV_PATH],
        moduleTypes: ['end-user', 'developer', 'internal'],
        indexFile: "".concat(cfg.paths.DOCS_SOURCE_PATH, "-dev/README.md"),
        isEndUser: false,
        logFile: './build-docs-latest-dev.log',
        processIndexPage: function (data) {
            return data.replace(/^(# Description.*)$/m, function (all) {
                if (!badgeLine) {
                    throw "end-user should had been processed already.";
                }
                return all + '\n' + badgeLine + '  \n';
            });
        },
    },
]; };
// ------------------------------------------------------------------------
//                               build_dts_files_beamtoix
// ------------------------------------------------------------------------
function build_dts_files_beamtoix(libModules, pluginModules, COPYRIGHTS, cfg) {
    var WARN_MSG = "\n  // This file was generated via gulp build-definition-files\n  //\n  // @WARN: Don't edit this file.\n  ";
    var libSourceFileNames = __spreadArray(__spreadArray([], libModules
        .map(function (fileTitle) { return "".concat(cfg.paths.JS_PATH, "/").concat(fileTitle, ".ts"); }), true), pluginModules
        .map(function (fileTitle) { return "".concat(cfg.paths.PLUGINS_PATH, "/").concat(fileTitle, "/").concat(fileTitle, ".ts"); }), true);
    [{
            uuid: 'bb85cc57-f5e3-4ae9-b498-7d13c07c8516',
            srcFiles: libSourceFileNames,
            docTarget: getDocsTargets(cfg).find(function (target) { return target.id === 'end-user'; }),
            namespace: 'BeamToIX',
            outFile: "".concat(cfg.paths.TYPINGS_PATH, "/beamtoix.d.ts"),
            description: "\n  //\n  // These are the class interfaces for the end-user and plugin creators\n  // Any modification on these interfaces will require an increment in the high number version\n  //",
            acceptId: function (id, idType) {
                switch (idType) {
                    case build_d_ts_js_1.BuildDTsFiles.IdTypes.JsDocs:
                        return id.replace(/@(memberof|extends) _/g, '@$1 ');
                    case build_d_ts_js_1.BuildDTsFiles.IdTypes.ExtendsWords:
                        return id.replace(/\s_/, ' ');
                    case build_d_ts_js_1.BuildDTsFiles.IdTypes.ClassName:
                        return id.replace(/^_/, '');
                    case build_d_ts_js_1.BuildDTsFiles.IdTypes.FunctionName:
                        return '';
                    case build_d_ts_js_1.BuildDTsFiles.IdTypes.MethodName:
                    case build_d_ts_js_1.BuildDTsFiles.IdTypes.VarName:
                        return id[0] === '_' || id === 'constructor' ? '' : id;
                }
                return id;
            },
        },
        {
            uuid: 'a7d9ab44-f9b0-4108-b768-730d7afb20a4',
            srcFiles: libSourceFileNames,
            namespace: 'BeamToIX',
            docTarget: getDocsTargets(cfg).find(function (target) { return target.id === 'dev'; }),
            outFile: "".concat(cfg.paths.TYPINGS_PATH, "/beamtoix-dev.d.ts"),
            description: "\n  //\n  // These are the class interfaces for internal usage only\n  // It won't be deployed on the release version\n  // and it shouldn't be accessed by plugin creators\n  // In theory, all of these class members should be have protected access\n  // but due a lack of 'friend class' mechanism in TypeScript, they have\n  // public access but both the interfaces as well as the members but all\n  // must start with underscore\n  //",
            acceptId: function (id, idType) {
                switch (idType) {
                    case build_d_ts_js_1.BuildDTsFiles.IdTypes.ExtendsWords:
                        return '';
                    case build_d_ts_js_1.BuildDTsFiles.IdTypes.ClassName:
                        return id + 'Impl extends ' + id.replace(/^_/, '');
                    case build_d_ts_js_1.BuildDTsFiles.IdTypes.FunctionName:
                        return '';
                    case build_d_ts_js_1.BuildDTsFiles.IdTypes.MethodName:
                    case build_d_ts_js_1.BuildDTsFiles.IdTypes.VarName: return id[0] !== '_' ? '' : id;
                }
                return id;
            },
        },
        {
            uuid: '61a25ccf-dbe2-49cc-bb39-bc58b68ccbae',
            srcFiles: libSourceFileNames,
            tag: 'release',
            namespace: 'BeamToIX',
            outFile: "".concat(cfg.paths.TYPINGS_PATH, "/release/beamtoix-release.d.ts"),
            description: "\n  //\n  // This file contains about the compilation of all the exported types\n  // targeted for the end-user\n  // The source data is all information in each source code file defined between\n  //      #export-section-start: release\n  // and  #export-section-end: release\n  //\n  // This way the user will have access to all the public information in one file\n  // It won't be used during the development phase.\n  // And it's excluded in tsconfig\n  //",
            acceptId: function (id, idType) {
                return (idType === build_d_ts_js_1.BuildDTsFiles.IdTypes.FunctionName && id[0] === '_') ? '' : id;
            },
        },
    ].forEach(function (target) {
        var outFile = target.outFile;
        var apiPath;
        if (target.docTarget) {
            apiPath = "".concat(target.docTarget.dstPath, "/").concat(EN_LAST_VERSION_PATH, "/").concat(API_FOLDER);
            fsix_js_1.fsix.mkdirpSync(apiPath);
        }
        build_d_ts_js_1.BuildDTsFiles.build(target.srcFiles, outFile, COPYRIGHTS + WARN_MSG + target.description
            + "\n\ndeclare namespace ".concat(target.namespace, " {\n\n"), '\n}\n', target.acceptId, target.tag, apiPath);
        console.log("Build ".concat(outFile));
    });
}
// ------------------------------------------------------------------------
//                               Build Single Lib
// ------------------------------------------------------------------------
var SINGLE_LIB_MODES = [
    { folder: 'min', suffix: '', isDebug: false, path: '' },
    { folder: 'debug.min', suffix: '-debug', isDebug: true, path: '' },
].map(function (mode) {
    mode.path = "".concat(cfg.paths.SINGLE_LIB_PATH, "/").concat(mode.folder);
    return mode;
});
var bs_clean = function (cb) {
    rimrafExcept(cfg.paths.SINGLE_LIB_PATH, []);
    cb();
};
var bs_copy = function (mode) {
    return function copy() {
        return gulp.src([
            './tsconfig.json',
            './client/lib/typings/**',
            '!./client/lib/typings/release/**',
        ], { base: '.' }).pipe(gulp.dest(mode.path));
    };
};
var bs_build_single_ts = function (mode) {
    return function build_single_ts(cb) {
        build_single_lib_file(libModules, cfg.paths.JS_PATH, "".concat(mode.path), "".concat(mode.path, "/beamtoix").concat(mode.suffix, ".ts"), 'npx gulp build_release_latest', [
            exports.Story, // story must always be exported
        ], mode.isDebug);
        cb();
    };
};
var bs_compile_single_ts = function (mode) {
    return function compile_single_ts(cb) {
        (0, child_process_1.exec)('tsc -p ./', { cwd: mode.path }, function () { cb(); });
        // sysExec(`npx esbuild --format=cjs --sourcemap --outdir=${mode.path} ${mode.path}/**/*.ts`, {}, () => { cb() });
    };
};
var build_single_lib_internal = series(bs_clean, parallel.apply(void 0, SINGLE_LIB_MODES.map(function (mode) { return series(bs_copy(mode), bs_build_single_ts(mode), bs_compile_single_ts(mode)); })));
// ------------------------------------------------------------------------
//                               Build Release
// ------------------------------------------------------------------------
var rel_clean = function (cb) {
    rimrafExcept(cfg.paths.RELEASE_LATEST_PATH, ['.git']);
    cb();
};
var rel_client = function () {
    return gulp.src(dev_config_js_1.DevCfg.expandArray(cfg.release.client))
        .pipe(gulp.dest("".concat(cfg.paths.RELEASE_LATEST_PATH, "/client")))
        .pipe(gulpPreserveTime());
};
var rel_client_js_join = function () {
    return gulp.src("".concat(cfg.paths.SINGLE_LIB_PATH, "/*/beamtoix*.js"))
        .pipe(gulpMinify({ noSource: true, ext: { min: '.min.js' } }))
        .pipe(gulpRename({ dirname: '' }))
        .pipe(gulpReplace(/^(.)/, COPYRIGHTS + '$1'))
        .pipe(gulp.dest("".concat(cfg.paths.RELEASE_LATEST_PATH, "/").concat(cfg.paths.JS_PATH)));
};
var rel_gallery = function () {
    return gulp.src([
        "".concat(cfg.paths.GALLERY_PATH, "/").concat(cfg.release.demosStr, "/**"),
        "!".concat(cfg.paths.GALLERY_PATH, "/*/story-frames/*"),
    ], { base: cfg.paths.GALLERY_PATH })
        .pipe(gulp.dest("".concat(cfg.paths.RELEASE_LATEST_PATH, "/gallery")))
        .pipe(gulpPreserveTime());
};
var rel_root = function () {
    return gulp.src(dev_config_js_1.DevCfg.expandArray(cfg.release.root))
        .pipe(gulp.dest(cfg.paths.RELEASE_LATEST_PATH))
        .pipe(gulpPreserveTime());
};
var rel_README = function () {
    return gulp.src(['README.md'])
        .pipe(gulp.dest(cfg.paths.RELEASE_LATEST_PATH))
        .pipe(gulpPreserveTime());
};
var rel_minify = function () {
    // not required to preserve timestamp since `rel_add_copyrights` does the job
    return gulp.src(dev_config_js_1.DevCfg.expandArray(cfg.jsFiles), { base: '.' })
        .pipe(gulpMinify({
        noSource: true, ext: { min: '.js' },
        ignoreFiles: ['beamtoix-cli.js']
    }))
        .pipe(gulp.dest("".concat(cfg.paths.RELEASE_LATEST_PATH)));
};
var rel_minify_cli = function () {
    // there is a bug on recent version of gulp-minify that has issues with mangle the cli file
    return gulp.src(dev_config_js_1.DevCfg.expandArray(['cli/*.js']), { base: '.' })
        .pipe(gulpMinify({ noSource: true, mangle: false, ext: { min: '.js' } }))
        .pipe(gulp.dest("".concat(cfg.paths.RELEASE_LATEST_PATH)));
};
var rel_add_copyrights = function (cb) {
    globule.find(dev_config_js_1.DevCfg.expandArray(cfg.jsFiles)).forEach(function (file) {
        var dstFileName = "".concat(cfg.paths.RELEASE_LATEST_PATH, "/").concat(file);
        if (sysFs.existsSync(file) && sysFs.existsSync(dstFileName)) {
            var content = fsix_js_1.fsix.readUtf8Sync(dstFileName);
            content = content.replace(/("use strict";)/, function (all) { return "".concat(all, "\n") + COPYRIGHTS; });
            sysFs.writeFileSync(dstFileName, content);
            var stat = sysFs.statSync(file);
            sysFs.utimesSync(dstFileName, stat.atime, stat.mtime);
        }
    });
    cb();
};
// copies package.json cleaning the unnecessary config
var rel_build_package_json = function (cb) {
    return gulp.src('./package.json')
        .pipe(gulpReplace(/^((?:.|\n)+)$/, function (_all, p) {
        var pkg = JSON.parse(p);
        // removes all dependencies
        pkg.devDependencies = {};
        // removes unnecessary scripts
        var scripts = {};
        [exports.compile, exports.watch, exports.beamtoix, exports.serve].forEach(function (key) {
            scripts[key] = pkg.scripts[key];
        });
        pkg.scripts = scripts;
        // sets only the repo for the release version.
        // homepage and issue will remain intact
        // pkg.repository.url = pkg.repository.url + '-release';
        return JSON.stringify(pkg, undefined, 2);
    }))
        .pipe(gulp.dest("".concat(cfg.paths.RELEASE_LATEST_PATH)))
        .pipe(gulpPreserveTime());
};
// copies tsconfig.ts to each demo cleaning the unnecessary config
var rel_build_tsconfig_ts = function (demo) {
    return function build_tsconfig_ts(cb) {
        return gulp.src('./tsconfig.json')
            .pipe(gulpReplace(/^((?:.|\n)+)$/, function (_all, p) {
            var tsconfig = JSON.parse(p);
            tsconfig.exclude = [];
            tsconfig["tslint.exclude"] = undefined;
            return JSON.stringify(tsconfig, undefined, 2);
        }))
            .pipe(gulp.dest("".concat(cfg.paths.RELEASE_LATEST_PATH, "/gallery/").concat(demo)))
            .pipe(gulpPreserveTime());
    };
};
// creates a plugin list from modules-list.json
// don't use gulp-file in order to preserve the time-date
var rel_build_plugins_list_json = function (cb) {
    return gulp.src(cfg.paths.MODULES_LIST_FILE)
        .pipe(gulpReplace(/^((?:.|\n)+)$/, function () {
        return JSON.stringify(pluginModules, undefined, 2);
    }))
        .pipe(gulpRename('plugins-list.json'))
        .pipe(gulp.dest("".concat(cfg.paths.RELEASE_LATEST_PATH, "/").concat(cfg.paths.PLUGINS_PATH)))
        .pipe(gulpPreserveTime());
    cb();
};
// joins beamtoix.d.ts and beamtoix-release.d.ts in a single file
var rel_build_beamtoix_d_ts = function (cb) {
    return gulp.src("".concat(cfg.paths.TYPINGS_PATH, "/beamtoix.d.ts"))
        .pipe(gulpReplace(/declare namespace BeamToIX \{/, function (all) {
        var releaseDTs = fsix_js_1.fsix.readUtf8Sync("".concat(cfg.paths.TYPINGS_PATH, "/release/beamtoix-release.d.ts"));
        return all + releaseDTs
            .replace(/^(?:.|\n)*declare namespace BeamToIX \{/, '').replace(/}(?:\s|\n)*$/, '');
    }))
        .pipe(gulp.dest("".concat(cfg.paths.RELEASE_LATEST_PATH, "/").concat(cfg.paths.TYPINGS_PATH)))
        .pipe(gulpPreserveTime());
    cb();
};
var rel_gen_bundle_en = function () {
    var JS_PATH = "".concat(cfg.paths.RELEASE_LATEST_PATH, "/client/lib/js");
    return gulp.src(["".concat(JS_PATH, "/vendor/jquery-easing/jquery.easing.min.js"), "".concat(JS_PATH, "/../messages/messages-en.js"), "".concat(JS_PATH, "/beamtoix.min.js")])
        .pipe(gulpConcat('beamtoix-bundle-en.min.js'))
        .pipe(gulp.dest(JS_PATH));
};
exports.build_release_latest = series(exports.build, build_single_lib_internal, rel_clean, rel_client, rel_gallery, rel_client_js_join, rel_root, rel_README, rel_minify, rel_minify_cli, rel_add_copyrights, rel_build_package_json, series.apply(void 0, cfg.release.demos.map(function (demo) { return rel_build_tsconfig_ts(demo); })), rel_build_beamtoix_d_ts, rel_build_plugins_list_json, rel_gen_bundle_en);
// ------------------------------------------------------------------------
//                               Updates Test List
// ------------------------------------------------------------------------
exports.update_test_list = function (cb) {
    var tests = [];
    sysFs.readdirSync("./test/tests").forEach(function (file) {
        file.replace(/(test-.*)\.ts/, function (_all, testName) {
            tests.push(testName);
            return '';
        });
    });
    var TEST_LIST_FILE = "./test/test-list.json";
    var curTestList = fsix_js_1.fsix.loadJsonSync(TEST_LIST_FILE);
    tests.forEach(function (test) {
        if (curTestList.active.indexOf(test) === -1 &&
            curTestList.disabled.indexOf(test) === -1) {
            console.log("Adding test ".concat(test, " to ").concat(TEST_LIST_FILE));
            curTestList.active.push(test);
        }
    });
    fsix_js_1.fsix.writeJsonSync(TEST_LIST_FILE, curTestList);
    console.log("Updated ".concat(TEST_LIST_FILE));
    var PACKAGE_FILE = "./package.json";
    var pkg = fsix_js_1.fsix.loadJsonSync(PACKAGE_FILE);
    var scripts = pkg.scripts;
    tests.forEach(function (test) {
        if (scripts[test] === undefined) {
            console.log("Adding test ".concat(test, " to ").concat(PACKAGE_FILE));
            scripts[test] = "mocha test/tests/".concat(test, ".js");
        }
    });
    fsix_js_1.fsix.writeJsonSync(PACKAGE_FILE, pkg);
    console.log("Updated ".concat(PACKAGE_FILE));
    cb();
};
// ------------------------------------------------------------------------
//                               Lists ./docs Files As Links
// ------------------------------------------------------------------------
exports.list_docs_files_as_links = function (cb) {
    sysFs.readdirSync("./docs").forEach(function (fileBase) {
        if (sysPath.extname(fileBase) !== '.md') {
            return;
        }
        var title = sysPath.parse(fileBase).name.replace(/-/g, ' ')
            .replace(/\b(\w)/, function (_all, firstChar) { return firstChar.toUpperCase(); });
        console.log("- [".concat(title, "](").concat(fileBase, ")"));
    });
    cb();
};
// ------------------------------------------------------------------------
//                               Lists ./docs Files As Links
// ------------------------------------------------------------------------
exports.prepare_docs = function (cb) {
    var pluginsFolders = sysFs.readdirSync(cfg.paths.PLUGINS_PATH)
        .map(function (fileBase) { return sysPath.join(cfg.paths.PLUGINS_PATH, fileBase); });
    var _loop_1 = function (path) {
        sysFs.readdirSync(path).forEach(function (fileBase) {
            if (sysPath.extname(fileBase) !== '.ts') {
                return;
            }
            var fileName = sysPath.join(path, fileBase);
            var content = fsix_js_1.fsix.readUtf8Sync(fileName);
            var matches = content.match(/\/\*\* @module ([\w-]+)/);
            if (matches) {
                var folder = matches[1].replace('internal', 'developer');
                content = content
                    .replace(/^(.|\n)+?\/\*\*\s*\n \* #/, '/**\n * #')
                    .replace(/\*\/\n(export )*namespace \w+ \{/, '* @packageDocumentation\n*/\nconst module = 0;')
                    .replace(/\}(\n|\s)*$/, '');
                sysFs.writeFileSync(sysPath.join("docs/ts", "API - ".concat(folder), fileBase), content);
            }
        });
    };
    for (var _i = 0, _a = __spreadArray(__spreadArray([], [cfg.paths.JS_PATH, 'cli', 'server',
        cfg.paths.SHARED_LIB_PATH], false), pluginsFolders, true); _i < _a.length; _i++) {
        var path = _a[_i];
        _loop_1(path);
    }
    cb();
};
//# sourceMappingURL=gulpfile.js.map