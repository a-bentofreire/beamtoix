"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

window.addEventListener("load", () => {

  const story = BeamToIX.createStory(/*FPS:*/20);

  // ------------------------------------------------------------------------
  //                               Scene1
  // ------------------------------------------------------------------------

  const scene1 = story.scenes[0];
  scene1
    .addAnimations([{
      selector: "#pulsar",
      props: [
        {
          prop: 'top',
          value: 10,
          oscillator: {
            handler: 'pulsar',
            params: {
              spread: 0.2,
              type: BeamToIX.PulsarType.normal,
            } as BeamToIX.PulsarOscillatorParams,
          },
          duration: '1s',
          iterationCount: 3,
        },
        {
          prop: 'left',
          value: 400,
          duration: '4s',
        },
      ],
    },
    {
      selector: "#heart",
      props: [
        {
          prop: 'opacity',
          oscillator: {
            handler: 'harmonic',
            params: {
              cycles: 1,
              negativeHander: BeamToIX.NegativeBuiltInFuncs.abs,
            } as BeamToIX.HarmonicOscillatorParams,
          },
          valueStart: 0.7,
          value: 0.3,
          duration: '2s',
        },
      ],
    },
    {
      selector: '#msg1',
      props: [
        {
          prop: 'opacity',
          duration: '0.5s',
          position: '0.5s',
          value: 1,
        },
      ],
    },
    {
      selector: '#msg2',
      props: [
        {
          prop: 'opacity',
          duration: '0.5s',
          position: '1.5s',
          value: 1,
        },
      ],
    },
    ]);

  story.render(story.bestPlaySpeed());
});
