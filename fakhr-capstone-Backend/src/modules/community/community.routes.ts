import { Router } from "express";
import { createPost, getPosts, reportPost } from "./community.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize.middleware";
import { USER_ROLES } from "../../config/constants";

const router = Router();

// All community routes require authentication and parent role
router.use(authenticate);
router.use(authorize(USER_ROLES.PARENT));

// GET /api/community/posts - Get all posts
router.get("/posts", getPosts);

// POST /api/community/posts - Create a new post
router.post("/posts", createPost);

// POST /api/community/posts/:postId/report - Report a harmful post
router.post("/posts/:postId/report", reportPost);

export default router;
