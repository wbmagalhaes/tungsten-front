import { matchPath, useLocation, useParams } from 'react-router-dom';
import { breadcrumbMap } from '@components/Header/breadcrumbs-items';
import { useGetUser } from './users/use-get-user';
import { useGetNote } from './notes/use-get-note';
import { useGetFile } from './files/use-get-file';
import { useGetRoom } from './chat/use-get-room';
import { useGetJob } from './jobs/use-get-job';

export const useBreadcrumbs = () => {
  const { pathname } = useLocation();
  const { id = '' } = useParams();

  const isUserRoute = !!matchPath('/users/:id', pathname);
  const isNoteRoute = !!matchPath('/notes/:id', pathname);
  const isFileRoute = !!matchPath('/media/:id', pathname);
  const isRoomRoute = !!matchPath('/chat/:id', pathname);
  const isSandboxRoute = !!matchPath('/sandbox/:id', pathname);
  const isJobRoute = !!matchPath('/background-jobs/:id', pathname);

  const userQuery = useGetUser(id, { enabled: isUserRoute });
  const noteQuery = useGetNote(id, { enabled: isNoteRoute });
  const fileQuery = useGetFile(id, { enabled: isFileRoute });
  const roomQuery = useGetRoom(id, { enabled: isRoomRoute });
  const jobQuery = useGetJob(id, { enabled: isSandboxRoute || isJobRoute });

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
    } else if (currentPath === '/media/:id' && fileQuery.data) {
      label = fileQuery.data.basename;
    } else if (currentPath === '/chat/:id' && roomQuery.data) {
      label = `#${roomQuery.data.title}`;
    } else if (
      (currentPath === '/sandbox/:id' ||
        currentPath === '/background-jobs/:id') &&
      jobQuery.data
    ) {
      const firstLine = jobQuery.data.payload?.code
        ?.split('\n')[0]
        ?.slice(0, 24);
      label = firstLine || label;
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
