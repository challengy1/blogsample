import type { Actions } from 'gatsby';

export const createSchemaCustomization: ({ actions }: { actions: Actions }) => void = ({
  actions,
}: {
  actions: Actions;
}): void => {
  const { createTypes } = actions; // eslint-disable-line @typescript-eslint/unbound-method

  createTypes(`
    type SiteSiteMetadata {
      author: Author
      description: String
      siteUrl: String
      social: Social
      title: String
    }
    type Author {
      name: String
      summary: String
    }
    type Social {
      twitter: String
    }
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }
    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      update: Date @dateformat
      tags: [String!]!
      table: Boolean
    }
    type Fields {
      slug: String
    }
  `);
};
