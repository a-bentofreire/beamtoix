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

  const scene1 = story.scenes[0];
  scene1
    .addAnimations([{
      selector: "#circle",
      tasks: [
        {
          handler: 'shape',
          params: {
            shape: BeamToIX.Shapes.circle,
            radius: 25,
            fill: '#ebebeb',
            stroke: '#9d9d9d',
            strokeWidth: 2,
          },
        },
      ],
    }, {
      selector: "#rectangle",
      tasks: [
        {
          handler: 'shape',
          params: {
            shape: 'rectangle',
            width: 150,
            height: 55,
            fill: '#ebebeb',
            stroke: '#9d9d9d',
            strokeWidth: 2,
            rx: 4,
            ry: 4,
          },
        },
      ],
    }, {
      selector: "#line",
      tasks: [
        {
          handler: 'shape',
          params: {
            shape: BeamToIX.Shapes.line,
            x: 30,
            y: 30,
            stroke: 'red',
            strokeWidth: 3,
          },
        },
      ],
    }, {
      selector: "#line-dir",
      tasks: [
        {
          handler: 'shape',
          params: {
            shape: BeamToIX.Shapes.line,
            direction: 150,
            length: 110,
            stroke: 'red',
            strokeWidth: 3,
          },
        },
      ],
    }])
    .addStills(2);

  story.render(story.bestPlaySpeed());
});
