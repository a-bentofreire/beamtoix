"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
$(window).on("load", function () {
    BeamToIX.createStoryFromConfig('story.json', function (story) {
        story.render(story.bestPlaySpeed());
    });
});
//# sourceMappingURL=main.js.map