import { Route, Routes } from 'react-router-dom';
import BaseLayout from '@layouts/BaseLayout';
import PublicLayout from '@layouts/PublicLayout';
import AuthenticatedLayout from '@layouts/AuthenticatedLayout';
import ProtectedPage from '@components/ProtectedPage';

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
import RootPage from '@pages/RootPage';
import LoginPage from '@pages/LoginPage';
import AccessDeniedPage from '@pages/AccessDeniedPage';
import LogoutPage from '@pages/LogoutPage';
import SingleUserPage from '@pages/SingleUserPage';
import { useAuthStore } from '@stores/useAuthStore';

export default function AppRoutes() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='logout' element={<LogoutPage />} />
          <Route path='help' element={<HelpPage />} />
        </Route>

        <Route element={<AuthenticatedLayout />}>
          <Route
            path='root'
            element={
              <ProtectedPage>
                <RootPage />
              </ProtectedPage>
            }
          />

          <Route
            path='system-health'
            element={
              <ProtectedPage requireScope='system:Read'>
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
            path='users/:id'
            element={
              <ProtectedPage requireScope='users:Get'>
                <SingleUserPage />
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
              <ProtectedPage requireScope='files:List'>
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
              <ProtectedPage requireScope='chat-bot:List'>
                <ChatBotPage />
              </ProtectedPage>
            }
          />
          <Route
            path='image-generation'
            element={
              <ProtectedPage requireScope='img-gen:List'>
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

        <Route
          element={isAuthenticated ? <AuthenticatedLayout /> : <PublicLayout />}
        >
          <Route
            path='*'
            element={<NotFoundPage isAuthenticated={isAuthenticated} />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
