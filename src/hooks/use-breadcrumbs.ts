import { matchPath, useLocation, useParams } from 'react-router-dom';
import { breadcrumbMap } from '@components/Header/breadcrumbs-items';
import { useGetUser } from './users/use-get-user';
import { useGetNote } from './notes/use-get-note';
import { useGetFile } from './files/use-get-file';
import { useGetRoom } from './chat/use-get-room';
import { useGetJob } from './jobs/use-get-job';
import { useGetBucket } from './buckets/use-get-bucket';
import { useGetQueue } from './queues/use-get-queue';
import { useGetTopic } from './notifications/use-get-topic';

export const useBreadcrumbs = () => {
  const { pathname } = useLocation();
  const { id = '', bucketId = '' } = useParams();

  const isUserRoute = !!matchPath('/users/:id', pathname);
  const isNoteRoute = !!matchPath('/notes/:id', pathname);
  const isFileRoute = !!matchPath('/media/:bucketId/files/:id', pathname);
  const isBucketRoute =
    !!matchPath('/media/:bucketId', pathname) || isFileRoute;
  const isRoomRoute = !!matchPath('/chat/:id', pathname);
  const isJobRoute = !!matchPath('/background-jobs/:id', pathname);
  const isQueueRoute = !!matchPath('/queues/:id', pathname);
  const isTopicRoute = !!matchPath('/topics/:id', pathname);

  const userQuery = useGetUser(id, { enabled: isUserRoute });
  const noteQuery = useGetNote(id, { enabled: isNoteRoute });
  const fileQuery = useGetFile(id, { enabled: isFileRoute });
  const bucketQuery = useGetBucket(isBucketRoute ? bucketId : '');
  const roomQuery = useGetRoom(id, { enabled: isRoomRoute });
  const jobQuery = useGetJob(id, { enabled: isJobRoute });
  const queueQuery = useGetQueue(isQueueRoute ? id : '');
  const topicQuery = useGetTopic(isTopicRoute ? id : '');

  if (pathname === '*' || pathname === '/403') {
    return [{ label: 'tungsten', href: '/root' }, { label: 'denied' }];
  }
  if (pathname === '*' || pathname === '/404') {
    return [{ label: 'tungsten', href: '/root' }, { label: 'not found' }];
  }

  const matchEntry = Object.entries(breadcrumbMap).find(([path]) =>
    matchPath(path, pathname),
  );

  if (!matchEntry) {
    return [{ label: 'tungsten', href: '/root' }, { label: 'not found' }];
  }

  const [path, config] = matchEntry;
  const crumbs: { label: string; href: string }[] = [];
  let current: typeof config | undefined = config;
  let currentPath: string | undefined = path;

  while (current && currentPath) {
    let label = current.label;

    if (currentPath === '/users/:id' && userQuery.data) {
      label = userQuery.data.username;
    } else if (currentPath === '/notes/:id' && noteQuery.data) {
      label = noteQuery.data.title;
    } else if (currentPath === '/media/:bucketId' && bucketQuery.data) {
      label = bucketQuery.data.name;
    } else if (
      currentPath === '/media/:bucketId/files/:id' &&
      fileQuery.data
    ) {
      label = fileQuery.data.basename;
    } else if (currentPath === '/chat/:id' && roomQuery.data) {
      label = `#${roomQuery.data.title}`;
    } else if (
      currentPath === '/background-jobs/:id' &&
      jobQuery.data
    ) {
      label = jobQuery.data.name || label;
    } else if (currentPath === '/queues/:id' && queueQuery.data) {
      label = queueQuery.data.name;
    } else if (currentPath === '/topics/:id' && topicQuery.data) {
      label = topicQuery.data.name;
    }

    crumbs.unshift({
      label,
      href: currentPath.includes(':') ? pathname : currentPath,
    });

    if (!current.parent) break;
    currentPath = current.parent;
    current = breadcrumbMap[current.parent];
  }

  if (crumbs.length > 0) {
    crumbs[0].href = '/root';
  }

  return crumbs;
};
