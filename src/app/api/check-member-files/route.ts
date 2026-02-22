import { NextResponse } from 'next/server';
import { connectDB, MemberFile, Member } from '@/lib/database';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('🔍 Checking member_files collection...');

    await connectDB();

    // MongoDB doesn't have schema inspection like PostgreSQL
    // We'll just check if the collection exists by trying to query it
    const collectionExists = mongoose.connection.collections['memberfiles'] !== undefined;

    // Get total files count
    const totalFiles = await MemberFile.countDocuments();

    // Get recent files (last 10) with member information
    const recentFiles = await MemberFile.find()
      .populate('member_id', 'first_name last_name national_code')
      .sort({ created_at: -1 })
      .limit(10)
      .lean();

    // Get storage statistics
    const storageStats = await MemberFile.aggregate([
      {
        $group: {
          _id: null,
          file_count: { $sum: 1 },
          total_bytes: { $sum: { $ifNull: ['$file_size', 0] } },
          avg_bytes: { $avg: { $ifNull: ['$file_size', 0] } },
          min_bytes: { $min: '$file_size' },
          max_bytes: { $max: '$file_size' }
        }
      }
    ]);

    const storage = storageStats[0] || {
      file_count: 0,
      total_bytes: 0,
      avg_bytes: 0,
      min_bytes: 0,
      max_bytes: 0
    };

    // Format recent files for response
    const formattedRecentFiles = recentFiles.map((file: any) => ({
      id: file._id.toString(),
      original_name: file.original_name,
      file_size: file.file_size,
      created_at: file.created_at,
      first_name: file.member_id?.first_name,
      last_name: file.member_id?.last_name,
      national_code: file.member_id?.national_code
    }));

    return NextResponse.json({
      success: true,
      collection_exists: collectionExists,
      database_type: 'MongoDB',
      total_files: totalFiles,
      recent_files: formattedRecentFiles,
      storage_stats: {
        file_count: storage.file_count,
        total_size_mb: storage.total_bytes ? (storage.total_bytes / (1024 * 1024)).toFixed(2) : '0',
        average_size_kb: storage.avg_bytes ? (storage.avg_bytes / 1024).toFixed(2) : '0',
        min_size_bytes: storage.min_bytes || 0,
        max_size_bytes: storage.max_bytes || 0
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error checking member_files collection:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: 'Failed to check member_files collection'
    }, { status: 500 });
  }
}
