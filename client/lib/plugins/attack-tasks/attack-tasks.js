"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// Implements a list of built-in attack Tasks
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * An **attack** is a quick and strong distortion of reality, created
 * with the purpose of grabbing the user attention or to process the visual
 * sensation as an attack by an exterior force.
 * Attacks can be done by changing quickly colors, texts, images and dimensions.
 *
 * This plugin has the following built-in attack tasks:
 *
 * - `color-attack` - produces a change in colors, returning to the original color at the end.
 */
var BeamToIX;
(function (BeamToIX) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Attack Tasks
    // ------------------------------------------------------------------------
    // #export-section-end: release
    // -------------------------------
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    BeamToIX.pluginManager.addPlugin({
        id: 'beamtoix.attack-tasks',
        uuid: 'e98cfe21-ec23-4545-88eb-829a0e9add39',
        author: 'Alexandre Bento Freire',
        email: 'beamtoix@a-bentofreire.com',
        jsUrls: ['plugins/attack-tasks/attack-tasks.js'],
        teleportable: true,
    });
    BeamToIX.pluginManager.addTasks([['color-attack', _colorAttack]]);
    /** Implements the Color Attack Task */
    function _colorAttack(anime, _wkTask, params, stage, args) {
        switch (stage) {
            case BeamToIX.TS_INIT:
                var attack = params.attack;
                var propName = params.prop || 'color';
                var cycles = BeamToIX.ExprOrNumToNum(params.cycles, 1, args);
                var endColor = params.endColor;
                var finalAttack = [];
                for (var i = 0; i < cycles; i++) {
                    finalAttack = finalAttack.concat(attack);
                }
                if (endColor === undefined) {
                    var elAdapters = args.scene.getElementAdapters(anime.selector);
                    if (elAdapters.length) {
                        endColor = elAdapters[0].getProp(propName);
                    }
                }
                if (endColor !== undefined) {
                    finalAttack.push(endColor);
                }
                if (!anime.props) {
                    anime.props = [];
                }
                anime.props.push({ prop: propName, valueText: finalAttack });
                return BeamToIX.TR_DONE;
        }
    }
})(BeamToIX || (BeamToIX = {}));
//# sourceMappingURL=attack-tasks.js.map