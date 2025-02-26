"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------
/** @module shared   | This module will generate a shared/lib file */
/** @module internal | This module is to be read only by developers */
/**
 * ## Description
 *
 * List of messages and constants to be shared between the client library
 * and the server.
 *
 * This module will generate a node module,
 * therefore it can't contain external references.
 */
var BeamToIX;
(function (BeamToIX) {
    BeamToIX._SRV_CNT = {
        MESSAGE_PREFIX: 'BEAMTOIX_',
        CMD_VALUE_SEP: '___',
        SERVER_SUFFIX: 'beamtoix-server=',
        LOG_LEVEL_SUFFIX: 'loglevel=',
        TELEPORT_SUFFIX: 'teleport=',
        RENDER_VAR_SUFFIX: 'var=',
        WIDTH_SUFFIX: 'frame-width=',
        HEIGHT_SUFFIX: 'frame-height=',
        // client messages
        MSG_READY: 'ready',
        MSG_RENDER: 'render',
        MSG_RENDER_FINISHED: 'render-finished',
        MSG_LOG_MSG: 'log',
        MSG_LOG_WARN: 'warn',
        MSG_LOG_ERROR: 'error',
        MSG_SET_FPS: 'set-fps',
        MSG_SET_FRAME_NR: 'set-frame-nr',
        MSG_SET_FRAME_COUNT: 'set-frame-count',
        MSG_TELEPORT: 'teleport',
        MSG_EXIT: 'exit',
        // server messages
        MSG_SERVER_READY: 'server-ready',
        MSG_RENDER_DONE: 'render-done',
    };
})(BeamToIX || (BeamToIX = {}));
//# sourceMappingURL=server-consts.js.map