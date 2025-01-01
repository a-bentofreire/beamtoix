"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
$(window).on("load", function () {
    var story = BeamToIX.createStory(/*FPS:*/ 20, {
        // Uncomment to set into teleportation mode
        //  toTeleport: true, 
        toStartTeleporting: false,
    });
    // ------------------------------------------------------------------------
    //                               Scene1
    // ------------------------------------------------------------------------
    var d = story.args.vars.duration || '3s';
    var json = story.args.vars.json || 'acme';
    $.getJSON("".concat(json, ".json"), function (data) {
        $('#name').text(data.name);
        // By setting this as the starting point, it allows to inject html code,
        // to be stored in the story to be teleported.
        story.startTeleporting();
        var scene1 = story.scenes[0];
        scene1
            .addAnimations([{
                selector: 'canvas',
                tasks: [{
                        handler: 'chart',
                        params: {
                            chartType: BeamToIX.ChartTypes.line,
                            animeSelector: 'graph',
                            data: [data.clicks],
                            strokeColors: ['#dd5252'],
                            strokeWidth: 2,
                            sweepStart: 0.1,
                            props: [{}],
                        },
                    }],
            },
            {
                selector: '%graph',
                duration: d,
                props: [
                    {
                        prop: 'sweep',
                        value: 1,
                    },
                ],
            },
            {
                selector: '#users',
                duration: d,
                props: [
                    {
                        prop: 'text',
                        valueStart: 0,
                        valueFormat: '%d',
                        value: data.users,
                    },
                ],
            }]);
        // Uncomment to get the teleported story with characters injected into story
        // before it started recording the story
        // console.log(story.getStoryToTeleport({}, true));
        story.render(story.bestPlaySpeed());
    });
});
//# sourceMappingURL=main.js.map