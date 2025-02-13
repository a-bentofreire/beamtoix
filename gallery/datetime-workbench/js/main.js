"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
window.addEventListener("load", function () {
    var dates = [
        { var: 'now', label: 'now', expr: "=now()" },
        { var: 'strDt', label: "'1974-04-25 12:20:10'", expr: "=date('1974-04-25 12:20:10')" },
        { var: 'numDt3', label: 'date(1985,6,12)', expr: "=date(1985,6,12)" },
        { var: 'numDt6', label: 'date(1755,11,1,9,40,0)', expr: "=date(1755,11,1,9,40,0)" },
    ];
    var dateTimeFuncs = ['Year', 'Month', 'Day', 'Hour', 'Minute', 'Second'];
    var formats = ['YYYY-MM-DD HH:mm:ss', 'ddd, MMM D (YY) hA'];
    // add as many scenes as labels
    $('#story').html(dates.map(function (_label, sceneIndex) {
        return "<div class=\"beamtoix-scene\" id=scene".concat(sceneIndex, "></div>");
    }).join('\n'));
    var animations = [];
    var vars = {};
    dates.forEach(function (date, sceneIndex) {
        var injectHtml = ["<div class=label>".concat(date.label, "</div>")];
        var tests = dateTimeFuncs.map(function (sel) {
            return {
                sel: sel,
                label: sel + ': ',
                classes: '',
                expr: "=".concat(sel.toLowerCase(), "(").concat(date.var, ")"),
            };
        });
        formats.forEach(function (format, index) {
            tests.push({
                sel: "format".concat(index),
                classes: 'format',
                label: format,
                expr: "=formatDateTime('".concat(format, "', ").concat(date.var, ")"),
            });
        });
        vars[date.var] = date.expr;
        animations.push(tests.map(function (rec) {
            injectHtml.push("<span class=\"".concat(rec.classes, "\">").concat(rec.label, "<span id=").concat(rec.sel, "></span></span>"));
            return {
                selector: "#".concat(rec.sel),
                props: [{
                        prop: 'text',
                        valueText: rec.expr,
                    }],
            };
        }));
        $("#scene".concat(sceneIndex)).html(injectHtml.join('\n'));
    });
    var story = BeamToIX.createStory(/*FPS:*/ 10);
    // ------------------------------------------------------------------------
    //                               Scene
    // ------------------------------------------------------------------------
    var scene;
    scene = story.scenes[0];
    scene
        .addAnimations([{
            tasks: [{
                    handler: 'add-vars',
                    params: {
                        allowExpr: true,
                        vars: vars,
                    },
                }],
        }]);
    var wait = 1.6 * 2;
    dates.forEach(function (_date, sceneIndex) {
        scene = story.scenes[sceneIndex];
        scene
            .addAnimations(animations[sceneIndex])
            .addStills("".concat(wait, "s"));
        if (sceneIndex < dates.length - 1) {
            scene.transition = {
                handler: BeamToIX.StdTransitions.slideLeft,
                duration: "".concat(wait / 2, "s"),
            };
        }
    });
    story.render(story.bestPlaySpeed() /* , { renderCount: wait * 10 * 3 - 4 } */);
});
//# sourceMappingURL=main.js.map