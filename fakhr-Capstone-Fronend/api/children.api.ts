import instance from "./axios";

export interface Medication {
  name: string;
  dosage?: string;
  frequency?: string;
}

export interface Child {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  dateOfBirth?: string;
  diagnosis?: string[];
  diagnoses?: string[]; // Alias for diagnosis
  medicalHistory?: string;
  medications?: Medication[];
  allergies?: string[];
  /** Server path under /uploads, e.g. /uploads/profiles/child-profile-xxx.jpg */
  profileImageUrl?: string;
  parentId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChildrenResponse {
  success: boolean;
  data: {
    children: Child[];
    count: number;
  };
}

export interface ChildResponse {
  success: boolean;
  data: {
    child: Child;
  };
}

/**
 * Get all children for authenticated user
 * GET /api/children
 * Returns an array of children
 */
export const getChildren = async (): Promise<Child[]> => {
  const response = await instance.get<ChildrenResponse>("/children");
  // axios interceptor returns response.data directly, so response is already the full response object
  const data = (response as unknown as ChildrenResponse).data;
  // Ensure we return an array
  if (Array.isArray(data.children)) {
    return data.children;
  }
  // If children is not an array, return empty array
  return [];
};

/**
 * Get child by ID
 * GET /api/children/:childId
 */
export const getChildById = async (childId: string): Promise<Child> => {
  const response = await instance.get<ChildResponse>(`/children/${childId}`);
  // axios interceptor returns response.data directly, so response is already the full response object
  return (response as unknown as ChildResponse).data.child;
};

/**
 * Create a new child
 * POST /api/children
 */
export const createChild = async (data: {
  name: string;
  age?: number;
  gender?: string;
  dateOfBirth?: string;
  diagnosis?: string[];
  medicalHistory?: string;
  medications?: Medication[];
  allergies?: string[];
}): Promise<Child> => {
  const response = await instance.post<ChildResponse>("/children", data);
  return (response as unknown as ChildResponse).data.child;
};

/**
 * Update child
 * PUT /api/children/:childId
 */
export const updateChild = async (
  childId: string,
  data: {
    name?: string;
    age?: number;
    gender?: string;
    dateOfBirth?: string;
    diagnosis?: string[];
    medicalHistory?: string;
    medications?: Medication[];
    allergies?: string[];
    clearProfileImage?: boolean;
  }
): Promise<Child> => {
  const response = await instance.put<ChildResponse>(`/children/${childId}`, data);
  return (response as unknown as ChildResponse).data.child;
};

/**
 * Upload or replace profile photo (multipart field: image)
 * POST /api/children/:childId/profile-image
 */
export const uploadChildProfileImage = async (
  childId: string,
  localUri: string
): Promise<Child> => {
  const formData = new FormData();
  const filename = localUri.split("/").pop() || "photo.jpg";
  // React Native FormData file shape
  formData.append("image", {
    uri: localUri,
    name: filename.endsWith(".png") ? filename : `${filename.replace(/\.[^.]+$/, "")}.jpg`,
    type: "image/jpeg",
  } as never);

  const response = await instance.post<ChildResponse>(
    `/children/${childId}/profile-image`,
    formData
  );
  return (response as unknown as ChildResponse).data.child;
};
