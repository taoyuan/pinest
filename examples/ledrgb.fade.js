const {Nest} = require('..');

const nest = new Nest({port: '/dev/cu.SLAB_USBtoUART'});

(async () => {
  await nest.ready;
  const ledrgb = nest.ledrgb();
  ledrgb.fadeloop('ff00ff');

  setTimeout(() => {
    ledrgb.stop();
    ledrgb.off();
  }, 5000)
})();
