export type { BlogPost } from './blog-storage';

import { readPosts } from './blog-storage';

export function getAllBlogPosts() {
  return readPosts();
}

export function getBlogPost(slug: string) {
  return readPosts().find((p) => p.slug === slug);
}
