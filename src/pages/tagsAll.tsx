import React, { FC } from 'react';
import { PageProps } from 'gatsby';
import { article } from '../styles/baseWrapper';
import { TagList } from '../components/TagList';
import { Layout } from '../components/Layout';

const IndexPage: FC<PageProps> = () => (
  <Layout headerSidebar>
    <div css={article}>
      <TagList />
    </div>
  </Layout>
);

export default IndexPage;
