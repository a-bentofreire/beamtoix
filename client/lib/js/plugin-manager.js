"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
/** @module end-user | The lines bellow convey information for the end-user */
/**
 *
 * ## Description
 *
 * A **plugin** is a 3rd-party extension which provides a set of functionalities,
 * allowing to extend the ecosystem to the already rich set of built-in functionalities.
 *
 * Plugins creators who wish to create a plugin to support [](teleporter), must:
 *
 * - Declare the plugin via `pluginManager.addPlugin`.
 * - Set the `pluginInfo.teleportable = true`.
 * - Follow the [Developer Guideline Rules](../../../../../developer/dev-docs/coding-style).
 *
 * BeamToIX allows plugins to add the following functionality types:
 *
 * - [](easings)
 * - [](oscillators)
 * - [](paths)
 * - [](tasks)
 * - [](transitions)
 * - [](flyovers)
 * - [](functions)
 * - [](i18n)
 *
 * To add a functionality use: `pluginManager.add<functionality-type>`.
 *
 * In most cases, a functionality is a function that receives a set of parameters
 * followed by `args?:BeamToIXArgs`.
 * This last parameter will provide information regarding the state of the system.
 *
 * Plugins should try to be independent of DOM in order to work
 * with virtual elements such as WebGL and canvas. However, in some cases is
 * required to work with DOM only.
 */
var BeamToIX;
(function (BeamToIX) {
    // #generate-group-section
    // ------------------------------------------------------------------------
    //                               Plugin Manager
    // ------------------------------------------------------------------------
    /** List of all the functionalities available to be extended by plugins. */
    var Functionalities;
    (function (Functionalities) {
        Functionalities[Functionalities["easings"] = 0] = "easings";
        Functionalities[Functionalities["oscillators"] = 1] = "oscillators";
        Functionalities[Functionalities["paths"] = 2] = "paths";
        Functionalities[Functionalities["transitions"] = 3] = "transitions";
        Functionalities[Functionalities["tasks"] = 4] = "tasks";
        Functionalities[Functionalities["flyovers"] = 5] = "flyovers";
        Functionalities[Functionalities["functions"] = 6] = "functions";
    })(Functionalities = BeamToIX.Functionalities || (BeamToIX.Functionalities = {}));
    // #export-section-end: release
    // -------------------------------
    var _FunctionalitiesContainers = [
        BeamToIX._easingFunctions,
        BeamToIX._easingFunctions,
        BeamToIX._pathFunctions,
        BeamToIX._taskFunctions,
        BeamToIX._transitionFunctions,
        BeamToIX._flyoverFunctions,
        BeamToIX._exFunctions,
    ];
    /**
     * Allows 3rd-party to add easings, oscillators, paths, etc.
     */
    var _PluginManager = /** @class */ (function () {
        function _PluginManager() {
            this._plugins = [];
            this._locale = 'en';
        }
        _PluginManager.prototype.addPlugin = function (pluginInfo) {
            this._plugins.push(pluginInfo);
        };
        _PluginManager.prototype.addEasings = function (easings) {
            easings.forEach(function (easing) {
                BeamToIX._easingFunctions[easing[0]] = easing[1];
            });
        };
        _PluginManager.prototype.addOscillators = function (oscillators) {
            oscillators.forEach(function (oscillator) {
                BeamToIX._easingFunctions[oscillator[0]] = oscillator[1];
            });
        };
        _PluginManager.prototype.addPaths = function (paths) {
            paths.forEach(function (path) {
                BeamToIX._pathFunctions[path[0]] = path[1];
            });
        };
        _PluginManager.prototype.addTasks = function (tasks) {
            tasks.forEach(function (task) {
                BeamToIX._taskFunctions[task[0]] = task[1];
            });
        };
        _PluginManager.prototype.addTransitions = function (transitions) {
            transitions.forEach(function (transition) {
                BeamToIX._transitionFunctions[transition[0]] = transition[1];
            });
        };
        _PluginManager.prototype.addFlyovers = function (flyovers) {
            flyovers.forEach(function (flyover) {
                BeamToIX._flyoverFunctions[flyover[0]] = flyover[1];
            });
        };
        _PluginManager.prototype.addFunctions = function (functions) {
            functions.forEach(function (exprFunction) {
                BeamToIX._exFunctions[exprFunction[0]] = exprFunction[1];
            });
        };
        _PluginManager.prototype.addLocalization = function (localeInfo) {
            this._locale = localeInfo.locale;
            if (!this._locale) {
                BeamToIX.throwErr('The localization locale can not be empty');
            }
            if (localeInfo.charRanges) {
                localeInfo.charRanges.forEach(function (charRange) {
                    BeamToIX.CharRanges.push(charRange);
                });
            }
            var msgs = localeInfo.messages;
            if (msgs) {
                Object.keys(msgs).forEach(function (srcMsg) {
                    BeamToIX.Msgs[srcMsg] = msgs[srcMsg];
                });
            }
            if (localeInfo.functionalities) {
                localeInfo.functionalities.forEach(function (functionality) {
                    var aType = functionality[0], map = functionality[1];
                    var funcIndex = typeof aType === 'string' ? Functionalities[aType] : aType;
                    if (funcIndex === undefined) {
                        throw "Unknown functionality ".concat(aType);
                    }
                    var container = _FunctionalitiesContainers[funcIndex];
                    map.forEach(function (srcDst) {
                        container[srcDst.dst] = container[srcDst.src];
                    });
                });
            }
        };
        return _PluginManager;
    }());
    BeamToIX._PluginManager = _PluginManager;
    BeamToIX.pluginManager = new _PluginManager();
})(BeamToIX || (BeamToIX = {}));
//# sourceMappingURL=plugin-manager.js.map