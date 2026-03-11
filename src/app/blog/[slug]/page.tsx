import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogPost, getAllBlogPosts } from "@/lib/blog";
import { Clock, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import Logo from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-jasa-edit.replit.app";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  const ogImage = post.coverImage.startsWith("http")
    ? post.coverImage
    : `${siteUrl}${post.coverImage}`;
  return {
    title: `${post.title} — Blog AI Jasa Edit`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: ["Tim AI Jasa Edit"],
      url: `${siteUrl}/blog/${post.slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
  };
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;
  let tableRows: string[][] = [];
  let inTable = false;

  const flushTable = () => {
    if (tableRows.length > 0) {
      const [header, , ...body] = tableRows;
      elements.push(
        <div key={key++} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>{header.map((cell, i) => <th key={i} className="border border-border px-3 py-2 bg-secondary/50 text-left font-semibold">{cell}</th>)}</tr>
            </thead>
            <tbody>
              {body.map((row, i) => (
                <tr key={i} className="border-b border-border hover:bg-secondary/20">
                  {row.map((cell, j) => <td key={j} className="border border-border px-3 py-2">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
        : part
    );
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.startsWith("|")) {
      inTable = true;
      const cells = line.split("|").slice(1, -1).map((c) => c.trim());
      tableRows.push(cells);
      continue;
    }
    if (inTable) flushTable();

    if (!line) { elements.push(<div key={key++} className="my-2" />); continue; }
    if (line === "---") { elements.push(<hr key={key++} className="my-6 border-border" />); continue; }
    if (line.startsWith("## ")) {
      elements.push(<h2 key={key++} className="text-2xl font-bold font-headline mt-8 mb-3 text-primary-foreground">{line.slice(3)}</h2>);
      continue;
    }
    if (line.startsWith("### ")) {
      elements.push(<h3 key={key++} className="text-lg font-semibold mt-6 mb-2 text-foreground">{renderInline(line.slice(4))}</h3>);
      continue;
    }
    if (line.startsWith("- ✅ ") || line.startsWith("- ")) {
      const txt = line.startsWith("- ✅ ") ? line.slice(5) : line.slice(2);
      elements.push(
        <li key={key++} className="flex items-start gap-2 text-muted-foreground text-sm md:text-base ml-4 mb-1">
          <span className="mt-1 text-primary flex-shrink-0">{line.startsWith("- ✅") ? "✅" : "•"}</span>
          <span>{renderInline(txt)}</span>
        </li>
      );
      continue;
    }
    elements.push(<p key={key++} className="text-muted-foreground text-sm md:text-base leading-relaxed">{renderInline(line)}</p>);
  }
  if (inTable) flushTable();
  return elements;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const otherPosts = getAllBlogPosts().filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        slug={post.slug}
        coverImage={post.coverImage}
        datePublished={post.date}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
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

      <main className="container mx-auto px-4 md:px-6 py-10 md:py-16 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Blog
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/20">
              {post.category}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.readTime}
            </span>
            <span className="text-xs text-muted-foreground">{post.date}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary-foreground leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">{post.excerpt}</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden mb-10 aspect-video shadow-xl ring-1 ring-white/10">
          <Image src={post.coverImage} alt={post.title} fill sizes="100vw" className="object-cover" priority />
        </div>

        <article className="space-y-3 prose-custom">
          {renderContent(post.content)}
        </article>

        <div className="mt-12 p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center">
          <Sparkles className="w-6 h-6 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-bold font-headline mb-2">Siap Mencoba?</h3>
          <p className="text-sm text-muted-foreground mb-4">Wujudkan kreasi impian Anda bersama AI Jasa Edit. Harga mulai Rp 60.000, hasil dalam 24 jam.</p>
          <Button asChild>
            <Link href="/#order">
              <Sparkles className="mr-2 h-4 w-4" />
              Pesan Sekarang
            </Link>
          </Button>
        </div>

        {otherPosts.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold font-headline mb-6">Artikel Lainnya</h2>
            <div className="grid gap-4">
              {otherPosts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex gap-4 items-center p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary/30 transition-all">
                  <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image src={p.coverImage} alt={p.title} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{p.category}</span>
                    <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">{p.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.readTime} · {p.date}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t py-8 mt-16 text-center text-sm text-muted-foreground">
        <p>© 2025 AI Jasa Edit · <Link href="/" className="hover:text-foreground underline underline-offset-4">Kembali ke beranda</Link></p>
      </footer>
    </div>
  );
}
