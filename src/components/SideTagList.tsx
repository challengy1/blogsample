import React, { FC } from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import { css } from '@emotion/react';

type allTagsQuery = {
  allMarkdownRemark: {
    tags: {
      tag: string;
      count: number;
    }[];
  };
};

export const SideTagList: FC = () => {
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
    if (a.count > b.count) return -1;
    if (a.count < b.count) return 1;

    return 0;
  });

  return (
    /* eslint-disable @typescript-eslint/no-use-before-define */
    <div>
      <p css={titleCss}>タグ抜粋</p>
      <ul css={ulCss}>
        {allTags.slice(0, 10).map((item, key) => (
          // eslint-disable-next-line react/no-array-index-key
          <li css={liCss} key={key}>
            <Link to={`/tags/${item.tag}/`}>
              {item.tag} ({item.count})
            </Link>
          </li>
        ))}
      </ul>
      <div css={aCss}>
        <a href="/tagsAll/">...more</a>
      </div>
    </div>
    /* eslint-enable @typescript-eslint/no-use-before-define */
  );
};

const titleCss = css`
  margin-top: 20px;
  text-align: center;
`;

const ulCss = css`
  margin-left: 0;
  padding-left: 0.3em;
  line-height: 1.5;
`;

const liCss = css`
  list-style: none;
  line-height: 1.5;
  width: 100%;
  text-align: left;
`;

const aCss = css`
  margin-top: 5px;
`;
