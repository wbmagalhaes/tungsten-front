import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@components/base/breadcrumb';
import { Fragment } from 'react';
import { useBreadcrumbs } from '@hooks/use-breadcrumbs';
import { useIsMobile } from '@hooks/use-mobile';
import { Link } from 'react-router-dom';
import { cn } from '@utils/cn';

export function HeaderBreadcrumbs() {
  const crumbs = useBreadcrumbs();

  const isMobile = useIsMobile();
  const visibleCrumbs = isMobile ? collapseCrumbs(crumbs) : crumbs;

  return (
    <Breadcrumb className='text-gray-300 max-w-full'>
      <BreadcrumbList>
        {visibleCrumbs.map((c, i) => {
          const isFirst = i === 0;
          const isLast = i === visibleCrumbs.length - 1;
          const isCollapsed = c.label === '...';

          return (
            <Fragment key={`${c.label}-${i}`}>
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className={cn(isFirst && 'font-bold')}>
                    {c.label}
                  </BreadcrumbPage>
                ) : isCollapsed ? (
                  <span className='text-white select-none'>...</span>
                ) : (
                  <BreadcrumbLink
                    className={cn(isFirst && 'font-bold')}
                    render={<Link to={c.href ?? ''} />}
                  >
                    {c.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

type Crumb = {
  label: string;
  href?: string;
};

function collapseCrumbs(crumbs: Crumb[]) {
  if (crumbs.length <= 2) return crumbs;
  return [crumbs[0], { label: '...' }, crumbs[crumbs.length - 1]];
}
