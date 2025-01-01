"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// Implements a list of core functions
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 * In the BeamToIX 2.x the core functions will move into this plugin.
 * To prevent breaking changes include now the js script `core-functions.js` on the html file.
 *
 */
var BeamToIX;
(function (BeamToIX) {
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    BeamToIX.pluginManager.addPlugin({
        id: 'beamtoix.core-functions',
        uuid: '3e5d5813-348a-4eb1-a8b5-9c87c3988923',
        author: 'Alexandre Bento Freire',
        email: 'beamtoix@a-bentofreire.com',
        jsUrls: ['plugins/core-functions/core-functions.js'],
        teleportable: true,
    });
})(BeamToIX || (BeamToIX = {}));
//# sourceMappingURL=core-functions.js.map