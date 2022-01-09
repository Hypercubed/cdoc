const { build } = require('gluegun');

/**
 * Create the cli and kick it off
 */
async function run(argv) {
  // create a CLI runtime
  const cli = build()
    .brand('dsd')
    .src(__dirname)
    // .plugins('./node_modules', { matching: 'dsd-*', hidden: true })
    .help() // provides default for help, h, --help, -h
    .version() // provides default for version, v, --version, -v
    .exclude(['strings', 'semver', 'prompt', 'http', 'template', 'patching', 'package-manager'])
    .create();

  const toolbox = await cli.run(argv);

  // send it back (for testing, mostly)
  return toolbox;
}

module.exports = { run };
