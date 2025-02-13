"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

window.addEventListener("load", () => {

  const story = BeamToIX.createStory(/*FPS:*/10);

  // ------------------------------------------------------------------------
  //                               Scene1
  // ------------------------------------------------------------------------

  const d = '1s';

  const scene1 = story.scenes[0];
  scene1
    .addAnimations([{
      selector: '#bkg1',
      duration: d,
      props: [
        {
          prop: 'opacity',
          easing: 'easeInCubic',
          value: 1,
          iterationCount: 2,
          direction: BeamToIX.Directions.alternate,
        },
      ],
    },
    {
      selector: '#rec',
      duration: d,
      props: [
        {
          prop: 'opacity',
          easing: 'linear',
          value: 0.3,
          iterationCount: 2,
          direction: BeamToIX.Directions.alternate,
        },
      ],
    }],
  );

  story.render(story.bestPlaySpeed());
});
