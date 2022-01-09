import { GluegunCommand } from 'gluegun';

import * as parseComments from 'multilang-extract-comments';

import { join, basename } from 'path';

const DEFAULT_EXTS = ['ts', 'js', 'tsx', 'jsx', 'mjs'];

const command: GluegunCommand = {
  name: 'dsd',
  run: async toolbox => {
    const { print, filesystem, parameters } = toolbox;

    const SOURCE = parameters.first || parameters.options.in || parameters.options.input || '.';
    const TARGET = parameters.second || parameters.options.out || parameters.options.output || '.';

    // TODO SOURCE and TARGET are required

    const DRY = parameters.options.dry || false;
    const SOURCE_EXT = parameters.options.inext ? parameters.options.inext.split(',') : DEFAULT_EXTS;
    const TARGET_EXT = parameters.options.outext ? parameters.options.outext : 'md';

    print.info('Welcome to your CLI');

    const matching = SOURCE_EXT.length > 1 ? `*.{${SOURCE_EXT.join(',')}}` : `*.${SOURCE_EXT[0]}`;

    const files = filesystem.find(SOURCE, { matching });

    files.forEach(async filename => {
      print.info(`Reading ${filename}`);
      const content = await filesystem.read(filename, 'utf8');
      const comments = parseComments(content, { filename });
      const output = (Object.values(comments))
        .filter((comment: any) => comment.info.apidoc)
        .map((comment: any) => comment.content)
        .join('\n\n')
        .replace(/\n{3,}/g, '\n\n');
      const outname = SOURCE_EXT.reduce((acc, ext) => {
        return acc.replace(`.${ext}`, `.${TARGET_EXT}`);
      }, basename(filename));
      const outpath = join(TARGET, outname);
      print.info(`Writing ${outpath}`);
      DRY || await filesystem.write(outpath, output);
    });
  }
};

module.exports = command;


