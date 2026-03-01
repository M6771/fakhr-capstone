import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import Post from "../../models/Post.model";
import PostReport from "../../models/PostReport.model";
import { ApiError } from "../../middlewares/apiError";
import { HTTP_STATUS, USER_ROLES } from "../../config/constants";
import { AuthRequest } from "../../middlewares/auth.middleware";

/**
 * Create a new post
 * POST /api/community/posts
 * Requires: parent role
 */
export const createPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized("User not authenticated");
    }

    // Check if user is a parent
    if (req.user.role !== USER_ROLES.PARENT) {
      throw ApiError.forbidden("Only parents can create posts");
    }

    const { title, content, tags } = req.body;

    // Validate required fields
    if (!title || !content) {
      throw ApiError.badRequest("Title and content are required");
    }

    if (typeof title !== "string" || title.trim().length === 0) {
      throw ApiError.badRequest("Title must be a non-empty string");
    }

    if (typeof content !== "string" || content.trim().length === 0) {
      throw ApiError.badRequest("Content must be a non-empty string");
    }

    // Validate title length
    if (title.trim().length > 200) {
      throw ApiError.badRequest("Title must be less than 200 characters");
    }

    // Validate content length
    if (content.trim().length > 5000) {
      throw ApiError.badRequest("Content must be less than 5000 characters");
    }

    // Validate tags if provided
    let validTags: string[] = [];
    if (tags) {
      if (!Array.isArray(tags)) {
        throw ApiError.badRequest("Tags must be an array");
      }
      validTags = tags
        .filter((tag: any) => typeof tag === "string" && tag.trim().length > 0)
        .map((tag: string) => tag.trim().toLowerCase())
        .slice(0, 10); // Limit to 10 tags
    }

    // Create post
    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      authorId: req.user.id,
      tags: validTags,
      likes: 0,
    });

    // Populate author information
    await post.populate("authorId", "name email");

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: {
        post: {
          id: post._id.toString(),
          title: post.title,
          content: post.content,
          authorId: post.authorId,
          author: {
            id: (post.authorId as any)._id?.toString() || post.authorId.toString(),
            name: (post.authorId as any).name,
            email: (post.authorId as any).email,
          },
          tags: post.tags,
          likes: post.likes,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all posts
 * GET /api/community/posts
 * Requires: parent role
 */
export const getPosts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized("User not authenticated");
    }

    // Check if user is a parent
    if (req.user.role !== USER_ROLES.PARENT) {
      throw ApiError.forbidden("Only parents can view posts");
    }

    // Query parameters for pagination and filtering
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as string) === "asc" ? 1 : -1;

    // Build query
    const query: any = {};

    // Filter by tags if provided
    if (req.query.tags) {
      const tags = Array.isArray(req.query.tags)
        ? req.query.tags
        : [req.query.tags];
      query.tags = { $in: tags };
    }

    // Filter by author if provided
    if (req.query.authorId) {
      const authorId = Array.isArray(req.query.authorId)
        ? req.query.authorId[0]
        : req.query.authorId;
      const authorIdStr = authorId as string;
      if (!mongoose.Types.ObjectId.isValid(authorIdStr)) {
        throw ApiError.badRequest("Invalid author ID format");
      }
      query.authorId = new mongoose.Types.ObjectId(authorIdStr);
    }

    // Get total count for pagination
    const total = await Post.countDocuments(query);

    // Get posts with pagination
    const posts = await Post.find(query)
      .populate("authorId", "name email")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    // Format response
    const formattedPosts = posts.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      author: {
        id: (post.authorId as any)._id?.toString() || post.authorId.toString(),
        name: (post.authorId as any).name,
        email: (post.authorId as any).email,
      },
      tags: post.tags,
      likes: post.likes,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        posts: formattedPosts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Report a harmful post
 * POST /api/community/posts/:postId/report
 * Requires: parent role
 */
export const reportPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized("User not authenticated");
    }

    // Check if user is a parent
    if (req.user.role !== USER_ROLES.PARENT) {
      throw ApiError.forbidden("Only parents can report posts");
    }

    const { postId } = req.params;
    const { reason } = req.body;

    // Validate postId
    const postIdStr = Array.isArray(postId) ? postId[0] : postId;
    if (!postIdStr || !mongoose.Types.ObjectId.isValid(postIdStr)) {
      throw ApiError.badRequest("Invalid post ID format");
    }

    // Validate reason
    if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
      throw ApiError.badRequest("Reason is required");
    }

    if (reason.trim().length > 500) {
      throw ApiError.badRequest("Reason must be less than 500 characters");
    }

    // Check if post exists
    const post = await Post.findById(postIdStr);
    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    // Check if user already reported this post
    const existingReport = await PostReport.findOne({
      postId: postIdStr,
      reporterId: req.user.id,
    });

    if (existingReport) {
      throw ApiError.conflict("You have already reported this post");
    }

    // Prevent users from reporting their own posts
    if (post.authorId.toString() === req.user.id) {
      throw ApiError.forbidden("You cannot report your own post");
    }

    // Create report
    const report = await PostReport.create({
      postId: postIdStr,
      reporterId: req.user.id,
      reason: reason.trim(),
      status: "pending",
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: {
        report: {
          id: report._id.toString(),
          postId: report.postId.toString(),
          reporterId: report.reporterId.toString(),
          reason: report.reason,
          status: report.status,
          createdAt: report.createdAt,
        },
        message: "Post reported successfully. Our team will review it shortly.",
      },
    });
  } catch (error) {
    // Handle duplicate key error (unique index)
    if ((error as any).code === 11000) {
      throw ApiError.conflict("You have already reported this post");
    }
    next(error);
  }
};
