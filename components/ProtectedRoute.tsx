'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { auth } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!auth.accessToken) {
      router.push('/login'); // Redirect to login page
    } else {
      setIsAuthorized(true);
    }
  }, [auth, router]);

  // Show nothing while checking authentication
  if (!isAuthorized) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}