import React, { FC } from 'react';
import { css } from '@emotion/react';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/nightOwl';

type PropsType = {
  code: string;
  lang?: string;
  title?: string;
  start?: number;
  highlight?: number[];
  height?: string;
  showNumber?: boolean;
};

const LineNumber: FC<{ lineNumber: number }> = ({ lineNumber }) => {
  const stringNum = `${`   ${String(lineNumber)}`.slice(-3)}  `;

  return (
    <span>
      <span>{stringNum}</span>
      {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
      <span css={borderCss} />
    </span>
  );
};

export const Highlighter: FC<PropsType> = ({
  code,
  lang,
  title = '',
  start = 1,
  highlight = [],
  height = '',
  showNumber = false,
}) => {
  const showTitle = title !== '';
  const lines = highlight;
  const codeAreaCss = showTitle
    ? css`
        height: ${height};
      `
    : css`
        overflow-x: hidden;
        overflow-y: hidden;
        border-radius: 5px;
      `;

  return (
    /* eslint-disable @typescript-eslint/no-use-before-define */
    /* eslint-disable react/no-array-index-key */
    /* eslint-disable react/jsx-props-no-spreading */
    <div>
      {title ? <div css={titleStyle}>{title}</div> : null}
      <div css={[codeStyle, codeAreaCss]}>
        <Highlight {...defaultProps} code={code} language={lang as Language} theme={theme}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={className}
              style={{
                ...style,
                backgroundColor: 'rgb(1, 22, 39)',
                width: '930px',
                padding: '10px',
                marginBottom: 0,
                fontFamily: 'Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace',
              }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {lines.includes(i + start) ? (
                    <div css={highlightStyle}>
                      {showNumber ? <LineNumber lineNumber={i + start} /> : null}
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  ) : (
                    <div css={notHighlightStyle}>
                      {showNumber ? <LineNumber lineNumber={i + start} /> : null}
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
    /* eslint-disable react/jsx-props-no-spreading */
    /* eslint-enable react/no-array-index-key */
    /* eslint-enable @typescript-eslint/no-use-before-define */
  );
};

const codeStyle = css`
  width: 95%;
  max-width: 750px;
  overflow-x: scroll;
  height: auto;
  overflow-y: scroll;
  font-size: 14px;
  margin-bottom: 20px;
`;

const titleStyle = css`
  width: 95%;
  max-width: 750px;
  font-size: 16px;
  background-color: rgb(1, 22, 39);
  color: white;
  padding: 10px 10px 10px 50px;
  font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const highlightStyle = css`
  background-color: rgb(50, 72, 70);
  line-height: 100%;
  padding: 3px 0;
`;

const notHighlightStyle = css`
  background-color: rgb(1, 22, 39);
  line-height: 100%;
  padding: 3px 0;
`;

const borderCss = css`
  font-size: 22px;
  border-right: solid 1px white;
  margin-right: 20px;
`;
