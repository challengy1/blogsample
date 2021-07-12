import React, { FC } from 'react';
import { graphql, PageProps } from 'gatsby';
import unified from 'unified';
import rehypeReact from 'rehype-react';
import rehypeParse from 'rehype-parse';
import { useBreakpoint } from 'gatsby-plugin-breakpoints';
import { GatsbyImage, getImage, getSrc, IGatsbyImageData } from 'gatsby-plugin-image';
import { css } from '@emotion/react';
import { CodeBlock } from '../components/CodeBlock';
import { TableList } from '../components/TableList';
import { Sidebar } from '../components/Sidebar';
import { header, headerSpace, main, article, sidebar } from '../styles/baseWrapper';
import { Layout } from '../components/Layout';

type ToC = {
  id: string;
  depth: number;
  value: string;
};

type pageQueryType = {
  markdownRemark: {
    id: string;
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
    fields: {
      slug: string;
    };
    headings: ToC[];
    html: string;
  };
  seoImage: {
    frontmatter: {
      hero: {
        childImageSharp: {
          gatsbyImageData: IGatsbyImageData;
        };
      };
    };
  };
};

const BlogPostTemplate: FC<PageProps<pageQueryType>> = ({ data }) => {
  const { title, description, date, update, tags, hero } = data.markdownRemark.frontmatter;
  const { slug } = data.markdownRemark.fields;
  const post = data.markdownRemark;
  const { html, headings } = post;

  const processor = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeReact, {
      createElement: React.createElement,
      components: {
        // eslint-disable-next-line react/jsx-props-no-spreading
        pre: (props: rehypeReact.ComponentProps) => <CodeBlock {...props} />,
      },
    });

  const image = getImage(hero.childImageSharp.gatsbyImageData);
  const { table } = data.markdownRemark.frontmatter;
  const breakpoints = useBreakpoint();

  const imageSeo = getSrc(data.seoImage.frontmatter.hero.childImageSharp.gatsbyImageData);

  return (
    /* eslint-disable @typescript-eslint/no-use-before-define */
    <Layout headerSidebar={false} image={imageSeo} title={title} description={description} url={slug}>
      <div>
        <div className="topPage" css={header}>
          <div css={headerSpace} />
          <div css={headerContainer}>
            {image !== undefined ? (
              <GatsbyImage css={imageCss} image={image} alt="blog inspiration" />
            ) : (
              <p>NO IMAGE</p>
            )}
            <div css={headerDetail}>
              <h1 css={headerTitle}>{title}</h1>
              <p css={datesCss}>
                初回発行: {date} 更新日: {update}
              </p>
              <div css={tagsCss}>
                {tags.map((tag) => (
                  <p css={tagCss} key={tag}>
                    # {tag}
                  </p>
                ))}
              </div>
              <p css={descriptionCss}>{description}</p>
            </div>
          </div>
        </div>
        <div css={main}>
          <div css={article}>{processor.processSync(html).contents}</div>
          {breakpoints.pc ? (
            <div css={sidebar}>
              {table ? (
                <TableList items={headings} />
              ) : (
                <div>
                  <Sidebar />
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
  /* eslint-enable @typescript-eslint/no-use-before-define */
};

export default BlogPostTemplate;

const headerContainer = css`
  display: flex;
`;

const imageCss = css`
  min-width: 250px;
  height: 250px;
  order: 0;
`;

const headerDetail = css`
  width: 100%;
  order: 1;
`;

const headerTitle = css`
  text-align: center;
  margin: 5px auto;
`;

const datesCss = css`
  text-align: center;
`;

const tagsCss = css`
  text-align: left;
  margin-left: 10px;
  margin-bottom: 10px;
`;

const tagCss = css`
  display: inline-block;
  line-height: 1.3;
  border: 1px solid black;
  border-radius: 2px;
  padding: 2px;
  margin: 2px 2px 2px 10px;
`;

const descriptionCss = css`
  margin: 0 10px;
`;

export const pageQuery = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      frontmatter {
        title
        description
        date(formatString: "YYYY-MM-DD")
        update(formatString: "YYYY-MM-DD")
        table
        tags
        hero {
          childImageSharp {
            gatsbyImageData(width: 250)
          }
        }
      }
      fields {
        slug
      }
      headings {
        id
        depth
        value
      }
      html
    }
    seoImage: markdownRemark(id: { eq: $id }) {
      frontmatter {
        hero {
          childImageSharp {
            gatsbyImageData(width: 600)
          }
        }
      }
    }
  }
`;
