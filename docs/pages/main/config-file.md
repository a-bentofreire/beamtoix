---
title: Config File
group: main
category: Pages
---
<!--- @ -->
<!--- @author: Alexandre Bento Freire -->
## Synopsis

Documentation of the `beamtoix.ini` file and `story.json` format.

## Rationale

Due the fact that html page layout has its own quirks, it's many times necessary
for the `.scss` files have access to the page dimensions to correctly position elements within the page.  
Since scss can't import json files, it's thus required to have `.scss` file with information regarding page dimensions.  
The render server agent also requires to have access to such information.  
Instead of having a complex communication system or different files (one `.json` and other `.scss`) format, 
having a solution with one single `.ini` file with a simple format that serves all purposes turn out to be one of the simplest solutions.  
Although, it has `.scss` format, it was decided to have `.ini` extension to prevent 
from being compiled and from the user being tempted to add extra information making the parsing more complex.  

## "beamtoix.ini" format

The `beamtoix.ini` is a subset of `.scss` format,  
It supports:  

* Line Comments the start with `//`
* SCSS variables with the format of: `$beamtoix-<key>: <value>;`
* String variables must be surrounded by double quotes, meta characters aren't supported

## Example

```scss
$beamtoix-height: 150;
$beamtoix-width: 220;
$beamtoix-file: "__PROJDIR__/index.html";
```

## Extra information

The `beamtoix.ini` examples in the gallery have the following extra fields, 
that have no meaning outside the scope of the gallery:  
  
```scss
$beamtoix-no-gif-image: "true";  // if true, it doesn't generates an animated gif image.
$beamtoix-uses-live: "false";    // if true, it requires a live server.
$beamtoix-teleportable: "false"; // if false, it doesn't supports teleportation.
$beamtoix-description: "<<example description>>";
$beamtoix-description2: "<<2n line example description>>";
```
  
## LESS

BeamToIX was designed to use `.scss` format for stylesheets, however, it also support LESS.  
In this case modify the `beamtoix.ini` file from `$beamtoix` to `@beamtoix`.   

```less
@beamtoix-height: 150;
@beamtoix-width: 220;
@beamtoix-file: "__PROJDIR__/index.html";
```
  
## "story.json" format

When BeamToIX was initially developer, the configuration files were `.json` files.  
During the develop phase, it become clear, the necessity of the `.scss` files 
to have access to the information about `width` and `height`, as a result the `.ini` format replaced the `.json` format.  
But the concept wasn't abandoned since it allowed to load complete animations from a `.json` file, 
if it's running using a live server.  
It was later, with the introduction of [teleportation](teleporter.md) that its main usage become to store teleportable stories,
and its importance was reinstated.  

The bare-bones of a config file:
  
```json
{
    "config": {
        "beamtoix": {
            "width": 150,
            "height": 220,
            "file": "__PROJDIR__/index.html"
        }
    }
}
```    
  
To load this config file use the following instead of `addAnimations`:
  
```ts
BeamToIX.createStoryFromConfig('story.json',
  (story: BeamToIX.Story) => {
    story.render(story.bestPlaySpeed());
  });
```
  
A `story.json` is a config file with the extra information, including:  

- CSS data.
- HTML text.
- Animation data.
- Plugins information.
- Metadata.
  
The easiest way to create a `story.json` is by running
  
```shell
beamtoix render --teleport
```
  
Read more about on [teleporter](teleporter.md).
