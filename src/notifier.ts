export interface Listener {
  (event: string, data?: any): Promise<void> | undefined;
}

export class Notifier {

  protected _listeners: Listener[] = [];

  listen(listener: Listener) {
    if (!this._listeners.indexOf(listener)) {
      this._listeners.push(listener);
    }
  }

  unlisten(listener: Listener) {
    const i = this._listeners.indexOf(listener);
    if (i >= 0) {
      this._listeners.splice(i, 1);
    }
  }

  async notify(event: string, data?: any) {
    for (const l of this._listeners) {
      await l(event, data);
    }
  }

  protected forward(events: string | string[]) {
    events = Array.isArray(events) ? events : [events];
    for (const event of events) {
      // @ts-ignore
      if (typeof this.on === 'function') {
        // @ts-ignore
        this.on(event, data => this.notify(event, data));
      }
    }
  }
}
