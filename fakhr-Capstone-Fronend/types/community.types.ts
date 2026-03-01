export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  location?: string;
}

export interface Post {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  likes?: number;
  comments?: number;
}
