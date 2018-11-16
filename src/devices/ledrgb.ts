import * as five from "johnny-five";
import RGBOption = five.Led.RGBOption;
import {expose} from "../exposes";

export interface LedRGBCreateOptions extends RGBOption {
  pins: number[];
  invert?: boolean;
}

export class LedRGB extends five.Led.RGB {

  protected _state: any = {};

  constructor(opts: RGBOption) {
    super(opts);
  }

  static create(opts: LedRGBCreateOptions) {
    opts.isAnode = opts.invert;
    return new LedRGB(opts);
  }

  @expose()
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
  @expose()
  fade(val: string | any, duration?: number | (() => void), callback?: () => void) {

    const state = this._state;

    // @ts-ignore
    this.stop();

    const options = {
      duration: typeof duration === "number" ? duration : 1000,
      keyFrames: [null, typeof val === "string" ? val : 'FFFFFF'],
      easing: "outSine",
      oncomplete: function () {
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
    state.animation = state.animation || new five.Animation(this);
    state.animation.enqueue(options);
  }

  fadeloop(color: string, mode: 'in' | 'out' | 'toggle', duration?: number) {
    const fade = (color, duration, direction = false) => {
      let toColor;
      if (mode === 'in') {
        this.color('000000');
        toColor = color;
      } else if (mode === 'out') {
        this.color(color);
        toColor = '000000';
      } else if (mode === 'toggle') {
        toColor = direction ? '000000' : color;
      }
      this.fade(toColor, duration, () => fade(color, duration, !direction));
    };
    fade(color, duration);
  }

  @expose()
  fadetoggle(color: string, duration?: number) {
    this.fadeloop(color, 'toggle', duration);
  }

  @expose()
  fadein(color: string, duration?: number) {
    this.fadeloop(color, 'in', duration);
  }

  @expose()
  fadeout(color: string, duration?: number) {
    this.fadeloop(color, 'out', duration);
  }

  @expose()
  on(): void {
    super.on();
  }

  @expose()
  off(): void {
    super.off();
  }

  @expose()
  color(value: string): void {
    super.color(value);
  }

  @expose()
  toggle(): void {
    super.toggle();
  }

  @expose()
  strobe(ms: number): void {
    super.strobe(ms);
  }

  @expose()
  intensity(value: number): void {
    super.intensity(value);
  }

  @expose()
  fadeIn(ms: number): void {
    super.fadeIn(ms);
  }

  @expose()
  fadeOut(ms: number): void {
    super.fadeOut(ms);
  }

  @expose()
  pulse(ms: number): void {
    super.pulse(ms);
  }
}
