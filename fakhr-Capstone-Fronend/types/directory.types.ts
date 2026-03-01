export interface HealthCenter {
  id: string;
  name: string;
  type: "public" | "private";
  address: string;
  city: string;
  phone: string | number;
  email?: string;
  description?: string;
  specialties?: string[];
  operatingHours?: string;
  rating?: number;
  latitude?: number;          
  longitude?: number; 
  reviews?: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  specialtyLabel: string;
  experience: string;
  rating: number;
  reviews: number;
  availability: string;
  verified: boolean;
  color: string;
  bio: string;
  education: string[];
  certifications: string[];
  languages: string[];
  services: string[];
  location: string;
  consultationFee: string;
  nextAvailable: string;
  email?: string;
  phone?: string;
  image?: string;
  centerId?: string;
  centerName?: string;
  createdAt?: string;
  updatedAt?: string;
}
