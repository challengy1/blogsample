/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React, { FC } from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import { IGatsbyImageData, getSrc } from 'gatsby-plugin-image';

type SeoQuery = {
  site: {
    siteMetadata: {
      title: string;
      description: string;
      social: {
        twitter: string;
      };
    };
  };
  file: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData;
    };
    id: string;
  };
};

type Props = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

export const Seo: FC<Props> = ({ title, description, image, url }) => {
  const { site, file } = useStaticQuery<SeoQuery>(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            social {
              twitter
            }
          }
        }
        file(relativePath: { eq: "me.png" }) {
          childImageSharp {
            gatsbyImageData(width: 600)
          }
          id
        }
      }
    `,
  );

  const metaTitle = title || site.siteMetadata.title;
  const metaDescription = description || site.siteMetadata.description;

  const imageNode = file.childImageSharp.gatsbyImageData;
  const imageDefault = getSrc(imageNode);
  const metaImage = image || imageDefault;

  const rootUrl = `https://challengy1.com`;
  const metaUrl = url ? rootUrl + url : rootUrl;

  return (
    <>
      <Helmet>
        <html lang="ja-jp" />
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="image" content={metaImage} />
        <meta property="og:url" content={metaUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content={site.siteMetadata?.social?.twitter || ``} />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={metaImage} />
      </Helmet>
    </>
  );
};
