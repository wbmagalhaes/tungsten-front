import { matchPath, useLocation, useParams } from 'react-router-dom';
import { breadcrumbMap } from '@components/Header/breadcrumbs';
import { useGetUser } from './users/use-get-user';

export function useBreadcrumbs() {
  const { pathname } = useLocation();
  const { id = '' } = useParams();

  const isUserRoute = !!matchPath('/users/:id', pathname);
  const userQuery = useGetUser(id, { enabled: isUserRoute });

  if (pathname === '*' || pathname === '/404') {
    return [
      { label: 'tungsten', href: '/' },
      { label: 'not found', href: pathname },
    ];
  }

  const matchEntry = Object.entries(breadcrumbMap).find(([path]) =>
    matchPath(path, pathname),
  );

  if (!matchEntry) {
    return [
      { label: 'tungsten', href: '/' },
      { label: 'not found', href: pathname },
    ];
  }

  const [path, config] = matchEntry;

  const crumbs: { label: string; href: string }[] = [];

  let current: typeof config | undefined = config;
  let currentPath: string | undefined = path;

  while (current && currentPath) {
    let label = current.label;

    if (currentPath === '/users/:id' && userQuery.data) {
      label = userQuery.data.username;
    }

    crumbs.unshift({
      label: label,
      href: currentPath.includes(':') ? pathname : currentPath,
    });

    if (!current.parent) break;

    currentPath = current.parent;
    current = breadcrumbMap[current.parent];
  }

  return crumbs;
}
