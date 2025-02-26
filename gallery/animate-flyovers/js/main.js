"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
window.addEventListener("load", function () {
    var story = BeamToIX.createStory(/*FPS:*/ 20);
    // ------------------------------------------------------------------------
    //                               Scene1
    // ------------------------------------------------------------------------
    var scene1 = story.scenes[0];
    scene1
        .addAnimations([{
            // opening the text
            selector: '#cntr',
            props: [
                {
                    prop: 'clip-path',
                    duration: '2s',
                    valueStart: -35,
                    value: 200,
                    valueFormat: 'polygon(0px 0px, 0px 100px, 100px 100px, %dpx 0px)',
                },
            ],
        }])
        .addAnimations([{
            // slide-up and down
            selector: '#text',
            tasks: [{
                    handler: 'add-vars',
                    params: {
                        vars: {
                            d: 2,
                        },
                    },
                }],
            props: [
                {
                    prop: 'top',
                    duration: "=d + 's'",
                    oscillator: {
                        handler: 'pulsar',
                        params: {
                            spread: 0.4,
                        },
                    },
                    iterationCount: 4,
                    valueStart: '0px',
                    value: 36,
                }, {
                    position: "='+' + (d/2) + 's'",
                    prop: 'text',
                    duration: "=d*4+'s'",
                    valueText: ['IN 2017', 'RECEIVED', '12 MILLION', 'TOURISTS'],
                },
            ],
        }]);
    // [TOPIC] Adding a flyover using a BeamToIX command
    story.addFlyover('info', {
        selector: '#flyover',
        format: 'story-frame: ${storyFrameNr}',
    });
    // [TOPIC] Adding a flyover using a task wrapper
    scene1
        .addAnimations([{
            tasks: [{
                    handler: 'add-flyover',
                    params: {
                        handler: 'info',
                        params: {
                            selector: '#flyover2',
                            format: 'story-time: ${storyElapsedS}',
                        },
                    },
                }],
        }]);
    story.render(story.bestPlaySpeed());
});
//# sourceMappingURL=main.js.map