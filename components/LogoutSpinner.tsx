'use client';
import { useLogout } from '@/contexts/LogoutContext';

export default function LogoutSpinner() {
  const { isLoggingOut } = useLogout();

  if (!isLoggingOut) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="text-gray-700 font-medium">Logging out...</p>
      </div>
    </div>
  );
}
