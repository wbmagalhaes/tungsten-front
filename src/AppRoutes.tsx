import { Route, Routes } from 'react-router-dom';
import BaseLayout from '@layouts/BaseLayout';
import HomePage from '@pages/HomePage';
import MediaPage from '@pages/MediaPage';
import NotesPage from '@pages/NotesPage';
import TemplatesPage from '@pages/TemplatesPage';
import SandboxPage from '@pages/SandboxPage';
import ChatPage from '@pages/ChatPage';
import ImageGenPage from '@pages/ImageGenPage';
import BgJobsPage from '@pages/BgJobsPage';
import SystemHealthPage from '@pages/SystemHealthPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route index element={<HomePage />} />
        <Route path='system-health' element={<SystemHealthPage />} />
        <Route path='notes' element={<NotesPage />} />
        <Route path='media' element={<MediaPage />} />
        <Route path='templates' element={<TemplatesPage />} />
        <Route path='sandbox' element={<SandboxPage />} />
        <Route path='chat' element={<ChatPage />} />
        <Route path='img-gen' element={<ImageGenPage />} />
        <Route path='bg-jobs' element={<BgJobsPage />} />
      </Route>
    </Routes>
  );
}
