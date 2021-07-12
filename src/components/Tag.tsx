import React, { FC } from 'react';
import { css } from '@emotion/react';
import { Link } from 'gatsby';

type Props = {
  tagName: string;
  articleNumber: number;
};

/* eslint-disable @typescript-eslint/no-use-before-define */
export const Tag: FC<Props> = ({ tagName, articleNumber }) => (
  <div css={tagWrapper}>
    <Link css={linkCss} to={`/tags/${tagName}`}>
      # {tagName} ( {articleNumber} )
    </Link>
  </div>
);
/* eslint-enable @typescript-eslint/no-use-before-define */

const tagWrapper = css`
  display: inline-block;
  width: auto;
  padding: 3px 10px;
  border: 1px solid black;
  border-radius: 3px;
  margin: 5px 10px;
`;

const linkCss = css`
  color: black;
  text-decoration: none;
  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
  }
`;
