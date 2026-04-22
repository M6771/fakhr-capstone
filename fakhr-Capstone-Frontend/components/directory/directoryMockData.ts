import type { DirectoryListing } from "./types";

export const FEATURED_LISTINGS: DirectoryListing[] = [
  {
    id: "1",
    kind: "center",
    name: "Al-Amal Specialized Center",
    subtitle: "Rehabilitation & Therapy",
    status: "OPEN",
    locationLine: "King Fahd Rd, Riyadh (1.2 km)",
    rating: "4.8",
    imageUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    tags: ["Speech Therapy", "Physiotherapy"],
    moreTagCount: 3,
    phone: "+966112345678",
  },
  {
    id: "2",
    kind: "doctor",
    name: "Dr. Sara Ahmed",
    subtitle: "Consultant Pediatrician",
    status: "BUSY",
    locationLine: "Olaya District, Riyadh (3.5 km)",
    rating: "4.9",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    tags: ["Family Counseling", "Child Psychology"],
    phone: "+966501234567",
  },
  {
    id: "3",
    kind: "center",
    name: "Elite Wellness Center",
    subtitle: "Comprehensive Care",
    status: "OPEN",
    locationLine: "North Road, Riyadh (5.8 km)",
    rating: "4.7",
    imageUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    tags: ["Occupational Therapy", "Sports Therapy"],
    phone: "+966113334445",
  },
];
