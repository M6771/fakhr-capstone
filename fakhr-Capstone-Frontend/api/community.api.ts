import { Event, Post } from "../types/community.types";
import instance from "./axios";

export interface PostsResponse {
  success: boolean;
  data: {
    posts: Post[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface PostResponse {
  success: boolean;
  data: {
    post: Post;
  };
}

export interface ReportResponse {
  success: boolean;
  data: {
    report: {
      id: string;
      postId: string;
      reporterId: string;
      reason: string;
      status: string;
      createdAt: string;
    };
    message: string;
  };
}

/**
 * Get all community posts
 * GET /api/community/posts
 */
export const getCommunityPosts = async (): Promise<Post[]> => {
  const response = await instance.get<PostsResponse>("/community/posts");
  // axios interceptor returns response.data directly, so response is already the full response object
  const data = (response as unknown as PostsResponse).data;
  // Ensure we return an array
  if (Array.isArray(data.posts)) {
    return data.posts;
  }
  return [];
};

/**
 * Create a new community post
 * POST /api/community/posts
 */
export const createPost = async (data: { title: string; content: string; tags?: string[] }): Promise<Post> => {
  const response = await instance.post<PostResponse>("/community/posts", data);
  // axios interceptor returns response.data directly, so response is already the full response object
  return (response as unknown as PostResponse).data.post;
};

/**
 * Report a harmful post
 * POST /api/community/posts/:postId/report
 */
export const reportPost = async (postId: string, reason: string): Promise<void> => {
  await instance.post<ReportResponse>(`/community/posts/${postId}/report`, { reason });
};

/**
 * Get community events (NOT IMPLEMENTED IN BACKEND)
 * GET /api/community/events
 */
export const getEvents = async (): Promise<Event[]> => {
  // This endpoint is not implemented in the backend yet
  // Returning empty array for now
  console.warn("Community events endpoint is not implemented in the backend");
  return [];
};
