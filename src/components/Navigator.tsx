import React, { FC } from 'react';
import { Link } from 'gatsby';
import { css } from '@emotion/react';
import { useBreakpoint } from 'gatsby-plugin-breakpoints';
import { useSiteMetadata, pageQueryType } from './useSiteMetadata';
import { navigator } from '../styles/baseWrapper';
import { Menu } from './Menu';

export const Navigator: FC = () => {
  const breakpoints = useBreakpoint();
  const data: pageQueryType = useSiteMetadata();
  const { title } = data.site.siteMetadata;

  return (
    /* eslint-disable @typescript-eslint/no-use-before-define */
    <div css={navigator}>
      {!breakpoints.pc ? <Menu /> : null}
      <h1 css={h1Css}>
        <Link to="/" css={titleCss}>
          {title}
        </Link>
      </h1>
    </div>
    /* eslint-enable @typescript-eslint/no-use-before-define */
  );
};

const h1Css = css`
  margin-top: 14px;
`;

const titleCss = css`
  color: black;
  margin-left: 20px;
  text-decoration: none;
  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
  }
`;
