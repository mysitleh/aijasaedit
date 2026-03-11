'use client';

import { useState, useEffect, useRef } from 'react';
import { getBlogPosts, createBlogPost, deleteBlogPost } from './actions';
import type { BlogPost } from '@/lib/blog-storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Pencil, Loader2, ExternalLink, Eye } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['Tren', 'Tutorial', 'Bisnis', 'Inspirasi', 'Update'];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      setPosts(await getBlogPosts());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCreate = async (formData: FormData) => {
    setSubmitting(true);
    const result = await createBlogPost(formData);
    if (result.success) {
      toast({ title: 'Sukses', description: 'Artikel berhasil dibuat.' });
      formRef.current?.reset();
      setShowForm(false);
      await fetchPosts();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setSubmitting(false);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Yakin ingin menghapus artikel ini?')) return;
    setDeletingSlug(slug);
    const result = await deleteBlogPost(slug);
    if (result.success) {
      toast({ title: 'Sukses', description: 'Artikel berhasil dihapus.' });
      await fetchPosts();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setDeletingSlug(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Kelola Blog</h2>
          <p className="text-muted-foreground text-sm">{posts.length} artikel tersimpan</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {showForm ? 'Batal' : 'Tulis Artikel Baru'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Artikel Baru</CardTitle>
            <CardDescription>Isi semua field di bawah ini lalu klik Simpan.</CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="title">Judul *</Label>
                  <Input id="title" name="title" placeholder="Judul artikel..." required disabled={submitting} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="category">Kategori *</Label>
                  <select name="category" id="category" required disabled={submitting}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Pilih kategori</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="excerpt">Ringkasan *</Label>
                <Textarea id="excerpt" name="excerpt" rows={2} placeholder="Ringkasan singkat artikel (tampil di listing blog)..." required disabled={submitting} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="coverImage">URL Gambar Cover</Label>
                  <Input id="coverImage" name="coverImage" placeholder="/blog/nama-gambar.png" disabled={submitting} />
                  <p className="text-xs text-muted-foreground">Kosongkan untuk pakai gambar default</p>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="readTime">Estimasi Baca</Label>
                  <Input id="readTime" name="readTime" placeholder="5 menit" disabled={submitting} />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="content">Isi Artikel * (Markdown)</Label>
                <Textarea id="content" name="content" rows={12}
                  placeholder={"## Judul Bagian\n\nIsi paragraf di sini...\n\n### Sub Judul\n\n- Poin pertama\n- Poin kedua\n\n---\n\n## Bagian Selanjutnya"}
                  required disabled={submitting}
                  className="font-mono text-sm" />
                <p className="text-xs text-muted-foreground">Gunakan ## untuk judul, ### untuk sub-judul, - untuk list, **teks** untuk tebal, --- untuk garis pemisah</p>
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={submitting}>Batal</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : <><PlusCircle className="mr-2 h-4 w-4" />Simpan Artikel</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Daftar Artikel</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Belum ada artikel. Klik "Tulis Artikel Baru" untuk mulai.</p>
          ) : (
            <div className="divide-y divide-border">
              {posts.map((post) => (
                <div key={post.slug} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <img src={post.coverImage} alt={post.title} className="w-16 h-12 object-cover rounded-lg flex-shrink-0 hidden sm:block" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">{post.date} · {post.readTime}</span>
                    </div>
                    <p className="font-semibold text-sm line-clamp-1">{post.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Button variant="outline" size="icon" asChild title="Lihat artikel">
                      <Link href={`/blog/${post.slug}`} target="_blank"><Eye className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild title="Edit artikel">
                      <Link href={`/admin/blog/${post.slug}`}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="destructive" size="icon" title="Hapus artikel"
                      onClick={() => handleDelete(post.slug)}
                      disabled={deletingSlug === post.slug}>
                      {deletingSlug === post.slug ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
