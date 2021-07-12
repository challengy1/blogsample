import React, { FC } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { css } from '@emotion/react';
import { Tag } from './Tag';

type allTagsQuery = {
  allMarkdownRemark: {
    tags: {
      tag: string;
      count: number;
    }[];
  };
};

export const TagList: FC = () => {
  const tags = useStaticQuery<allTagsQuery>(graphql`
    query {
      allMarkdownRemark {
        tags: group(field: frontmatter___tags) {
          tag: fieldValue
          count: totalCount
        }
      }
    }
  `);
  const allTags = tags.allMarkdownRemark.tags;
  allTags.sort((a, b) => {
    if (a.tag < b.tag) return -1;
    if (a.tag > b.tag) return 1;

    return 0;
  });

  return (
    /* eslint-disable @typescript-eslint/no-use-before-define */
    <div>
      <h1 css={titleCss}>タグ一覧</h1>
      <div css={tagListCss}>
        {allTags.map((item, key) => (
          // eslint-disable-next-line react/no-array-index-key
          <Tag key={key} tagName={item.tag} articleNumber={item.count} />
        ))}
      </div>
    </div>
    /* eslint-enable @typescript-eslint/no-use-before-define */
  );
};

const tagListCss = css`
  display: flex;
  flex-wrap: wrap;
`;

const titleCss = css`
  text-align: center;
`;
