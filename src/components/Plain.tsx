import React, { FC } from 'react';
import { css } from '@emotion/react';

type PropsType = {
  code: string;
};

export const Plain: FC<PropsType> = ({ code }) => {
  const areaCss = css`
    padding: 5px;
    border: 1px solid black;
    width: auto;
    max-width: 520px;
    border-radius: 3px;
  `;
  const textCss = css`
    font-size: 14px;
    font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
  `;

  const lines = code.split('\n');

  return (
    /* eslint-disable @typescript-eslint/no-use-before-define */
    <div css={areaCss}>
      {lines.map((line, key) => (
        // eslint-disable-next-line react/no-array-index-key
        <pre css={textCss} key={key}>
          {line}
        </pre>
      ))}
    </div>
    /* eslint-enable @typescript-eslint/no-use-before-define */
  );
};
