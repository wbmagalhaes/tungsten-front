import { Route, Routes } from 'react-router-dom';
import BaseLayout from '@layouts/BaseLayout';
import ProtectedRoute from './ProtectedRoutes';
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
      </Route>

      <Route element={<AuthenticatedLayout />}>
        <ProtectedRoute index element={<OverviewPage />} />
        <ProtectedRoute
          path='system-health'
          element={<SystemHealthPage />}
          requireScope={'system:View'}
        />
        <ProtectedRoute
          path='users'
          element={<UsersPage />}
          requireScope={'users:List'}
        />
        <ProtectedRoute
          path='notes'
          element={<NotesPage />}
          requireScope={'notes:List'}
        />
        <ProtectedRoute
          path='media'
          element={<MediaPage />}
          requireScope={'media:List'}
        />
        <ProtectedRoute
          path='templates'
          element={<TemplatesPage />}
          requireScope={'templates:List'}
        />
        <ProtectedRoute
          path='sandbox'
          element={<SandboxPage />}
          requireScope={'sandbox:List'}
        />
        <ProtectedRoute
          path='chat-bot'
          element={<ChatBotPage />}
          requireScope={'chat:List'}
        />
        <ProtectedRoute
          path='image-generation'
          element={<ImageGenerationPage />}
          requireScope={'image-gen:List'}
        />
        <ProtectedRoute
          path='background-jobs'
          element={<BackgroundJobsPage />}
          requireScope={'bg-jobs:List'}
        />
        <ProtectedRoute path='config' element={<ConfigPage />} />
        <ProtectedRoute path='help' element={<HelpPage />} />
        <ProtectedRoute path='profile' element={<ProfilePage />} />

        <ProtectedRoute path='403' element={<AccessDeniedPage />} />
      </Route>

      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}
