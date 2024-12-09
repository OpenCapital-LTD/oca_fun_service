
import React, { lazy } from 'react';
import MainLayout from '../layout/mainlayout'
import DashboardDefault from '../pages/dashboard';
import Page from '../pages/page';

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },{
      path: '/page/',
      element: <DashboardDefault />
    },
    {
      path: '*',
      element: <DashboardDefault />
    }

  ]
}

export default MainRoutes