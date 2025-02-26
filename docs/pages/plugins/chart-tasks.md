---
title: Chart Tasks
group: Plugins
category: Pages
---
## Description
  
A **chart** task creates an animated chart.  
  
**WARN** This plugin is still in development stage, parts of API can change in the future.  
However is already in a stage that can be used.  
  
This plugin has the following built-in charts:  
  
- [pie](chart-tasks.md#piecharttaskparams)
- [bar](chart-tasks.md#axischarttaskparams)
- [area](chart-tasks.md#axischarttaskparams)
- [line](chart-tasks.md#axischarttaskparams)
- [marker](chart-tasks.md#axischarttaskparams)
- [mixed](chart-tasks.md#axischarttaskparams) Draws different types of chars in the same chart, uses
  [chartTypes](#chartTypes) parameter to determine the type of each chart per series.  
  
read the details on [AxisChartTaskParams](chart-tasks.md#axischarttaskparams).  
  
## Get started
How to create a simple bar chart:  
  
The bare-bones of a `beamtoix.scss` file:  
```scss
$beamtoix-width: 300;
$beamtoix-height: 150;
```  
  
 The bare-bones of a `html` file:  
```html
<div class="beamtoix-story" id=story>
    <div class=beamtoix-scene id=scene1>
      <canvas id=chart width=300 height=150></canvas>
    </div>
</div>
```  
  
On the `hello-world` example, replace the `scene.addAnimations` with:  
```typescript
scene.addAnimations([{
   selector: '#chart', // JQuery selector pointing to the HtmlElement
   tasks: [{
     handler: 'chart', // is always 'chart' for charts.  
     params: {
       chartType: BeamToIX.ChartTypes.bar, // or 'bar' if you are using javascript
       labelsX: { captions: ['A', 'B', 'C', 'D', 'E'] },
       title: 'My first Chart',
       data: [[100, 200, 50, 140, 300]],
     } as BeamToIX.AxisChartTaskParams, // comment as ... if you are using javascript
   }],
 }]);
```  
The previous example, will create a static chart.  
To animate it, change it the to following:  
```typescript
 scene.addAnimations([{
  selector: 'canvas',
  tasks: [{
    handler: 'chart',
    params: {
      chartType: BeamToIX.ChartTypes.bar,
      labelsX: { captions: ['A', 'B', 'C', 'D', 'E'] },
      title: 'My first Chart',
      data: [[100, 200, 50, 140, 300]],
      // animation parameters
      pointHeightStart: 0.1,    // defined the initial value for the animation point-height property
      animeSelector: 'chart-anime-01', // unique animation selector to be used by the animator
    } as BeamToIX.AxisChartTaskParams,
  }],
}])
  .addAnimations([{
    selector: `%chart-anime-01`, // animation selector defined previously, prefixed with '%'
    duration: `1s`,
    props: [{
      prop: 'point-height', // property which initial value is 0.1
      value: 1,             // value at the end of animation
    }],
  }]);
```  
  
<div class=api-header>&nbsp;</div>
#API
## ChartTaskName

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type ChartTaskName = 'chart';
```

<div class=class-interface-header>&nbsp;</div>
## ExprSeries

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface ExprSeries{ }
```

### ExprSeries.expr

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ExprSeries](chart-tasks.md#exprseries)]  
```js
expr: ExprString;
```


Expression that defines the series.  
`v` is the variable that starts in `startValue`, increments `step`.  
`n` is the number of points.

### ExprSeries.nrPoints

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ExprSeries](chart-tasks.md#exprseries)]  
```js
nrPoints: uint;
```


Number of points generated by the expr.  
If it's undefined, but there is already a previous series it will use
the previous series nrPoints.  
_default_: `ChartDefaults.nrPoints`  
### ExprSeries.startValue

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ExprSeries](chart-tasks.md#exprseries)]  
```js
startValue?: number;
```

### ExprSeries.step

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ExprSeries](chart-tasks.md#exprseries)]  
```js
step?: number;
```

## SeriesData

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type SeriesData = number[] | ExprSeries;
```

<div class=class-interface-header>&nbsp;</div>
## ChartCaptions

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface ChartCaptions{ }
```

### ChartCaptions.fontColor

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartCaptions](chart-tasks.md#chartcaptions)]  
```js
fontColor?: string | ExprString;
```

### ChartCaptions.fontFamily

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartCaptions](chart-tasks.md#chartcaptions)]  
```js
fontFamily?: string | ExprString;
```

### ChartCaptions.fontSize

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartCaptions](chart-tasks.md#chartcaptions)]  
```js
fontSize?: uint | ExprString;
```

### ChartCaptions.alignment

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartCaptions](chart-tasks.md#chartcaptions)]  
```js
alignment?: ChartCaptionAlignment | string;
```

### ChartCaptions.position

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartCaptions](chart-tasks.md#chartcaptions)]  
```js
position?: ChartCaptionPosition | string;
```

### ChartCaptions.orientation

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartCaptions](chart-tasks.md#chartcaptions)]  
```js
orientation?: ChartCaptionOrientation | string;
```

### ChartCaptions.marginBefore

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartCaptions](chart-tasks.md#chartcaptions)]  
```js
marginBefore?: uint | ExprString;
```

### ChartCaptions.marginAfter

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartCaptions](chart-tasks.md#chartcaptions)]  
```js
marginAfter?: uint | ExprString;
```

<div class=class-interface-header>&nbsp;</div>
## ChartLabels

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface ChartLabels extends ChartCaptions{ }
```

### ChartLabels.captions

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartLabels](chart-tasks.md#chartlabels)]  
```js
captions?: string[] | ExprString;
```

## ChartLabelsX

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-type">type</span>    
```js
export type ChartLabelsX = ChartLabels;
```

<div class=class-interface-header>&nbsp;</div>
## ChartLegendMark

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface ChartLegendMark{ }
```

### ChartLegendMark.width

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartLegendMark](chart-tasks.md#chartlegendmark)]  
```js
width?: uint | ExprString;
```

### ChartLegendMark.height

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartLegendMark](chart-tasks.md#chartlegendmark)]  
```js
height?: uint | ExprString;
```

### ChartLegendMark.spacing

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartLegendMark](chart-tasks.md#chartlegendmark)]  
```js
spacing?: uint | ExprString;
```

<div class=class-interface-header>&nbsp;</div>
## ChartLegend

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface ChartLegend extends ChartLabels{ }
```

### ChartLegend.mark

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartLegend](chart-tasks.md#chartlegend)]  
```js
mark?: ChartLegendMark;
```

<div class=class-interface-header>&nbsp;</div>
## ChartLabelsY

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface ChartLabelsY extends ChartLabels{ }
```

### ChartLabelsY.tickCount

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartLabelsY](chart-tasks.md#chartlabelsy)]  
```js
tickCount?: uint;
```

<div class=class-interface-header>&nbsp;</div>
## ChartMarkers

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface ChartMarkers{ }
```

### ChartMarkers.visible

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartMarkers](chart-tasks.md#chartmarkers)]  
```js
visible?: boolean | boolean[] | boolean[][];
```

### ChartMarkers.shape

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartMarkers](chart-tasks.md#chartmarkers)]  
```js
shape?: (ChartPointShape | string) | (ChartPointShape | string)[]
    | (ChartPointShape | string)[][];
```

### ChartMarkers.size

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartMarkers](chart-tasks.md#chartmarkers)]  
```js
size?: uint | uint[] | uint[][];
```

### ChartMarkers.color

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartMarkers](chart-tasks.md#chartmarkers)]  
```js
color?: string | string[] | string[][];
```

<div class=class-interface-header>&nbsp;</div>
## ChartLine

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface ChartLine{ }
```

### ChartLine.visible

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartLine](chart-tasks.md#chartline)]  
```js
visible?: boolean;
```

### ChartLine.color

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartLine](chart-tasks.md#chartline)]  
```js
color?: string | ExprString;
```

### ChartLine.width

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartLine](chart-tasks.md#chartline)]  
```js
width?: number | ExprString;
```

<div class=class-interface-header>&nbsp;</div>
## ChartTitle

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface ChartTitle extends ChartCaptions{ }
```

### ChartTitle.caption

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartTitle](chart-tasks.md#charttitle)]  
```js
caption: string | ExprString;
```

<div class=class-interface-header>&nbsp;</div>
## ChartDefaults

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface ChartDefaults{ }
```

### ChartDefaults.labelsX

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartDefaults](chart-tasks.md#chartdefaults)]  
```js
labelsX: ChartLabelsX;
```

### ChartDefaults.labelsY

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartDefaults](chart-tasks.md#chartdefaults)]  
```js
labelsY: ChartLabelsY;
```

### ChartDefaults.legend

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartDefaults](chart-tasks.md#chartdefaults)]  
```js
legend: ChartLegend;
```

### ChartDefaults.title

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartDefaults](chart-tasks.md#chartdefaults)]  
```js
title: ChartTitle;
```

### ChartDefaults.fillColors

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartDefaults](chart-tasks.md#chartdefaults)]  
```js
fillColors: string;
```

### ChartDefaults.strokeColors

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartDefaults](chart-tasks.md#chartdefaults)]  
```js
strokeColors: string;
```

### ChartDefaults.strokeWidth

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartDefaults](chart-tasks.md#chartdefaults)]  
```js
strokeWidth: uint;
```

### ChartDefaults.markers

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartDefaults](chart-tasks.md#chartdefaults)]  
```js
markers: ChartMarkers;
```

### ChartDefaults.barWidth

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartDefaults](chart-tasks.md#chartdefaults)]  
```js
barWidth: uint;
```

### ChartDefaults.pointMaxHeight

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartDefaults](chart-tasks.md#chartdefaults)]  
```js
pointMaxHeight: uint;
```

### ChartDefaults.pointDistance

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartDefaults](chart-tasks.md#chartdefaults)]  
```js
pointDistance: uint;
```

### ChartDefaults.seriesSpacing

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartDefaults](chart-tasks.md#chartdefaults)]  
```js
seriesSpacing: uint;
```

### ChartDefaults.nrPoints

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[ChartDefaults](chart-tasks.md#chartdefaults)]  
```js
nrPoints: uint;
```

Number of Points for ExprSeries
<div class=class-interface-header>&nbsp;</div>
## BaseChartTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface BaseChartTaskParams extends AnyParams{ }
```


Parameters for both [Axis Charts](chart-tasks.md#axischarttaskparams) and [Pie Charts](chart-tasks.md#piecharttaskparams).

### BaseChartTaskParams.chartType

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[BaseChartTaskParams](chart-tasks.md#basecharttaskparams)]  
```js
chartType?: ChartTypes | string;
```


Defines the type of chart.  
If it's `mixed` it uses [chartTypes](#chartTypes)

### BaseChartTaskParams.data

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[BaseChartTaskParams](chart-tasks.md#basecharttaskparams)]  
```js
data: SeriesData[];
```


List of series of data points.  
Each series much have the same number of data points.

### BaseChartTaskParams.animeSelector

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[BaseChartTaskParams](chart-tasks.md#basecharttaskparams)]  
```js
animeSelector?: string;
```


Set with a unique virtual selector, to be used another `addAnimations` to animate the chart.  
### Example
```typescript
   scene.addAnimations([{
    selector: 'canvas',
    tasks: [{
      handler: 'chart',
      params: {
        data: [[100, 200, 50, 140, 300]],
        pointHeightStart: 0.1,    // defined the initial value for the animation point-height property
        animeSelector: 'chart-anime-02', // unique animation selector to be used by the animator
      } as BeamToIX.AxisChartTaskParams,
    }],
  }])
    .addAnimations([{
      selector: `%chart-anime-02`, // animation selector defined previously, prefixed with '%'
      duration: `1s`,
      props: [{
        prop: 'point-height', // property which initial value is 0.1
        value: 1,             // value at the end of animation
      }],
    }]);
```

### BaseChartTaskParams.title

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[BaseChartTaskParams](chart-tasks.md#basecharttaskparams)]  
```js
title?: string | ExprString | ChartTitle;
```


Defines the chart title.  
At the moment is only supported horizontal top or bottom titles.

### BaseChartTaskParams.legend

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[BaseChartTaskParams](chart-tasks.md#basecharttaskparams)]  
```js
legend?: ChartLegend;
```


Defines the chart legend.  
At the moment is only supported stacked left or right top legend.

### BaseChartTaskParams.fillColors

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[BaseChartTaskParams](chart-tasks.md#basecharttaskparams)]  
```js
fillColors?: string | string[] | string[][];
```

Interior Color used by `area`, `bar` and `pie` charts.
### BaseChartTaskParams.strokeColors

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[BaseChartTaskParams](chart-tasks.md#basecharttaskparams)]  
```js
strokeColors?: string | string[] | string[][];
```

Outline Color used by `area`, `bar` and `pie` charts, and line color for `line` chart.
### BaseChartTaskParams.strokeWidth

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[BaseChartTaskParams](chart-tasks.md#basecharttaskparams)]  
```js
strokeWidth?: uint | uint[] | uint[][];
```

<div class=class-interface-header>&nbsp;</div>
## PieChartTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface PieChartTaskParams extends BaseChartTaskParams{ }
```


Parameters used by Pie Charts.  
Pie Charts provide the following animators:  
- [angle](#PieChartTaskParams.angleStart) with initial value in angleStart.  
- [dispersion](#PieChartTaskParams.dispersionStart) with initial value in dispersionStart.

### PieChartTaskParams.angleStart

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[PieChartTaskParams](chart-tasks.md#piecharttaskparams)]  
```js
angleStart?: number | ExprString;
```


Initial angle in radians defining the zero radial line of the chart.  
This parameter is animated with property `angle`.

### PieChartTaskParams.dispersionStart

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[PieChartTaskParams](chart-tasks.md#piecharttaskparams)]  
```js
dispersionStart?: number | ExprString;
```


Initial dispersion factor defined between 0 and 1.  
A dispersion defines the percentage of how much the pie circle will be used.  
A value of 1 represents a full circle, and a value of 0.5, represents half circle.  
This parameter is animated with property `dispersion`.

### PieChartTaskParams.isClockwise

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[PieChartTaskParams](chart-tasks.md#piecharttaskparams)]  
```js
isClockwise?: boolean;
```

<div class=class-interface-header>&nbsp;</div>
## AxisChartTaskParams

<span class="code-badge badge-public">public</span> <span class="code-badge badge-export">export</span> <span class="code-badge badge-interface">interface</span>    
```js
export interface AxisChartTaskParams extends BaseChartTaskParams{ }
```


Parameters used by Axis Charts, which are all except [Pie Charts](chart-tasks.md#piecharttaskparams).  
Axis Charts provide the following animators:  
- [point-height](#AxisChartTaskParams.pointHeightStart) with initial value in pointHeightStart.  
- [deviation](#AxisChartTaskParams.deviationStart) with initial value in deviationStart.  
- [sweep](#AxisChartTaskParams.sweepStart) with initial value in sweepStart.

### AxisChartTaskParams.chartTypes

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AxisChartTaskParams](chart-tasks.md#axischarttaskparams)]  
```js
chartTypes?: (ChartTypes | string)[];
```


Chart Type per series. Use only if [chartType](#chartType) is `mixed`.  
_example_: `: [BeamToIX.ChartTypes.bar, BeamToIX.ChartTypes.bar, BeamToIX.ChartTypes.line]`  
### AxisChartTaskParams.labelsX

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AxisChartTaskParams](chart-tasks.md#axischarttaskparams)]  
```js
labelsX?: ChartLabelsX | ExprString | string[];
```


Defines the X labels with complete information or just as an [ExprString](expressions.md#exprstring).  
If it's a ExprString, it will create one label for each point.  
The iterator variable is `v`.  
If it's an array, it must match the number of points in a series.  
_example_: `=2012 + v`  
_example_: `{ captions: ['A', 'B', 'C', 'D'] }`  
### AxisChartTaskParams.labelsY

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AxisChartTaskParams](chart-tasks.md#axischarttaskparams)]  
```js
labelsY?: ChartLabelsY | ExprString | string[];
```


Defines the Y labels with complete information or just as an [ExprString](expressions.md#exprstring).  
If it's a ExprString, it will create one label for each point.  
The iterator variable is `v`.  
If it's an array, it must match the tickCount.  
_example_: `=v/1000 + 'k'`  
_example_: `{ captions: ['10', '20', '30', '40'] }`  
### AxisChartTaskParams.markers

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AxisChartTaskParams](chart-tasks.md#axischarttaskparams)]  
```js
markers?: ChartMarkers;
```

### AxisChartTaskParams.barWidth

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AxisChartTaskParams](chart-tasks.md#axischarttaskparams)]  
```js
barWidth?: uint | ExprString;
```


x bar length for `bar` charts.  
If it's zero, it's calculated automatically in order to fill the complete x-space.

### AxisChartTaskParams.pointMaxHeight

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AxisChartTaskParams](chart-tasks.md#axischarttaskparams)]  
```js
pointMaxHeight?: uint | ExprString;
```

### AxisChartTaskParams.pointDistance

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AxisChartTaskParams](chart-tasks.md#axischarttaskparams)]  
```js
pointDistance?: uint | ExprString;
```


x distance between two data points.  
If it's zero, it's calculated automatically in order to fill the complete x-space.  
If the chart includes bars charts it must be big enough to include all the bars.

### AxisChartTaskParams.seriesSpacing

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AxisChartTaskParams](chart-tasks.md#axischarttaskparams)]  
```js
seriesSpacing?: uint | ExprString;
```


x space between two bars. Used only in `bar` charts.

### AxisChartTaskParams.negativeFillColors

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AxisChartTaskParams](chart-tasks.md#axischarttaskparams)]  
```js
negativeFillColors?: string | string[] | string[][];
```


Colors to be used in case of the data point is negative.  
At the moment, it only supports `bar` charts.

### AxisChartTaskParams.xAxis

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AxisChartTaskParams](chart-tasks.md#axischarttaskparams)]  
```js
xAxis?: ChartLine;
```

### AxisChartTaskParams.yAxis

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AxisChartTaskParams](chart-tasks.md#axischarttaskparams)]  
```js
yAxis?: ChartLine;
```

### AxisChartTaskParams.y0Line

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AxisChartTaskParams](chart-tasks.md#axischarttaskparams)]  
```js
y0Line?: ChartLine;
```

### AxisChartTaskParams.maxValue

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AxisChartTaskParams](chart-tasks.md#axischarttaskparams)]  
```js
maxValue?: number | ExprString;
```

### AxisChartTaskParams.minValue

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AxisChartTaskParams](chart-tasks.md#axischarttaskparams)]  
```js
minValue?: number | ExprString;
```

### AxisChartTaskParams.pointHeightStart

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AxisChartTaskParams](chart-tasks.md#axischarttaskparams)]  
```js
pointHeightStart?: number | ExprString;
```

### AxisChartTaskParams.deviationStart

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AxisChartTaskParams](chart-tasks.md#axischarttaskparams)]  
```js
deviationStart?: number | ExprString;
```

### AxisChartTaskParams.sweepStart

<span class="code-badge badge-public">public</span> <span class="code-badge badge-property">property</span>  [[AxisChartTaskParams](chart-tasks.md#axischarttaskparams)]  
```js
sweepStart?: number | ExprString;
```
