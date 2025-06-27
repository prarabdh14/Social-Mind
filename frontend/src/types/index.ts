export interface User {
  id: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  platform: string;
  status: 'DRAFT' | 'SCHEDULED' | 'POSTED' | 'FAILED' | 'NEEDS_REVIEW';
  scheduledAt: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
} 