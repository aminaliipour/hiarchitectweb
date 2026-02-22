'use client';

import { AuthProvider } from '../../hooks/use-auth';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </AuthProvider>
  );
}
