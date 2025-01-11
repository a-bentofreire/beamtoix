"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

// Implements transitions

/** @module end-user | The lines bellow convey information for the end-user */

/**
 *
 * ## Description
 *
 * A **transition** is the motion between the end of a scene
 * and the beginning of the next scene.
 *
 * Its computation is done outside the [](Animation Pipeline).
 *
 * It can affect the properties of its children elements,
 * in such cases it's required for the user to provide the starting value
 * since the computed value might not be correct.
 * Currently, only scene transitions are supported,
 * future versions might support element transition as well.
 * The transition duration provided by the user is converted into frames
 * and split half to the out scene, the previous scene,
 * and half into the in scene, the next scene.
 * BeamToIX doesn't adds extra frames to ensure the execution of the transition,
 * instead it works on top of the element animation pipeline.
 * If there aren't enough frames in the pipeline, part of the transition will be missing.
 *
 * ## Core transitions
 * **WARNING!** In BeamToIX 4.x these core transitions will move `core-transitions` plugin.
 * To prevent breaking changes include now the js script `core-transitions.js` on the html file.
 *
 *  BeamToIX has the following core transitions:
 * - `slideLeft`
 * - `slideRight`
 * - `slideTop`
 * - `slideBottom`
 * - `dissolve`
 */
namespace BeamToIX {

  // #generate-group-section
  // ------------------------------------------------------------------------
  //                               Transitions
  // ------------------------------------------------------------------------

  // The following section contains data for the end-user
  // generated by `gulp build-definition-files`
  // -------------------------------
  // #export-section-start: release

  // ------------------------------------------------------------------------
  //                               Transition States
  // ------------------------------------------------------------------------

  export const TRS_SETUP = 0;
  export const TRS_AT_OUT = 1;
  export const TRS_AT_IN = 2;


  export const DEFAULT_TRANSITION_DURATION = '1s';


  /**
   * List of the built-in Transition Names.
   */
  export enum StdTransitions {
    slideLeft,
    slideRight,
    slideTop,
    slideBottom,
    dissolve,
  }


  /**
   * Parameters passed to the Transition function.
   */
  export interface TransitionParams {
    bothVisible: boolean;
    state?: int;
    frameI?: int;
    enterFrameI?: uint | undefined;
    leaveRealFrameI?: uint | undefined;
    frameCount?: uint;
    leaveFrameCount?: uint;
    enterFrameCount?: uint;
    leaveAdapter?: AbstractAdapter;
    enterAdapter?: AbstractAdapter;
  }


  export type TransitionFunc = (params: TransitionParams, args?: BeamToIXArgs) => void;

  export type TransitionHandler = string | ExprString | TransitionFunc
    | StdTransitions;


  export interface Transition {
    handler: TransitionHandler;
    duration?: TimeHandler;
  }

  // #export-section-end: release
  // -------------------------------

  // ------------------------------------------------------------------------
  //                               Implementation
  // ------------------------------------------------------------------------

  export const _transitionFunctions: { [name: string]: TransitionFunc } = {};


  export class _TransitionInterpolator {

    _active: boolean = false;
    _transition: Transition = {
      handler: '',
    };


    _params: TransitionParams;
    protected _transitionFunc: TransitionFunc;
    protected _firstOutTransitionFrame: int;


    _set(transition: Transition,
      sceneFrameCount: int, args: BeamToIXArgs): boolean {

      this._active = false;
      this._transition = transition;
      let handler = transition.handler;
      const duration = transition.duration;

      if (handler === undefined) { return false; }

      const frameCount = parseTimeHandler(duration, args,
        DEFAULT_TRANSITION_DURATION, sceneFrameCount);

      if (frameCount === 0) { return false; }
      this._params = {
        bothVisible: true,
        frameCount,
        leaveFrameCount: Math.round(frameCount / 2),
      };

      this._params.enterFrameCount = frameCount - this._params.leaveFrameCount;

      if (typeof handler === 'number') {
        handler = StdTransitions[handler];
      }

      if (typeof handler === 'string') {
        this._transitionFunc = _transitionFunctions[handler as string];
      } else {
        this._transitionFunc = (handler as TransitionFunc);
      }

      this._active = this._transitionFunc !== undefined;
      return this._active;
    }


    _setup(leaveAdapter: AbstractAdapter,
      enterAdapter: AbstractAdapter,
      sceneFrameCount: uint,
      args: BeamToIXArgs): void {

      const params = this._params;
      this._firstOutTransitionFrame = sceneFrameCount - params.leaveFrameCount;
      params.leaveAdapter = leaveAdapter;
      params.enterAdapter = enterAdapter;
      params.state = TRS_SETUP;
      this._transitionFunc(params, args);
    }


    _render(frameNr: int, _frameCount: int, isLeaveAdapted: boolean,
      args: BeamToIXArgs): void {

      const params = this._params;
      if (isLeaveAdapted) {
        const frameI = frameNr - this._firstOutTransitionFrame;
        if (frameI >= 0) {
          params.state = TRS_AT_OUT;
          params.enterFrameI = undefined;
          params.leaveRealFrameI = frameNr;
          params.frameI = frameI;
          if (params.bothVisible && params.enterAdapter && params.frameI === 0) {
            params.enterAdapter.setProp('visible', true, args);
          }
          this._transitionFunc(params, args);
        }
      } else {
        if (frameNr <= params.enterFrameCount) {
          params.state = TRS_AT_IN;
          params.enterFrameI = frameNr;
          params.leaveRealFrameI = undefined;
          params.frameI = frameNr + params.leaveFrameCount;

          if (params.bothVisible) {
            if (params.enterAdapter && frameNr === 0) {
              params.leaveAdapter.setProp('visible', true, args);
            }
            if (frameNr === params.enterFrameCount) {
              params.leaveAdapter.setProp('visible', false, args);
            }

          }
          this._transitionFunc(params, args);
        }
      }
    }
  }

  // ------------------------------------------------------------------------
  //                               Standard Transitions Implementation
  // ------------------------------------------------------------------------

  interface SlideTransitionParams extends TransitionParams {
    ref: int;
    length: int;
  }


  function _slide(params: TransitionParams, args: BeamToIXArgs,
    refAttrName: string, lengthAttrName: string, isNegDir: boolean): void {

    const sParams = params as SlideTransitionParams;
    const leaveAdapter = params.leaveAdapter;

    if (params.state === TRS_SETUP) {
      sParams.ref = parseInt(leaveAdapter.getProp(refAttrName, args) as string);
      sParams.length = parseInt(leaveAdapter.getProp(lengthAttrName, args) as string);

    } else {
      const shift = downRound((params.frameI / params.frameCount) * sParams.length);
      let ref = sParams.ref;
      ref = isNegDir ? ref - shift : ref + shift;
      params.leaveAdapter.setProp(refAttrName, ref, args);

      // #debug-start
      if (args.isVerbose) {
        args.story.logFrmt('slide-leave', [
          ['frameI', params.frameI],
          [refAttrName, ref],
        ]);
      }
      // #debug-end

      if (params.enterAdapter) {
        ref = isNegDir ? ref + sParams.length : ref - sParams.length;
        params.enterAdapter.setProp(refAttrName, ref, args);

        // #debug-start
        if (args.isVerbose) {
          args.story.logFrmt('slide-enter', [
            ['frameI', params.frameI],
            [refAttrName, refAttrName],
          ]);
        }
        // #debug-end
      }
    }
  }


  _transitionFunctions['slideLeft'] = _slideLeft;

  function _slideLeft(params: TransitionParams, args?: BeamToIXArgs): void {
    _slide(params, args, 'left', 'width', true);
  }


  _transitionFunctions['slideRight'] = _slideRight;

  function _slideRight(params: TransitionParams, args?: BeamToIXArgs): void {
    _slide(params, args, 'left', 'width', false);
  }


  _transitionFunctions['slideTop'] = _slideTop;

  function _slideTop(params: TransitionParams, args?: BeamToIXArgs): void {
    _slide(params, args, 'top', 'height', true);
  }


  _transitionFunctions['slideBottom'] = _slideBottom;

  function _slideBottom(params: TransitionParams, args?: BeamToIXArgs): void {
    _slide(params, args, 'top', 'height', false);
  }


  _transitionFunctions['dissolve'] = _dissolveTransition;

  function _dissolveTransition(params: TransitionParams,
    args?: BeamToIXArgs): void {

    if (params.state !== TRS_SETUP) {
      let opacity = 1 - (params.frameI / params.frameCount);
      params.leaveAdapter.setProp('opacity', opacity, args);

      // #debug-start
      if (args.isVerbose) {
        args.story.logFrmt('dissolve-leave', [
          ['frameI', params.frameI],
          ['opacity', opacity],
        ]);
      }
      // #debug-end

      if (params.enterAdapter) {
        opacity = 1 - opacity;
        params.enterAdapter.setProp('opacity', opacity, args);

        // #debug-start
        if (args.isVerbose) {
          args.story.logFrmt('dissolve-enter', [
            ['frameI', params.frameI],
            ['opacity', opacity],
          ]);
        }
        // #debug-end
      }
    }
  }
}
