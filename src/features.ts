import {LedRGB} from "./devices/ledrgb";
import {Button} from "./devices/button";

export interface FeatureOptions {
  node: string;
  role: string;
}

export interface RGBFeatureOptions extends FeatureOptions{
  pins: number[];
  invert?: boolean;
}

export interface ButtonOptions extends FeatureOptions {
  pin: number;
  invert?: boolean;
}

export function ledrgb(opts: RGBFeatureOptions): LedRGB {
  return new LedRGB({
    pins: opts.pins,
    isAnode: opts.invert || false,
  });
}

export function button(opts: ButtonOptions): Button {
  return new Button({
    pin: opts.pin,
    invert: opts.invert,
  })
}
