import { CheckIn, Progress, Task, WeeklyPlan } from "../types/care-path.types";
import { Child } from "../types/child.types";
import instance from "./axios";

/**
 * Get weekly care plan (NOT REGISTERED IN BACKEND)
 * GET /api/care-path/weekly-plan
 */
export const getWeeklyPlan = async (): Promise<WeeklyPlan | null> => {
  // This endpoint is not registered in app.ts yet
  console.warn("Care-path weekly-plan endpoint is not registered in the backend");
  return null;
};

/**
 * Get task details by ID (NOT REGISTERED IN BACKEND)
 * GET /api/care-path/tasks/:taskId
 */
export const getTaskDetails = async (taskId: string): Promise<Task | null> => {
  // This endpoint is not registered in app.ts yet
  console.warn("Care-path task details endpoint is not registered in the backend");
  return null;
};

/**
 * Get care path progress (NOT REGISTERED IN BACKEND)
 * GET /api/care-path/progress
 */
export const getProgress = async (): Promise<Progress | null> => {
  // This endpoint is not registered in app.ts yet
  console.warn("Care-path progress endpoint is not registered in the backend");
  return null;
};

/**
 * Submit a check-in (NOT REGISTERED IN BACKEND)
 * POST /api/care-path/check-in
 */
export const submitCheckIn = async (data: { notes: string; rating: number }): Promise<CheckIn | null> => {
  // This endpoint is not registered in app.ts yet
  console.warn("Care-path check-in endpoint is not registered in the backend");
  return null;
};

/**
 * Generate a new care path (NOT REGISTERED IN BACKEND)
 * POST /api/care-path/generate
 */
export const generateCarePath = async (): Promise<WeeklyPlan | null> => {
  // This endpoint is not registered in app.ts yet
  console.warn("Care-path generate endpoint is not registered in the backend");
  return null;
};

/**
 * Get children (NOT REGISTERED IN BACKEND - use /api/children instead)
 * GET /api/care-path/children
 */
export const getChildren = async (): Promise<Child[]> => {
  // This endpoint is not registered in app.ts yet
  // Use /api/children instead
  console.warn("Care-path children endpoint is not registered. Use /api/children instead.");
  return [];
};
