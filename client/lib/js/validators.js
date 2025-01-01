"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * This module provides validations functions to check if input values
 * are within the expected space.
 * Mostly to be used by plugin creators or developers.
 */
var BeamToIX;
(function (BeamToIX) {
    function throwErr(msg) {
        throw msg;
    }
    BeamToIX.throwErr = throwErr;
    function throwI8n(msg, params) {
        throwErr(BeamToIX.i8nMsg(msg, params));
    }
    BeamToIX.throwI8n = throwI8n;
    function throwIf(isTrue, msg) {
        if (isTrue) {
            throwErr(msg);
        }
    }
    BeamToIX.throwIf = throwIf;
    function throwIfI8n(isTrue, msg, params) {
        if (isTrue) {
            throwErr(BeamToIX.i8nMsg(msg, params));
        }
    }
    BeamToIX.throwIfI8n = throwIfI8n;
    BeamToIX.isPositiveNatural = function (value) {
        return (typeof value === 'number') && value > 0 &&
            (Math.abs(Math.floor(value) - value) < 0.0000001);
    };
    BeamToIX.isNotNegativeNatural = function (value) {
        return (typeof value === 'number') && value >= 0 &&
            (Math.abs(Math.floor(value) - value) < 0.0000001);
    };
    BeamToIX.isPositive = function (value) {
        return (typeof value === 'number') && value > 0;
    };
    BeamToIX.isNotNegative = function (value) {
        return (typeof value === 'number') && value >= 0;
    };
})(BeamToIX || (BeamToIX = {}));
//# sourceMappingURL=validators.js.map