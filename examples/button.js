const {Nest} = require('..');

(async () => {
  const nest = await Nest.create();
  const button = nest.button();
  button.on('hold', () => console.log('hold'));
  button.on('down', () => console.log('down'));
  button.on('press', () => console.log('press'));
  button.on('up', () => console.log('up'));
  button.on('release', () => console.log('release'));

  console.log('Waiting press button...');
})();
