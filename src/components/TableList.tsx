import React, { FC, useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { css } from '@emotion/react';

type ToC = {
  id: string;
  depth: number;
  value: string;
};

type Props = {
  items: ToC[];
};

const useActiveId = (itemIds: string[]) => {
  const [activeId, setActiveId] = useState(`test`);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -70% 0%` },
    );
    itemIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [itemIds]);

  return activeId;
};

const acc: string[] = [];
const getIds = (items: ToC[]): string[] => {
  items.forEach((item) => {
    if (item.id) {
      acc.push(item.id);
    }
  });

  return acc;
};

export const TableList: FC<Props> = (props) => {
  const { items } = props;
  const idList = getIds(items);
  const activeId = useActiveId(idList);

  return (
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    <ul css={ulCss}>
      {items.map((item: ToC) => (
        <li
          css={css`
            margin: 2px 0;
            list-style: none;
            padding-left: calc(10px * (${item.depth} - 1));
          `}
          key={item.id}
        >
          <Link
            to={item.id}
            smooth
            offset={-50}
            duration={800}
            style={{
              color: activeId === item.id ? 'rgb(30,30,30)' : 'rgb(100,100,100)',
              fontWeight: activeId === item.id ? 'bolder' : 'lighter',
              cursor: 'pointer',
            }}
          >
            {item.value}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const ulCss = css`
  font-family: Hiragino Maru Gothic ProN W4, sans-serif;
  margin-bottom: 10px;
  margin-left: 5px;
`;
