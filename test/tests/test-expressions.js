"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
var exact_js_1 = require("../exact.js");
var chai_1 = require("chai");
var Tests;
(function (Tests) {
    var jsMacros = [];
    var tests = [];
    function add(expr, label, expected) {
        // if (tests.length > 0) { return; }
        var i = tests.length;
        tests.push({
            index: tests.length,
            name: expr,
            label: label ? label + ':  ' : '',
            expr: expr,
            expected: (expected ? (typeof expected === 'function'
                ? expected : expected.toString()) : undefined)
                // tslint:disable-next-line:no-eval
                || (eval(expr.substr(1))).toString(),
        });
        jsMacros.push(["\"f".concat(i, "\""), "function (t) {\n          if (t === 0) {\n            var actual = BeamToIX.calcExpr(\"".concat(expr, "\", story._args);\n          }\n      return t;\n    }")]);
    }
    // @TODO: Implement array testing
    // add('=[56.4, 6, 7]', 'simple array', '56.4,6,7');
    add('=  -5', 'simple value');
    add('= 4 -5', 'number sign');
    add('=  12 + 24', 'simple binary op');
    add('=  12 + 24 + 8', 'multiple binary op');
    add('=  12 + 24 + 8 * 2', 'priorities');
    add('=  12 + 24 +    8 * 2 * -4');
    add('=  12 + 24 +    8 * 2 * 4 + 7');
    add('=  12 / 24 +    8 * 2 / 4 + 7');
    // test string variables
    add("=  'beamtoix'", 'string values', 'beamtoix');
    add("=  'travel ' + 'around ' + 'world' ", 'string concatenation', 'travel around world');
    // @TODO: add a test new line meta chars. Requires some changes in the code.
    add("='beamtoix \\\\'animation\\\\' '", 'string meta chars', "beamtoix 'animation' ");
    // test parenthesis
    add('=  (5) ', 'simple parenthesis');
    add('=  (5 + 3) ');
    // test priorities
    add('=  (5 + 3) * 4 ');
    add('=  ((15 + 33.5) * 4)');
    add('=  34.4 - ((15 + 33.5) * 4)');
    add('=  (34.4 - ((15 + 33.5) * 4) - 7) ');
    // test vars
    add('= e + pi', 'variables', (Math.E + Math.PI).toString());
    add('= e * (23.56 + pi)', 'variables ops', (Math.E * (23.56 + Math.PI)).toString());
    // test functions
    add('=random()', 'zero param func', function (actual) {
        var v = parseFloat(actual);
        return (v < 0 || v > 1) ? 'Invalid Random' : actual;
    });
    add('=round(14.4)', 'one param func', Math.round(14.4).toString());
    add('=round(14.4 + 34.2 * e)', 'one param func with bin op', Math.round(14.4 + 34.2 * Math.E).toString());
    add("='#' + rgb(2 + 3 * 8, 12 - 6, 50 - 30)", 'multi param function', '#1a0614');
    // test errors
    add('= (5', 'tests end parenthesis error', '<error>');
    add('=  55 <= 55.4', 'comparison', '1');
    add('=  55.4 == 55.6', 'inequality', '0');
    add('=  55.4 == 55.4', 'equality', '1');
    var outputMap = {};
    var func = function (rd, done, index) {
        var test = tests[index];
        var filteredExpr = test.expr.replace(/\\\\/g, '\\');
        var actual;
        if (test.expected !== '<error>') {
            actual = outputMap[filteredExpr];
        }
        else {
            actual = rd.exceptions[test.index] ? '<error>' : 'NO ERROR';
        }
        var expected = typeof test.expected !== 'function' ? test.expected
            : test.expected(actual);
        chai_1.assert.isTrue(expected === actual, "Expected: [".concat(expected, "], Actual: [").concat(actual, "]"));
        done();
    };
    var testParams = {};
    tests.forEach(function (test) {
        testParams["".concat(test.label, "\"").concat(test.name, "\" ~> \"").concat(test.expected, "\"")] = func;
    });
    exact_js_1.Exact.runTestSuite(__filename, {
        fps: 2,
        css: '',
        animes: tests.map(function (_test, index) {
            return {
                selector: "#t".concat(index),
                props: [{
                        prop: 'left',
                        duration: '2f',
                        easing: "f".concat(index),
                        value: 5,
                    }],
            };
        }),
        html: exact_js_1.Exact.genTestHtml(tests.length),
    }, {
        jsMacros: jsMacros,
        plugins: ['color-functions'],
        tests: testParams,
        // toLogStdOut: true,
        onParseOutputLine: function (line) {
            exact_js_1.Exact.getResTagParams(line, 'expression', function (exprData) {
                var filteredExpr = exprData[0].replace(/\\n/g, '(newline)');
                outputMap[filteredExpr] = exprData[1];
            });
        },
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=test-expressions.js.map