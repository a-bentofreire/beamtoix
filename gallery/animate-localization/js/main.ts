"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

window.addEventListener("load", () => {

  BeamToIX.pluginManager.addLocalization({
    locale: 'pt_PT',
    functionalities: [[BeamToIX.Functionalities.functions, [
      { src: 'sin', dst: 'sen' },
      { src: 'iff', dst: 'se' }]]],
    messages: {
      /* spell-checker: disable */
      MustNatPositive: 'O valor de %p% tem de ser um número natural positivo',
    },
  });

  const story = BeamToIX.createStory(/*FPS:*/8);

  // ------------------------------------------------------------------------
  //                               Scene1
  // ------------------------------------------------------------------------

  const d = '2s';

  const scene1 = story.scenes[0];
  scene1
    .addAnimations([{
      selector: '#dot',
      duration: d,
      props: [{
        prop: 'top',
        oscillator: {
          handler: '=sin(t*pi*4)',
        },
        valueStart: "=frameHeight/2 +'px'",
        value: '=frameHeight/2-20',
      }, {
        prop: 'left',
        value: '=frameWidth-10',
      }],
    }])
    .addAnimations([{
      selector: '#title, #expr',
      props: [{
        prop: 'text',
        duration: 1,
        // Portuguese iff = se
        valueText: "=se(elIndex==0,'Português', '\\\'=sen(t)\\\'')",
      }],
    }, {
      selector: '#dot',
      duration: d,
      props: [{
        prop: 'top',
        oscillator: {
          // Portuguese sin = sen
          handler: '=sen(t*pi*4)',
        },
        valueStart: "=frameHeight/2 +'px'",
        value: '=frameHeight/2-20',
      }, {
        prop: 'left',
        valueStart: '10px',
        value: '=frameWidth-10',
      }],
    }]);

  story.render(story.bestPlaySpeed());
});
