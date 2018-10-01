const {Nest} = require('..');

(async () => {
  const nest = await Nest.create({waitForReady: true});
  const ledrgb = nest.ledrgb();
  ledrgb.fadeloop('0000ff');

  setTimeout(() => {
    ledrgb.stop();
    ledrgb.off();
  }, 5000)
})();
