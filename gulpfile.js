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
var build_d_ts_beamtoix_js_1 = require("./shared/dev-builders/build-d-ts-beamtoix.js");
var build_shared_js_1 = require("./shared/dev-builders/build-shared.js");
var build_single_lib_file_js_1 = require("./shared/dev-builders/build-single-lib-file.js");
var build_gallery_latest_js_1 = require("./shared/dev-builders/build-gallery-latest.js");
var dev_config_js_1 = require("./shared/dev-config.js");
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
// const gulpZip = require('gulp-zip');
var cfg = dev_config_js_1.DevCfg.getConfig(__dirname);
var modulesList = fsix_js_1.fsix.loadJsonSync(cfg.paths.MODULES_LIST_FILE);
var libModules = modulesList.libModules;
var pluginModules = modulesList.pluginModules;
var exampleNames = sysFs.readdirSync(cfg.paths.GALLERY_SRC_PATH)
    .filter(function (file) { return file.startsWith('animate'); });
var exampleArray = __spreadArray([], Array(exampleNames.length), true);
// ------------------------------------------------------------------------
//                               Print Usage
// ------------------------------------------------------------------------
exports.default = function (cb) {
    console.log("gulp [task]\n  Where task is\n    bump_version - builds version files from package.json\n      when: before publishing a new version\n\n    clean - executes clean-gallery-src\n\n    build_release_latest - builds the release files where all the files are compiled and minify\n      when: before publishing a new **stable** version and after testing\n\n    build_shared_lib - builds files from the client library to be used by server, tests and cli\n      when: every time a module tagged with @module shared or\n            constants that are useful for server and cli are modified\n\n    build_docs_latest_deprecated - builds both the end-user and developer documentation\n      when: before publishing a new **stable** version and after testing\n\n    post_build_docs_latest_deprecated - changes links for offline testing and adds other improvements\n\n    build_definition_files - builds definition files for end-user and developer\n      when: after any public or shared member of a class is modified\n\n    build_gallery_src_gifs - builds all the animated gifs for each example in the gallery\n      when: before build-gallery-latest\n      warn: this can be a long operation\n\n    build_gallery_latest - builds release version of the gallery\n      --local builds using local links\n      when: before publishing a new gallery, after build-gallery-src-gifs\n\n    clean_gallery_src - deletes all the ".concat(cfg.paths.GALLERY_SRC_PATH, "/story-frames files and folder\n      when: cleaning day!\n\n    clean_gallery_src_png - deletes all the ").concat(cfg.paths.GALLERY_SRC_PATH, "/story-frames/*.png\n\n    update_gallery_src_scripts - builds a new version of ")
        + "".concat(cfg.paths.GALLERY_SRC_PATH, "/*/index.html with script list updated\n      when: every time there is a new module on the library or a module change its name\n            first must update on the ").concat(cfg.paths.CLIENT_PATH, "/lib/js/modules.json\n\n    update_test_list - updates test-list.json and package.json with the full list of tests\n      when: every time there is a new test or a test change its name\n\n    list_docs_files_as_links - outputs the console the list of document files in markdown link format\n\n    list_paths_macros - lists paths & macros\n\n    README_to_online - converts all online README.md local links to online links\n\n    README_to_local - converts all online README.md online links to local links\n\n    "));
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
//                               updateHtmlPages
// ------------------------------------------------------------------------
/**
 * Updates the html links.
 * For release and release-gallery it removes the individual links,
 * and replaces with the compiled version.
 * In other cases, just updates links.
 */
function updateHtmlPages(srcPath, destPath, newScriptFiles, setReleaseLinks, srcOptions) {
    return gulp.src(srcPath, srcOptions)
        .pipe(gulpReplace(/<body>((?:.|\n)+)<\/body>/, function (_all, p) {
        var lines = p.split('\n');
        var outLines = [];
        var state = 0;
        lines.forEach(function (line) {
            if (state < 2) {
                if (line.match(/lib\/js\/[\w\-]+.js"/)) {
                    state = 1;
                    return;
                }
                else if (state === 1 && line.trim()) {
                    newScriptFiles.forEach(function (srcFile) {
                        outLines.push("   <script src=\"".concat(srcFile, ".js\"></script>"));
                    });
                    state = 2;
                }
            }
            outLines.push(line);
        });
        return '<body>' + outLines.join('\n') + '</body>';
    }))
        .pipe(gulpReplace(/^(?:.|\n)+$/, function (all) {
        return setReleaseLinks ? all.replace(/\.\.\/\.\.\/client\/lib/g, 'beamtoix') : all;
    }))
        .pipe(gulp.dest(destPath));
}
// ------------------------------------------------------------------------
//                               Clean
// ------------------------------------------------------------------------
exports.clean = exports.clean_gallery_src;
// ------------------------------------------------------------------------
//                               Bump Version
// ------------------------------------------------------------------------
exports.bump_version = function (cb) {
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
    fsix_js_1.fsix.runExternal('npx gulp build_shared_lib', function () {
        fsix_js_1.fsix.runExternal('npm run compile', function () {
            console.log('Version bumped');
            cb();
        });
    });
};
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
        build_single_lib_file_js_1.BuildSingleLibFile.build(libModules, cfg.paths.JS_PATH, "".concat(mode.path), "".concat(mode.path, "/beamtoix").concat(mode.suffix, ".ts"), 'npx gulp build_release_latest', [
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
// jquery_typings is over 300k. no longer being deployed 
var rel_jquery_typings = function () {
    return gulp.src("node_modules/@types/jquery/**")
        .pipe(gulp.dest("".concat(cfg.paths.RELEASE_LATEST_PATH, "/").concat(cfg.paths.TYPINGS_PATH, "/vendor/jquery")))
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
        "".concat(cfg.paths.GALLERY_SRC_PATH, "/").concat(cfg.release.demosStr, "/**"),
        "!".concat(cfg.paths.GALLERY_SRC_PATH, "/*/story-frames/*"),
    ], { base: cfg.paths.GALLERY_SRC_PATH })
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
exports.build_release_latest = series(build_single_lib_internal, rel_clean, rel_client, rel_gallery, rel_client_js_join, rel_root, rel_README, rel_minify, rel_minify_cli, rel_add_copyrights, rel_build_package_json, series.apply(void 0, cfg.release.demos.map(function (demo) { return rel_build_tsconfig_ts(demo); })), rel_build_beamtoix_d_ts, rel_build_plugins_list_json, rel_gen_bundle_en);
// ------------------------------------------------------------------------
//                               Builds Shared Modules from Client
// ------------------------------------------------------------------------
exports.build_shared_lib = function (cb) {
    build_shared_js_1.BuildShared.build(libModules, cfg.paths.JS_PATH, cfg.paths.SHARED_LIB_PATH, 'npx gulp build_shared_lib');
    cb();
};
// ------------------------------------------------------------------------
//                               Builds Definition Files
// ------------------------------------------------------------------------
exports.build_definition_files = function (cb) {
    build_d_ts_beamtoix_js_1.BuildDTsFilesBeamToIX.build(libModules, pluginModules, '', COPYRIGHTS, cfg);
    cb();
};
// ------------------------------------------------------------------------
//                               Builds the documentation
// ------------------------------------------------------------------------
exports.build_docs_latest_deprecated = function (cb) {
    // BuildDocsLatest.build(libModules, pluginModules, cfg);
    cb();
};
exports.post_build_docs_latest_deprecated = function (cb) {
    // const wordMap: DevCfg.DevDocsWordMap = {};
    // cfg.docs.keywords.forEach(word => { wordMap[word] = { wordClass: exports.keyword }; });
    // cfg.docs.jsTypes.forEach(word => { wordMap[word] = { wordClass: exports.type }; });
    // cfg.docs.customTypes.forEach(wordPair => {
    //     wordMap[wordPair[0]] = {
    //         wordClass: exports.type,
    //         title: wordPair[1],
    //     };
    // });
    // BuildDocsLatest.postBuild([
    //     `{${cfg.paths.DOCS_LATEST_END_USER_PATH},${cfg.paths.DOCS_LATEST_DEVELOPER_PATH}}/en/site{/,/*/}*.html`],
    //     cfg.docs.replacePaths, wordMap);
    cb();
};
// ------------------------------------------------------------------------
//                               Builds Release Version Of The Gallery
// ------------------------------------------------------------------------
function gal_rel_clear(cb) {
    rimrafExcept(cfg.paths.GALLERY_LATEST_PATH, ['.git']);
    cb();
}
function gal_rel_get_examples(cb) {
    build_gallery_latest_js_1.BuildGalleryLatest.populateReleaseExamples(cfg);
    cb();
}
function gal_rel_copy_files(index) {
    return function rel_copy_files(cb) {
        var ex = build_gallery_latest_js_1.BuildGalleryLatest.releaseExamples[index];
        var srcList = ["".concat(ex.srcFullPath, "/**"), "!".concat(ex.srcFullPath, "/{*.html,story.json,story-frames/*.png}")];
        if (ex.srcFullPath.includes('remote-server')) {
            srcList.push("!".concat(ex.srcFullPath, "/assets{/**,}"));
        }
        return gulp.src(srcList, { dot: true })
            .pipe(gulp.dest(ex.dstFullPath));
    };
}
function gal_rel_update_html_files(index) {
    return function rel_update_html_files(cb) {
        var ex = build_gallery_latest_js_1.BuildGalleryLatest.releaseExamples[index];
        return updateHtmlPages("".concat(ex.srcFullPath, "/*.html"), ex.dstFullPath, ["../../".concat(cfg.paths.JS_PATH, "/beamtoix.min")], true);
    };
}
function gal_rel_online_html_files(index) {
    var onlineLink = "".concat(cfg.webLinks.webDomain, "/").concat(cfg.paths.RELEASE_LATEST_PATH, "/client/lib");
    return function rel_online_html_files(cb) {
        var ex = build_gallery_latest_js_1.BuildGalleryLatest.releaseExamples[index];
        return gulp.src(["".concat(ex.dstFullPath, "/index.html")])
            .pipe(gulpReplace(/^(?:.|\n)+$/, function (all) {
            return all
                .replace(/"beamtoix\//g, "\"".concat(onlineLink, "/"))
                .replace(/(<head>)/g, '<!-- This file was created to be used online only. -->\n$1');
        }))
            .pipe(gulpRename('index-online.html'))
            .pipe(gulp.dest(ex.dstFullPath))
            .pipe(gulpPreserveTime());
    };
}
function gal_rel_create_zip(index) {
    return function rel_create_zip(cb) {
        var ex = build_gallery_latest_js_1.BuildGalleryLatest.releaseExamples[index];
        cb();
        // return gulp.src([
        //     `${ex.dstFullPath}/**`,
        //     `${ex.dstFullPath}/.allowed-plugins.json`,
        //     `!${ex.dstFullPath}/index-online.html`,
        //     `!${ex.dstFullPath}/*.zip`,
        //     `!${ex.dstFullPath}/story-frames/*.{json,gif,mp4}`,
        // ])
        //     .pipe(gulpZip(BuildGalRel.EXAMPLE_ZIP_FILE))
        //     .pipe(gulp.dest(ex.dstFullPath));
    };
}
exports.build_gallery_latest = series(gal_rel_clear, gal_rel_get_examples, parallel.apply(void 0, __spreadArray(__spreadArray([], exampleArray.map(function (_, index) { return series(gal_rel_copy_files(index), gal_rel_update_html_files(index), gal_rel_online_html_files(index), gal_rel_create_zip(index)); }), false), [function gal_rel_process_readme(cb) {
        build_gallery_latest_js_1.BuildGalleryLatest.buildReadMe(cfg);
        cb();
    }], false)));
// ------------------------------------------------------------------------
//                               Deletes gallery story-frames folder
// ------------------------------------------------------------------------
exports.clean_gallery_src = function (cb) {
    rimraf.sync("".concat(cfg.paths.GALLERY_SRC_PATH, "/*/story-frames"));
    cb();
};
exports.clean_gallery_src_png = function (cb) {
    rimraf.sync("".concat(cfg.paths.GALLERY_SRC_PATH, "/*/story-frames/*.png"));
    cb();
};
// ------------------------------------------------------------------------
//                               Creates gallery examples gif image
// ------------------------------------------------------------------------
exports.build_gallery_src_gifs = series(exports.clean_gallery_src_png, function (cb) {
    build_gallery_latest_js_1.BuildGalleryLatest.buildGifs(cfg);
    cb();
});
// ------------------------------------------------------------------------
//                               Update Gallery Scripts
// ------------------------------------------------------------------------
exports.update_gallery_src_scripts = function () {
    var DST_PATH = "".concat(cfg.paths.GALLERY_SRC_PATH, "-updated");
    rimraf.sync("".concat(DST_PATH, "/**"));
    var newScriptFiles = libModules.map(function (srcFile) { return "../../".concat(cfg.paths.JS_PATH, "/").concat(srcFile); });
    return updateHtmlPages("".concat(cfg.paths.GALLERY_SRC_PATH, "/*/*.html"), DST_PATH, newScriptFiles, false);
};
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
// ------------------------------------------------------------------------
//                               Lists ./docs Files As Links
// ------------------------------------------------------------------------
function changeReadmeLinks(toLocal, cb) {
    var IN_FILE = './README.md';
    var BAK_FILE = IN_FILE + '.bak.md';
    var srcRegEx = new RegExp('\\]\\(' + (toLocal ? cfg.webLinks.webDomain : '') + '/', exports.g);
    var dstLink = '](' + (toLocal ? '' : cfg.webLinks.webDomain) + '/';
    var content = fsix_js_1.fsix.readUtf8Sync(IN_FILE);
    sysFs.writeFileSync(BAK_FILE, content);
    content = content.replace(srcRegEx, dstLink);
    sysFs.writeFileSync(IN_FILE, content);
    cb();
}
exports.readme_to_online = function (cb) { changeReadmeLinks(false, cb); };
exports.readme_to_local = function (cb) { changeReadmeLinks(true, cb); };
//# sourceMappingURL=gulpfile.js.map