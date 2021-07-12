import React, { FC } from 'react';
import { PageProps } from 'gatsby';

import { Layout } from '../components/Layout';
import { article } from '../styles/baseWrapper';

const NotFoundPage: FC<PageProps> = () => (
  <Layout headerSidebar>
    <div css={article}>
      <h1>404: Not Found</h1>
      <p>You just hit a route that does not exist... the sadness.</p>
    </div>
  </Layout>
);

export default NotFoundPage;
