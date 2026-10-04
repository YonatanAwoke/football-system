import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

export interface NextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  to?: string;
  children: React.ReactNode;
  prefetch?: boolean;
  replace?: boolean;
}

export default function Link({ href, to, children, prefetch, ...props }: NextLinkProps) {
  const target = href || to || '#';
  return (
    <RouterLink to={target} {...(props as any)}>
      {children}
    </RouterLink>
  );
}
