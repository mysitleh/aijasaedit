import fs from 'fs';
import path from 'path';

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  category: string;
  readTime: string;
  content: string;
};

const DATA_PATH = path.join(process.cwd(), 'src/data/blog-posts.json');

export function readPosts(): BlogPost[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw) as BlogPost[];
  } catch {
    return [];
  }
}

export function writePosts(posts: BlogPost[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(posts, null, 2), 'utf-8');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
