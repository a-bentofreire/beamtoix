
@ECHO OFF
setlocal enabledelayedexpansion
REM  

REM  ------------------------------------------------------------------------
REM  Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
REM  Licensed under the MIT License.
REM  ------------------------------------------------------------------------

REM  this script is designed only for testing beamtoix cli in a bash environment
REM  using `beamtoix serve` as a live server.
REM  e.g. live-render.cmd gallery\animate-colors

if  "%1" == "" (
  echo "usage: ./live-render.cmd [--gif] [PORT] (FOLDER)"
  goto :end
) 

set GEN_GIF=0
if "%1" == "--gif" (
  set GEN_GIF=1
) else (
  goto skipShift
)
shift
:skipShift

set PORT=%1
set /a IPORT=%PORT%
if %PORT% NEQ %IPORT% (
  set PORT=9000
  goto skipShift2
)
shift
:skipShift2
set FOLDER=%1
shift

REM set FOLDER=!FOLDER!
set D_FOLDER=!FOLDER:\=/!
set URL=http://localhost:!PORT!/!D_FOLDER!/
set CONFIG=./!D_FOLDER!/beamtoix.scss

echo PORT=!PORT!
echo FOLDER=!D_FOLDER!
echo URL=!URL!
echo CONFIG=!CONFIG!

REM ------------------------------------------------------------------------------
REM This code is credited to 
REM https://stackoverflow.com/questions/761615/is-there-a-way-to-indicate-the-last-n-parameters-in-a-batch-file
set params=%1
:loop
shift
if [%1]==[] goto after_loop
set params=%params% %1
goto loop
:after)loop
REM ------------------------------------------------------------------------------

echo node cli\beamtoix-cli.js render !params! --dp --url !URL! --config !CONFIG!
node cli\beamtoix-cli.js render !params! --dp --url !URL! --config !CONFIG!

if %GEN_GIF% == 1 (
  node cli\beamtoix-cli.js gif ./!D_FOLDER!
)
:end