import React, { FC } from 'react';
import rangeParse from 'parse-numeric-range';
import parseArgs from 'minimist';
import { Node } from '../types/rehypeNodeType';
import { Highlighter } from './Highlighter';
import { Chart } from './Chart';
import { Plain } from './Plain';
import { Notice } from './Notice';
import { Graph } from './Graph';

const langArray = [
  'markup',
  'bash',
  'clike',
  'c',
  'cpp',
  'css',
  'javascript',
  'jsx',
  'coffeescript',
  'actionscript',
  'css-extr',
  'diff',
  'git',
  'go',
  'graphql',
  'handlebars',
  'json',
  'less',
  'makefile',
  'markdown',
  'objectivec',
  'ocaml',
  'python',
  'reason',
  'sass',
  'scss',
  'sql',
  'stylus',
  'tsx',
  'typescript',
  'wasm',
  'yaml',
];

const parseOption = {
  string: ['title', 'start', 'number', 'height', 'width', 'background', 'color', 'font'],
  boolean: ['line'],
  alias: {
    t: 'title',
    l: 'line',
    s: 'start',
    n: 'number',
    h: 'height',
    w: 'width',
    b: 'background',
    c: 'color',
    f: 'font',
  },
  default: {
    title: '',
    line: false,
    start: '1',
    number: '',
    height: '200px',
    width: '300px',
    background: 'white',
    color: 'red',
    font: '14px',
  },
};

const getSingle = <T,>(arg: T | T[]): T => (Array.isArray(arg) ? arg[0] : arg);

// eslint-disable-next-line react/no-unused-prop-types,react/require-default-props
type PropsType = React.HTMLProps<HTMLElement> & { node?: Node } & { children?: JSX.Element[] };

/* eslint-disable react/destructuring-assignment */
export const CodeBlock: FC<PropsType> = (props: PropsType) => {
  if (!props) {
    return null;
  }
  if (!props.children) {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const context = props.children[0].props.children[0] as string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  const { className }: { className: string } = props.children[0].props;
  const lang = className.replace('language-', '');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const paramString = props.children[0].props['data-meta'] ? (props.children[0].props['data-meta'] as string) : '';
  const paramArray = paramString.split(/\s/);

  const argv = parseArgs(paramArray, parseOption);
  const title = getSingle<string>(argv.title);
  const showNumber = getSingle<boolean>(argv.line);
  const start = parseInt(getSingle<string>(argv.start), 10);
  const number = rangeParse(getSingle<string>(argv.number));
  const height = getSingle<string>(argv.height);
  const width = getSingle<string>(argv.width);
  const background = getSingle<string>(argv.background);
  const color = getSingle<string>(argv.color);
  const font = getSingle<string>(argv.font);

  if (langArray.includes(lang)) {
    return (
      <div>
        {context ? (
          <Highlighter
            code={context.trim()}
            title={title}
            lang={lang}
            showNumber={showNumber}
            highlight={number}
            height={height}
            start={start}
          />
        ) : null}
      </div>
    );
  }
  if (lang === 'chart') {
    return (
      <div>
        <Chart code={context} height={height} width={width} />
      </div>
    );
  }
  if (lang === 'notice') {
    return (
      <div>
        <Notice code={context} background={background} color={color} font={font} />
      </div>
    );
  }
  if (lang === 'graph') {
    return (
      <div>
        <Graph code={context} height={height} width={width} />
      </div>
    );
  }

  return (
    <div>
      <Plain code={context} />
    </div>
  );
};

/* eslint-enable react/destructuring-assignment */
