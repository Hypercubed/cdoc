import { print } from 'gluegun/print';
import { filesystem } from 'gluegun/filesystem';

import * as parseComments from 'multilang-extract-comments';

import { join, relative } from 'path';

const DEFAULT_EXTS = ['ts', 'js', 'tsx', 'jsx', 'mjs'];

interface Options {
  source: string;
  target: string;
  dry?: boolean;
  ext?: string[];
  out?: string;
  silent?: boolean;
}

export async function process(options: Options) {
  const SOURCE = options.source;
  const TARGET = options.target;

  if (!SOURCE) {
    throw new Error('Missing source directory');
  }

  if (!TARGET) {
    throw new Error('Missing target directory');
  }

  const DRY = options.dry || false;
  const SOURCE_EXT = options.ext || DEFAULT_EXTS;
  const TARGET_EXT = options.out || 'md';
  const SILENT = options.silent ?? true;

  const matching =
    SOURCE_EXT.length > 1
      ? `*.{${SOURCE_EXT.join(',')}}`
      : `*.${SOURCE_EXT[0]}`;

  const files: string[] = filesystem.find(SOURCE, { matching });

  files.forEach(async (filename: string) => {
    SILENT || print.info(`Processing ${filename}`);
    const content = await filesystem.readAsync(filename, 'utf8');
    const comments = parseComments(content, { filename });
    const output = Object.values(comments)
      .filter((comment: any) => comment.info.type === 'multiline')
      .map((comment: any) => comment.content)
      .join('\n\n')
      .replace(/\n{3,}/g, '\n\n');
    const outname = SOURCE_EXT.reduce((acc, ext) => {
      return acc.replace(`.${ext}`, `.${TARGET_EXT}`);
    }, relative(SOURCE, filename));
    const outpath = join(TARGET, outname);
    SILENT || print.info(`Writing to ${outpath}`);
    DRY || (await filesystem.writeAsync(outpath, output));
  });
}
