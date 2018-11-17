const {Nest} = require('..');

(async () => {
  const nest = await Nest.create();
  await nest.ready;
  const button = nest.button();

  button.listen((event) => {
    console.log(event);
  });

  console.log('Waiting press button...');
})();
