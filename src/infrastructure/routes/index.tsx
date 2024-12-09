import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('../../pages/Home'));
const ProtocolDetail = lazy(() => import('../../pages/ProtocolDetail'));
const CreateProtocol = lazy(() => import('../../pages/CreateProtocol'));
const ExploreProtocols = lazy(() => import('../../pages/ExploreProtocols'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/protocol/:id',
    element: <ProtocolDetail />
  },
  {
    path: '/create',
    element: <CreateProtocol />
  },
  {
    path: '/explore',
    element: <ExploreProtocols />
  }
]; 