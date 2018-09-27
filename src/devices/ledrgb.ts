import * as five from "johnny-five";

import RGBOption = five.Led.RGBOption;

export class LedRGB extends five.Led.RGB {
  constructor(opts: RGBOption) {
    super(opts);
  }

  protected _state: any = {};

  stop() {
    // @ts-ignore
    super.stop();

    const state = this._state;

    if (state.interval) {
      clearInterval(state.interval);
    }

    /* istanbul ignore if */
    if (state.animation) {
      state.animation.stop();
    }

    state.interval = null;

    return this;
  }

  fade(val: string | any, callback?: () => void)
  fade(val: string | any, duration?: number, callback?: () => void);
  fade(val: string | any, duration?: number | (() => void), callback?: () => void) {

    const state = this._state;

    // @ts-ignore
    this.stop();

    const options = {
      duration: typeof duration === "number" ? duration : 1000,
      keyFrames: [null, typeof val === "string" ? val : 'FFFFFF'],
      easing: "outSine",
      oncomplete: function() {
        state.isRunning = false;
        /* istanbul ignore else */
        if (typeof callback === "function") {
          callback();
        }
      }
    };

    if (typeof val === "object") {
      Object.assign(options, val);
    }

    if (typeof val === "function") {
      callback = val;
    }

    if (typeof duration === "object") {
      Object.assign(options, duration);
    }

    if (typeof duration === "function") {
      callback = duration;
    }

    state.isRunning = true;

    // @ts-ignore
    state.animation = state.animation || new Animation(this);
    state.animation.enqueue(options);
  }

  fadeloop(color: string, duration?: number) {
    const fadeloop = (color, duration, direction = false) => {
      this.fade(direction ? '000000' : color, duration, () => fadeloop(color, duration, !direction));
    };
    fadeloop(color, duration);
  }
}
