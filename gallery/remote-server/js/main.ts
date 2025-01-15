"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

window.addEventListener("load", () => {
  BeamToIX.createStoryFromConfig('story.json',
    (story: BeamToIX.Story) => {
      story.render(story.bestPlaySpeed());
    });
});
