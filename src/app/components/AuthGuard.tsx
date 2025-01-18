'use client'
import { useAuth } from '@/app/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';


const publicPaths = ['/main', '/'];

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user && !publicPaths.includes(pathname)) {
      router.push('/');
    }
  }, [user, pathname, router]);

  if (!user && !publicPaths.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;