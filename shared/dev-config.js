"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevCfg = void 0;
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
var yaml = require("js-yaml");
var fsix_js_1 = require("./vendor/fsix.js");
var DevCfg;
(function (DevCfg) {
    // ------------------------------------------------------------------------
    //                               Get Config
    // ------------------------------------------------------------------------
    var cfg;
    function getConfig(projPath) {
        if (!cfg) {
            cfg = yaml.load(fsix_js_1.fsix.readUtf8Sync('./config.yaml'), yaml.DEFAULT_FULL_SCHEMA);
            cfg.paths.PROJ_PATH = fsix_js_1.fsix.toPosixSlash(projPath);
            cfg.release.demosStr = cfg.release.demos.length > 1 ?
                "{".concat(cfg.release.demos.join(','), "}") : cfg.release.demos[0];
            expandMap(cfg.webLinks);
            expandMap(cfg.paths);
        }
        return cfg;
    }
    DevCfg.getConfig = getConfig;
    function expandMacro(value) {
        var changed = false;
        do {
            changed = false;
            value = value.replace(/\${(\w+)}/g, function (_all, key) {
                changed = true;
                return cfg.macros[key] || cfg.paths[key];
            });
        } while (changed);
        return value;
    }
    DevCfg.expandMacro = expandMacro;
    function expandMap(map) {
        Object.keys(map).forEach(function (key) {
            map[key] = expandMacro(map[key]);
        });
        return map;
    }
    DevCfg.expandMap = expandMap;
    function expandArray(arr) {
        arr.forEach(function (value, index) {
            arr[index] = expandMacro(value);
        });
        return arr;
    }
    DevCfg.expandArray = expandArray;
})(DevCfg || (exports.DevCfg = DevCfg = {}));
//# sourceMappingURL=dev-config.js.map