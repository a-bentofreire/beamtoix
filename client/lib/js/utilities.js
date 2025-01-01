"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
/** @module end-user | The lines bellow convey information for the end-user */
/**
 *
 * ## Description
 *
 * This module provides utility functions, mostly to be used by plugin creators
 * or developers.
 */
var BeamToIX;
(function (BeamToIX) {
    // The following section contains data for the end-user
    // generated by `gulp build-definition-files`
    // -------------------------------
    // #export-section-start: release
    var RoundFuncName;
    (function (RoundFuncName) {
        RoundFuncName[RoundFuncName["none"] = 0] = "none";
        RoundFuncName[RoundFuncName["round"] = 1] = "round";
        RoundFuncName[RoundFuncName["ceil"] = 2] = "ceil";
        RoundFuncName[RoundFuncName["floor"] = 3] = "floor";
        RoundFuncName[RoundFuncName["downRound"] = 4] = "downRound";
    })(RoundFuncName = BeamToIX.RoundFuncName || (BeamToIX.RoundFuncName = {}));
    // #export-section-end: release
    // -------------------------------
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    function parseRoundFunc(handler) {
        if (handler === undefined) {
            return undefined;
        }
        if (typeof handler === 'string') {
            handler = RoundFuncName[handler];
        }
        else if (typeof handler === 'function') {
            return handler;
        }
        switch (handler) {
            case RoundFuncName.round: return Math.round;
            case RoundFuncName.downRound: return BeamToIX.downRound;
            case RoundFuncName.ceil: return Math.ceil;
            case RoundFuncName.floor: return Math.floor;
        }
        return undefined;
    }
    BeamToIX.parseRoundFunc = parseRoundFunc;
    function _applyRoundFunc(values, f) {
        return f ? values.map(function (value) { return f(value); }) : values;
    }
    BeamToIX._applyRoundFunc = _applyRoundFunc;
    function parseHandler(handler, defaultHandler, _mapper, args) {
        if (handler === undefined) {
            if (!defaultHandler) {
                return undefined;
            }
            handler = defaultHandler;
        }
        if (typeof handler === 'string') {
            var exprValue = BeamToIX.ifExprCalc(handler, args);
            if (exprValue !== undefined) {
                handler = exprValue;
            }
        }
        if (typeof handler === 'function') {
            return handler(args);
        }
        else {
            return handler;
        }
    }
    BeamToIX.parseHandler = parseHandler;
    function parseEnum(value, mapper, defValue) {
        // checks for undefined twice, since this way allows also to remap defValue
        if (value === undefined) {
            value = defValue;
        }
        return value === undefined ? defValue :
            (typeof value === 'string' ? mapper[value] : value);
    }
    BeamToIX.parseEnum = parseEnum;
})(BeamToIX || (BeamToIX = {}));
//# sourceMappingURL=utilities.js.map