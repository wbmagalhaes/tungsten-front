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

export function HeaderBreadcrumbs() {
  const crumbs = useBreadcrumbs();

  const isMobile = useIsMobile();
  const visibleCrumbs = isMobile ? collapseCrumbs(crumbs) : crumbs;

  return (
    <Breadcrumb className='text-gray-300'>
      <BreadcrumbList>
        {visibleCrumbs.map((c, i) => {
          const isFirst = i === 0;
          const isLast = i === visibleCrumbs.length - 1;
          const isCollapsed = c.label === '...';

          const firstClass = isFirst ? 'font-bold' : '';

          return (
            <Fragment key={`${c.label}-${i}`}>
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className={firstClass}>
                    {c.label}
                  </BreadcrumbPage>
                ) : isCollapsed ? (
                  <span className='text-white select-none'>...</span>
                ) : (
                  <BreadcrumbLink
                    className={firstClass}
                    render={<Link to={c.href} />}
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
  href: string;
};

function collapseCrumbs(crumbs: Crumb[]) {
  if (crumbs.length <= 2) return crumbs;
  return [crumbs[0], { label: '...', href: '' }, crumbs[crumbs.length - 1]];
}
