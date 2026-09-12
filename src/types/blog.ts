export interface BlogPostSEO {
  focusKeyword: string;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  robotsIndex: boolean; // default true
  robotsFollow: boolean; // default true
  schemaType: 'BlogPosting' | 'Article' | 'NewsArticle';
  socialTitle?: string;
  socialDescription?: string;
  socialImage?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML / formatted markdown
  featuredImage: string;
  featuredImageAlt: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedAt: string;
  updatedAt: string;
  status: 'published' | 'draft';
  readTimeMinutes: number;
  views: number;
  likes: number;
  seo: BlogPostSEO;
}

export interface RankMathAnalysis {
  score: number; // 0 - 100
  rating: 'good' | 'ok' | 'bad';
  checks: {
    id: string;
    category: 'basic' | 'additional' | 'title' | 'content';
    title: string;
    passed: boolean;
    message: string;
    impact: 'high' | 'medium' | 'low';
  }[];
  wordCount: number;
  keywordDensity: number;
  keywordCount: number;
}
