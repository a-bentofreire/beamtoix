"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
var fsix_js_1 = require("../shared/vendor/fsix.js");
var sysProcess = require("process");
var Tests;
(function (Tests) {
    var toRunInSerial = sysProcess.argv.join(' ').search(/--serial/) !== -1;
    var tests = JSON.parse(fsix_js_1.fsix.readUtf8Sync("".concat(__dirname, "/test-list.json")));
    console.log(tests);
    if (!toRunInSerial) {
        // At the moment, this is not used since
        tests.active.forEach(function (test) {
            require("./tests/".concat(test, ".js"));
        });
    }
    else {
        var activeTestFiles = tests.active.map(function (test) { return "".concat(__dirname, "/tests/").concat(test, ".js"); });
        var sm = require('happner-serial-mocha');
        var logFolder_1 = "".concat(__dirname, "/log");
        sm.runTasks(activeTestFiles, null, logFolder_1)
            .then(function (_results) {
            // Do what you want with data
            console.log("The log report files are on ".concat(logFolder_1));
        })
            .catch(function (err) { return console.log(err); });
    }
})(Tests || (Tests = {}));
//# sourceMappingURL=tests.js.map