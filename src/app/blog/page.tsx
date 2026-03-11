import Link from "next/link";
import Image from "next/image";
import { getAllBlogPosts } from "@/lib/blog";
import { Clock, Tag, ArrowRight, Sparkles } from "lucide-react";
import Logo from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-jasa-edit.replit.app";

export const metadata = {
  title: "Blog — AI Jasa Edit",
  description: "Tips, tutorial, dan inspirasi seputar edit foto & video AI terbaru dari AI Jasa Edit.",
  openGraph: {
    title: "Blog — AI Jasa Edit",
    description: "Tips, tutorial, dan inspirasi seputar edit foto & video AI terbaru dari AI Jasa Edit.",
    url: `${siteUrl}/blog`,
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Blog", url: "/blog" },
        ]}
      />
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-6 w-auto" />
            <span className="sr-only">AI Jasa Edit</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">Home</Link>
            <Link href="/#gaya" className="text-sm font-medium hover:underline underline-offset-4">Gaya</Link>
            <Link href="/#services" className="text-sm font-medium hover:underline underline-offset-4">Layanan</Link>
            <Link href="/blog" className="text-sm font-medium text-primary underline underline-offset-4">Blog</Link>
          </nav>
          <Button asChild size="sm">
            <Link href="/#order">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Pesan Sekarang
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="mb-10 md:mb-14 text-center">
          <div className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary mb-4">
            Tips & Inspirasi
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary-foreground mb-3">Blog AI Jasa Edit</h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Update terbaru seputar gaya edit AI, tutorial, dan inspirasi kreatif untuk Anda.
          </p>
        </div>

        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group block mb-10 md:mb-14">
            <div className="rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 bg-card">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-video md:aspect-auto md:min-h-[280px]">
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/30 hidden md:block" />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/20">
                      {featured.category}
                    </span>
                    <span className="text-xs text-muted-foreground">Artikel Utama</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold font-headline text-foreground mb-3 group-hover:text-primary transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base mb-4 line-clamp-3">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime}</span>
                    <span>{featured.date}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-primary text-sm font-semibold">
                    Baca selengkapnya <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <div className="rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 bg-card h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-[1.05] transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-primary border border-primary/20">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-base md:text-lg font-headline mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{post.excerpt}</p>
                  <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t py-8 mt-16 text-center text-sm text-muted-foreground">
        <p>© 2025 AI Jasa Edit · <Link href="/" className="hover:text-foreground underline underline-offset-4">Kembali ke beranda</Link></p>
      </footer>
    </div>
  );
}
