const { system, filesystem } = require('gluegun');

const src = filesystem.path(__dirname, '..');

const cli = async cmd =>
  system.run('node ' + filesystem.path(src, 'bin', 'cdoc') + ` ${cmd}`);

test('outputs version', async () => {
  const output = await cli('--version');
  expect(output).toContain('0.0.1');
});

test('outputs help', async () => {
  const output = await cli('--help');
  expect(output).toContain('0.0.1');
});

test('runs', async () => {
  filesystem.remove('example/docs/');

  const output = await cli('./example/src/ ./example/docs/');
  expect(output).toContain('Extracting comments from source files');
  expect(output).toContain('Processing example/src/add.ts');
  expect(output).toContain('Writing to example/docs/add.md');

  const addFile = filesystem.read('example/docs/add.md');
  expect(addFile).toContain(`# Add`);
  expect(addFile).toContain(`Add two numbers.`);
});
