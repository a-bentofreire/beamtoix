"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
/** @module internal | This module is to be read only by developers */
/**
 * ## Description
 *
 * Computes the delay between each item.
 */
var BeamToIX;
(function (BeamToIX) {
    function _parseItemDelay(values, args) {
        if (!values.itemDelayDuration) {
            return { duration: 0 };
        }
        return {
            duration: BeamToIX.parseTimeHandler(values.itemDelayDuration, args, 0, 0, false),
            grouping: values.itemDelayGrouping,
            disturbance: values.itemDelayDisturbance
                ? BeamToIX.parseTimeHandler(values.itemDelayDisturbance, args, 0, 0, false) : 0,
        };
    }
    BeamToIX._parseItemDelay = _parseItemDelay;
    function _computeItemDelay(it, elIndex /* , elCount: uint */) {
        var disturbance = it.disturbance;
        if (disturbance) {
            elIndex = elIndex + (Math.random() * 2 * disturbance) - disturbance;
        }
        return Math.max(BeamToIX.downRound((!it.grouping ? elIndex : elIndex % it.grouping)
            * it.duration), 0);
    }
    BeamToIX._computeItemDelay = _computeItemDelay;
})(BeamToIX || (BeamToIX = {}));
//# sourceMappingURL=item-delay.js.map