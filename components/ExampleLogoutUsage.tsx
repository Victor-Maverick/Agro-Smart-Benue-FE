'use client';
import { useSession } from 'next-auth/react';
import { useLogoutHandler } from '@/hooks/useLogoutHandler';

/**
 * Example component showing how to use the logout handler
 * You can copy this pattern into your Header, Navbar, or any component
 */
export default function ExampleLogoutUsage() {
  const { data: session, status } = useSession();
  const { handleLogout } = useLogoutHandler();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="flex items-center gap-4">
      <p>Welcome, {session.user.firstName}!</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
