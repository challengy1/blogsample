import React, { FC } from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import { css } from '@emotion/react';

type QueryType = {
  allMarkdownRemark: {
    nodes: {
      fields: {
        slug: string;
      };
    }[];
  };
};

const useHistoryData = (): QueryType =>
  useStaticQuery<QueryType>(
    graphql`
      query {
        allMarkdownRemark {
          nodes {
            fields {
              slug
            }
          }
        }
      }
    `,
  );

export const History: FC = () => {
  const startYear = 2021;
  const startMonth = 6;

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;

  const arrayYear = new Array(todayYear - startYear + 1);
  const years = [...arrayYear.keys()].map((d) => 2021 - d);
  const arrayMonth = new Array(12);
  const months = [...arrayMonth.keys()].map((d) => 12 - d);

  const YearMonthElement = (year: number, month: number) => (year - startYear - 1) * 12 + month + (12 - startMonth);

  const YearElement = (year: number) => year - startYear;

  const isInRange = (year: number, month: number): boolean => {
    const startNumber = startYear * 100 + startMonth;
    const todayNumber = todayYear * 100 + todayMonth;
    const target = year * 100 + month;

    return startNumber <= target && target <= todayNumber;
  };

  const yearData = new Array<number>(todayYear - startYear + 1);
  yearData.fill(0);

  const yearMonthData = new Array<number>((todayYear - startYear - 1) * 12 + todayMonth + (12 - startMonth) + 1);
  yearMonthData.fill(0);

  const { nodes } = useHistoryData().allMarkdownRemark;
  const yearMonthArray = nodes.map((node) => node.fields.slug.substr(1, 7));

  yearMonthArray.forEach((item) => {
    const year = parseInt(item.substr(0, 4), 10);
    const month = parseInt(item.substr(4, 2), 10);
    yearData[YearElement(year)] += 1;
    yearMonthData[YearMonthElement(year, month)] += 1;
  });

  const yearMonthString = (year: number, month: number): string => String(year) + `00${month}`.slice(-2);

  return (
    /* eslint-disable @typescript-eslint/no-use-before-define */
    <div>
      <p css={titleCss}>投稿履歴</p>
      {years.map((year) => (
        <details key={year}>
          <summary css={summaryCss}>
            {year}年({yearData[YearElement(year)]})
          </summary>
          <ul css={ulCss}>
            {months.map((month) => {
              const monthString = `  ${String(month)}`.substr(-3);

              return (
                isInRange(year, month) && (
                  <li css={liCss} key={month}>
                    {yearMonthData[YearMonthElement(year, month)] ? (
                      <Link css={linkCss} to={`/history/${yearMonthString(year, month)}`}>
                        {monthString}月 ({yearMonthData[YearMonthElement(year, month)]})
                      </Link>
                    ) : (
                      <span>
                        {monthString}月 ({yearMonthData[YearMonthElement(year, month)]})
                      </span>
                    )}
                  </li>
                )
              );
            })}
          </ul>
        </details>
      ))}
    </div>
    /* eslint-enable @typescript-eslint/no-use-before-define */
  );
};

const titleCss = css`
  margin-top: 20px;
  text-align: center;
`;

const linkCss = css`
  text-decoration: none;
  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
  }
`;

const summaryCss = css`
  margin-left: 10px;
  line-height: 1.5;
`;

const ulCss = css`
  margin-left: 0;
  padding-left: 0.3em;
  line-height: 1.5;
`;

const liCss = css`
  list-style: none;
  line-height: 1.5;
  width: 100px;
  text-align: right;
`;
