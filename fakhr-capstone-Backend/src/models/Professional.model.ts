import mongoose, { Document, Schema } from "mongoose";

export interface IProfessional extends Document {
  name: string;
  specialty: string; // speech, behavioral, occupational, physical, educational
  specialtyLabel: string; // Display name like "Speech Therapist"
  experience: string; // e.g., "10 years"
  rating: number;
  reviews: number;
  availability: string; // e.g., "Available today", "Next available: Tomorrow"
  verified: boolean;
  color: string; // Hex color code
  bio: string;
  education: string[]; // Array of education degrees
  certifications: string[]; // Array of certifications
  languages: string[]; // Array of languages spoken
  services: string[]; // Array of services offered
  location: string; // e.g., "Riyadh, Saudi Arabia"
  consultationFee: string; // e.g., "250 SAR"
  nextAvailable: string; // e.g., "Today, 3:00 PM"
  centerId?: mongoose.Types.ObjectId; // Optional reference to Center
  email?: string;
  phone?: string;
  image?: string; // URL to profile image
  createdAt: Date;
  updatedAt: Date;
}

const professionalSchema = new Schema<IProfessional>(
  {
    name: { type: String, required: true },
    specialty: {
      type: String,
      required: true,
      enum: ["speech", "behavioral", "occupational", "physical", "educational"],
    },
    specialtyLabel: { type: String, required: true },
    experience: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
    reviews: { type: Number, default: 0 },
    availability: { type: String, required: true },
    verified: { type: Boolean, default: false },
    color: { type: String, required: true },
    bio: { type: String, required: true },
    education: [{ type: String }],
    certifications: [{ type: String }],
    languages: [{ type: String }],
    services: [{ type: String }],
    location: { type: String, required: true },
    consultationFee: { type: String, required: true },
    nextAvailable: { type: String, required: true },
    centerId: { type: Schema.Types.ObjectId, ref: "Center" },
    email: { type: String },
    phone: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

// Index for faster queries
professionalSchema.index({ specialty: 1 });
professionalSchema.index({ centerId: 1 });
professionalSchema.index({ verified: 1 });
professionalSchema.index({ name: 1, specialty: 1 }, { unique: true });

const Professional = mongoose.model<IProfessional>("Professional", professionalSchema);

export default Professional;
