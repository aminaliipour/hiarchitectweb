import { Metadata, Viewport } from 'next';
import ClientLayout from './components/client-layout';

export const metadata: Metadata = {
  title: 'پنل مدیریت - هی آرکیتکت',
  description: 'پنل مدیریت سایت معماری هی آرکیتکت',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1f2937',
  colorScheme: 'light dark',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
