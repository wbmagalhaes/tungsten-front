import { matchPath, useLocation } from 'react-router-dom';
import { breadcrumbMap } from '@components/Header/breadcrumbs';

export function useBreadcrumbs() {
  const { pathname } = useLocation();

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

  const crumbs = [];

  let current: typeof config | undefined = config;
  let currentPath: string | undefined = path;

  while (current && currentPath) {
    crumbs.unshift({
      label: current.label,
      href: currentPath.includes(':') ? pathname : currentPath,
    });

    if (!current.parent) break;

    currentPath = current.parent;
    current = breadcrumbMap[current.parent];
  }

  return crumbs;
}
