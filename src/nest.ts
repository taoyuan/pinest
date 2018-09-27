import * as PromiseA from "bluebird";
import {Board, BoardOption} from "johnny-five";
import * as SerialPort from "serialport";
import * as Firmata from "firmata";
import * as Features from "./features";
import {LedRGB} from "./devices/ledrgb";
import {Button} from "./devices/button";

export const FEATURE_REQUEST = 0x5B;
export const FEATURE_RESPONSE = 0x5C;

export interface Feature {
  node: string;
  role: string;
  device: any;
}

export class Nest {

  protected _board: Board;
  protected _features: Feature[];

  constructor(opts?: BoardOption) {
    opts = opts || {};

    let port = opts.port;
    delete opts.port;

    if (typeof port === 'string') {
      port = {path: port}
    }

    port = Object.assign({
      baudRate: 57600,
    }, port);

    Object.assign(opts, {
      io: new Firmata(new SerialPort(port.path, port)),
    });

    this._board = new Board(opts);
    this._ready = new Promise(async resolve => {
      this._board.on('ready', async () => {
        await this._initFeatures();
        resolve(this);
      });
    });
  }

  protected _ready: Promise<Nest>;

  get ready() {
    return this._ready;
  }

  get io() {
    return this._board.io;
  }

  feature(node: string, role?: string): Feature | undefined {
    if (this._ready.isResolved) throw new Error('Not ready');
    return this._features.find(feature => feature.node === node && (role ? feature.role === role : true));
  }

  device<T>(node: string, role?: string): T | undefined {
    if (this._ready.isResolved) throw new Error('Not ready');
    const feature = this.feature(node, role);
    return feature && <T> feature.device;
  }

  ledrgb(role?: string): LedRGB | undefined {
    return this.device<LedRGB>('ledrgb', role);
  }

  button(role?: string): Button | undefined {
    return this.device<Button>('button', role);
  }

  protected async _initFeatures() {
    try {
      const data = await new PromiseA<number[]>((resolve, rejcet) => {
        this.io.sysexResponse(FEATURE_RESPONSE, resolve);
        this.io.sysexCommand([FEATURE_REQUEST]);
      });

      const items = JSON.parse(Buffer.from(data).toString());
      if (Array.isArray(items)) {
        this._features = items.filter(item => Boolean(Features[item.node])).map(item => ({
          node: item.node,
          role: item.role,
          device: Features[item.node](item)
        }));
      }

    } finally {
      this.io.clearSysexResponse(FEATURE_RESPONSE)
    }
  }

}
