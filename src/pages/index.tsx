import React, { FC } from 'react';
import { graphql, PageProps } from 'gatsby';
import { ArticleList } from '../components/ArticleList';

import { articleType } from '../types/PostType';
import { article } from '../styles/baseWrapper';
import { Layout } from '../components/Layout';

const IndexPage: FC<PageProps<articleType>> = ({ data, location }) => {
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

export default IndexPage;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { order: DESC, fields: frontmatter___date }, limit: 5) {
      nodes {
        id
        fields {
          slug
        }
        frontmatter {
          title
          description
          date
          update
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
    }
  }
`;
