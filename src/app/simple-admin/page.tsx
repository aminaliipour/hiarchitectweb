'use client';
import { useState, useEffect } from 'react';

interface RegistrationForm {
  id: string;
  full_name: string;
  email: string;
  mobile: string;
  created_at: string;
}

export default function SimpleAdminTest() {
  const [registrations, setRegistrations] = useState<RegistrationForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        console.log('🧪 Fetching registrations...');
        const response = await fetch('/api/registration?page=1&limit=10');
        console.log('📊 Response status:', response.status);
        
        const data = await response.json();
        console.log('📋 Response data:', data);
        
        if (response.ok && data.success !== false) {
          setRegistrations(data.data || data.registrations || []);
          setError(null);
        } else {
          setError(data.message || data.error || 'Unknown error');
        }
      } catch (err) {
        console.error('💥 Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>بارگیری...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1 style={{ color: 'red' }}>خطا</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>تلاش مجدد</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>مدیریت فرم‌های ثبت نام</h1>
      <p>تعداد کل: {registrations.length}</p>
      
      {registrations.length === 0 ? (
        <p>هیچ فرمی یافت نشد.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>نام</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>ایمیل</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>موبایل</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>تاریخ ثبت</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((form) => (
                <tr key={form.id}>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>{form.full_name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>{form.email}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>{form.mobile}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                    {new Date(form.created_at).toLocaleDateString('fa-IR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}