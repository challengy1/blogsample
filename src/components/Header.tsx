import React, { FC } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { css } from '@emotion/react';
import { headerSpace } from '../styles/baseWrapper';

type ImageType = {
  file: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData;
    };
  };
};

export const useImage = (): ImageType =>
  useStaticQuery<ImageType>(
    graphql`
      query {
        file(relativePath: { eq: "me.jpg" }) {
          childImageSharp {
            gatsbyImageData(width: 250)
          }
        }
      }
    `,
  );

export const Header: FC = () => {
  const { file } = useImage();
  const image = file.childImageSharp.gatsbyImageData;

  return (
    /* eslint-disable @typescript-eslint/no-use-before-define */
    <div>
      <div css={headerSpace} />
      <div css={headerWrapper}>
        <div css={headerImage}>
          <GatsbyImage image={image} alt="Hoptimist" />
        </div>
        <div css={headerTextWrapper}>
          <h1 css={headerText}>技術 BLOG にようこそ</h1>
          <h2 css={headerText}>沢山のハマった経験を含め</h2>
          <h2 css={headerText}>知見を共有いたします</h2>
        </div>
      </div>
    </div>
    /* eslint-enable @typescript-eslint/no-use-before-define */
  );
};

const headerWrapper = css`
  display: flex;
`;

const headerImage = css`
  order: 1;
`;

const headerTextWrapper = css`
  order: 2;
  display: inline-block;
  margin: 30px auto 0 auto;
`;

const headerText = css`
  text-align: center;
`;
