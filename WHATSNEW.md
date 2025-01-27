# What's new

## [2.0] -
- Rebrand project ABeamer to BeamToIX

## [1.8] -
- Update the links to be minimum and online

## [1.7] -
- Update to gulp@5
- Update compilation to es6
- Updated compile beamtoix.js with esbuild
- Improve README

## [1.6] -
- Use jquery-3.7.1
- Add support for arrays in the 1 parameter numerical functions.
  > With this addition, those functions can process individual elements inside an array,  
  > and set the result to an array.
- Add new `statistic-functions` plugin with 8 fundamental functions.
- Add `get` and `slice` functions for array data extraction to `functions`.
- Add new `format-functions` plugin to convert numbers to string according to locale.
- Add `getVars` global function to allow plugins to add init vars.
- Add support for cli options ending with `__\d+`.
 > This addition solves slimerjs `--config` option conflict with beamtoix `--config`.
- Add support for default `INFO_PER_SERVER`.
 > This allows to add more servers without changing `INFO_PER_SERVER`.
- Add initial support for `slimerjs` server. (alpha version).
- Add `--server-exec` option to command line.
- Add `--scale` support for beamtoix cli `gif` and `movie` command.
- Add `--no-default-browser-check` to puppeteer server agent.
 > This change reduce chrome's the initialization phase.

## [1.5] -
  
- New `datetime-functions` plugin.
- Added `hsl2Rgb`, `rgb2Hsl`, `hsl` and `hsla` functions to `color-functions` plugin.
- Support input array parameter in `color-functions`.
- Added `abs` and `sign` functions.
- Added `allowExpr` parameter to `add-vars` task.
- Fixed a bug on the reducing the release version size.
- Improved command line documentation.
  
[read more >>>](https://beamtoix.devtoix.com/blog/2018/09/10/beamtoix-1.5.0-released.html)  
  
## [1.4] -
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-delay-teleportation/story-frames/story.gif)  ![Image](https://beamtoix.devtoix.com/gallery/latest/animate-delay-teleportation/story-frames/story-lighthouse.gif)  
  
- Teleportation initial snapshot can be delay by using `story.startTeleporting()`. Read about it on the blog [post](https://beamtoix.devtoix.com/blog/2018/08/20/how-to-delay-the-teleportation-in-beamtoix.html).  
- Debugging code was removed from `beamtoix.min.js`. Use `beamtoix-debug.min.js` if you need such information.
  
[read more >>>](https://beamtoix.devtoix.com/blog/2018/08/20/beamtoix-1.4.0-released.html)  
  
## [1.3] -
  
- Fixes font rendering on `animate-transitions` example.
- Adds minify to all beamtoix release js files.
- Adds execution scripts (linux and windows) when BeamToIX is downloaded as [zip](https://beamtoix.devtoix.com/downloads.html) file.  
  
[read more >>>](https://beamtoix.devtoix.com/blog/2018/08/15/beamtoix-1.3.0-released.html)  
  
## [1.2] -
  
- Fixes gif generator bug on Windows.
- Adds `--gif-background` to `beamtoix gif` CLI.  
  
[read more >>>](https://beamtoix.devtoix.com/blog/2018/08/06/beamtoix-1.2.0-released.html)  
  
## [1.1] -
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-simple-virtual-animator/story-frames/story.gif)
  
- Improves and simplifies the usage of [Virtual Animators](https://beamtoix.devtoix.com/blog/2018/07/31/how-to-use-virtual-animators-in-beamtoix.html).
- The CLI has:
    * a new `check` command to verify the requirements and help to configure puppeteer.
    * new parameters to fine-tune the generation of movies and gifs.
    * new environments variables to avoid changing the search path to execute `ffmpeg` and imagemagick `convert`.
- Better support for paths with spaces.
- Improved support for windows developers with new batch files.  
  
[read more >>>](https://beamtoix.devtoix.com/blog/2018/07/31/beamtoix-1.1.0-released.html)  
  
## [1.0] -
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-badges/story-frames/story.gif)
  
BeamToIX was raised to production level with the release of BeamToIX 1.0.0.  
This is the first LTS version and it includes many improvements, bug fixes, a few cosmetics changes in the documentation, 
and better support on Windows platform and Microsoft web browsers.  
BeamToIX 1.0.0 gives great access to the command-line allowing to create stories that can 
be configure by the server, opening the door to multiple dimension rendering.  
  
[read more >>>](https://beamtoix.devtoix.com/blog/2018/07/11/beamtoix-1.0.0-released.html)  
  
The `animated-badges` now are configurable by the server, and don't require the installation of local js/css files.  
[How to generate an animated badge with BeamToIX >>>](https://beamtoix.devtoix.com/blog/2018/07/11/how-to-generate-an-animated-badge-with-beamtoix.html)  
  
## [0.3.2] -
  
BeamToIX 0.3.2: Now BeamToIX has a website and blog. Have a look: [https://beamtoix.devtoix.com](https://beamtoix.devtoix.com).  
With the creation of the blog, the project updates will be described in more detail and its information can be used as documentation.
In this version includes more detailed documentation and several fixed several documentation bugs.
The major goal now is to raise the BeamToIX to production level.  
The [roadmap](https://beamtoix.devtoix.com/docs/latest/end-user/en/site/roadmap/) was also updated and added many details.   
  
## [0.3.1] -
  
BeamToIX 0.3.1 includes chart series as expressions, allowing to plot mathematical functions.  
The standard library now also includes `log`, `log10` and `exp`.  
[read more >>>](https://beamtoix.devtoix.com/blog/2018/06/29/beamtoix-0.3.1-released.html)  
 
## [0.3.0] -
  
![Image](https://a-bentofreire.github.io/beamtoix-gallery-release/animate-charts/story-frames/story.gif)  
  
BeamToIX 0.3.0 includes the first implementation of the charts plugin.  
Although there is still a lot of work for reach production stage, and the API can still change,
is already usable in projects.  
This plugin, will now enter a phase of research to ensure all parameters are consistent and their names 
and specifications are easy to use.  
Have a look how the charts look in [action](https://a-bentofreire.github.io/beamtoix-gallery-release/charts-gallery/index-online.html) or 
play with them in [Code Pen](https://codepen.io/a-bentofreire/pen/mKjQXR).  
  
[read more >>>](https://beamtoix.devtoix.com/blog/2018/06/25/beamtoix-0.3.0-released.html)  
  
This version also includes:
* Gallery examples can viewed online without installing.
* expressions support object variables.
* expressions support one-dimension indices access to array variable.
* [Easings gallery](https://a-bentofreire.github.io/beamtoix-gallery-release/easings-gallery/index-online.html).
  
## [0.2.12] -

In the version 0.2.11, it was added the alpha version of the charts plugin.
In the next versions, this plugin will be improved to reach beta version.
In this version 0.2.12, the command line and teleporter were both improved 
and fixed small bugs.
