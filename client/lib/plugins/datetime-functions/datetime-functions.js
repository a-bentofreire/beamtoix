"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// Implements a list of built-in text Tasks
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 *
 * This plugin has the following datetime functions:
 *
 * `now` - returns the current date/time to be used by the other datetime functions.
 *
 * `date` - returns a specific date/time to be used by the other functions.
 *   The input can be the following:
 *  - a textual formated date or date/time. e.g. `date('1974-04-25 12:20:10')`.
 *      for the supported formats, read [Mozilla Date Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).
 *  - 3 numerical values, representing `year,month,day`. e.g. `date(1985,6,12)`.
 *  - 6 numerical values, representing date and time. e.g. `date(1755,11,1,9,40,0)`.
 *
 * `formatDateTime` - returns a formatted version of the datetime.
 *   The input is:
 *   - format. this follows the rules of [momentjs](https://momentjs.com/docs/#/displaying/).
 *          The supported tokens are:
 *     - `YY` - 2-digits year.
 *     - `YYYY` - 4-digits year.
 *     - `M` - month.
 *     - `MM` - zero-pad month. e.g. `02`.
 *     - `MMM` - 3-char month name.
 *     - `MMMM` - long month name.
 *     - `d` - day of the week.
 *     - `ddd` - 3-char day of the week.
 *     - `dddd` - long day of the week.
 *     - `D` - day of the month.
 *     - `DD` - zero-pad day of the month.
 *     - `H` - hour (0-23).
 *     - `HH` - zero-pad hour (00-23).
 *     - `h` - hour (1-12).
 *     - `hh` - zero-pad hour (01-12).
 *     - `m` - minute.
 *     - `mm` - zero-pad minute.
 *     - `s` - second.
 *     - `ss` - zero-pad second.
 *     - `A` - AM PM.
 *     - `a` - am pm.
 *   - datetime. A value created by `now` or by `date`.
 *   - optional locale. Used to decode month, AM/PM, and weekday names.
 *
 * `year` - returns the 4-digit year of the datetime.
 *   The datetime is a value created by `now` or by `date`.
 *
 * `shortYear` - returns the 2-digit year of the datetime.
 *   The datetime is a value created by `now` or by `date`.
 *
 * `month` - returns the month of the datetime.
 *   The datetime is a value created by `now` or by `date`.
 *
 * `day` - returns the day of the datetime.
 *   The datetime is a value created by `now` or by `date`.
 *
 * `hour` - returns the hour of the datetime.
 *   The datetime is a value created by `now` or by `date`.
 *
 * `minute` - returns the minute of the datetime.
 *   The datetime is a value created by `now` or by `date`.
 *
 * `second` - returns the second of the datetime.
 *   The datetime is a value created by `now` or by `date`.
 */
var BeamToIX;
(function (BeamToIX) {
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    BeamToIX.pluginManager.addPlugin({
        id: 'beamtoix.datetime-functions',
        uuid: '782cbaf4-1f1e-426c-bfbd-89c2f6ab4bbb',
        author: 'Alexandre Bento Freire',
        email: 'beamtoix@a-bentofreire.com',
        jsUrls: ['plugins/datetime-functions/datetime-functions.js'],
        teleportable: true,
    });
    // ------------------------------------------------------------------------
    //                               Functions
    // ------------------------------------------------------------------------
    function _timeCommon(params, req, f) {
        req.checkParams(req, 1, [1 /* ExFuncParamType.Number */]);
        req.res.paType = 1 /* ExFuncParamType.Number */;
        f(req.res, new Date(params[0].numValue));
    }
    function _now(_params, req) {
        req.checkParams(req, 0);
        req.res.paType = 1 /* ExFuncParamType.Number */;
        req.res.numValue = new Date().valueOf();
    }
    function _date(params, req) {
        var paramCount = params.length;
        var dt;
        if (paramCount === 1 && params[0].paType === 2 /* ExFuncParamType.String */) {
            dt = new Date(params[0].sValue);
        }
        else if (paramCount === 3) {
            req.checkParams(req, 3, [1 /* ExFuncParamType.Number */, 1 /* ExFuncParamType.Number */, 1 /* ExFuncParamType.Number */]);
            dt = new Date(params[0].numValue, params[1].numValue - 1, params[2].numValue);
        }
        else if (paramCount === 6) {
            req.checkParams(req, 6, [1 /* ExFuncParamType.Number */, 1 /* ExFuncParamType.Number */, 1 /* ExFuncParamType.Number */,
                1 /* ExFuncParamType.Number */, 1 /* ExFuncParamType.Number */, 1 /* ExFuncParamType.Number */]);
            dt = new Date(params[0].numValue, params[1].numValue - 1, params[2].numValue, params[3].numValue, params[4].numValue, params[5].numValue);
        }
        else {
            req.checkParams(req, 1, [2 /* ExFuncParamType.String */]);
        }
        req.res.paType = 1 /* ExFuncParamType.Number */;
        req.res.numValue = dt.valueOf();
    }
    function _formatDateTime(params, req) {
        var hasLocale = params.length === 3;
        req.checkParams(req, hasLocale ? 3 : 2, hasLocale ? [2 /* ExFuncParamType.String */, 1 /* ExFuncParamType.Number */, 2 /* ExFuncParamType.String */] :
            [2 /* ExFuncParamType.String */, 1 /* ExFuncParamType.Number */]);
        var frmt = params[0].sValue;
        var dt = new Date(params[1].numValue);
        var locale = hasLocale ? params[2].sValue : 'en-us';
        req.res.paType = 2 /* ExFuncParamType.String */;
        req.res.sValue = frmt.replace(/(\w)(\1*)/g, function (p) {
            function pad(v) {
                var s = v.toString();
                s = (p.length === 2 && s.length < 2) ? '0' + s : s;
                return s;
            }
            function dayTime() {
                var hPM = dt.toLocaleString(locale, { hour: '2-digit', hour12: true });
                return hPM.substr(hPM.length - 2, 2);
            }
            switch (p) {
                case 'YY': return (dt.getFullYear() % 100).toString();
                case 'YYYY': return dt.getFullYear().toString();
                case 'M':
                case 'MM': return pad(dt.getMonth() + 1);
                case 'MMM': return dt.toLocaleString(locale, { month: 'short' });
                case 'MMMM': return dt.toLocaleString(locale, { month: 'long' });
                case 'd': return dt.getDay().toString();
                case 'ddd': return dt.toLocaleString(locale, { weekday: 'short' });
                case 'dddd': return dt.toLocaleString(locale, { weekday: 'long' });
                case 'D':
                case 'DD': return pad(dt.getDate());
                case 'H':
                case 'HH': return pad(dt.getHours());
                case 'h':
                case 'hh': return pad((dt.getHours() % 12) || 12);
                case 'm':
                case 'mm': return pad(dt.getMinutes());
                case 's':
                case 'ss': return pad(dt.getSeconds());
                case 'A': return dayTime().toUpperCase();
                case 'a': return dayTime().toLowerCase();
            }
            return p;
        });
    }
    function _year(params, req) {
        _timeCommon(params, req, function (res, dt) { res.numValue = dt.getFullYear(); });
    }
    function _shortYear(params, req) {
        _year(params, req);
        req.res.numValue = req.res.numValue % 100;
    }
    function _month(params, req) {
        _timeCommon(params, req, function (res, dt) { res.numValue = dt.getMonth() + 1; });
    }
    function _day(params, req) {
        _timeCommon(params, req, function (res, dt) { res.numValue = dt.getDate(); });
    }
    function _hour(params, req) {
        _timeCommon(params, req, function (res, dt) { res.numValue = dt.getHours(); });
    }
    function _minute(params, req) {
        _timeCommon(params, req, function (res, dt) { res.numValue = dt.getMinutes(); });
    }
    function _second(params, req) {
        _timeCommon(params, req, function (res, dt) { res.numValue = dt.getSeconds(); });
    }
    BeamToIX.pluginManager.addFunctions([
        ['now', _now], ['date', _date], ['formatDateTime', _formatDateTime],
        ['year', _year], ['shortYear', _shortYear], ['month', _month], ['day', _day],
        ['hour', _hour], ['minute', _minute], ['second', _second],
    ]);
})(BeamToIX || (BeamToIX = {}));
//# sourceMappingURL=datetime-functions.js.map