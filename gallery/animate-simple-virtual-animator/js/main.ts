"use strict";
// ------------------------------------------------------------------------
// Copyright (c) 2018-2025 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License.
// ------------------------------------------------------------------------

window.addEventListener("load", () => {

  const story = BeamToIX.createStory(/*FPS:*/20);

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  // let drawCallTimes = 0;

  // ------------------------------------------------------------------------
  //                               CanvasAnimator
  // ------------------------------------------------------------------------

  class CanvasAnimator extends BeamToIX.SimpleVirtualAnimator {

    /**
     * This method is called after each property were updated.
     * In this case, it would generate 3x times more calls since there are
     * the 3 animation properties in this example.
     * Use animateProps instead.
     */
    animateProp(name: BeamToIX.PropName, value: BeamToIX.PropValue): void {
      // this.draw();
    }


    /**
     * This method is called after all properties were updated.
     * It's the preferable method of this case.
     * You can get the values props property.
     */
    animateProps(): void {
      this.draw();
    }


    draw(): void {
      const w = canvas.width;
      ctx.clearRect(0, 0, w, canvas.height);
      const y = canvas.height - 10;

      ctx.font = `30px sans-serif`;
      ctx.fillStyle = this.props.colors;
      ctx.textBaseline = 'bottom';

      const text = this.props.text;
      const sz = ctx.measureText(text);
      ctx.fillText(text, (w - sz.width) / 2, y);

      const lineWidth = this.props.lineWidth;
      ctx.fillStyle = '#FF3333';
      ctx.fillRect((w - lineWidth) / 2, y + 2, lineWidth, 4);

      // drawCallTimes++;
      // console.log(`drawCallTimes: ${drawCallTimes}`);
    }
  }

  // ------------------------------------------------------------------------
  //                               Scene1
  // ------------------------------------------------------------------------

  const scene1 = story.scenes[0];

  const texts = ['LIFE', 'IS AN', 'ENDLESS', 'JOURNEY'];
  const colors = ['#333333', '#883333', '#338833', '#333388'];

  const ca = new CanvasAnimator();
  ca.selector = 'canvas-fx';
  ca.props.lineWidth = 10;
  ca.props.text = texts[0];
  ca.props.colors = colors[0];
  ca.draw();
  story.addVirtualAnimator(ca);

  scene1
    .addAnimations([{
      selector: '%canvas-fx',
      duration: '2s',
      props: [
        {
          prop: 'lineWidth',
          value: story.width - 10,
        },
        {
          prop: 'text',
          valueText: texts,
        },
        {
          prop: 'colors',
          valueText: colors,
        },
      ],
    }],
  );

  story.render(story.bestPlaySpeed());
});
