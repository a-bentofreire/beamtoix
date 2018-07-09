"use strict";
// uuid: 4b46e734-07ff-4ae2-b3a0-4ee59d140f15

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

$(window).on("load", () => {

  const story = ABeamer.createStory(/*FPS:*/20);

  // ------------------------------------------------------------------------
  //                               Scene
  // ------------------------------------------------------------------------

  const args = story.args;
  const nameText = args.renderVars['name'] || 'target';
  const valueText = args.renderVars['value'] || 'developer';
  const duration = args.renderVars['duration'] || '2s';
  const waitTime = args.renderVars['wait'] || '0.5s';
  const nameBackgroundColor = args.renderVars['name-background-color'] || '#5a5a5a';
  const valueBackgroundColor = args.renderVars['value-background-color'] || '#49c31b';
  const easing = args.renderVars['easing'] || ABeamer.EasingName.easeOutElastic;
  const nameWidth = parseInt(args.renderVars['name-width'] || 55);
  const valueWidth = story.width - nameWidth;

  const scene1 = story.scenes[0];
  scene1
    .addAnimations([{
      selector: '#label',
      props: [{
        prop: 'background-color',
        valueText: [nameBackgroundColor],
      }, {
        prop: 'width',
        value: nameWidth,
      }, {
        prop: 'text',
        valueText: [nameText],
      }],
    }, {
      selector: '#text',
      props: [{
        prop: 'background-color',
        valueText: [valueBackgroundColor],
      }, {
        prop: 'width',
        value: valueWidth,
      }],
    }, {
      selector: '#text-value',
      duration,
      props: [ {
        prop: 'text',
        duration: 1,
        valueText: [valueText],
      }, {
          prop: 'top',
          easing,
        }],
    }])
    .addStills(waitTime);

  story.render(story.bestPlaySpeed());
});
