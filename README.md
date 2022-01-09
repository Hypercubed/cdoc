# cDoc

cDoc is a super simple documentation tool.  cDoc extracts comments from source code and creates an identical directory tree in the target directory that contains the extracted comments.

## Installation

```bash
npm install -g @hypercubed/cdoc
```

## Comment formatting rules

Currently cDoc extracts multi-line comments.  It does not extract single-line comments.  By deafult, cDoc will not comments for js and js-ish files (ts, jsx, etc).  Other languages are supported by including additional fire extensions (see CLI below).  Language-specific comment syntax [can be found here](https://github.com/nknapp/comment-patterns/blob/master/docs/languages.md).

## CLI

``` 
  Usage:
    cdoc [source] [target] - extract comments from source files

  Options:
    --ext [ext]   - specify the source file extensions (comma separated, default: ts,js,tsx,jsx,mjs)
    --out [ext]   - specify the output file extension (default: md)
    --dry         - dry run
    --silent      - silent mode
```

## License

This project is licensed under the MIT License - see the LICENSE file for details

