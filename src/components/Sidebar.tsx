import React, { FC } from 'react';
import { History } from './History';
import { SideTagList } from './SideTagList';
import { ToAbout } from './ToAbout';

export const Sidebar: FC = () => (
  <div>
    <ToAbout />
    <History />
    <SideTagList />
  </div>
);
