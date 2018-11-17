import * as five from "johnny-five";
import {EventNotifier, Listener, Notifier} from "../notifier";

export interface ButtonCreateOptions {
  pin: number;
  invert?: boolean;
}

export class Button extends five.Button implements Notifier {

  protected _notifier: EventNotifier;

  constructor(opts: five.ButtonOption) {
    super(opts);

    this._notifier = new EventNotifier();

    this.init();
  }

  listen(listener: Listener) {
    this._notifier.listen(listener);
  }

  unlisten(listener: Listener) {
    this._notifier.unlisten(listener);
  }

  static create(opts: ButtonCreateOptions) {
    return new Button(opts);
  }

  protected init() {
    this._notifier.forward(this, ['hold', 'down', 'press', 'up', 'release']);
  }
}
