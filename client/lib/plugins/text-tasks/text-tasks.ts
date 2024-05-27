"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

// Implements a list of built-in text Tasks

/** @module end-user | The lines bellow convey information for the end-user */

/**
 * ## Description
 *
 * A **text task** transforms text elements or creates complex text animation.
 *
 * This plugin has the following built-in text tasks:
 *
 * - `text-split` - Wraps words or characters with `span` tags, allowing to later
 *      animate individual words or characters.
 *
 * - `typewriter` - Creates the typewriter effect by typing individual characters
 *      or words one by one followed by a cursor.
 *
 * - `decipher` - Generates a random list of texts that gradually reveal the hidden text.
 */
namespace ABeamer {

  // #generate-group-section
  // ------------------------------------------------------------------------
  //                               Text Tasks
  // ------------------------------------------------------------------------

  // The following section contains data for the end-user
  // generated by `gulp build-definition-files`
  // -------------------------------
  // #export-section-start: release

  export type TextTaskName =
    /** @see #TextSplitTaskParams */
    | 'text-split'
    /** @see #TypewriterTaskParams */
    | 'typewriter'
    /** @see #DecipherTaskParams */
    | 'decipher'
    ;


  export type TextTaskParams =
    | TextSplitTaskParams
    | TypewriterTaskParams
    | DecipherTaskParams
    ;


  export interface TextSplitTaskParams extends AnyParams {
    text?: string;
    splitBy?:
    | 'char'
    | 'word'
    ;


    /**
     * If realign is true, it sets the left property of each new element
     * in a way that are align side by side.
     *
     * Use it if the element position is absolute.
     *
     * Main purpose is to use with transformations.
     *
     * Valid only for DOM elements.
     */
    realign?: boolean;
  }


  export interface TypewriterTaskParams extends TextSplitTaskParams {
    cursor?: boolean;
    cursorChar?: string;
  }


  /**
   * List of the directions that instruct how the text can be revealed.
   */
  export enum RevealDir {
    disabled,
    toRight,
    toLeft,
    toCenter,
  }


  export interface DecipherTaskParams extends AnyParams {
    upperCharRanges?: [number, number][];
    lowerCharRanges?: [number, number][];
    iterations: uint;
    revealCharIterations?: uint;
    revealDirection?: RevealDir | string;
    text: string;
  }


  // #export-section-end: release
  // -------------------------------

  // ------------------------------------------------------------------------
  //                               Implementation
  // ------------------------------------------------------------------------

  pluginManager.addPlugin({
    id: 'abeamer.text-tasks',
    uuid: '8b547eff-a0de-446a-9753-fb8b39d8031a',
    author: 'Alexandre Bento Freire',
    email: 'abeamer@a-bentofreire.com',
    jsUrls: ['plugins/text-tasks/text-tasks.js'],
    teleportable: true,
  });

  // ------------------------------------------------------------------------
  //                               Tools
  // ------------------------------------------------------------------------

  function _textSplitter(params: TextSplitTaskParams): string[] {

    const text = params.text;
    return params.splitBy === 'word' ?
      text.replace(/(\s+)/g, '\0$1').split(/\0/) : text.split('');
  }

  // ------------------------------------------------------------------------
  //                               text-split Task
  // ------------------------------------------------------------------------

  pluginManager.addTasks([['text-split', _textSplit]]);

  /** Implements the Text Split Task */
  function _textSplit(anime: Animation, _wkTask: WorkTask,
    params: TextSplitTaskParams, stage: uint, args?: ABeamerArgs): TaskResult {

    switch (stage) {
      case TS_INIT:
        const inTextArray = _textSplitter(params);
        const elAdapters = args.scene.getElementAdapters(anime.selector);
        const inTextHtml = inTextArray.map((item, index) =>
          `<span data-index="${index}" data="${item.replace(/[\n"']/g, '')}">`
          + `${item.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>')}</span>`,
        );

        elAdapters.forEach(elAdapter => {
          elAdapter.setProp('html', inTextHtml.join(''), args);
          if (params.realign && !elAdapter.isVirtual) {
            const $spans = $((elAdapter as _DOMElementAdapter).htmlElement).find('span');
            let left = 0;
            $spans.each((_index: uint, domEl: HTMLElement) => {
              domEl.style.left = `${left}px`;
              left += domEl.clientWidth;
            });
          }
        });
        return TR_EXIT;
    }
  }

  // ------------------------------------------------------------------------
  //                               typewriter Task
  // ------------------------------------------------------------------------

  pluginManager.addTasks([['typewriter', _typewriter]]);

  /** Implements the Typewriter Task */
  function _typewriter(anime: Animation, _wkTask: WorkTask,
    params: TypewriterTaskParams, stage: uint, _args?: ABeamerArgs): TaskResult {

    switch (stage) {
      case TS_INIT:
        const textInter = [];
        const inTextArray = _textSplitter(params);
        const len = inTextArray.length;
        const hasCursor = params.cursor !== undefined;
        const cursorChar = hasCursor ? params.cursorChar || '▐' : '';

        let accText = '';
        for (let i = 0; i < len; i++) {
          accText += inTextArray[i];
          textInter.push(accText + cursorChar);
        }
        if (hasCursor) {
          textInter.push(accText);
        }

        if (!anime.props) {
          anime.props = [];
        }
        anime.props.push({ prop: 'text', valueText: textInter });
        return TR_DONE;
    }
  }

  // ------------------------------------------------------------------------
  //                               decipher Task
  // ------------------------------------------------------------------------

  pluginManager.addTasks([['decipher', _decipherTask]]);

  /** Implements the Decipher Task */
  function _decipherTask(anime: Animation, _wkTask: WorkTask,
    params: DecipherTaskParams, stage: uint, _args?: ABeamerArgs): TaskResult {

    function isInsideRange(code: uint, ranges: [number, number][]): [number, number][] {
      return ranges.findIndex(range => range[0] <= code && range[1] >= code)
        !== -1 ? ranges : undefined;
    }


    function reveal(textInter: string[][], text: string, _textLen: uint,
      rangesByIndex: [number, number][][],
      _revealDir: RevealDir, revealCharIterations: uint,
      i: uint, scale: uint) {

      if (rangesByIndex[i]) {
        scale++;
        let textInterPos = textInter.length - 1;
        const downCounter = revealCharIterations * scale;
        for (let j = 0; j < downCounter; j++) {
          if (textInterPos < 0) { return; }
          textInter[textInterPos][i] = text[i];
          textInterPos--;
        }
      }
      return scale;
    }


    switch (stage) {
      case TS_INIT:

        const cc_A = 'A'.charCodeAt(0);
        const cc_Z = 'Z'.charCodeAt(0);
        const cc_a = 'a'.charCodeAt(0);
        const cc_z = 'z'.charCodeAt(0);
        const cc_0 = '0'.charCodeAt(0);
        const cc_9 = '9'.charCodeAt(0);

        const iterations = params.iterations;
        const text = params.text;
        const textLen = text.length;
        const upperCharRanges = params.upperCharRanges || [[cc_A, cc_Z]];
        const lowerCharRanges = params.lowerCharRanges || [[cc_a, cc_z]];
        const digitRanges: [number, number][] = [[cc_0, cc_9]];
        const revealCharIterations = params.revealCharIterations || 1;
        const revealDir = parseEnum(params.revealDirection, RevealDir, RevealDir.disabled);

        throwIfI8n(!isPositiveNatural(iterations), Msgs.MustNatPositive, { p: 'iterations' });
        throwIfI8n(!textLen, Msgs.NoEmptyField, { p: 'text' });

        // let usableCharsCount = 0;
        const rangesByIndex: [number, number][][] = [];

        for (let charI = 0; charI < textLen; charI++) {
          const charCode = text.charCodeAt(charI);
          const ranges = isInsideRange(charCode, upperCharRanges)
            || isInsideRange(charCode, lowerCharRanges)
            || isInsideRange(charCode, digitRanges);

          // if (ranges) {
          //   usableCharsCount++;
          // }
          rangesByIndex.push(ranges);
        }

        const textInter: string[][] = [];
        for (let i = 0; i < iterations - 1; i++) {
          const dText = text.split('');

          for (let charI = 0; charI < textLen; charI++) {
            const ranges = rangesByIndex[charI];
            if (ranges) {
              const charRangesLen = ranges.length;
              const charRangesIndex = charRangesLen === 1 ? 0
                : Math.floor(Math.random() * charRangesLen);
              const charRange = ranges[charRangesIndex];
              const range = charRange[1] - charRange[0];
              const winnerChar = String.fromCharCode(Math.round(Math.random() * range)
                + charRange[0]);
              dText[charI] = winnerChar;
            }
          }
          textInter.push(dText);
        }

        let scale = 0;
        switch (revealDir) {
          case RevealDir.toLeft:
            for (let i = textLen - 1; i >= 0; i--) {
              scale = reveal(textInter, text, textLen,
                rangesByIndex, revealDir, revealCharIterations, i, scale);
            }
            break;

          case RevealDir.toRight:
            for (let i = 0; i < textLen; i++) {
              scale = reveal(textInter, text, textLen,
                rangesByIndex, revealDir, revealCharIterations, i, scale);
            }
            break;

          case RevealDir.toCenter:
            const midLen = Math.floor(textLen / 2);
            for (let i = midLen - 1; i >= 0; i--) {
              scale = reveal(textInter, text, textLen,
                rangesByIndex, revealDir, revealCharIterations, i, scale);
              scale = reveal(textInter, text, textLen,
                rangesByIndex, revealDir, revealCharIterations, textLen - i - 1, scale);
            }
            break;
        }

        textInter.push(text.split(''));

        if (!anime.props) {
          anime.props = [];
        }
        anime.props.push({ prop: 'text', valueText: textInter.map(inter => inter.join('')) });
        return TR_DONE;
    }
  }
}
