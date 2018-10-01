const {Nest} = require("..");

(async () => {
  const ports = await Nest.detect();
  console.log(ports);
})();

