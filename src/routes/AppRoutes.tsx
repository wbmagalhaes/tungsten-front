import { Route, Routes } from 'react-router-dom';
import BaseLayout from '@layouts/BaseLayout';
import PublicLayout from '@layouts/PublicLayout';
import AuthenticatedLayout from '@layouts/AuthenticatedLayout';
import ProtectedPage from '@components/ProtectedPage';

import { useAuthStore } from '@stores/useAuthStore';
import HomePage from '@pages/HomePage';
import MediaPage from '@pages/files/MediaPage';
import SingleFilePage from '@pages/files/SingleFilePage';
import NotesPage from '@pages/notes/NotesPage';
import SingleNotePage from '@pages/notes/SingleNotePage';
import UsersPage from '@pages/users/UsersPage';
import SingleUserPage from '@pages/users/SingleUserPage';
import TemplatesPage from '@pages/templates/TemplatesPage';
import SandboxPage from '@pages/sandbox/SandboxPage';
import SingleRunnerPage from '@pages/sandbox/SingleRunnerPage';
import ChatBotPage from '@pages/chat-bot/ChatBotPage';
import ImageGenerationPage from '@pages/img-gen/ImageGenerationPage';
import BackgroundJobsPage from '@pages/jobs/BackgroundJobsPage';
import SingleJobPage from '@pages/jobs/SingleJobPage';
import SystemHealthPage from '@pages/system/SystemHealthPage';
import ConfigPage from '@pages/ConfigPage';
import HelpPage from '@pages/HelpPage';
import NotFoundPage from '@pages/NotFoundPage';
import ProfilePage from '@pages/users/ProfilePage';
import RootPage from '@pages/RootPage';
import LoginPage from '@pages/auth/LoginPage';
import RegisterPage from '@pages/auth/RegisterPage';
import AccessDeniedPage from '@pages/AccessDeniedPage';
import LogoutPage from '@pages/auth/LogoutPage';
import ChatPage from '@pages/chat/ChatPage';
import ChatRoomPage from '@pages/chat/ChatRoomPage';

export default function AppRoutes() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='register' element={<RegisterPage />} />
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
            path='notes/:id'
            element={
              <ProtectedPage requireScope='notes:Get'>
                <SingleNotePage />
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
            path='media/:id'
            element={
              <ProtectedPage requireScope='files:Get'>
                <SingleFilePage />
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
            path='sandbox/:id'
            element={
              <ProtectedPage requireScope='jobs:Get'>
                <SingleRunnerPage />
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
              <ProtectedPage requireScope='jobs:List'>
                <BackgroundJobsPage />
              </ProtectedPage>
            }
          />
          <Route
            path='background-jobs/:id'
            element={
              <ProtectedPage requireScope='jobs:Get'>
                <SingleJobPage />
              </ProtectedPage>
            }
          />

          <Route
            path='chat'
            element={
              <ProtectedPage>
                <ChatPage />
              </ProtectedPage>
            }
          />
          <Route
            path='chat/:id'
            element={
              <ProtectedPage>
                <ChatRoomPage />
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
