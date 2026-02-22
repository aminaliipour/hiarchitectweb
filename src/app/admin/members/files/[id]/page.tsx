'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Download, Trash2, FileText, ArrowLeft } from 'lucide-react';

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  position: string;
  national_code: string;
  phone: string;
  email: string;
}

interface MemberFile {
  id: string;
  file_name: string;
  original_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  description: string;
  created_at: string;
  is_manual?: boolean;
}

export default function MemberFilesPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const memberId = resolvedParams.id;
  
  const [member, setMember] = useState<Member | null>(null);
  const [files, setFiles] = useState<MemberFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    description: ''
  });

  useEffect(() => {
    fetchMemberData();
    fetchMemberFiles();
  }, []);

  const fetchMemberData = async () => {
    try {
      const response = await fetch(`/api/members/${memberId}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setMember(data.member);
      } else {
        router.push('/admin/members');
      }
    } catch (error) {
      console.error('Error fetching member:', error);
      router.push('/admin/members');
    }
  };

  const fetchMemberFiles = async () => {
    try {
      const response = await fetch(`/api/admin/member-files?memberId=${memberId}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'خطا در بارگذاری فایل‌ها');
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setMessage('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadData(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadData.file) {
      setMessage('لطفاً فایل را انتخاب کنید');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', uploadData.file);
      formData.append('memberId', memberId);
      formData.append('description', uploadData.description);

      const response = await fetch('/api/admin/member-files', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setUploadData({ file: null, description: '' });
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // Refresh files list
        await fetchMemberFiles();
      } else {
        setMessage(data.error || 'خطا در آپلود فایل');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('خطا در آپلود فایل');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!confirm(`آیا از حذف فایل "${fileName}" اطمینان دارید؟`)) return;

    try {
      setDeleting(fileId);

      const response = await fetch(`/api/admin/member-files?fileId=${fileId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        await fetchMemberFiles();
      } else {
        setMessage(data.error || 'خطا در حذف فایل');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('خطا در حذف فایل');
    } finally {
      setDeleting(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl mb-4">عضو یافت نشد</h1>
          <button
            onClick={() => router.push('/admin/members')}
            className="px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#b8941f] transition-colors"
          >
            بازگشت به لیست اعضا
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/members')}
            className="flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            بازگشت به لیست اعضا
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#b8941f] rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-black">
                {member.first_name[0]}{member.last_name[0]}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#D4AF37]">
                مدیریت فایل‌های {member.first_name} {member.last_name}
              </h1>
              <p className="text-gray-400">{member.position}</p>
              <p className="text-gray-500 text-sm">{member.phone} | {member.email}</p>
              {member.national_code && (
                <div className="mt-2 flex items-center gap-2 text-sm text-blue-400">
                  <span>📁 پوشه فایل‌ها:</span>
                  <code className="bg-gray-800 px-2 py-1 rounded">/files/{member.national_code}/</code>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('موفقیت') ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
          }`}>
            {message}
          </div>
        )}

        {/* Upload Form */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#D4AF37]">آپلود فایل جدید</h2>
            {member.national_code && (
              <div className="text-sm text-gray-400">
                فایل‌ها در پوشه <code className="bg-gray-800 px-2 py-1 rounded">{member.national_code}</code> ذخیره می‌شوند
              </div>
            )}
          </div>
          
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  انتخاب فایل (حداکثر 10 مگابایت)
                </label>
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileSelect}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                  required
                />
                {uploadData.file && (
                  <p className="text-sm text-gray-400 mt-1">
                    فایل انتخاب شده: {uploadData.file.name} ({formatFileSize(uploadData.file.size)})
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  توضیحات فایل (اختیاری)
                </label>
                <input
                  type="text"
                  value={uploadData.description}
                  onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors"
                  placeholder="توضیحی درباره فایل..."
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={uploading || !uploadData.file}
              className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#b8941f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  در حال آپلود...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  آپلود فایل
                </>
              )}
            </button>
          </form>
        </div>

        {/* Files List */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-[#D4AF37] flex items-center gap-2">
              فایل‌های آپلود شده 
              <span className="text-sm bg-[#D4AF37] text-black px-2 py-1 rounded">
                {files.length}
              </span>
              {files.filter(f => f.is_manual).length > 0 && (
                <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded ml-2">
                  {files.filter(f => f.is_manual).length} دستی
                </span>
              )}
            </h2>
            {member && member.national_code && (
              <p className="text-sm text-gray-400 mt-2">
                📁 پوشه: /files/{member.national_code.replace(/[^0-9]/g, '')}/
              </p>
            )}
          </div>

          {files.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>هنوز فایلی برای این عضو آپلود نشده است</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-medium text-[#D4AF37]">نام فایل</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-[#D4AF37]">توضیحات</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-[#D4AF37]">نوع فایل</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-[#D4AF37]">حجم</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-[#D4AF37]">تاریخ آپلود</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-[#D4AF37]">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file.id} className={`border-b border-gray-800 hover:bg-gray-800/30 transition-colors ${
                      file.is_manual ? 'bg-blue-900/20' : ''
                    }`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <FileText className="w-5 h-5 text-[#D4AF37]" />
                            {file.is_manual && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" 
                                   title="فایل دستی"></div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{file.original_name}</p>
                              {file.is_manual && (
                                <span className="text-xs bg-blue-600 text-white px-1 py-0.5 rounded">
                                  دستی
                                </span>
                              )}
                            </div>
                            {!file.is_manual && (
                              <p className="text-sm text-gray-400">{file.file_name}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {file.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {file.file_type || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {formatFileSize(file.file_size)}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {formatDate(file.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={file.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            title="دانلود فایل"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          
                          {!file.is_manual ? (
                            <button
                              onClick={() => handleDelete(file.id, file.original_name)}
                              disabled={deleting === file.id}
                              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                              title="حذف فایل"
                            >
                              {deleting === file.id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          ) : (
                            <div className="p-2 bg-gray-600 text-gray-400 rounded-lg" title="فایل دستی - قابل حذف نیست">
                              <Trash2 className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
