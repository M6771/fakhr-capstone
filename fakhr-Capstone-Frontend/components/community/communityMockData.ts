import type { CommunityCategoryId, CommunityPost } from "./types";

export const CATEGORY_TABS: { id: CommunityCategoryId; label: string }[] = [
  { id: "all", label: "All Posts" },
  { id: "tips", label: "Parenting Tips" },
  { id: "education", label: "Education" },
];

export const MOCK_POSTS: CommunityPost[] = [
  {
    id: "p1",
    kind: "text",
    categoryIds: ["all", "tips"],
    authorName: "Ahmed K.",
    metaLine: "2 hours ago • Father of 2",
    createdLabel: "2h",
    body: "Tonight was tough with sensory overload before bed, but we tried the calm-down corner and it actually helped. Small win 🌙",
    likes: 24,
    comments: 8,
  },
  {
    id: "p2",
    kind: "image",
    categoryIds: ["all", "education"],
    authorName: "Sarah M.",
    metaLine: "5 hours ago • Educator & Mom",
    createdLabel: "5h",
    body: "Visual schedules have been a game changer for morning routines 📚✨",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    likes: 142,
    comments: 15,
  },
  {
    id: "p3",
    kind: "question",
    categoryIds: ["all", "tips"],
    authorName: "Anonymous Parent",
    metaLine: "8 hours ago • Seeking Advice",
    createdLabel: "8h",
    badgeLabel: "HEALTH QUESTION",
    question:
      "Does anyone have recommendations for pediatricians in the downtown area who are great with toddlers having dental anxiety?",
    responseCount: 12,
  },
  {
    id: "p4",
    kind: "text",
    categoryIds: ["education"],
    authorName: "Layla R.",
    metaLine: "1 day ago • Autism parent",
    createdLabel: "1d",
    body: "School readiness tip: we practiced short ‘circle time’ at home with a visual timer before kindergarten — huge help for transitions and ADHD focus.",
    likes: 56,
    comments: 11,
  },
  {
    id: "p5",
    kind: "text",
    categoryIds: ["tips"],
    authorName: "Omar H.",
    metaLine: "2 days ago • Speech delay journey",
    createdLabel: "2d",
    body: "For speech delay: narrating everyday activities (bath, snack) gave us more words than flashcards alone. Behavior support + praise for any attempt worked best.",
    likes: 89,
    comments: 22,
  },
];

export function postsForCategory(cat: CommunityCategoryId): CommunityPost[] {
  if (cat === "all") return MOCK_POSTS;
  return MOCK_POSTS.filter((p) => p.categoryIds.includes(cat));
}
