import { resolve } from 'path';
import type { GatsbyNode } from 'gatsby';

type PageQueryType = {
  allMarkdownRemark: {
    nodes: {
      id: string;
      fields: {
        slug: string;
      };
      frontmatter: {
        tags: string[];
      };
    }[];
  };
};

export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions, reporter }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { createPage } = actions;
  const blogPost = resolve('./src/templates/blog-post.tsx');
  const result = await graphql<PageQueryType>(
    `
      {
        allMarkdownRemark {
          nodes {
            id
            fields {
              slug
            }
            frontmatter {
              tags
            }
          }
        }
      }
    `,
  );
  if (result.errors) {
    reporter.panicOnBuild(`There was an error loading your blog posts`, result.errors);

    return;
  }

  const posts = result.data?.allMarkdownRemark.nodes;

  if (posts !== undefined && posts.length > 0) {
    posts.forEach((post) => {
      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
        },
      });
    });

    const allTags = new Array<string>();
    posts.forEach((post) => {
      allTags.push(...post.frontmatter.tags);
    });
    const uniqTags = Array.from(new Set(allTags));
    uniqTags.forEach((tag) => {
      createPage({
        path: `/tags/${tag}`,
        component: resolve(`./src/templates/tagsTemplate.tsx`),
        context: {
          tag,
        },
      });
    });

    const allSlugs = new Array<string>();
    posts.forEach((post) => {
      allSlugs.push(post.fields.slug.substr(0, 7));
    });
    const uniqSlugs = Array.from(new Set(allSlugs));
    uniqSlugs.forEach((slug) => {
      const regexSlug = `/^${slug}/`;
      createPage({
        path: `/history/${slug.replace('/', '')}`,
        component: resolve(`./src/templates/historyTemplate.tsx`),
        context: {
          regexSlug,
        },
      });
    });
  }
};
