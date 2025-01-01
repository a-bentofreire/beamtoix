"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
/** @module internal | This module is to be read only by developers */
/**
 * ## Description
 *
 * This module isolates all the property interpolations,
 * allowing to break down the complexity and perform unit tests.
 */
var BeamToIX;
(function (BeamToIX) {
    /** Var used only for internal testing via exact framework  */
    BeamToIX._TEST_DIGIT_LIMIT = 1000;
    // ------------------------------------------------------------------------
    //                               Tools
    // ------------------------------------------------------------------------
    function _bypassModeToBool(isFirst, isLast, mode) {
        switch (mode || BeamToIX.BP_FIRST_INSIDE) {
            case BeamToIX.BP_FIRST_INSIDE: return !isLast;
            case BeamToIX.BP_ALL: return true;
            case BeamToIX.BP_INSIDE: return !isLast && !isFirst;
        }
    }
    // ------------------------------------------------------------------------
    //                               Property Types
    // ------------------------------------------------------------------------
    BeamToIX.PT_BOOLEAN = 0;
    BeamToIX.PT_NUMBER = 1;
    BeamToIX.PT_PIXEL = 2;
    BeamToIX.PT_STR = 3;
    BeamToIX.PT_VALUE_TEXT_LIST = 4;
    BeamToIX.PT_VALUE_TEXT_FUNC = 5;
    BeamToIX.PT_VALUE_TEXT_EXPR = 6;
    /** Pre-compiled RegEx to determine if the string is a pixel. */
    var pxRegExp = /^-?[\d\.]+(?:px)?$/;
    // ------------------------------------------------------------------------
    //                               _parseRelativeValue
    // ------------------------------------------------------------------------
    /**
     * Parses user defined `value`.
     * The `value` is similar to the `startValue` except also
     * supports relative values to the `startValue`.
     */
    function _parseParseValueHandler(value, curValue, args) {
        value = _parseStartValueHandler(value, args);
        if (typeof value === 'string') {
            if (value[0] === '+') {
                return curValue + parseFloat(value.substr(1));
            }
            else if (value[0] === '-') {
                return curValue - parseFloat(value.substr(1));
            }
            else {
                var resValue = parseFloat(value);
                if (isNaN(resValue)) {
                    BeamToIX.throwI8n(BeamToIX.Msgs.ValueTypeError, { p: value });
                }
                return value;
            }
        }
        else {
            return value;
        }
    }
    // ------------------------------------------------------------------------
    //                               _parseStartPropValue
    // ------------------------------------------------------------------------
    /**
     * Parses user defined `value` and `startValue`.
     * If it's a expression, it computes this expression,
     * and if it's a function it computes the function.
     */
    function _parseStartValueHandler(value, args) {
        return BeamToIX.parseHandler(value, undefined, undefined, args);
    }
    // ------------------------------------------------------------------------
    //                               PropInterpolator
    // ------------------------------------------------------------------------
    var _PropInterpolator = /** @class */ (function (_super) {
        __extends(_PropInterpolator, _super);
        function _PropInterpolator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        _PropInterpolator.prototype.attachSelector = function (elementAdpt, elActRg, _isVerbose, args) {
            var self = this;
            var realPropName = this.realPropName;
            var actRg = elActRg.actionRg;
            function getStartValue() {
                // user valueStart has priority
                var valueStart = self.animProp.valueStart;
                if (valueStart !== undefined) {
                    return _parseStartValueHandler(valueStart, args);
                }
                // then comes linking with previous actRg
                if (elActRg.linkIndex !== -1) {
                    return elActRg.actionRgList[elActRg.linkIndex].endValue;
                }
                else {
                    return elementAdpt.getProp(realPropName, args);
                }
            }
            var startValue = getStartValue();
            if (startValue === 'auto') {
                startValue = '';
            }
            var strStartValue = startValue;
            var numStartValue = 0;
            var propType = BeamToIX.PT_NUMBER;
            // computes PROP_TYPE based on startValue
            var valueText = this.animProp.valueText;
            if (valueText) {
                switch (typeof valueText) {
                    case 'string':
                        if (!BeamToIX.isExpr(valueText)) {
                            BeamToIX.throwErr('Invalid valueText');
                        }
                        propType = BeamToIX.PT_VALUE_TEXT_EXPR;
                        break;
                    case 'function':
                        propType = BeamToIX.PT_VALUE_TEXT_FUNC;
                        break;
                    case 'object':
                        propType = BeamToIX.PT_VALUE_TEXT_LIST;
                        if (!valueText.length) {
                            BeamToIX.throwErr('Invalid valueText');
                        }
                        break;
                    default:
                        BeamToIX.throwErr('Invalid valueText');
                }
                numStartValue = BeamToIX.isDigit(strStartValue) ? parseFloat(strStartValue) : 0;
            }
            else {
                switch (typeof startValue) {
                    case 'undefined':
                        break;
                    case 'boolean':
                        propType = BeamToIX.PT_BOOLEAN;
                        numStartValue = startValue === true ? 1 : 0;
                        break;
                    case 'number':
                        numStartValue = startValue;
                        // if this property was animated previously and is pixel,
                        // the start value will be numerical not `%dpx`.
                        if (actRg.propType === BeamToIX.PT_PIXEL) {
                            propType = BeamToIX.PT_PIXEL;
                        }
                        break;
                    case 'string':
                        if (strStartValue === 'true' || strStartValue === 'false') {
                            propType = BeamToIX.PT_BOOLEAN;
                            numStartValue = strStartValue === 'true' ? 1 : 0;
                        }
                        else if (strStartValue.search(pxRegExp) === 0) {
                            // string value is a pure value or a  pixel
                            if (strStartValue.endsWith('px')) {
                                propType = BeamToIX.PT_PIXEL;
                                numStartValue = parseFloat(strStartValue.substr(0, strStartValue.length - 2));
                            }
                            else {
                                propType = BeamToIX.PT_NUMBER;
                                numStartValue = parseFloat(strStartValue);
                            }
                        }
                        else {
                            propType = BeamToIX.PT_STR;
                            numStartValue = BeamToIX.isDigit(strStartValue) ? parseFloat(strStartValue) : 0;
                        }
                }
            }
            var endValue = this.animProp.value;
            var numEndValue;
            // computes EndValue based on value
            switch (propType) {
                case BeamToIX.PT_BOOLEAN:
                    numEndValue = endValue > 0.5 ? 1 : 0;
                    break;
                default:
                    numEndValue = endValue !== undefined ? _parseParseValueHandler(endValue, numStartValue, args) : 1;
            }
            this.propType = propType;
            this.numStartValue = numStartValue;
            this.numEndValue = numEndValue;
            this.variation = this.numEndValue - this.numStartValue;
            this.actRg = actRg;
            actRg.initialValue = numStartValue;
            actRg.waitFor = this.waitFor;
            actRg.propType = this.propType;
        };
        _PropInterpolator.prototype.interpolate = function (t, story, isVerbose) {
            var args = story._args;
            BeamToIX._vars.v0 = this.numStartValue;
            BeamToIX._vars.v1 = this.numEndValue;
            BeamToIX._vars.vd = this.variation;
            // processes easing
            var tAfterEasing = this.easing ? this.easing.func(t, this.easing.params, args) : t;
            BeamToIX._vars.vot = tAfterEasing;
            // processes oscillator
            var tAfterOscillator = this.oscillator
                ? this.oscillator.func(tAfterEasing, this.oscillator.params, args) : tAfterEasing;
            // #debug-start
            if (isVerbose && this.oscillator) {
                story.logFrmt('oscillator', [
                    ['selector', typeof this.oscillator.handler === 'string'
                            ? this.oscillator.handler : ''],
                    ['input', tAfterEasing],
                    ['output', tAfterOscillator],
                ]);
            }
            // #debug-end
            // processes `variation` and `startValue`
            var v = tAfterOscillator * this.variation + this.numStartValue;
            this.curNumValue = v;
            // processes `path`
            var values;
            var dimCount = 1;
            if (this.path) {
                BeamToIX._vars.vpt = v;
                values = this.path.func(v, this.path.params, BeamToIX.FS_RUN, args);
                dimCount = values.length;
                // #debug-start
                if (isVerbose) {
                    story.logFrmt('path', [
                        ['selector', typeof this.path.handler === 'string'
                                ? this.path.handler : ''],
                        ['input', v],
                        ['output', values.toString()],
                    ]);
                }
                // #debug-end
                if (dimCount === 1) {
                    v = values[0];
                }
            }
            var value = v;
            var valueFormat = this.animProp.valueFormat;
            var propType = this.propType;
            if (dimCount === 1) {
                value = this.roundFunc ? this.roundFunc(value) : value;
                switch (propType) {
                    case BeamToIX.PT_BOOLEAN:
                        value = value > 0.5 ? 1 : 0;
                        break;
                    case BeamToIX.PT_PIXEL:
                        value = (this.roundFunc ? v : Math.round(v)).toString() + 'px';
                        break;
                    case BeamToIX.PT_VALUE_TEXT_EXPR:
                        BeamToIX._vars.t = value;
                        value = BeamToIX.calcExpr(this.animProp.valueText, args).toString();
                        break;
                    case BeamToIX.PT_VALUE_TEXT_LIST:
                        var list = this.animProp.valueText;
                        var len = list.length;
                        var listIndex = Math.floor(len * Math.min(Math.max(0, value), 0.999));
                        value = list[listIndex];
                        break;
                    case BeamToIX.PT_VALUE_TEXT_FUNC:
                        value = this.roundFunc ? this.roundFunc(value) : value;
                        value = this.animProp.valueText(v, args);
                        break;
                }
                // #debug-start
                if (isVerbose && typeof value === 'number') {
                    value = Math.round(value * BeamToIX._TEST_DIGIT_LIMIT) / BeamToIX._TEST_DIGIT_LIMIT;
                }
                // #debug-end
                value = valueFormat ? BeamToIX.sprintf(valueFormat, value) : value;
            }
            else {
                // multi-dimension paths
                values = BeamToIX._applyRoundFunc(values, this.roundFunc);
                value = valueFormat ? BeamToIX.sprintf.apply(void 0, __spreadArray([valueFormat], values, false)) : values.toString();
            }
            // console.log(t, v, this.variation, value);
            return value;
        };
        _PropInterpolator.prototype.toAction = function (v, isFirst, isLast) {
            return {
                realPropName: this.realPropName,
                value: v,
                actRg: this.actRg,
                numValue: this.curNumValue,
                toBypassForward: _bypassModeToBool(isFirst, isLast, this.bypassForwardMode),
                toBypassBackward: _bypassModeToBool(isLast, isFirst, this.bypassBackwardMode),
            };
        };
        return _PropInterpolator;
    }(BeamToIX._WorkAnimationProp));
    BeamToIX._PropInterpolator = _PropInterpolator;
    function _applyAction(action, elAdapter, isVerbose, args, simulateOnly) {
        if (simulateOnly === void 0) { simulateOnly = false; }
        var actRg = action.actRg;
        var value = action.value;
        var propName = action.realPropName;
        // #debug-start
        function log(name, aValue) {
            args.story.logFrmt('action', [
                ['id', elAdapter.getId(args)],
                ['prop', name],
                ['value', aValue],
            ]);
        }
        // #debug-end
        function setValue(newValue) {
            if (simulateOnly) {
                return;
            }
            // let prevValue: PropValue;
            // // #debug-start
            // if (isVerbose) { prevValue = elAdapter.getProp(propName, args); }
            // // #debug-end
            elAdapter.setProp(propName, newValue, args);
            // #debug-start
            if (isVerbose) {
                var actualNewValue = elAdapter.getProp(propName, args);
                var isDifferent = newValue !== actualNewValue;
                if (isDifferent) {
                    // compares numerical values taking into account the numeric precision errors
                    if (isDifferent && actRg.propType === BeamToIX.PT_NUMBER) {
                        var actualFloat = Math.round(parseFloat(actualNewValue) * BeamToIX._TEST_DIGIT_LIMIT);
                        var newFloat = Math.round(newValue * BeamToIX._TEST_DIGIT_LIMIT);
                        isDifferent = newFloat !== actualFloat;
                    }
                }
                if (isDifferent) {
                    args.story.logFrmt('action-update-warn', [
                        ['id', elAdapter.getId(args)],
                        ['prop', propName],
                        ['expected', newValue + ''],
                        ['actual', actualNewValue + ''],
                    ], BeamToIX.LT_WARN);
                }
                log(propName, newValue);
            }
            // #debug-end
        }
        setValue(value);
        if (actRg.waitFor && actRg.waitFor.length) {
            for (var _i = 0, _a = actRg.waitFor; _i < _a.length; _i++) {
                var waitFor = _a[_i];
                args.waitMan.addWaitFunc(BeamToIX._handleWaitFor, { waitFor: waitFor, elAdapter: elAdapter });
            }
        }
        return action.numValue;
    }
    BeamToIX._applyAction = _applyAction;
})(BeamToIX || (BeamToIX = {}));
//# sourceMappingURL=interpolator.js.map