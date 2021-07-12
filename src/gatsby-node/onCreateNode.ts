import { createFilePath } from 'gatsby-source-filesystem';
import type { GatsbyNode } from 'gatsby';

export const onCreateNode: GatsbyNode['onCreateNode'] = ({ node, actions, getNode }) => {
  const { createNodeField } = actions; // eslint-disable-line @typescript-eslint/unbound-method

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
