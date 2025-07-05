export interface Photo {
  name: string;
  id: string;
  created_at?: string;
  updated_at?: string;
  metadata?: {
    caption?: string;
    tags?: string[];
  };
}

export interface UploadProgress {
  loaded: number;
  total: number;
}

export interface PhotoWithUrl extends Photo {
  url: string;
  updated_at: string;
} 