import BaseLayout from '@layouts/BaseLayout';
import MediaPage from '@pages/MediaPage';
import SystemDashboardPage from '@pages/SystemDashboardPage';
import { Route, Routes } from 'react-router-dom';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route index element={<SystemDashboardPage />} />
        <Route path='media' element={<MediaPage />} />
      </Route>
    </Routes>
  );
}
