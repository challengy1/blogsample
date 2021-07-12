import React, { FC } from 'react';
import { css } from '@emotion/react';
import { nodeType } from '../types/PostType';
import { Article } from './Article';

type Props = {
  pageName: string;
  nodes: nodeType[];
};

export const ArticleList: FC<Props> = (props) => {
  const { nodes, pageName } = props;
  const [, pageCategory, details] = pageName.split('/');
  let pageTitle: string;
  switch (pageCategory) {
    case 'history':
      pageTitle = `${details.substr(0, 4)}年${details.substr(4, 2)}月  記事一覧`;
      break;
    case 'tags':
      pageTitle = `タグ "${details}" 記事一覧`;
      break;
    default:
      pageTitle = '最近の記事...';
  }

  return (
    /* eslint-disable @typescript-eslint/no-use-before-define */
    <div>
      <h1 css={titleCss}>{pageTitle}</h1>
      {nodes &&
        nodes.map((node, key) => (
          // eslint-disable-next-line react/no-array-index-key
          <Article key={key} id={node.id} frontmatter={node.frontmatter} fields={node.fields} />
        ))}
    </div>
    /* eslint-enable @typescript-eslint/no-use-before-define */
  );
};

const titleCss = css`
  text-align: center;
  font-size: 2rem;
`;
