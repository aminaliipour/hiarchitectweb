
export interface ProjectImage {
    src: string;
    badge: string;
  }
  
  export interface Project {
    id: number; // Added id for keying
    title: string;
    description: string;
    images: ProjectImage[];
    position: { x: string; y: string }; // percentages
    details: string;
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
  