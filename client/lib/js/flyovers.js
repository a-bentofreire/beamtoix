"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// Implementation of Flyovers
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * A **flyover** is a function executed for every frame during render process
 * with the main purpose of providing useful information or sync data.
 *
 * A flyover operates outside a scene animation pipeline, and can it
 * modify the content of one or more elements.
 *
 * BeamToIX has following built-in flyovers:
 * - `info`
 * - `video-sync`.
 *
 * More flyovers can be added via `pluginManager.addFlyovers`.
 *
 * ## Info flyover
 *
 * A `info` flyover provides information regarding current time position and frame.
 *
 * @see gallery/animate-flyovers
 *
 * ### Example
 * css
 * ```css
 * #flyover {
 *   left: 10px;
 * }
 * ```
 * html
 * ```html
 * <div id="flyover" class="beamtoix-flyover"></div>
 * ```
 * js
 * ```js
 * story.addFlyover('info', {
 *    selector: '#flyover',
 *    format: 'story-frame: ${storyFrameNr}\nstory-time: ${storyElapsedS}',
 * });
 * ```
 *
 * ## Video Sync flyover
 *
 * A `video-sync` flyover synchronizes the current render frame with a background video.
 *
 * **WARNING** Due Chrome 'autoplay-policy', it's not possible to 'safely' use Chrome to sync with videos,
 * In order to overcome this limitation:
 * 1. Use Firefox to test the animation with a background video.
 * 2. Set `serverRender: false` to prevent `beamtoix render` from attempting to sync the video while server render.
 * 3. When using `beamtoix movie`, set `--bkg-movie` parameter with the video filename to use a background video.
 *
 * @see gallery/animate-video-sync
 *
 * ### Example
 * css
 * ```css
 * #flyover {
 *   left: 10px;
 * }
 * ```
 * html
 * ```html
 * <video id=video width="385" height="288" src="assets/video.mp4" type="video/mp4">
 * ```
 *
 * js
 * ```js
 * story.addFlyover('video-sync', {
 *     selector: '#video',
 *     serverRender: false,
 *   });
 * ```
 */
var BeamToIX;
(function (BeamToIX) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Flyovers
    // ------------------------------------------------------------------------
    /**
     * Internal map by name pointing to all flyover functions,
     * both built-in and 3rd party.
     */
    BeamToIX._flyoverFunctions = {};
    function _buildWorkFlyover(handler, params, toTeleport, args) {
        var flyoverFunc;
        switch (typeof handler) {
            case 'string':
                flyoverFunc = BeamToIX._flyoverFunctions[handler];
                break;
            case 'function':
                flyoverFunc = handler;
                BeamToIX.throwIfI8n(toTeleport, BeamToIX.Msgs.NoCode);
                break;
        }
        if (!flyoverFunc) {
            BeamToIX.throwI8n(BeamToIX.Msgs.UnknownOf, { type: BeamToIX.Msgs.flyover, p: handler });
        }
        var wkFlyover = {
            func: flyoverFunc,
            name: handler,
            params: params || {},
        };
        if (toTeleport) {
            wkFlyover.func(wkFlyover, wkFlyover.params, BeamToIX.TS_TELEPORT, args);
        }
        return wkFlyover;
    }
    BeamToIX._buildWorkFlyover = _buildWorkFlyover;
    BeamToIX._flyoverFunctions['info'] = _infoFlyover;
    /**
     * Implementation of Info Flyover.
     */
    function _infoFlyover(_wkFlyover, params, stage, args) {
        switch (stage) {
            case BeamToIX.TS_INIT:
                if (!params._elAdapters) {
                    params._elAdapters = args.story.getElementAdapters(params.selector
                        || '.info-flyover');
                }
                break;
            case BeamToIX.TS_ANIME_LOOP:
                // rendering
                var format_1 = params.format || '${storyFrameNr}';
                var story_1 = args.story;
                params._elAdapters.forEach(function (elAdapter) {
                    var text = format_1.replace(/\$\{(\w+)\}/g, function (_all, macro) {
                        switch (macro) {
                            case 'storyFrameNr':
                                return story_1.renderFramePos.toString();
                            case 'storyElapsedMS':
                                return BeamToIX.frame2Time(story_1.renderFramePos, story_1.fps, BeamToIX.TimeUnit.ms);
                            case 'storyElapsedS':
                                return BeamToIX.frame2Time(story_1.renderFramePos, story_1.fps, BeamToIX.TimeUnit.s);
                            case 'storyElapsedM':
                                return BeamToIX.frame2Time(story_1.renderFramePos, story_1.fps, BeamToIX.TimeUnit.m);
                        }
                        return '';
                    });
                    // #debug-start
                    if (args.isVerbose) {
                        args.story.logFrmt('info-flyover', [['text', text]]);
                    }
                    // #debug-end
                    elAdapter.setProp('text', text, args);
                });
                break;
        }
    }
    /**
     * Implementation of Video Sync Flyover.
     */
    BeamToIX._flyoverFunctions['video-sync'] = _videoSyncFlyover;
    function _videoSyncFlyover(_wkFlyover, params, stage, args) {
        // setup
        switch (stage) {
            case BeamToIX.TS_INIT:
                if (!params._elAdapters) {
                    params._elAdapters = args.story.getElementAdapters(params.selector
                        || '#video');
                    break;
                }
            case BeamToIX.TS_ANIME_LOOP:
                // rendering
                var storyFps_1 = args.story.fps;
                if (!args.hasServer || params.serverRender !== false) {
                    params._elAdapters.forEach(function (elAdapter) {
                        var currentTime = args.story.renderFramePos / storyFps_1;
                        // #debug-start
                        if (args.isVerbose) {
                            args.story.logFrmt('video-sync', [['currentTime', currentTime]]);
                        }
                        // #debug-end
                        elAdapter.setProp('currentTime', currentTime, args);
                    });
                }
                break;
        }
    }
})(BeamToIX || (BeamToIX = {}));
//# sourceMappingURL=flyovers.js.map