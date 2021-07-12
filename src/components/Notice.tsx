import React, { FC } from 'react';
import { css } from '@emotion/react';

type PropsType = {
  code: string;
  background?: string;
  color?: string;
  font?: string;
};

export const Notice: FC<PropsType> = ({ code, background, color, font }) => {
  const areaCss = css`
    display: inline-block;
    background-color: ${background};
    color: ${color};
    padding: 5px;
    border: 1px solid black;
    width: auto;
    max-width: 520px;
    border-radius: 3px;
  `;
  const textCss = css`
    font-size: ${font};
    font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
    line-height: 1.4;
  `;

  const lines = code.split('\n');

  return (
    /* eslint-disable @typescript-eslint/no-use-before-define */
    <div css={areaCss}>
      {lines.map((line, key) => (
        // eslint-disable-next-line react/no-array-index-key
        <p css={textCss} key={key}>
          {line}
        </p>
      ))}
    </div>
    /* eslint-enable @typescript-eslint/no-use-before-define */
  );
};
