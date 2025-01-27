"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
// Implements a list of built-in shape Tasks
/** @module end-user | The lines bellow convey information for the end-user */
/**
 * ## Description
 *
 * A **shape task** creates a configurable shape by creating a `svg` tag.
 *
 * This plugin has the following built-in shapes:
 *
 * - `rectangle` - rectangle shape including round rectangle via cx,cy fields.
 * - `line` - x,y and directional shape.
 * - `circle`
 * - `speech` - round rectangle with left and right speech triangle.
 */
var BeamToIX;
(function (BeamToIX) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Shape Tasks
    // ------------------------------------------------------------------------
    // The following section contains data for the end-user
    // generated by `gulp build-definition-files`
    // -------------------------------
    // #export-section-start: release
    var Shapes;
    (function (Shapes) {
        Shapes[Shapes["rectangle"] = 0] = "rectangle";
        Shapes[Shapes["line"] = 1] = "line";
        Shapes[Shapes["circle"] = 2] = "circle";
        Shapes[Shapes["speech"] = 3] = "speech";
    })(Shapes = BeamToIX.Shapes || (BeamToIX.Shapes = {}));
    BeamToIX.DEFAULT_SPEECH_START = 10;
    BeamToIX.DEFAULT_SPEECH_WIDTH = 10;
    BeamToIX.DEFAULT_SPEECH_HEIGHT = 10;
    BeamToIX.DEFAULT_SPEECH_SHIFT = 0;
    var SpeechPosition;
    (function (SpeechPosition) {
        SpeechPosition[SpeechPosition["left"] = 0] = "left";
        SpeechPosition[SpeechPosition["right"] = 1] = "right";
    })(SpeechPosition = BeamToIX.SpeechPosition || (BeamToIX.SpeechPosition = {}));
    // #export-section-end: release
    // -------------------------------
    // ------------------------------------------------------------------------
    //                               Implementation
    // ------------------------------------------------------------------------
    BeamToIX.pluginManager.addPlugin({
        id: 'beamtoix.shape-tasks',
        uuid: '3e5d5813-348a-4eb1-a8b5-9c87c3988923',
        author: 'Alexandre Bento Freire',
        email: 'beamtoix@a-bentofreire.com',
        jsUrls: ['plugins/shape-tasks/shape-tasks.js'],
        teleportable: true,
    });
    // ------------------------------------------------------------------------
    //                               Shape Task
    // ------------------------------------------------------------------------
    BeamToIX.pluginManager.addTasks([['shape', _shapeTask]]);
    /** Implements the Shape Task */
    function _shapeTask(anime, _wkTask, params, stage, args) {
        function buildSvg(inTextHtml, shapeTag, width, height, attrs, x0, y0) {
            if (x0 === void 0) { x0 = 0; }
            if (y0 === void 0) { y0 = 0; }
            inTextHtml.push(" width=\"".concat(width, "\""));
            inTextHtml.push(" height=\"".concat(height, "\""));
            inTextHtml.push(" viewBox=\"".concat(x0, " ").concat(y0, " ").concat(width, " ").concat(height, "\""));
            inTextHtml.push(" ><".concat(shapeTag));
            attrs.forEach(function (attr) {
                var name = attr[0], value = attr[1];
                if (value !== undefined) {
                    inTextHtml.push(" ".concat(name, "=\"").concat(value, "\""));
                }
            });
        }
        function buildRectangle(inTextHtml, sw, sr) {
            var rw = BeamToIX.ExprOrNumToNum(sr.width, 0, args);
            var rh = BeamToIX.ExprOrNumToNum(sr.height, 0, args);
            var rx = BeamToIX.ExprOrNumToNum(sr.rx, 0, args);
            var ry = BeamToIX.ExprOrNumToNum(sr.ry, 0, args);
            buildSvg(inTextHtml, 'rect', rw, rh, [['x', sw], ['y', sw], ['rx', rx], ['ry', ry],
                ['width', rw - 2 * sw], ['height', rh - 2 * sw]]);
        }
        function buildSpeech(inTextHtml, sw, sp) {
            var w = BeamToIX.ExprOrNumToNum(sp.width, 0, args);
            var h = BeamToIX.ExprOrNumToNum(sp.height, 0, args);
            var srx = BeamToIX.ExprOrNumToNum(sp.rx, 0, args);
            var sry = BeamToIX.ExprOrNumToNum(sp.ry, 0, args);
            var x0 = -sw;
            var rx = srx || sry || 0;
            var ry = sry || rx || 0;
            var isRound = rx !== 0 && ry !== 0;
            var speechStart = Math.max(sp.speechStart || BeamToIX.DEFAULT_SPEECH_START, rx);
            var speechWidth = Math.max(sp.speechWidth || BeamToIX.DEFAULT_SPEECH_WIDTH, 0);
            var speechHeight = sp.speechHeight || BeamToIX.DEFAULT_SPEECH_HEIGHT;
            var speechShift = sp.speechShift || BeamToIX.DEFAULT_SPEECH_SHIFT;
            var path = [];
            // @TODO: fix speech shift
            if (!sp.speechPosition || sp.speechPosition === SpeechPosition.left
                || SpeechPosition[sp.speechPosition] === 'left') {
                speechShift = -speechShift - speechWidth;
                speechStart = w - speechStart - speechWidth;
            }
            path.push("M".concat(rx, " 0 H").concat(w - rx));
            if (isRound) {
                path.push("A ".concat(rx, " ").concat(ry, " 0 0 1 ").concat(w, " ").concat(ry));
            }
            path.push("V".concat(h - ry));
            if (isRound) {
                path.push("A ".concat(rx, " ").concat(ry, " 0 0 1 ").concat(w - rx, " ").concat(h));
            }
            path.push("h".concat(-speechStart));
            path.push("l".concat(speechShift, " ").concat(speechHeight));
            path.push("l".concat(-speechWidth - speechShift, " ").concat(-speechHeight));
            path.push("H".concat(rx));
            if (isRound) {
                path.push("A ".concat(rx, " ").concat(ry, " 0 0 1 0 ").concat(h - ry));
            }
            path.push("V".concat(ry));
            if (isRound) {
                path.push("A ".concat(rx, " ").concat(ry, " 0 0 1 ").concat(rx, " 0"));
            }
            buildSvg(inTextHtml, 'path', w + 2 * sw, h + speechHeight + 2 * sw, [['d', path.join(' ')]], x0, -sw);
        }
        function buildArrow(inTextHtml, sa, isArrow) {
            // @TODO: Build Arrow code
            var x = BeamToIX.ExprOrNumToNum(sa.x, 0, args);
            var y = BeamToIX.ExprOrNumToNum(sa.y, 0, args);
            var x0 = 0;
            var y0 = 0;
            var radDir;
            var len;
            if (params.direction) {
                radDir = BeamToIX.ExprOrNumToNum(sa.direction, 0, args) * Math.PI / 180;
                len = BeamToIX.ExprOrNumToNum(sa.length, 0, args);
                x = Math.cos(radDir) * len;
                y = Math.sin(radDir) * len;
            }
            else {
                if (isArrow) {
                }
            }
            x0 = Math.min(0, x);
            y0 = Math.min(0, y);
            // if (isArrow) {
            //   const norm = Math.sqrt(x * x + y * y);
            //   // const
            // }
            buildSvg(inTextHtml, 'line', Math.abs(x), Math.abs(y), [['x1', 0], ['y1', 0], ['x2', x], ['y2', y]], x0, y0);
        }
        switch (stage) {
            case BeamToIX.TS_INIT:
                var sw = BeamToIX.ExprOrNumToNum(params.strokeWidth, 0, args);
                var shape = BeamToIX.parseEnum(params.shape, Shapes, Shapes.rectangle);
                var inTextHtml_1 = ["<svg"];
                switch (shape) {
                    case Shapes.rectangle:
                        buildRectangle(inTextHtml_1, sw, params);
                        break;
                    case Shapes.line:
                        buildArrow(inTextHtml_1, params, false);
                        break;
                    case Shapes.circle:
                        var r = BeamToIX.ExprOrNumToNum(params.radius, 0, args);
                        var r_sw = r + sw;
                        buildSvg(inTextHtml_1, 'circle', 2 * r_sw, 2 * r_sw, [['cx', r_sw], ['cy', r_sw], ['r', r]]);
                        break;
                    case Shapes.speech:
                        buildSpeech(inTextHtml_1, sw, params);
                        break;
                    default:
                        return BeamToIX.TR_EXIT;
                }
                if (params.fill) {
                    inTextHtml_1.push(" fill=\"".concat(params.fill, "\""));
                }
                if (params.stroke) {
                    inTextHtml_1.push(" stroke=\"".concat(params.stroke, "\""));
                }
                if (sw) {
                    inTextHtml_1.push(" stroke-width=\"".concat(sw, "\""));
                }
                inTextHtml_1.push('/></svg >');
                var elAdapters = args.scene.getElementAdapters(anime.selector);
                elAdapters.forEach(function (elAdapter) {
                    elAdapter.setProp('html', elAdapter.getProp('html') +
                        inTextHtml_1.join(''), args);
                });
                return BeamToIX.TR_EXIT;
        }
    }
})(BeamToIX || (BeamToIX = {}));
//# sourceMappingURL=shape-tasks.js.map