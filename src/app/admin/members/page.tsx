'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  position: string;
  national_code: string;
  phone: string;
  email: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  useEffect(() => {
    fetchMembers();
  }, [pagination.page, search]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search })
      });

      const response = await fetch(`/api/members?${params}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
        setPagination(data.pagination);
        setMessage('');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'خطا در بارگذاری اعضا');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      setMessage('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`آیا از حذف ${name} اطمینان دارید؟`)) return;

    try {
      setDeleting(id);
      
      const response = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        // Refresh the list
        await fetchMembers();
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'خطا در حذف عضو');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      setMessage('خطا در حذف عضو');
    } finally {
      setDeleting(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchMembers();
  };

  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
              </svg>
              بازگشت به پنل ادمین
            </button>
            <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">مدیریت اعضا</h1>
            <p className="text-gray-400">مدیریت اعضا و کارکنان شرکت</p>
          </div>
          
          <button
            onClick={() => router.push('/admin/members/add')}
            className="px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#b8941f] transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            افزودن عضو جدید
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('موفقیت') || message.includes('حذف شد') ? 
            'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
          }`}>
            {message}
          </div>
        )}

        {/* Search */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو در نام، نام خانوادگی، سمت، کد ملی، تلفن یا ایمیل..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#b8941f] transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              جستجو
            </button>
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setPagination(prev => ({ ...prev, page: 1 }));
                  setTimeout(fetchMembers, 0);
                }}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                پاک کردن
              </button>
            )}
          </form>
        </div>

        {/* Members Table */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>در حال بارگذاری...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              {search ? 'هیچ عضوی با این جستجو یافت نشد' : 'هنوز هیچ عضوی اضافه نشده'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800 border-b border-gray-700">
                      <th className="px-6 py-4 text-right text-sm font-medium text-[#D4AF37]">نام و نام خانوادگی</th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-[#D4AF37]">سمت</th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-[#D4AF37]">کد ملی</th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-[#D4AF37]">تلفن</th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-[#D4AF37]">ایمیل</th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-[#D4AF37]">وضعیت</th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-[#D4AF37]">تاریخ عضویت</th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-[#D4AF37]">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium">{member.first_name} {member.last_name}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{member.position}</td>
                        <td className="px-6 py-4 text-gray-300">{member.national_code}</td>
                        <td className="px-6 py-4 text-gray-300">{member.phone}</td>
                        <td className="px-6 py-4 text-gray-300">{member.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            member.status === 'active' 
                              ? 'bg-green-900/50 text-green-400' 
                              : 'bg-red-900/50 text-red-400'
                          }`}>
                            {member.status === 'active' ? 'فعال' : 'غیرفعال'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{formatDate(member.created_at)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => router.push(`/admin/members/edit/${member.id}`)}
                              className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                              title="ویرایش"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => router.push(`/admin/members/files/${member.id}`)}
                              className="p-2 text-green-400 hover:text-green-300 transition-colors"
                              title="مدیریت فایل‌ها"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(member.id, `${member.first_name} ${member.last_name}`)}
                              disabled={deleting === member.id}
                              className="p-2 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                              title="حذف"
                            >
                              {deleting === member.id ? (
                                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    نمایش {((pagination.page - 1) * pagination.limit) + 1} تا {Math.min(pagination.page * pagination.limit, pagination.total)} از {pagination.total} عضو
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                      className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      قبلی
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, pagination.page - 2) + i;
                        if (pageNum > pagination.totalPages) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`px-3 py-2 rounded-lg transition-colors ${
                              pageNum === pagination.page
                                ? 'bg-[#D4AF37] text-black'
                                : 'bg-gray-800 text-white hover:bg-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => goToPage(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                      className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      بعدی
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
