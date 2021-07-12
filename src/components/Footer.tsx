import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import { css } from '@emotion/react';
import { Link } from 'react-scroll';
import { footer } from '../styles/baseWrapper';
import { useSiteMetadata, pageQueryType } from './useSiteMetadata';

export const Footer: FC = () => {
  const data: pageQueryType = useSiteMetadata();
  const author = data.site.siteMetadata.author.name;
  const iconStyle: React.CSSProperties = { padding: 10, fontSize: 100 };

  return (
    /* eslint-disable @typescript-eslint/no-use-before-define */
    <div css={footer}>
      <h2 css={footerH2Css}>{author}</h2>
      <Link to="topPage" smooth duration={800}>
        {/* eslint-disable-next-line react/button-has-type */}
        <button css={gotoTopCss}>
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          <FontAwesomeIcon style={iconStyle} icon={faAngleDoubleUp} />
        </button>
      </Link>
    </div>
    /* eslint-enable @typescript-eslint/no-use-before-define */
  );
};

const footerH2Css = css`
  padding-top: 10px;
  padding-left: 20px;
`;

const gotoTopCss = css`
  position: fixed;
  bottom: 15px;
  right: 15px;
  color: darkgrey;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  border: none;
  &:hover {
    cursor: pointer;
    color: #0366d6;
  }
`;
