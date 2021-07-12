import React, { FC } from 'react';
import { graphql, PageProps } from 'gatsby';
import { article } from '../styles/baseWrapper';
import { articleType } from '../types/PostType';
import { ArticleList } from '../components/ArticleList';
import { Layout } from '../components/Layout';

const TagsTemplate: FC<PageProps<articleType>> = ({ data, location }) => {
  const { nodes } = data.allMarkdownRemark;
  const pageName = location.pathname;

  return (
    <Layout headerSidebar>
      <div css={article}>
        <ArticleList nodes={nodes} pageName={pageName} />
      </div>
    </Layout>
  );
};

export default TagsTemplate;

export const pageQuery = graphql`
  query ($tag: String) {
    allMarkdownRemark(
      sort: { order: DESC, fields: frontmatter___date }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      nodes {
        id
        fields {
          slug
        }
        frontmatter {
          title
          description
          date(formatString: "YYYY-MM-DD")
          update(formatString: "YYYY-MM-DD")
          table
          tags
          hero {
            childImageSharp {
              gatsbyImageData(width: 150)
            }
          }
        }
      }
    }
    file(relativePath: { eq: "me.png" }) {
      childImageSharp {
        gatsbyImageData(width: 250)
      }
      id
    }
  }
`;
