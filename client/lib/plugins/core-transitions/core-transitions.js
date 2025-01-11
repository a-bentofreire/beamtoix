"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// Implements a list of core transitions
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 * In BeamToIX 4.x the core transitions will move into this plugin.
 * To prevent breaking changes include now the js script `core-transitions.js` on the html file.
 *
 */
var BeamToIX;
(function (BeamToIX) {
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    BeamToIX.pluginManager.addPlugin({
        id: 'beamtoix.core-transitions',
        uuid: 'b948c9cc-60e7-4106-bb88-f038b6fa9cf4',
        author: 'Alexandre Bento Freire',
        email: 'beamtoix@a-bentofreire.com',
        jsUrls: ['plugins/core-transitions/core-transitions.js'],
        teleportable: true,
    });
})(BeamToIX || (BeamToIX = {}));
//# sourceMappingURL=core-transitions.js.map