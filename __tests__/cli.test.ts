const { filesystem } = require('gluegun');
import * as execaWrap from 'execa-wrap';

const bin = filesystem.path(__dirname, '../bin/cdoc');
const run = args =>
  execaWrap('node', [bin, ...(Array.isArray(args) ? args : [args])], {
    filter: ['stdout', 'code', 'stderr']
  });

test('outputs version', async () => {
  const output = await run('--version');
  expect(output).toMatchInlineSnapshot(`
    "  code: 0
      stdout:
      -------
      1.0.0
      -------
      stderr:
      -------
      
      -------
    "
  `);
});

test('outputs help', async () => {
  const output = await run('--help');
  expect(output).toMatchInlineSnapshot(`
    "  code: 0
      stdout:
      -------
      cDoc version 1.0.0

        Usage:
          cdoc [source] [target] - extract comments from source files

        Options:
          --ext [ext]   - specify the source file extensions (comma separated, default: ts,js,tsx,jsx,mjs) 
          --out [ext]   - specify the output file extension (default: md)                                  
          --dry         - dry run                                                                          
          --silent      - silent mode
      -------
      stderr:
      -------
      
      -------
    "
  `);
});

test('runs', async () => {
  filesystem.remove('example/docs/');

  const output = await run(['./example/src/', './example/docs/']);
  expect(output).toContain('Extracting comments from source files');
  expect(output).toContain('Processing example/src/add.ts');
  expect(output).toContain('Writing to example/docs/add.md');

  const file = await filesystem.readAsync('example/docs/add.md');
  expect(file).toMatchInlineSnapshot(`
    "# Add

    Add two numbers.
    "
  `);
});

test('runs dry', async () => {
  filesystem.remove('example/docs/');

  const output = await run(['./example/src/', './example/docs/', '--dry']);
  expect(output).toContain('Extracting comments from source files');
  expect(output).toContain('(Dry run)');
  expect(output).toContain('Processing example/src/add.ts');
  expect(output).toContain('Writing to example/docs/add.md');

  const exists = await filesystem.existsAsync('example/docs/sub/mul.md')
  expect(exists).toBe(false);
});

test('runs silent', async () => {
  filesystem.remove('example/docs/');

  const output = await run(['./example/src/', './example/docs/', '--silent']);
  expect(output).toMatchInlineSnapshot(`
    "  code: 0
      stdout:
      -------
      
      -------
      stderr:
      -------
      
      -------
    "
  `);

  const file = await filesystem.readAsync('example/docs/sub/mul.md');
  expect(file).toMatchInlineSnapshot(`
    "# Mul

    Multiply two numbers.
    "
  `);
});
