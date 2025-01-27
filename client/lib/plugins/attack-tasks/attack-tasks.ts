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
namespace BeamToIX {

  // #generate-group-section
  // ------------------------------------------------------------------------
  //                               Attack Tasks
  // ------------------------------------------------------------------------

  // The following section contains data for the end-user
  // generated by `gulp build-definition-files`
  // -------------------------------
  // #export-section-start: release

  export type AttackTaskName =
    /** @see #ColorAttackTaskParams */
    | 'color-attack'
    ;


  export type AttackTaskParams =
    ColorAttackTaskParams;


  export interface ColorAttackTaskParams extends AnyParams {

    /** List of colors to attack the original color. */
    attack: string[];

    /**
     * Property Name.
     * @default: 'color'
     */
    prop?: string;


    /**
     * Number of times it will attack the color before returning to the original.
     * Expressions are supported.
     */
    cycles?: uint | ExprString;


    /** Color to end the attack. If undefined, it uses the original color. */
    endColor?: string;
  }

  // #export-section-end: release
  // -------------------------------

  // ------------------------------------------------------------------------
  //                               Implementation
  // ------------------------------------------------------------------------

  pluginManager.addPlugin({
    id: 'beamtoix.attack-tasks',
    uuid: 'e98cfe21-ec23-4545-88eb-829a0e9add39',
    author: 'Alexandre Bento Freire',
    email: 'beamtoix@a-bentofreire.com',
    jsUrls: ['plugins/attack-tasks/attack-tasks.js'],
    teleportable: true,
  });


  pluginManager.addTasks([['color-attack', _colorAttack]]);

  /** Implements the Color Attack Task */
  function _colorAttack(anime: Animation, _wkTask: WorkTask,
    params: ColorAttackTaskParams, stage: uint, args?: BeamToIXArgs): TaskResult {

    switch (stage) {
      case TS_INIT:
        const attack = params.attack;
        const propName = params.prop || 'color';
        const cycles = ExprOrNumToNum(params.cycles, 1, args);
        let endColor = params.endColor;
        let finalAttack = [];
        for (let i = 0; i < cycles; i++) {
          finalAttack = finalAttack.concat(attack);
        }

        if (endColor === undefined) {
          const elAdapters = args.scene.getElementAdapters(anime.selector);
          if (elAdapters.length) {
            endColor = elAdapters[0].getProp(propName) as string;
          }
        }

        if (endColor !== undefined) {
          finalAttack.push(endColor);
        }

        if (!anime.props) {
          anime.props = [];
        }
        anime.props.push({ prop: propName, valueText: finalAttack });

        return TR_DONE;
    }
  }
}
