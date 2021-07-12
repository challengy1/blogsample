import React, { FC } from 'react';
import { bubble as Burger } from 'react-burger-menu';
import '../styles/burger.css';
import { SideTagList } from './SideTagList';
import { History } from './History';
import { ToAbout } from './ToAbout';

export const Menu: FC = () => (
  <Burger right>
    <ToAbout />
    <History />
    <SideTagList />
  </Burger>
);
