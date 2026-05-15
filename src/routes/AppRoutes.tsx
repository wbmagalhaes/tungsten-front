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
import BucketContentsPage from '@pages/files/BucketContentsPage';
import QueuesPage from '@pages/queues/QueuesPage';
import SingleQueuePage from '@pages/queues/SingleQueuePage';
import InboxPage from '@pages/notifications/InboxPage';
import TopicsPage from '@pages/notifications/TopicsPage';
import SingleTopicPage from '@pages/notifications/SingleTopicPage';
import NotificationsPage from '@pages/notifications/NotificationsPage';
import AdminNotificationsPage from '@pages/notifications/AdminNotificationsPage';
import SystemTopicsPage from '@pages/notifications/SystemTopicsPage';
import DiscoverTopicsPage from '@pages/notifications/DiscoverTopicsPage';
import FailedExecutionsPage from '@pages/jobs/FailedExecutionsPage';
import LanguagesAdminPage from '@pages/jobs/LanguagesAdminPage';
import RecipientsPage from '@pages/notifications/RecipientsPage';
import QuotasPage from '@pages/quotas/QuotasPage';
import FailedEventsPage from '@pages/events/FailedEventsPage';

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
              <ProtectedPage requireScope='w74:system:Read'>
                <SystemHealthPage />
              </ProtectedPage>
            }
          />

          <Route
            path='users'
            element={
              <ProtectedPage requireScope='iam:user:List'>
                <UsersPage />
              </ProtectedPage>
            }
          />
          <Route
            path='users/:id'
            element={
              <ProtectedPage requireScope='iam:user:Get'>
                <SingleUserPage />
              </ProtectedPage>
            }
          />

          <Route
            path='notes'
            element={
              <ProtectedPage requireScope='wnt:note:List'>
                <NotesPage />
              </ProtectedPage>
            }
          />
          <Route
            path='notes/:id'
            element={
              <ProtectedPage requireScope='wnt:note:Get'>
                <SingleNotePage />
              </ProtectedPage>
            }
          />

          <Route
            path='media'
            element={
              <ProtectedPage requireScope='wss:bucket:List'>
                <MediaPage />
              </ProtectedPage>
            }
          />
          <Route
            path='media/:bucketId'
            element={
              <ProtectedPage requireScope='wss:bucket:Get'>
                <BucketContentsPage />
              </ProtectedPage>
            }
          />
          <Route
            path='media/:bucketId/files/:id'
            element={
              <ProtectedPage requireScope='wss:file:Get'>
                <SingleFilePage />
              </ProtectedPage>
            }
          />

          <Route
            path='templates'
            element={
              <ProtectedPage>
                <TemplatesPage />
              </ProtectedPage>
            }
          />

          <Route
            path='chat-bot'
            element={
              <ProtectedPage>
                <ChatBotPage />
              </ProtectedPage>
            }
          />

          <Route
            path='image-generation'
            element={
              <ProtectedPage>
                <ImageGenerationPage />
              </ProtectedPage>
            }
          />

          <Route
            path='background-jobs'
            element={
              <ProtectedPage requireScope='wjb:job:List'>
                <BackgroundJobsPage />
              </ProtectedPage>
            }
          />
          <Route
            path='background-jobs/:id'
            element={
              <ProtectedPage requireScope='wjb:job:Get'>
                <SingleJobPage />
              </ProtectedPage>
            }
          />
          <Route
            path='background-jobs/admin/failed'
            element={
              <ProtectedPage requireScope='sudo'>
                <FailedExecutionsPage />
              </ProtectedPage>
            }
          />
          <Route
            path='background-jobs/admin/languages'
            element={
              <ProtectedPage requireScope='wjb:job:List'>
                <LanguagesAdminPage />
              </ProtectedPage>
            }
          />

          <Route
            path='queues'
            element={
              <ProtectedPage requireScope='wqs:queue:List'>
                <QueuesPage />
              </ProtectedPage>
            }
          />
          <Route
            path='queues/:id'
            element={
              <ProtectedPage requireScope='wqs:queue:Get'>
                <SingleQueuePage />
              </ProtectedPage>
            }
          />

          <Route
            path='inbox'
            element={
              <ProtectedPage>
                <InboxPage />
              </ProtectedPage>
            }
          />
          <Route
            path='topics'
            element={
              <ProtectedPage requireScope='was:topic:List'>
                <TopicsPage />
              </ProtectedPage>
            }
          />
          <Route
            path='topics/system'
            element={
              <ProtectedPage requireScope='sudo'>
                <SystemTopicsPage />
              </ProtectedPage>
            }
          />
          <Route
            path='topics/discover'
            element={
              <ProtectedPage requireScope='was:topic:List'>
                <DiscoverTopicsPage />
              </ProtectedPage>
            }
          />
          <Route
            path='topics/:id'
            element={
              <ProtectedPage requireScope='was:topic:Get'>
                <SingleTopicPage />
              </ProtectedPage>
            }
          />
          <Route
            path='recipients'
            element={
              <ProtectedPage requireScope='was:recipient:List'>
                <RecipientsPage />
              </ProtectedPage>
            }
          />
          <Route
            path='notifications'
            element={
              <ProtectedPage requireScope='was:notification:List'>
                <NotificationsPage />
              </ProtectedPage>
            }
          />
          <Route
            path='notifications/admin'
            element={
              <ProtectedPage requireScope='sudo'>
                <AdminNotificationsPage />
              </ProtectedPage>
            }
          />

          <Route
            path='quotas'
            element={
              <ProtectedPage>
                <QuotasPage />
              </ProtectedPage>
            }
          />

          <Route
            path='events/failed'
            element={
              <ProtectedPage requireScope='sudo'>
                <FailedEventsPage />
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
