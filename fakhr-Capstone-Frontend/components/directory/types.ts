export type DirectoryListing = {
  id: string;
  kind: "center" | "doctor";
  name: string;
  subtitle: string;
  status: "OPEN" | "BUSY";
  locationLine: string;
  rating: string;
  imageUrl: string;
  tags: string[];
  /** When set, shows "+N more" after visible tags */
  moreTagCount?: number;
  phone: string;
};
