import { Router } from "express";
import { getServices, getServiceById } from "./services.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

// All services routes require authentication
router.use(authenticate);

// GET /api/services - Get all services
router.get("/", getServices);

// GET /api/services/:serviceId - Get service by ID
router.get("/:serviceId", getServiceById);

export default router;
