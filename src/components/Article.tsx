import React, { FC } from 'react';
import { css } from '@emotion/react';
import { GatsbyImage } from 'gatsby-plugin-image';
import { Link } from 'gatsby';
import { nodeType } from '../types/PostType';

export const Article: FC<nodeType> = (props) => {
  const { frontmatter, fields } = props;
  const { slug } = fields;
  const { title, date, update, tags, description, hero } = frontmatter;
  const image = hero.childImageSharp.gatsbyImageData;
  const jumpTo = `${slug}`;

  return (
    /* eslint-disable @typescript-eslint/no-use-before-define */
    <Link to={jumpTo} css={[articleWrapper, linkCss]}>
      <GatsbyImage css={imageCss} alt={title} image={image} />
      <div css={textBoxCss}>
        <div>
          <p css={titleBoxCss}>{title}</p>
          <p css={dateCss}>作成：{date} </p>
          <p css={dateCss}>更新：{update}</p>
        </div>
        {tags.map((tag, key) => (
          // eslint-disable-next-line react/no-array-index-key
          <p key={key} css={tagCss}>
            # {tag}
          </p>
        ))}
        <p css={descriptionCss}>{description}</p>
      </div>
    </Link>
    /* eslint-enable @typescript-eslint/no-use-before-define */
  );
};

const articleWrapper = css`
  text-decoration: none;
  width: 100%;
  display: flex;
  border: 1px solid black;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const imageCss = css`
  min-width: 150px;
  margin: 5px;
  border-radius: 7px;
`;

const textBoxCss = css`
  margin: 5px;
  height: 150px;
  width: 100%;
  border: 1px solid gray;
  border-radius: 7px;
`;

const titleBoxCss = css`
  display: inline-block;
  margin: 0 15px 0 5px;
  font-weight: 800;
`;

const dateCss = css`
  display: inline-block;
  padding-left: 10px;
`;

const tagCss = css`
  display: inline-block;
  margin: 0 5px;
  line-height: 1.3;
  border: 1px solid black;
  border-radius: 2px;
  padding: 2px;
`;

const descriptionCss = css`
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 1.3;
  height: 5.2em;
  margin-left: 5px;
`;

const linkCss = css`
  color: black;
  text-decoration: none;
  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
  }
`;
