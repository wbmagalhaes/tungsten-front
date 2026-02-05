import { Route, Routes } from 'react-router-dom';
import BaseLayout from '@layouts/BaseLayout';
import ProtectedPage from './ProtectedPage';
import AuthenticatedLayout from '@layouts/AuthenticatedLayout';

import HomePage from '@pages/HomePage';
import MediaPage from '@pages/MediaPage';
import NotesPage from '@pages/NotesPage';
import UsersPage from '@pages/UsersPage';
import TemplatesPage from '@pages/TemplatesPage';
import SandboxPage from '@pages/SandboxPage';
import ChatBotPage from '@pages/ChatBotPage';
import ImageGenerationPage from '@pages/ImageGenerationPage';
import BackgroundJobsPage from '@pages/BackgroundJobsPage';
import SystemHealthPage from '@pages/SystemHealthPage';
import ConfigPage from '@pages/ConfigPage';
import HelpPage from '@pages/HelpPage';
import NotFoundPage from '@pages/NotFoundPage';
import ProfilePage from '@pages/ProfilePage';
import OverviewPage from '@pages/OverviewPage';
import LoginPage from '@pages/LoginPage';
import AccessDeniedPage from '@pages/AccessDeniedPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route index element={<HomePage />} />
        <Route path='login' element={<LoginPage />} />
        <Route path='help' element={<HelpPage />} />
      </Route>

      <Route element={<AuthenticatedLayout />}>
        <Route
          path='overview'
          element={
            <ProtectedPage>
              <OverviewPage />
            </ProtectedPage>
          }
        />

        <Route
          path='system-health'
          element={
            <ProtectedPage requireScope='system:View'>
              <SystemHealthPage />
            </ProtectedPage>
          }
        />
        <Route
          path='users'
          element={
            <ProtectedPage requireScope='users:List'>
              <UsersPage />
            </ProtectedPage>
          }
        />
        <Route
          path='notes'
          element={
            <ProtectedPage requireScope='notes:List'>
              <NotesPage />
            </ProtectedPage>
          }
        />
        <Route
          path='media'
          element={
            <ProtectedPage requireScope='media:List'>
              <MediaPage />
            </ProtectedPage>
          }
        />
        <Route
          path='templates'
          element={
            <ProtectedPage requireScope='templates:List'>
              <TemplatesPage />
            </ProtectedPage>
          }
        />
        <Route
          path='sandbox'
          element={
            <ProtectedPage requireScope='sandbox:List'>
              <SandboxPage />
            </ProtectedPage>
          }
        />
        <Route
          path='chat-bot'
          element={
            <ProtectedPage requireScope='chat:List'>
              <ChatBotPage />
            </ProtectedPage>
          }
        />
        <Route
          path='image-generation'
          element={
            <ProtectedPage requireScope='image-gen:List'>
              <ImageGenerationPage />
            </ProtectedPage>
          }
        />
        <Route
          path='background-jobs'
          element={
            <ProtectedPage requireScope='bg-jobs:List'>
              <BackgroundJobsPage />
            </ProtectedPage>
          }
        />
        <Route
          path='config'
          element={
            <ProtectedPage>
              <ConfigPage />
            </ProtectedPage>
          }
        />
        <Route
          path='profile'
          element={
            <ProtectedPage>
              <ProfilePage />
            </ProtectedPage>
          }
        />

        <Route path='403' element={<AccessDeniedPage />} />
      </Route>

      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}
