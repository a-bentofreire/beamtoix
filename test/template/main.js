// ------------------------------------------------------------------------
$(window).on("load", function () {
    var independentCases = __IND_CASES__;
    try {
        var story = BeamToIX.createStory(__FPS__);
    } catch (error) {
        console.error('[EXCEPTION]:', error);
        console.error('[CRITICAL]: BeamToIX.createStory failed: ' + error);
    }

    if (story.logLevel === undefined || BeamToIX.LL_VERBOSE === undefined) {
        console.error('[CRITICAL]: story.logLevel or BeamToIX.LL_VERBOSE is missing');
    }
    story.logLevel = BeamToIX.LL_VERBOSE;

    // ------------------------------------------------------------------------
    //                               Scene1
    // ------------------------------------------------------------------------
    try {
        var scene1 = story.scenes[0];
    } catch (error) {
        console.error('[EXCEPTION]:', error);
        console.error('[CRITICAL]: scene1 = story.scenes[0] failed: ' + error);
    }

    __JS__

    story.toExitOnRenderFinished = __EXIT_RENDER_ON_FINISHED__;
    try {
        story.render(story.bestPlaySpeed(), __RENDER_FRAME_OPTIONS__);
        __EXTRA_RENDER_CALLS__
    } catch (error) {
        story.logError('[EXCEPTION]:' + error);
        console.error('[CRITICAL]: story.render failed:' + error);
    }
});