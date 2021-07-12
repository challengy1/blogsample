import React, { ReactElement, FC } from 'react';
import { useBreakpoint } from 'gatsby-plugin-breakpoints';
import { header, main, sidebar, wrapper } from '../styles/baseWrapper';
import { Seo } from './Seo';
import { Navigator } from './Navigator';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

type Props = {
  headerSidebar: boolean;
  children: ReactElement;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

export const Layout: FC<Props> = ({ headerSidebar, children, title, description, image, url }) => {
  const breakpoints = useBreakpoint();

  if (headerSidebar) {
    return (
      <div css={wrapper}>
        <Seo title={title} description={description} />
        <Navigator />
        <div className="topPage" css={header}>
          <Header />
        </div>
        <div css={main}>
          {children}
          {breakpoints.pc ? (
            <div css={sidebar}>
              <Sidebar />
            </div>
          ) : null}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div css={wrapper}>
      <Seo title={title} description={description} image={image} url={url} />
      <Navigator />
      <div>{children}</div>
      <Footer />
    </div>
  );
};
