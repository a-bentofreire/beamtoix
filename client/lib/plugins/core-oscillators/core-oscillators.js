"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// Implements a list of core oscillators
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 * In the BeamToIX 2.x the core oscillators will move into this plugin.
 * To prevent breaking changes include now the js script `core-oscillators.js` on the html file.
 *
 */
var BeamToIX;
(function (BeamToIX) {
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    BeamToIX.pluginManager.addPlugin({
        id: 'beamtoix.core-oscillators',
        uuid: 'bb845fdf-7493-4000-8b04-6ec2a386ea21',
        author: 'Alexandre Bento Freire',
        email: 'beamtoix@a-bentofreire.com',
        jsUrls: ['plugins/core-oscillators/core-oscillators.js'],
        teleportable: true,
    });
})(BeamToIX || (BeamToIX = {}));
//# sourceMappingURL=core-oscillators.js.map