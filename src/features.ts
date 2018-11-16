import {fetchExposes} from "./exposes";

export interface Action {
  (...args): any;
}

export interface Actions {
  [name: string]: Action
}

export class Feature {
  readonly node: string;
  readonly role: string;
  readonly device: any;

  constructor(node, role, device) {
    this.node = node;
    this.role = role;
    this.device = device;
  }

  actions(): Actions {
    return fetchExposes(this.device).filter(n => this.device[n]).reduce((actions, name) => {
      actions[name] = (...args) => this.device[name](...args);
      return actions;
    }, {});
  }
}
