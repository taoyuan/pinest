export interface Listener {
  (event: string, data?: any): Promise<void> | void;
}

export interface Notifier {
  listen(listener: Listener);
  unlisten(listener: Listener);
}

export class EventNotifier implements Notifier {

  protected _listeners: Listener[] = [];

  protected hasListener(listener: Listener): boolean {
    return this._listeners.indexOf(listener) >= 0;
  }

  listen(listener: Listener) {
    if (!this.hasListener(listener)) {
      this._listeners.push(listener);
    }
  }

  unlisten(listener: Listener) {
    const i = this._listeners.indexOf(listener);
    if (i >= 0) {
      this._listeners.splice(i, 1);
    }
  }

  forward(source: any, events: string | string[]) {
    if (typeof source.on !== 'function') {
      throw new Error('source should be EventEmitter');
    }

    events = Array.isArray(events) ? events : [events];
    for (const event of events) {
      // @ts-ignore
      source.on(event, data => this.notify(event, data));
    }
  }

  async notify(event: string, data?: any) {
    for (const l of this._listeners) {
      await l(event, data);
    }
  }

}
