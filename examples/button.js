const {Nest} = require('..');

const nest = new Nest({port: '/dev/cu.SLAB_USBtoUART'});

(async () => {
  await nest.ready;
  const button = nest.button();
  button.on('hold', () => console.log('hold'));
  button.on('down', () => console.log('down'));
  button.on('press', () => console.log('press'));
  button.on('up', () => console.log('up'));
  button.on('release', () => console.log('release'));
})();
