import { graphql, useStaticQuery } from 'gatsby';

export type pageQueryType = {
  site: {
    siteMetadata: {
      author: {
        name: string;
        summary: string;
      };
      description: string;
      siteUrl: string;
      social: {
        twitter: string;
      };
      title: string;
    };
  };
};

export const useSiteMetadata = (): pageQueryType =>
  useStaticQuery<pageQueryType>(
    graphql`
      query {
        site {
          siteMetadata {
            author {
              name
              summary
            }
            description
            siteUrl
            social {
              twitter
            }
            title
          }
        }
      }
    `,
  );
