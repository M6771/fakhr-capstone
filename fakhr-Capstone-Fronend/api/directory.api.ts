import { HealthCenter, Professional } from "../types/directory.types";
import instance from "./axios";


export interface CenterFilters {
  type?: "public" | "private";
  city?: string;
  specialties?: string[];
}

/**
 * Get health centers
 * GET /api/directory/centers
 */
export const getCenters = async (filters?: CenterFilters): Promise<HealthCenter[]> => {
  const params: Record<string, string> = {};

  if (filters?.type) params.type = filters.type;
  if (filters?.city) params.city = filters.city;
  if (filters?.specialties?.length) {
    params.specialties = filters.specialties.join(",");
  }

  const response = await instance.get<{ success: boolean; data: { centers: HealthCenter[]; count: number } }>("/directory/centers", { params });
  // axios interceptor returns response.data directly, so response is already the full response object
  const data = (response as unknown as { success: boolean; data: { centers: HealthCenter[]; count: number } }).data;
  // Ensure we return an array
  if (Array.isArray(data.centers)) {
    return data.centers;
  }
  return [];
};

/**
 * Get list of available cities
 * GET /api/directory/centers/cities
 * Note: This endpoint needs to be implemented in the backend
 */
export const getCities = async (): Promise<string[]> => {
  // This endpoint needs to be implemented in the backend
  // For now, we can extract cities from centers data
  try {
    const centers = await getCenters();
    const cities = [...new Set(centers.map((center) => center.city).filter(Boolean))];
    return cities;
  } catch {
    console.warn("Failed to get cities from centers");
    return [];
  }
};

/**
 * Get list of center specialties
 * GET /api/directory/centers/specialties
 * Note: This endpoint needs to be implemented in the backend
 */
export const getSpecialties = async (): Promise<string[]> => {
  // This endpoint needs to be implemented in the backend
  // For now, we can extract specialties from centers data
  try {
    const centers = await getCenters();
    const specialties = new Set<string>();
    centers.forEach((center) => {
      if (center.specialties) {
        center.specialties.forEach((spec) => specialties.add(spec));
      }
    });
    return Array.from(specialties);
  } catch {
    console.warn("Failed to get specialties from centers");
    return [];
  }
};


export interface ProfessionalFilters {
  specialty?: string;
  tags?: string[];
  city?: string;
  search?: string;
}


export const getProfessionals = async (filters?: ProfessionalFilters): Promise<Professional[]> => {
  const params: Record<string, string> = {};
  
  if (filters?.specialty) params.specialty = filters.specialty;
  if (filters?.tags?.length) params.tags = filters.tags.join(","); 
  if (filters?.city) params.city = filters.city;
  if (filters?.search) params.search = filters.search;
  
  const response = await instance.get<{ success: boolean; data: { professionals: Professional[]; count: number } }>("/directory/professionals", { params });
  // axios interceptor returns response.data directly, so response is already the full response object
  const data = (response as unknown as { success: boolean; data: { professionals: Professional[]; count: number } }).data;
  // Ensure we return an array
  if (Array.isArray(data.professionals)) {
    return data.professionals;
  }
  return [];
};

/**
 * Get list of professional specialties
 * GET /api/directory/professionals/specialties/list
 */
export const getProfessionalSpecialties = async (): Promise<string[]> => {
  const response = await instance.get<{ success: boolean; data: string[] }>("/directory/professionals/specialties/list");
  // axios interceptor returns response.data directly, so response is already the full response object
  const data = (response as unknown as { success: boolean; data: string[] }).data;
  // Ensure we return an array
  if (Array.isArray(data)) {
    return data;
  }
  return [];
};

/**
 * Get list of professional tags (NOT IMPLEMENTED IN BACKEND)
 * GET /api/directory/professionals/tags/list
 */
export const getProfessionalTags = async (): Promise<string[]> => {
  // This endpoint is not implemented in the backend yet
  console.warn("Professional tags endpoint is not implemented in the backend");
  return [];
};

/**
 * Get center details by ID
 * GET /api/directory/centers/:centerId
 */
export const getCenterDetails = async (centerId: string): Promise<HealthCenter> => {
  const response = await instance.get<{ success: boolean; data: { center: HealthCenter } }>(`/directory/centers/${centerId}`);
  // axios interceptor returns response.data directly, so response is already the full response object
  return (response as unknown as { success: boolean; data: { center: HealthCenter } }).data.center;
};



export const getProfessionalDetails = async (professionalId: string): Promise<Professional> => {
  const response = await instance.get<{ success: boolean; data: { professional: Professional } }>(`/directory/professionals/${professionalId}`);
  // axios interceptor returns response.data directly, so response is already the full response object
  return (response as unknown as { success: boolean; data: { professional: Professional } }).data.professional;
};
