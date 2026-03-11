'use server';

import { readPosts, writePosts, slugify, type BlogPost } from '@/lib/blog-storage';
import { revalidatePath } from 'next/cache';

export async function getBlogPosts(): Promise<BlogPost[]> {
  return readPosts();
}

export async function createBlogPost(formData: FormData): Promise<{ success: boolean; error?: string; slug?: string }> {
  const title = (formData.get('title') as string)?.trim();
  const excerpt = (formData.get('excerpt') as string)?.trim();
  const coverImage = (formData.get('coverImage') as string)?.trim() || '/blog/cover-gaya-viral.png';
  const category = (formData.get('category') as string)?.trim();
  const readTime = (formData.get('readTime') as string)?.trim() || '3 menit';
  const content = (formData.get('content') as string)?.trim();

  if (!title || !excerpt || !category || !content) {
    return { success: false, error: 'Semua field wajib diisi.' };
  }

  const posts = readPosts();
  let slug = slugify(title);

  if (posts.find((p) => p.slug === slug)) {
    slug = `${slug}-${Date.now()}`;
  }

  const now = new Date();
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const date = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const newPost: BlogPost = { slug, title, excerpt, coverImage, date, category, readTime, content };
  writePosts([newPost, ...posts]);

  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);

  return { success: true, slug };
}

export async function updateBlogPost(slug: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
  const title = (formData.get('title') as string)?.trim();
  const excerpt = (formData.get('excerpt') as string)?.trim();
  const coverImage = (formData.get('coverImage') as string)?.trim();
  const category = (formData.get('category') as string)?.trim();
  const readTime = (formData.get('readTime') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();

  if (!title || !excerpt || !category || !content) {
    return { success: false, error: 'Semua field wajib diisi.' };
  }

  const posts = readPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { success: false, error: 'Artikel tidak ditemukan.' };

  posts[idx] = { ...posts[idx], title, excerpt, coverImage: coverImage || posts[idx].coverImage, category, readTime: readTime || posts[idx].readTime, content };
  writePosts(posts);

  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);

  return { success: true };
}

export async function deleteBlogPost(slug: string): Promise<{ success: boolean; error?: string }> {
  const posts = readPosts();
  const filtered = posts.filter((p) => p.slug !== slug);
  if (filtered.length === posts.length) return { success: false, error: 'Artikel tidak ditemukan.' };

  writePosts(filtered);
  revalidatePath('/blog');

  return { success: true };
}
