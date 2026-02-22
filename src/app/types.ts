
export interface ProjectImage {
  src: string;
  badge: string;
}

// Old project interface for existing components
export interface LegacyProject {
  id: number;
  title: string;
  description: string;
  images: ProjectImage[];
  position: { x: string; y: string };
  details: string;
}

// New database project interface
export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  main_image?: string;
  is_featured: boolean;
  status: 'published' | 'draft' | 'archived';
  created_at: Date;
  updated_at: Date;
  images?: DatabaseProjectImage[];
  image_count?: number;
}

export interface DatabaseProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  created_at: Date;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface Rotation {
  x: number;
  y: number;
}
  