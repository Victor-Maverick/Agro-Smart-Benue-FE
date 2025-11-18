'use client';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import axios from 'axios';
import { useLogout } from '@/contexts/LogoutContext';

export const useLogoutHandler = () => {
  const router = useRouter();
  const { setIsLoggingOut } = useLogout();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // First call the backend logout endpoint
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('BFPCAuthToken')}`,
          },
        }
      );
    } catch (error) {
      console.error('Backend logout failed:', error);
    }

    try {
      // Clear client-side authentication
      await signOut({ redirect: false });
      
      // Clear all localStorage items
      localStorage.removeItem('BFPCAuthToken');
      localStorage.removeItem('userEmail');
      localStorage.clear();
      
      // Clear sessionStorage as well
      sessionStorage.clear();
      
      // Add a small delay to show the spinner
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force a hard redirect to ensure complete logout
      window.location.href = '/';
    } catch (error) {
      console.error('Client logout failed:', error);
      // Fallback to router if window.location fails
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { handleLogout };
};
