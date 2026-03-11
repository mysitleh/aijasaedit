'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBlogPosts, updateBlogPost } from '../actions';
import type { BlogPost } from '@/lib/blog-storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Save, ArrowLeft, Loader2, Eye } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['Tren', 'Tutorial', 'Bisnis', 'Inspirasi', 'Update'];

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getBlogPosts().then((posts) => {
      const found = posts.find((p) => p.slug === slug);
      setPost(found ?? null);
      setLoading(false);
    });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateBlogPost(slug, formData);
    if (result.success) {
      toast({ title: 'Sukses', description: 'Artikel berhasil diperbarui.' });
      router.push('/admin/blog');
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );

  if (!post) return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="text-muted-foreground">Artikel tidak ditemukan.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/admin/blog"><ArrowLeft className="mr-2 h-4 w-4" />Kembali</Link>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/blog"><ArrowLeft className="mr-2 h-4 w-4" />Kembali ke Daftar Blog</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/blog/${slug}`} target="_blank"><Eye className="mr-2 h-4 w-4" />Lihat Artikel</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Artikel</CardTitle>
          <CardDescription>Perbarui konten artikel, lalu klik Simpan Perubahan.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="title">Judul *</Label>
                <Input id="title" name="title" defaultValue={post.title} required disabled={submitting} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="category">Kategori *</Label>
                <select name="category" id="category" required disabled={submitting}
                  defaultValue={post.category}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="excerpt">Ringkasan *</Label>
              <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={post.excerpt} required disabled={submitting} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="coverImage">URL Gambar Cover</Label>
                <Input id="coverImage" name="coverImage" defaultValue={post.coverImage} disabled={submitting} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="readTime">Estimasi Baca</Label>
                <Input id="readTime" name="readTime" defaultValue={post.readTime} disabled={submitting} />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="content">Isi Artikel * (Markdown)</Label>
              <Textarea id="content" name="content" rows={18} defaultValue={post.content} required disabled={submitting}
                className="font-mono text-sm" />
              <p className="text-xs text-muted-foreground">## judul · ### sub-judul · - list · **tebal** · --- pemisah</p>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/blog')} disabled={submitting}>Batal</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : <><Save className="mr-2 h-4 w-4" />Simpan Perubahan</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
