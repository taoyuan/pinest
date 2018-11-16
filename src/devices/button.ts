import * as five from "johnny-five";
import {Mixin} from "ts-mixer";
import {Notifier} from "../notifier";

export interface ButtonCreateOptions {
  pin: number;
  invert?: boolean;
}

export class Button extends Mixin(five.Button, Notifier) {

  constructor(opts: five.ButtonOption) {
    super(opts);

    this.init();
  }

  static create(opts: ButtonCreateOptions) {
    return new Button(opts);
  }

  protected init() {
    this.forward(['hold', 'down', 'press', 'up', 'release']);
  }
}
