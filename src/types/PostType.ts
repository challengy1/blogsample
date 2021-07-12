import { IGatsbyImageData } from 'gatsby-plugin-image';

export type nodeType = {
  id: string;
  fields: {
    slug: string;
  };
  frontmatter: {
    title: string;
    description: string;
    date: string;
    update: string;
    table: boolean;
    tags: string[];
    hero: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData;
      };
    };
  };
};

export type articleType = {
  allMarkdownRemark: {
    nodes: nodeType[];
  };
  file: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData;
    };
  };
};
