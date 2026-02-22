'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '../components/admin-layout';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Edit,
  Trash2,
  Plus,
  Eye,
  Video,
  Image as ImageIcon,
  Move,
  X
} from 'lucide-react';

interface JourneyMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  image_url?: string;
  video_url?: string;
  hotspot_x: number;
  hotspot_y: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function JourneyManagement() {
  const [milestones, setMilestones] = useState<JourneyMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(true);

  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    try {
      const response = await fetch('/api/journey?includeInactive=true');
      const data = await response.json();

      if (data.success) {
        setMilestones(data.milestones || []);
      } else {
        console.error('Failed to load milestones:', data.error);
      }
    } catch (error) {
      console.error('Error loading milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMilestone = async (id: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این مرحله سفر را حذف کنید؟')) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/journey/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await loadMilestones();
        alert('مرحله سفر با موفقیت حذف شد');
      } else {
        alert('خطا در حذف: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting milestone:', error);
      alert('خطا در حذف مرحله سفر');
    } finally {
      setDeleting(null);
    }
  };

  const updateSortOrder = async (id: string, newSortOrder: number) => {
    try {
      const milestone = milestones.find(m => m.id === id);
      if (!milestone) return;

      const response = await fetch(`/api/journey/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...milestone,
          sort_order: newSortOrder
        }),
      });

      const data = await response.json();

      if (data.success) {
        await loadMilestones();
      } else {
        alert('خطا در تغییر ترتیب: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating sort order:', error);
      alert('خطا در تغییر ترتیب');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const milestone = milestones.find(m => m.id === id);
      if (!milestone) return;

      const response = await fetch(`/api/journey/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...milestone,
          is_active: !isActive
        }),
      });

      const data = await response.json();

      if (data.success) {
        await loadMilestones();
      } else {
        alert('خطا در تغییر وضعیت: ' + data.error);
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
      alert('خطا در تغییر وضعیت');
    }
  };

  const seedInitialData = async () => {
    if (!confirm('آیا می‌خواهید داده‌های اولیه (4 مرحله) را به دیتابیس اضافه کنید؟')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/seed-journey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: 'seed-journey-2024' })
      });

      const data = await response.json();

      if (data.success) {
        alert(`${data.count} مرحله با موفقیت اضافه شد!`);
        await loadMilestones();
      } else {
        alert('خطا: ' + data.error);
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('خطا در بارگذاری داده‌ها');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="مدیریت سفر ما">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="مدیریت سفر ما">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مدیریت سفر ما</h1>
            <p className="text-gray-600 mt-1">
              مراحل مختلف سفر شرکت را مدیریت کنید
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Filter Toggle */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <label className="text-sm font-medium text-gray-700">
                نمایش غیرفعال‌ها:
              </label>
              <button
                onClick={() => setShowInactive(!showInactive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showInactive ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showInactive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            <Link href="/admin/journey/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 ml-2" />
                افزودن مرحله جدید
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <h3 className="text-lg font-medium text-gray-900">
                  کل مراحل
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {milestones.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <h3 className="text-lg font-medium text-gray-900">
                  فعال
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {milestones.filter(m => m.is_active).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div className="mr-4">
                <h3 className="text-lg font-medium text-gray-900">
                  غیرفعال
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {milestones.filter(m => !m.is_active).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <h3 className="text-lg font-medium text-gray-900">
                  با ویدیو
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {milestones.filter(m => m.video_url).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              لیست مراحل سفر
            </h2>
          </div>

          {milestones.length === 0 ? (
            <div className="p-12 text-center">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                هیچ مرحله‌ای یافت نشد
              </h3>
              <p className="text-gray-500 mb-6">
                برای شروع، اولین مرحله سفر خود را اضافه کنید
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/admin/journey/new">
                  <Button>
                    <Plus className="w-4 h-4 ml-2" />
                    افزودن مرحله جدید
                  </Button>
                </Link>
                <Button
                  onClick={seedInitialData}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  بارگذاری داده‌های نمونه (4 مرحله)
                </Button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {milestones
                .filter(milestone => showInactive || milestone.is_active)
                .map((milestone) => (
                  <div key={milestone.id} className="p-6">
                    <div className="flex items-start space-x-4 space-x-reverse">
                      {/* Image/Video Preview */}
                      <div className="flex-shrink-0">
                        {milestone.image_url ? (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={milestone.image_url}
                              alt={milestone.title}
                              fill
                              className="object-cover"
                            />
                            {milestone.video_url && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Video className="w-8 h-8 text-white" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {milestone.year}
                              </span>
                              <span className="text-sm text-gray-500">
                                ترتیب: {milestone.sort_order}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${milestone.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                                }`}>
                                {milestone.is_active ? 'فعال' : 'غیرفعال'}
                              </span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mt-1">
                              {milestone.title}
                            </h3>
                            <p className="text-gray-600 mt-1 line-clamp-2">
                              {milestone.description}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 space-x-reverse">
                            {/* Sort Order Controls */}
                            <div className="flex flex-col">
                              <button
                                onClick={() => updateSortOrder(milestone.id, milestone.sort_order - 1)}
                                disabled={milestone.sort_order === 1}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                              >
                                <Move className="w-4 h-4 rotate-180" />
                              </button>
                              <button
                                onClick={() => updateSortOrder(milestone.id, milestone.sort_order + 1)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <Move className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Toggle Active */}
                            <button
                              onClick={() => toggleActive(milestone.id, milestone.is_active)}
                              className={`p-2 rounded-lg ${milestone.is_active
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-gray-400 hover:bg-gray-50'
                                }`}
                              title={milestone.is_active ? 'غیرفعال کردن' : 'فعال کردن'}
                            >
                              <Eye className="w-5 h-5" />
                            </button>

                            {/* Edit */}
                            <Link
                              href={`/admin/journey/edit/${milestone.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="ویرایش"
                            >
                              <Edit className="w-5 h-5" />
                            </Link>

                            {/* Delete */}
                            <button
                              onClick={() => deleteMilestone(milestone.id)}
                              disabled={deleting === milestone.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                              title="حذف"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
