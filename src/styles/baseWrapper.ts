import { css } from '@emotion/react';

export const wrapper = css`
  margin-left: 0;
  min-height: 400px;
  width: 100% - 20px;
  min-width: 520px;
  @media (min-width: 960px) {
    width: 100% - 30px;
  }
`;
export const navigator = css`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  background-color: rgba(95, 158, 160, 0.9);
  margin-bottom: 50px;
  z-index: 90;
`;
export const header = css`
  width: auto;
  height: 300px;
  background-color: darkseagreen;
`;
export const headerSpace = css`
  min-height: 50px;
`;
export const main = css`
  margin-left: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  height: auto;
  width: auto;
`;
export const article = css`
  order: 1;
  width: 100%;
  min-width: 520px;
  padding: 30px;
  margin: 0 30px 0 0;
  background-color: white;
`;
export const sidebar = css`
  order: 2;
  width: 300px;
  height: calc(100vh - 200px);
  top: 50px;
  overflow-y: scroll;
  position: sticky;
  padding: 5px;
  background-color: yellow;
`;
export const footer = css`
  width: auto;
  height: 50px;
  background-color: blue;
  color: white;
`;
