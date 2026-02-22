// MIGRATION NOTICE: This file is depprecated.
// All PostgreSQL functionality has been migrated to MongoDB.
// This file exists only as a compatibility stub for routes that haven't been migrated yet.
// Please import from './database' instead which uses MongoDB/Mongoose.

import { connectDB } from './database';

console.warn('⚠️ WARNING: database-pg.ts is deprecated! All database operations have been migrated to MongoDB.');
console.warn('⚠️ Please update your imports to use "./database" instead.');
console.warn('⚠️ Any routes still using this file need to be migrated to MongoDB/Mongoose.');

// Stub object that throws errors if used
export const db = {
  query: async (text: string, params?: any[]) => {
    throw new Error(
      'PostgreSQL has been fully migrated to MongoDB. This route needs to be updated to use Mongoose models. ' +
      'Please check database.ts for available models: User, Project, ProjectCategory, ProjectImage, SliderImage, Member, MemberFile, RegistrationForm'
    );
  },
  getClient: async () => {
    throw new Error('PostgreSQL Pool.getClient() is not available. Database has been migrated to MongoDB.');
  },
  end: async () => {
    console.log('PostgreSQL pool.end() called but database is now MongoDB - ignoring');
  }
};

// Type exports for backward compatibility (though they should use the MongoDB versions)
export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category_id: string;
  main_image?: string;
  is_featured: boolean;
  status: 'published' | 'draft' | 'archived';
  area?: number;
  year?: number;
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
  created_at: Date;
  updated_at: Date;
  category?: ProjectCategory;
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  created_at: Date;
}

export interface SliderImage {
  id: string;
  title?: string;
  description?: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}
