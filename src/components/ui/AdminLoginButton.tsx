'use client';

import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface AdminLoginButtonProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

export function AdminLoginButton({ 
  href = '/maintenance/login', 
  children = 'Acceso Administrativo',
  className
}: AdminLoginButtonProps) {
  return (
    <Link href={href} legacyBehavior passHref>
      <a className={twMerge('ui-btn', className)}>
        <span>
          {children}
        </span>
      </a>
    </Link>
  );
}