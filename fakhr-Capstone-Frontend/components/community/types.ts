export type CommunityCategoryId = "all" | "tips" | "education";

export type BasePost = {
  id: string;
  categoryIds: CommunityCategoryId[];
  authorName: string;
  authorAvatarUrl?: string;
  metaLine: string;
  createdLabel: string;
};

export type TextPost = BasePost & {
  kind: "text";
  body: string;
  likes: number;
  comments: number;
};

export type ImagePost = BasePost & {
  kind: "image";
  body: string;
  imageUrl: string;
  likes: number;
  comments: number;
};

export type QuestionPost = BasePost & {
  kind: "question";
  badgeLabel: string;
  question: string;
  responseCount: number;
};

export type CommunityPost = TextPost | ImagePost | QuestionPost;
