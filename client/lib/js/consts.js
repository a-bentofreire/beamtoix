"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// Defines global constants
/** @module shared   | This module will generate a shared/lib file */
/** @module internal | This module is to be read only by developers */
/**
 * ## Description
 *
 * Defines global constants.
 *
 * This module will generate a node module,
 * therefore it can't contain external references.
 */
var BeamToIX;
(function (BeamToIX) {
    // ------------------------------------------------------------------------
    //                               Logging Type
    // ------------------------------------------------------------------------
    BeamToIX.LT_MSG = 0;
    BeamToIX.LT_WARN = 1;
    BeamToIX.LT_ERROR = 2;
    // ------------------------------------------------------------------------
    //                               Logging Level
    // ------------------------------------------------------------------------
    BeamToIX.LL_SILENT = 0;
    BeamToIX.LL_ERROR = 1;
    BeamToIX.LL_WARN = 2;
    BeamToIX.LL_VERBOSE = 3;
    // ------------------------------------------------------------------------
    //                               Args Stage
    // ------------------------------------------------------------------------
    BeamToIX.AS_UNKNOWN = 0;
    BeamToIX.AS_ADD_ANIMATION = 1;
    BeamToIX.AS_RENDERING = 2;
    BeamToIX.AS_STORY = 3;
})(BeamToIX || (BeamToIX = {}));
//# sourceMappingURL=consts.js.map