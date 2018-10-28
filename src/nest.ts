import * as PromiseA from "bluebird";
import * as SP from "serialport";
import * as Firmata from "firmata";
import {Board, BoardOption} from "johnny-five";
import * as Features from "./features";
import {LedRGB} from "./devices/ledrgb";
import {Button} from "./devices/button";
import {throws} from "assert";

export const FEATURE_REQUEST = 0x5B;
export const FEATURE_RESPONSE = 0x5C;

export interface NestOptions extends BoardOption {
  waitForReady: boolean;
}

export interface Feature {
  node: string;
  role: string;
  device: any;
}

export interface PortDescriptor {
  comName: string;
  manufacturer: string;
  serialNumber: string;
  pnpId: string;
  locationId: string;
  vendorId: string;
  productId: string;
}

export class Nest {

  protected _board: Board;

  protected constructor(opts?: NestOptions) {
    opts = normalize(opts);

    const portpath = opts.port.path;
    delete opts.port.path;

    const port = new SP(portpath, opts.port);
    delete opts.port;
    Object.assign(opts, {
      io: new Firmata(port),
    });

    this._board = new Board(opts);
    this._ready = new Promise(async resolve => {
      this._board.on('ready', async () => {
        await this._initFeatures();
        resolve(this);
      });
    });
  }

  protected _features: Feature[];

  get features() {
    return this._features;
  }

  protected _ready: Promise<Nest>;

  get ready() {
    return this._ready;
  }

  get io() {
    return this._board.io;
  }

  static async create(opts?: NestOptions): Promise<Nest> {
    opts = normalize(opts);
    if (!opts.port.path) {
      const descriptors = await this.detect();
      if (descriptors.length) {
        opts.port.path = descriptors[0].comName;
      } else {
        throw new Error('No serial port detected for pinest');
      }
    }

    const nest = new Nest(opts);
    if (opts.waitForReady) {
      return nest.ready;
    }
    return nest;
  }

  static async detect(): Promise<PortDescriptor[]> {
    const ports: PortDescriptor[] = await SP.list();
    if (!ports) {
      return [];
    }
    return ports.filter(p => p.vendorId && p.productId)
  }

  _checkReady() {
    if (this._ready.isResolved) throw new Error('Not ready');
  }

  feature(node: string, role?: string): Feature | undefined {
    this._checkReady();
    return this._features.find(feature => feature.node === node && (role ? feature.role === role : true));
  }

  device<T>(node: string, role?: string): T | undefined {
    this._checkReady();
    const feature = this.feature(node, role);
    return feature && <T> feature.device;
  }

  ledrgb(role?: string): LedRGB | undefined {
    this._checkReady();
    return this.device<LedRGB>('ledrgb', role);
  }

  button(role?: string): Button | undefined {
    this._checkReady();
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

function normalize(opts?: NestOptions): NestOptions {
  opts = opts || <NestOptions>{};

  if (typeof opts.port === 'string') {
    opts.port = {path: opts.port}
  }

  opts.port = Object.assign({
    baudRate: 57600,
  }, opts.port);

  return opts;
}
