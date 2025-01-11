# Description
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-beamtoix/story-frames/story.gif)

![NPM Version](https://img.shields.io/npm/v/beamtoix)

[BeamToIX](https://beamtoix.devtoix.com) is a powerful frame-by-frame animation ecosystem, designed to create an animated story
in the web browser and generate the file images of each frame in either a local machine or in the cloud.
  
This project was formerly known as ABeamer. Read [here](#migrating-from-abeamer) how to migrate from ABeamer to BeamToIX.

Unlike `VelocityJs` and `JQuery.animate` which were built for real-time user interaction,
BeamToIX allows you to build complex frame based animations and save them frame-by-frame
with transparency at high resolution and lossless compression without frame drop.
  
When an animated story is designed to be rendered in the cloud,
no software is required to install on the local machine,
allowing video hosting services, ad network, e-commerce companies
many other businesses to provide a tool for their users to add text, images,
and special effects to their images or videos by just using the web browser
and then [teleport](https://www.devtoix.com/docs/beamtoix/en/latest/documents/Library.Teleporter.html)
the story to the company's machine to render the frame images and generate animated gifs or videos.

If you find this project useful, please, read the [Support this Project](#support-this-project) on how to contribute.
  
## Components

BeamToIX includes a web browser library, a render server agent and a command line utility.
For the BeamToIX Animation Editor, read [Animation Editor](https://www.devtoix.com/docs/beamtoix/en/latest/documents/Animation_Editor.html).
  
- BeamToIX **web browser library** is a highly extensible TypeScript/JavaScript library
bundled with a rich [toolset](#toolset) reducing the time to build complex animations.
- BeamToIX **render server agent** is designed to communicate with a render server, usually a headless web browser, in order to save
each frame to the disk. It can run either with the full potential supporting [Code Handlers](https://www.devtoix.com/docs/beamtoix/en/latest/documents/Glossary.html#code-handler)
or in a sanitized environment allowing you to safely to render animations created by other users.
- BeamToIX **command line utility** allows you to build new projects,
render frames, create animated gifs or movies.

Read the [requirements](#requirements) for details about the necessary software
to install if you need to render, create gifs or movies in the local machine.

## Features

- Free and Open-source.
- Simple and intuitive design.
- Supports rendering in the cloud in a sanitized environment.
- Extensively documented: [Documentation](https://www.devtoix.com/docs/beamtoix/en/latest/).
- Absolutely minimum [dependencies](#requirements).
- Highly Extensible via plugins including interpolators, functions, flyovers and tasks.
- Tasks to build complex animations and F/X.
- Large gallery of [example projects](https://beamtoix.devtoix.com/gallery/latest/).
- Multiple scenes (only default scenes are teleportable).
- Scene transitions.
- Expressions, functions and variables.
- Parallel and off-sync property animations.
- Teleportable JQuery-like containers.
- Teleportable flyovers.
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-rec-high-res/story-frames/story.gif)
  
- Saves frame-by-frame into a file sequence with transparency and at high resolution.
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-with-less/story-frames/story.gif)
  
- Optional support for SCSS, LESS and TypeScript.
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-virtual/story-frames/story.gif)
  
- DOM and Virtual Elements, Animators and Scenes. [read more >>>](https://beamtoix.devtoix.com/blog/2018/07/31/how-to-use-virtual-animators-in-beamtoix.html)
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-localization/story-frames/story.gif)
  
- Localization of messages and plugin functionalities, including functions and variables.

## Property Animation

BeamToIX has a complex system that allows to interpolate pixels, numbers,
text, colors and much more.
BeamToIX guesses the starting value and property type from CSS style information,
or if that information is given via `valueStart`.
- General CSS properties:

e.g  `prop: 'border-style'; valueText: ['dotted', 'dashed']`.
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-pixels/story-frames/story.gif)
  
- Pixel properties.
 e.g. `valueStart: 10px; value: 100;`
- Dual-pixel properties via [paths](https://beamtoix.devtoix.com/docs/latest/end-user/en/site/paths/).
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-colors/story-frames/story.gif)
  
- Color properties.
e.g. `valueText: ['red', '#FF00AA'];`
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-counter/story-frames/story.gif)
  
- Formatted numerical properties.
e.g. `valueFormat: '%d%'; value: 100;`
- Unformatted numerical properties.
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-images/story-frames/story.gif)
  
- Image properties.
e.g. `prop: 'src'; valueText: ['a.png', 'b.png'];`
- Text properties.
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-class-prop/story-frames/story.gif)
  
- `class` property.
e.g. `prop: 'class'; valueText: ['+class1 -class2'];`
- `visible` property.
e.g. `prop: 'visible'; duration: 1; value: 1;`
- `transform` property:
e.g. `prop: 'transform'; valueFormat: 'rotateX(%fdeg)'`;

## CSS Animations

BeamToIX doesn't supports CSS animations, but BeamToIX was designed in a way that
its animations are similar to CSS animations, therefore it's easy to convert CSS Animations
to BeamToIX animations.
Besides the property interpolation described above, BeamToIX also supports:

![Image](https://beamtoix.devtoix.com/gallery/latest/animate-item-delay/story-frames/story.gif)
  
- Item-delay with `disturbance` to produce random effects.
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-loop/story-frames/story.gif)
  
- CSS animation-iteration-count.

## Interpolators

BeamToIX provides several interpolators, which can be defined by:

- Teleportable Built-in interpolators. Accessible by name and ID.
- Teleportable Expressions.
- Plugins. Only official plugins can be teleportable.
- Code Handlers due security reasons aren't teleportable.

BeamToIX has following interpolators:

![Image](https://beamtoix.devtoix.com/gallery/latest/animate-easings/story-frames/story.gif)
  
- Easings - The speed of motion.
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-oscillator/story-frames/story.gif)
  
- `harmonic` and `damped` oscillators - Rotation and Balancing motion.
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-pulsar/story-frames/story.gif)
  
- `pulsar` oscillator.
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-paths/story-frames/story.gif)
  
- Paths - n-dimension motion.

The interpolators are chained in the following order: easing→oscillator→path.

## Toolset

BeamToIX has a rich toolset. Extensibility and teleportation are the key features of these tools.
Unless is noticed, all the built-in tools support teleportation.
Just like in the case of interpolators, Code Handlers aren't teleported, and the tools can be extended via plugins but only official plugins are teleportable.

BeamToIX has the following tools:
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-transitions/story-frames/story.gif)
  
- Scene transitions.
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-flyovers/story-frames/story.gif)
  
- `info` flyover.
  
[![Image](https://beamtoix.devtoix.com/gallery/latest/animate-video-sync/story-frames/../assets/a-bentofreire/snapshot.jpg)](https://beamtoix.devtoix.com/gallery/latest/animate-video-sync/story-frames/../assets/a-bentofreire/view-video.html)
  
- `video-sync` flyover [[1]](https://beamtoix.devtoix.com/docs/latest/end-user/en/site/flyovers/#video-sync-flyover).
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-wrappers/story-frames/story.gif)
  
- Wrappers.
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-text-tasks/story-frames/story.gif)
  
- Text tasks:
  - `text-split` task.
  - `typewriter` task.

![Image](https://beamtoix.devtoix.com/gallery/latest/animate-factory/story-frames/story.gif)
  
- `factory` task.
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-decipher-text/story-frames/story.gif)
  
- `decipher` task.
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-attack-task/story-frames/story.gif)
  
- `color-attack` task.
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-shapes/story-frames/story.gif)
  
- `shape` task.
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-speech/story-frames/story.gif)
  
- `speech` shape task.
  
![Image](https://beamtoix.devtoix.com/gallery/latest/animate-charts/story-frames/story.gif)
  
- `charts` task.

and much more [coming soon](https://beamtoix.devtoix.com/docs/latest/end-user/en/site/roadmap/).

## Installation

To create animations, It's only required to have the `web browser library` without the need of any software installed in the computer.

If you have nodejs already installed, install using npm:
  
`npm install -g beamtoix`
  
## Requirements

However, in order to render frames, generate gifs and movies, it requires:
1. [nodejs](https://nodejs.org/en/).

2. To render, it requires [puppeteer](https://www.npmjs.com/package/puppeteer) render server `npm install -g puppeteer`.
   Puppeteer installs Chromium by default, since Chromium is outdated and it has less features than Chrome,
   before installing puppeteer, read the following [note](https://www.devtoix.com/docs/beamtoix/en/latest/documents/FAQ.html#can-i-install-puppeteer-without-chromium)
   on how to configure puppeteer to use Chrome instead of Chromium.
   BeamToIX also supports `phantomjs` but since its features are outdated it is preferable to use puppeteer.

3. To generate gifs, it requires to have [imagemagick](https://www.imagemagick.org) on system path.
   For Windows users, read the following [note](https://beamtoix.devtoix.com/docs/latest/end-user/en/site/faq/#it-doesnt-creates-a-gif-file).

4. To create movies, it requires to have [ffmpeg](https://www.ffmpeg.org/) on the system path.
  
To check if 2-4 points are installed and configured, execute:
  `beamtoix check`

## Playground

Try these examples online without any installation:

- [Hello world](https://codepen.io/a-bentofreire/pen/rrRMRa)
- [Image Overlays](https://codepen.io/a-bentofreire/pen/QxMPYR)
- [Ad Example](https://codepen.io/a-bentofreire/pen/qKPdVo)
- [E-Commerce](https://codepen.io/a-bentofreire/pen/aKyxyd)
- [Charts](https://codepen.io/a-bentofreire/pen/mKjQXR)

## Get started

Start by creating a new project using the BeamToIX command line utility:
  
`beamtoix create myproject`

BeamToIX web browser library root is `BeamToIX.Story`.
When you create a story, you define an immutable number of frames per second,
and all animations are interpolated based on that `fps`.
  
on file `js/main.ts`:

```javascript
  let story = BeamToIX.createStory(25); // creates a story with 25 fps
```
  
The `story` holds a collection of Scenes.
Only one scene can be visible at a given moment in time except during the transition between two scenes.
It represents the natural concept of a scene in a storyline.
By using Scenes, BeamToIX can speed up the processing speed by reducing the global amount of calculations.

The bare-bones of a `html` file:

```html
  <div class="beamtoix-story" id=story>
      <div class=beamtoix-scene id=scene1>
           <p id="hello">Hello world</p>
      </div>
  </div>
```
  
The bare-bones of a `beamtoix.scss` file:

```scss
$beamtoix-width: 200;
$beamtoix-height: 100;
```
  
The bare-bones of a `scss` file:

```scss
@use "./../beamtoix";
body,
html,
.beamtoix-story,
.beamtoix-scene {
  width: beamtoix.$beamtoix-width + px;
  height: beamtoix.$beamtoix-height + px;
}
```
  
Html Elements with `beamtoix-scene` class are added automatically.
Scenes can be added manually with the following code:

```javascript
 const newScene = story.AddScene();
```

Creating scenes with `beamtoix-scene` class is the preferable way.
You add animations to the scene defining the time in 'seconds', 'milliseconds' or 'frames'
but if it's defined in time, these are converted to frames based on the story fps.

```javascript
  scene1.addAnimations(
    [{
      selector: '#hello',  // dom or JQuery selector
      duration: '4s', // at 25fps, the duration is 100 frames
      props: [
        {
          prop: 'left',  // property, text, url to animate
          easing: 'easeOutQuad', // easing
          value: 100 // end value
        }
      ]
    }]
  );

```

You can add multiple properties in parallel or off-sync with the `position` or `advance` parameter.

## Command line

**BeamToIX** command line utility is used to:

1. checks if requirements are configured: `beamtoix check`.
2. create projects: `beamtoix create`.
3. launch a live server: `beamtoix serve`.
4. create a png file sequence: `beamtoix render`.
5. create gifs: `beamtoix gif`.
6. create movies: `beamtoix movie`.

For detailed examples, read: [Command Line Utility](https://www.devtoix.com/docs/beamtoix/en/latest/documents/Command_Line.html).
Read [Requirements](#requirements) for details about the necessary software
to install if you need to render, create gifs or movies on the local machine.

## Documentation

- [Documentation](https://www.devtoix.com/docs/beamtoix/en/latest/)

## Known Issues

- [Known Issues](https://www.devtoix.com/docs/beamtoix/en/latest/documents/Known_Issues.html)

## Migrating from ABeamer

To migrate from ABeamer to BeamToIX:
1. rename all the files and text from "ABeamer" to "BeamToIX".
2. rename all the files and text from "abeamer" to "beamtoix".

## Migrating from Version 2 to Version 3+

Starting version 3+ due scss deprecated `@import`, the following changes must be applies to projects in prior versions:
- `beamtoix.ini` becomes `beamtoix.scss` and it must contains the `$width` and `$height` variables
- `mains.scss` @import becomes `@use "./../beamtoix"`
- `$width` and `$height` outside beamtoix must be prefixed with `beamtoix`.

## Support this Project

If you find this project useful, consider supporting it:

- Donate:

[![Donate via PayPal](https://www.paypalobjects.com/webstatic/en_US/i/btn/png/blue-rect-paypal-34px.png)](https://www.paypal.com/donate/?business=MCZDHYSK6TCKJ&no_recurring=0&item_name=Support+Open+Source&currency_code=EUR)

[![Buy me a Coffee](https://www.devtoix.com/assets/buymeacoffee-small.png)](https://buymeacoffee.com/abentofreire)

- Visit the project [homepage](https://www.devtoix.com/en/projects/beamtoix)
- Give the project a ⭐ on [Github](https://github.com/a-bentofreire/beamtoix)
- Spread the word
- Follow me:
  - [Github](https://github.com/a-bentofreire)
  - [LinkedIn](https://www.linkedin.com/in/abentofreire)
  - [Twitter/X](https://x.com/devtoix)

## Contribute

![Image](https://beamtoix.devtoix.com/assets/icons/warning.png) BeamToIX
was built on Linux/Chrome/Puppeteer and tested on Windows, Firefox, Opera, MS IE11 and MS Edge.

To keep an healthy cooperation environment, before posting an issue, please read
[Code Of Conduct](https://www.devtoix.com/docs/beamtoix/en/latest/documents/Code_Of_Conduct.html).

Report issues on [github](https://github.com/a-bentofreire/beamtoix/issues/).

## License

MIT License

## Copyrights

(c) 2018-2025 [Alexandre Bento Freire](https://www.a-bentofreire.com)
