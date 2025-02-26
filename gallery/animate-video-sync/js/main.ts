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
  scene1.addAnimations(
    [{
      selector: '#wow',
      props: [
        {
          prop: 'font-size',
          duration: '4.72s',
          value: 60,
          oscillator: {
            handler: 'damped',
          },
        },
      ],
    }],
  );

  story.addFlyover('video-sync', {
    selector: '#video',
    serverRender: false,
  });

  story.render(story.bestPlaySpeed());
});
