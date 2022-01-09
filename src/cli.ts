import { build } from 'gluegun';
import { Options } from 'gluegun/build/types/domain/options';
import { process } from './';

const USAGE = `
  Usage:
    cdoc [source] [target] - extract comments from source files`;

const OPTIONS_TABLE = [
  [
    '  --ext [ext]',
    '- specify the source file extensions (comma separated, default: ts,js,tsx,jsx,mjs)'
  ],
  ['  --out [ext]', '- specify the output file extension (default: md)'],
  ['  --dry', '- dry run'],
  ['  --silent', '- silent mode']
];

async function run(argv: string | Options) {
  const cli = build()
    .brand('cDoc')
    .src(__dirname)
    .help({
      name: 'help',
      alias: 'h',
      dashed: true,
      run: (toolbox: any) => {
        const {
          runtime: { brand },
          print
        } = toolbox;
        print.info(`${brand} version ${toolbox.meta.version()}`);
        print.info(USAGE);
        print.info(`\n  Options:`);
        print.table(OPTIONS_TABLE);
      }
    })
    .version() // provides default for version, v, --version, -v
    .defaultCommand({
      description:
        '[source] [target] - extract comments from source files\n --ext [ext] - specify the source file extension\n --out [ext] - specify the output file extension',
      run: async toolbox => {
        const { parameters, print } = toolbox;

        const source = parameters.first || parameters.options.input;
        const target = parameters.second || parameters.options.output;

        if (!source) {
          print.error('Missing source directory');
          return;
        }

        if (!target) {
          print.error('Missing target directory');
          return;
        }

        const dry = parameters.options.dry || false;
        const ext = parameters.options.ext
          ? parameters.options.inext.split(',')
          : undefined;
        const out = parameters.options.out
          ? parameters.options.outext
          : undefined;

        const silent = parameters.options.silent || false;

        silent || print.info('Extracting comments from source files');
        silent || (dry && print.info('(Dry run)'));
        silent || print.info('');

        try {
          await process({
            source,
            target: target,
            dry,
            ext,
            out,
            silent
          });
        } catch (error) {
          print.error(error);
        }
      }
    })
    .exclude([
      'strings',
      'semver',
      'prompt',
      'http',
      'template',
      'patching',
      'package-manager'
    ])
    .create();

  const toolbox = await cli.run(argv);

  // send it back (for testing, mostly)
  return toolbox;
}

module.exports = { run };
