const {Nest} = require('..');

(async () => {
  const nest = await Nest.create({waitForReady: true});
  for (const f of nest.features) {
    console.log('------');
    console.log(f.node, f.role);
    console.log(f.actions())
  }
})();
