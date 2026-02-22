import mongoose, { Schema, Document, Model } from 'mongoose';

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gooz';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      bufferCommands: false,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnected = false;
    throw error;
  }
};

// TypeScript Interfaces
export interface IUser extends Document {
  email: string;
  password_hash: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface IProjectCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IProject extends Document {
  title: string;
  slug: string;
  description?: string;
  category_id: mongoose.Types.ObjectId;
  main_image?: string;
  is_featured: boolean;
  status: 'published' | 'draft' | 'archived';
  area?: number;
  year?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  view_count?: number;
  created_at: Date;
  updated_at: Date;
}

export interface IProjectImage extends Document {
  project_id: mongoose.Types.ObjectId;
  image_url: string;
  alt_text?: string;
  category: 'execution' | 'design';
  sort_order: number;
  created_at: Date;
}

export interface ISliderImage extends Document {
  title?: string;
  description?: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface IMember extends Document {
  first_name: string;
  last_name: string;
  position?: string;
  national_code: string;
  phone?: string;
  email?: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface IMemberFile extends Document {
  member_id: mongoose.Types.ObjectId;
  file_name: string;
  original_name: string;
  file_url: string;
  file_size?: number;
  file_type?: string;
  description?: string;
  uploaded_by?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

export interface IRegistrationForm extends Document {
  full_name: string;
  birth_date?: Date;
  national_id?: string;
  phone?: string;
  mobile: string;
  email: string;
  address?: string;
  education_level?: string;
  field_of_study?: string;
  university?: string;
  graduation_year?: number;
  gpa?: number;
  current_position?: string;
  work_experience_years?: number;
  skills?: string[];
  software_proficiency?: string[];
  languages?: string[];
  has_portfolio?: boolean;
  portfolio_url?: string;
  project_types?: string[];
  preferred_position?: string;
  salary_expectation?: string;
  availability_date?: Date;
  work_schedule_preference?: string;
  cover_letter?: string;
  additional_notes?: string;
  resume_file?: string;
  portfolio_file?: string;
  certificates?: string[];
  status: string;
  admin_notes?: string;
  created_at: Date;
  updated_at: Date;
  reviewed_at?: Date;
  reviewed_by?: mongoose.Types.ObjectId;
}

export interface IJourneyMilestone extends Document {
  year: string;
  title: string;
  description: string;
  image_url?: string;
  video_url?: string;
  hotspot_x: number;
  hotspot_y: number;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Mongoose Schemas
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, default: 'admin' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const ProjectCategorySchema = new Schema<IProjectCategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  category_id: { type: Schema.Types.ObjectId, ref: 'ProjectCategory' },
  main_image: String,
  is_featured: { type: Boolean, default: false },
  status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
  area: Number,
  year: Number,
  location: String,
  latitude: Number,
  longitude: Number,
  view_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const ProjectImageSchema = new Schema<IProjectImage>({
  project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  image_url: { type: String, required: true },
  alt_text: String,
  category: {
    type: String,
    enum: ['execution', 'design'],
    default: 'design',
    required: true
  },
  sort_order: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

const SliderImageSchema = new Schema<ISliderImage>({
  title: String,
  description: String,
  image_url: { type: String, required: true },
  link_url: String,
  is_active: { type: Boolean, default: true },
  sort_order: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const MemberSchema = new Schema<IMember>({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  position: String,
  national_code: { type: String, required: true },
  phone: String,
  email: String,
  status: { type: String, default: 'active' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const MemberFileSchema = new Schema<IMemberFile>({
  member_id: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
  file_name: { type: String, required: true },
  original_name: { type: String, required: true },
  file_url: { type: String, required: true },
  file_size: Number,
  file_type: String,
  description: String,
  uploaded_by: { type: Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const RegistrationFormSchema = new Schema<IRegistrationForm>({
  full_name: { type: String, required: true },
  birth_date: Date,
  national_id: String,
  phone: String,
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  address: String,
  education_level: String,
  field_of_study: String,
  university: String,
  graduation_year: Number,
  gpa: Number,
  current_position: String,
  work_experience_years: Number,
  skills: [String],
  software_proficiency: [String],
  languages: [String],
  has_portfolio: { type: Boolean, default: false },
  portfolio_url: String,
  project_types: [String],
  preferred_position: String,
  salary_expectation: String,
  availability_date: Date,
  work_schedule_preference: String,
  cover_letter: String,
  additional_notes: String,
  resume_file: String,
  portfolio_file: String,
  certificates: [String],
  status: { type: String, default: 'pending' },
  admin_notes: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  reviewed_at: Date,
  reviewed_by: { type: Schema.Types.ObjectId, ref: 'User' }
});

const JourneyMilestoneSchema = new Schema<IJourneyMilestone>({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image_url: String,
  video_url: String,
  hotspot_x: { type: Number, default: 50 },
  hotspot_y: { type: Number, default: 50 },
  sort_order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Create indexes
ProjectSchema.index({ category_id: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ is_featured: 1 });
ProjectImageSchema.index({ project_id: 1 });
ProjectImageSchema.index({ project_id: 1, category: 1 });
SliderImageSchema.index({ is_active: 1 });
SliderImageSchema.index({ sort_order: 1 });
MemberSchema.index({ national_code: 1 }, { unique: true });
MemberSchema.index({ email: 1 });
MemberSchema.index({ status: 1 });
MemberFileSchema.index({ member_id: 1 });
MemberFileSchema.index({ uploaded_by: 1 });
MemberFileSchema.index({ created_at: -1 });
RegistrationFormSchema.index({ status: 1 });
RegistrationFormSchema.index({ created_at: -1 });
RegistrationFormSchema.index({ email: 1 });
JourneyMilestoneSchema.index({ sort_order: 1 });
JourneyMilestoneSchema.index({ is_active: 1 });

// Models
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const ProjectCategory: Model<IProjectCategory> = mongoose.models.ProjectCategory || mongoose.model<IProjectCategory>('ProjectCategory', ProjectCategorySchema);
export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export const ProjectImage: Model<IProjectImage> = mongoose.models.ProjectImage || mongoose.model<IProjectImage>('ProjectImage', ProjectImageSchema);
export const SliderImage: Model<ISliderImage> = mongoose.models.SliderImage || mongoose.model<ISliderImage>('SliderImage', SliderImageSchema);
export const Member: Model<IMember> = mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);
export const MemberFile: Model<IMemberFile> = mongoose.models.MemberFile || mongoose.model<IMemberFile>('MemberFile', MemberFileSchema);
export const RegistrationForm: Model<IRegistrationForm> = mongoose.models.RegistrationForm || mongoose.model<IRegistrationForm>('RegistrationForm', RegistrationFormSchema);
export const JourneyMilestone: Model<IJourneyMilestone> = mongoose.models.JourneyMilestone || mongoose.model<IJourneyMilestone>('JourneyMilestone', JourneyMilestoneSchema);

// Legacy type exports for backward compatibility
export interface User extends IUser { }
export interface ProjectCategory extends IProjectCategory { }
export interface Project extends IProject { }
export interface ProjectImage extends IProjectImage { }
export interface SliderImage extends ISliderImage { }

// Helper db object for backwards compatibility
export const db = {
  query: async (text: string, params?: any[]) => {
    throw new Error('Direct SQL queries are no longer supported. Use Mongoose models instead.');
  },
  init: async () => {
    await connectDB();
  }
};
