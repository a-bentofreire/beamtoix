#!/usr/bin/env bash
# 

# ------------------------------------------------------------------------
# Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
# Licensed under the MIT License.
# ------------------------------------------------------------------------

# this script is designed only for testing beamtoix cli in a bash enviroment
# using `beamtoix serve` as a live server.
# e.g. ./live-render.sh ./gallery/animate-colors

if [ "$1" == "" ]; then
  echo "usage: ./live-render.sh [--gif] [PORT] (FOLDER)"
else
  GEN_GIF=0
  if [ "$1" == "--gif" ]; then
    GEN_GIF=1
    shift
  fi

  PORT=$1
  PARAM_TEST=${PORT//[0-9]}
  if [ "$PARAM_TEST" != "" ]; then
    PORT=9000
  else
    shift
  fi
  FOLDER=$1
  shift

  FOLDER=${FOLDER%/}
  DFOLDER=${FOLDER//\.\//}
  URL="http://localhost:$PORT/$DFOLDER/"
  CONFIG="./$DFOLDER/beamtoix.scss"

  echo "PORT=$PORT"
  echo "FOLDER=$DFOLDER"
  echo "URL=$URL"
  echo "CONFIG=$CONFIG"

  echo "node ./cli/beamtoix-cli.js render $@ --dp --url $URL --config $CONFIG"
  node ./cli/beamtoix-cli.js render "$@" --dp --url "$URL" --config "$CONFIG"

  if [ $GEN_GIF == 1 ]; then
    node ./cli/beamtoix-cli.js gif "./$DFOLDER"
  fi
fi
