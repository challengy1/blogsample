import React, { FC } from 'react';
import { css } from '@emotion/react';
import { Link } from 'gatsby';

/* eslint-disable @typescript-eslint/no-use-before-define */
export const ToAbout: FC = () => (
  <div css={tagWrapper}>
    <Link css={linkCss} to="/about">
      サイトのご紹介
    </Link>
  </div>
);
/* eslint-enable @typescript-eslint/no-use-before-define */

const tagWrapper = css`
  width: auto;
  padding: 3px 10px;
  border: 1px solid black;
  border-radius: 3px;
  text-align: center;
`;

const linkCss = css`
  font-weight: bolder;
  text-decoration: none;
  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
  }
`;
