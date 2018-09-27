import * as five from "johnny-five";

export class Button extends five.Button {
  constructor(opts: five.ButtonOption) {
    super(opts);
  }
}
