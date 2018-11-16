export interface Constructor {
  new(...args: any[]): any;
}

export interface Tagger {
  decorator: () => PropertyDecorator,
  fetch: (target: Constructor | any) => string[],
}

export function tagify(key: string): Tagger {
  const decorator = (): PropertyDecorator => {
    return (target: Object, propertyKey: string): void => {
      let props: string[];
      if (target.hasOwnProperty(key)) {
        props = target[key];
      } else {
        props = target[key] = [];
      }
      props.push(propertyKey);
    };
  };

  const fetch = (target: Constructor | any): string[] => {
    let result: string[] = [];
    let prototype = target.prototype ? target.prototype : Object.getPrototypeOf(target);
    while (prototype != null) {
      let props: string[] = prototype[key];
      if (props) {
        result.push(...props);
      }
      prototype = Object.getPrototypeOf(prototype);
    }
    return result;
  };

  return {decorator, fetch};
}
