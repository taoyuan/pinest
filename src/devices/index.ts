import {LedRGB} from "./ledrgb";
import {Button} from "./button";

export const devices = {
  button: Button.create,
  ledrgb: LedRGB.create,
};
