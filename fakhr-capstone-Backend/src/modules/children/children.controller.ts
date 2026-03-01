import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import Child from "../../models/Child.model";
import { ApiError } from "../../middlewares/apiError";
import { HTTP_STATUS } from "../../config/constants";
import { AuthRequest } from "../../middlewares/auth.middleware";

/**
 * Get all children for the authenticated user
 * GET /api/children
 */
export const getChildren = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized("User not authenticated");
    }

    const children = await Child.find({ parentId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        children: children.map((child) => {
          // Parse medications from JSON string if it exists
          let parsedMedications: any = child.medications;
          if (parsedMedications) {
            try {
              const parsed = JSON.parse(parsedMedications);
              if (Array.isArray(parsed)) {
                parsedMedications = parsed;
              }
            } catch {
              // If parsing fails, keep as string
            }
          }

          // Parse diagnosis and allergies from comma-separated strings
          const parsedDiagnosis = child.diagnosis ? child.diagnosis.split(", ").filter(Boolean) : [];
          const parsedAllergies = child.allergies ? child.allergies.split(", ").filter(Boolean) : [];

          return {
            id: child._id.toString(),
            name: child.name,
            age: child.age,
            dateOfBirth: child.dateOfBirth,
            gender: child.gender,
            diagnosis: parsedDiagnosis,
            diagnoses: parsedDiagnosis, // Alias for frontend compatibility
            medicalHistory: child.medicalHistory,
            medications: parsedMedications,
            allergies: parsedAllergies,
            parentId: child.parentId.toString(),
            createdAt: child.createdAt,
            updatedAt: child.updatedAt,
          };
        }),
        count: children.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get child by ID (only if belongs to authenticated user)
 * GET /api/children/:childId
 * Only returns child if it belongs to the authenticated user
 */
export const getChildById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized("User not authenticated");
    }

    const childId = Array.isArray(req.params.childId)
      ? req.params.childId[0]
      : req.params.childId;

    if (!childId || !mongoose.Types.ObjectId.isValid(childId)) {
      throw ApiError.badRequest("Invalid child ID format");
    }

    // Find child only if it belongs to authenticated user
    const child = await Child.findOne({
      _id: childId,
      parentId: req.user.id, // Only find if it belongs to authenticated user
    });

    if (!child) {
      // Don't reveal if child exists but belongs to someone else
      throw ApiError.notFound("Child not found or you don't have permission to view it");
    }

    // Verify ownership (redundant but explicit)
    if (child.parentId.toString() !== req.user.id) {
      throw ApiError.forbidden("You can only view your own children");
    }

    // Parse medications from JSON string if it exists
    let parsedMedications: any = child.medications;
    if (parsedMedications) {
      try {
        const parsed = JSON.parse(parsedMedications);
        if (Array.isArray(parsed)) {
          parsedMedications = parsed;
        }
      } catch {
        // If parsing fails, keep as string
      }
    }

    // Parse diagnosis and allergies from comma-separated strings
    const parsedDiagnosis = child.diagnosis ? child.diagnosis.split(", ").filter(Boolean) : [];
    const parsedAllergies = child.allergies ? child.allergies.split(", ").filter(Boolean) : [];

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        child: {
          id: child._id.toString(),
          name: child.name,
          age: child.age,
          dateOfBirth: child.dateOfBirth,
          gender: child.gender,
          diagnosis: parsedDiagnosis,
          diagnoses: parsedDiagnosis, // Alias for frontend compatibility
          medicalHistory: child.medicalHistory,
          medications: parsedMedications,
          allergies: parsedAllergies,
          parentId: child.parentId.toString(),
          createdAt: child.createdAt,
          updatedAt: child.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new child for the authenticated user
 * POST /api/children
 * User ID is automatically set from authenticated user - cannot be overridden
 */
export const createChild = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized("User not authenticated");
    }

    // Reject any attempt to set parentId from request body
    if (req.body.parentId) {
      throw ApiError.forbidden("Cannot set parentId. It is automatically assigned to your account.");
    }

    const { name, age, gender, dateOfBirth, diagnosis, medicalHistory, medications, allergies } = req.body;

    // Validate required fields
    if (!name || !gender) {
      throw ApiError.badRequest("Name and gender are required");
    }

    if (typeof name !== "string" || name.trim().length === 0) {
      throw ApiError.badRequest("Name must be a non-empty string");
    }

    if (age !== undefined && (typeof age !== "number" || age < 0 || age > 120)) {
      throw ApiError.badRequest("Age must be a number between 0 and 120");
    }

    if (typeof gender !== "string" || gender.trim().length === 0) {
      throw ApiError.badRequest("Gender must be a non-empty string");
    }

    // Convert arrays to strings for storage
    let diagnosisString: string | undefined;
    if (diagnosis) {
      if (Array.isArray(diagnosis)) {
        diagnosisString = diagnosis.length > 0 ? diagnosis.join(", ") : undefined;
      } else if (typeof diagnosis === "string") {
        diagnosisString = diagnosis.trim() || undefined;
      }
    }

    let medicationsString: string | undefined;
    if (medications) {
      if (Array.isArray(medications)) {
        medicationsString = medications.length > 0 
          ? JSON.stringify(medications) 
          : undefined;
      } else if (typeof medications === "string") {
        medicationsString = medications.trim() || undefined;
      }
    }

    let allergiesString: string | undefined;
    if (allergies) {
      if (Array.isArray(allergies)) {
        allergiesString = allergies.length > 0 ? allergies.join(", ") : undefined;
      } else if (typeof allergies === "string") {
        allergiesString = allergies.trim() || undefined;
      }
    }

    // Create child - parentId is ALWAYS set from authenticated user
    const child = await Child.create({
      name: name.trim(),
      age: age !== undefined ? age : undefined,
      dateOfBirth: dateOfBirth?.trim() || undefined,
      gender: gender.trim(),
      diagnosis: diagnosisString,
      medicalHistory: medicalHistory?.trim() || undefined,
      medications: medicationsString,
      allergies: allergiesString,
      parentId: req.user.id, // Always use authenticated user's ID
    });

    // Parse medications from JSON string if it exists
    let parsedMedications: any = child.medications;
    if (parsedMedications) {
      try {
        const parsed = JSON.parse(parsedMedications);
        if (Array.isArray(parsed)) {
          parsedMedications = parsed;
        }
      } catch {
        // If parsing fails, keep as string
      }
    }

    // Parse diagnosis and allergies from comma-separated strings
    const parsedDiagnosis = child.diagnosis ? child.diagnosis.split(", ").filter(Boolean) : [];
    const parsedAllergies = child.allergies ? child.allergies.split(", ").filter(Boolean) : [];

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: {
        child: {
          id: child._id.toString(),
          name: child.name,
          age: child.age,
          dateOfBirth: child.dateOfBirth,
          gender: child.gender,
          diagnosis: parsedDiagnosis,
          diagnoses: parsedDiagnosis, // Alias for frontend compatibility
          medicalHistory: child.medicalHistory,
          medications: parsedMedications,
          allergies: parsedAllergies,
          parentId: child.parentId.toString(),
          createdAt: child.createdAt,
          updatedAt: child.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update child (only if belongs to authenticated user)
 * PUT /api/children/:childId
 * Only the user who created the child can update it
 * parentId cannot be changed
 */
export const updateChild = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized("User not authenticated");
    }

    const childId = Array.isArray(req.params.childId)
      ? req.params.childId[0]
      : req.params.childId;

    if (!childId || !mongoose.Types.ObjectId.isValid(childId)) {
      throw ApiError.badRequest("Invalid child ID format");
    }

    // Reject any attempt to change parentId
    if (req.body.parentId) {
      throw ApiError.forbidden("Cannot change parentId. Only the original creator can update this child.");
    }

    const { name, age, gender, dateOfBirth, diagnosis, medicalHistory, medications, allergies } = req.body;

    // Find child and verify ownership
    const child = await Child.findOne({
      _id: childId,
      parentId: req.user.id, // Only find if it belongs to authenticated user
    });

    if (!child) {
      // Don't reveal if child exists but belongs to someone else
      throw ApiError.notFound("Child not found or you don't have permission to update it");
    }

    // Double check ownership (redundant but explicit)
    if (child.parentId.toString() !== req.user.id) {
      throw ApiError.forbidden("You can only update children you created");
    }

    // Prepare update data
    const updateData: {
      name?: string;
      age?: number;
      dateOfBirth?: string;
      gender?: string;
      diagnosis?: string;
      medicalHistory?: string;
      medications?: string;
      allergies?: string;
    } = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        throw ApiError.badRequest("Name must be a non-empty string");
      }
      updateData.name = name.trim();
    }

    if (age !== undefined) {
      if (typeof age !== "number" || age < 0 || age > 120) {
        throw ApiError.badRequest("Age must be a number between 0 and 120");
      }
      updateData.age = age;
    }

    if (dateOfBirth !== undefined) {
      if (typeof dateOfBirth !== "string") {
        throw ApiError.badRequest("Date of birth must be a string");
      }
      updateData.dateOfBirth = dateOfBirth.trim() || undefined;
    }

    if (gender !== undefined) {
      if (typeof gender !== "string" || gender.trim().length === 0) {
        throw ApiError.badRequest("Gender must be a non-empty string");
      }
      updateData.gender = gender.trim();
    }

    // Convert arrays to strings for storage
    if (diagnosis !== undefined) {
      if (Array.isArray(diagnosis)) {
        updateData.diagnosis = diagnosis.length > 0 ? diagnosis.join(", ") : undefined;
      } else if (typeof diagnosis === "string") {
        updateData.diagnosis = diagnosis.trim() || undefined;
      }
    }

    if (medicalHistory !== undefined) {
      updateData.medicalHistory = medicalHistory?.trim() || undefined;
    }

    if (medications !== undefined) {
      if (Array.isArray(medications)) {
        updateData.medications = medications.length > 0 ? JSON.stringify(medications) : undefined;
      } else if (typeof medications === "string") {
        updateData.medications = medications.trim() || undefined;
      }
    }

    if (allergies !== undefined) {
      if (Array.isArray(allergies)) {
        updateData.allergies = allergies.length > 0 ? allergies.join(", ") : undefined;
      } else if (typeof allergies === "string") {
        updateData.allergies = allergies.trim() || undefined;
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw ApiError.badRequest("No valid fields to update");
    }

    // Update child
    const updatedChild = await Child.findByIdAndUpdate(
      childId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedChild) {
      throw ApiError.notFound("Child not found");
    }

    // Parse medications from JSON string if it exists
    let parsedMedications: any = updatedChild.medications;
    if (parsedMedications) {
      try {
        const parsed = JSON.parse(parsedMedications);
        if (Array.isArray(parsed)) {
          parsedMedications = parsed;
        }
      } catch {
        // If parsing fails, keep as string
      }
    }

    // Parse diagnosis and allergies from comma-separated strings
    const parsedDiagnosis = updatedChild.diagnosis ? updatedChild.diagnosis.split(", ").filter(Boolean) : [];
    const parsedAllergies = updatedChild.allergies ? updatedChild.allergies.split(", ").filter(Boolean) : [];

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        child: {
          id: updatedChild._id.toString(),
          name: updatedChild.name,
          age: updatedChild.age,
          dateOfBirth: updatedChild.dateOfBirth,
          gender: updatedChild.gender,
          diagnosis: parsedDiagnosis,
          diagnoses: parsedDiagnosis, // Alias for frontend compatibility
          medicalHistory: updatedChild.medicalHistory,
          medications: parsedMedications,
          allergies: parsedAllergies,
          parentId: updatedChild.parentId.toString(),
          createdAt: updatedChild.createdAt,
          updatedAt: updatedChild.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

