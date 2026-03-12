import { Suspense } from "react";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import OrderForm from "@/components/landing/order-form";
import { LocalBusinessJsonLd, ServicesJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getServices, type Service } from "@/app/actions";
import { getSiteSettings } from "@/app/actions/settings";
import { type SiteSettings } from "@/types/settings";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoveRight, Sparkles, CheckCircle, ArrowRight, MessageCircle, Upload, Wand2, Send } from "lucide-react";
import { renderIcon } from "@/components/icons/icon-map";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aijasaedit.com";

export const metadata: Metadata = {
  title: "AI Jasa Edit - AI-Powered Photo & Video Editing Service",
  description:
    "Transform your photos and videos with the power of AI. Professional editing, affordable pricing, delivered within 24 hours. Serving clients worldwide.",
  keywords: [
    "ai photo editing", "ai video editing", "photo editing service",
    "ai image transformation", "professional photo editing", "ai portrait editing",
    "ai art from photo", "anime photo ai", "graduation photo ai",
    "custom ai editing service", "ai jasa edit",
  ],
  alternates: {
    canonical: `${siteUrl}/en`,
    languages: {
      "id": siteUrl,
      "en": `${siteUrl}/en`,
    },
  },
  openGraph: {
    title: "AI Jasa Edit - AI-Powered Photo & Video Editing",
    description: "Transform your ordinary photos into extraordinary works of art with AI magic. Affordable, fast, and stunning results.",
    url: `${siteUrl}/en`,
    siteName: "AI Jasa Edit",
    locale: "en_US",
    alternateLocale: ["id_ID"],
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Jasa Edit - AI Photo & Video Transformation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Jasa Edit - AI-Powered Photo & Video Editing",
    description: "Transform your ordinary photos into extraordinary works of art with AI magic.",
    images: ["/og-image.png"],
  },
};

const enServices = [
  { id: "e1", icon: "Camera", title: "Supercar Scene", description: "Place yourself in a viral 'stopped by police' scene with a luxury supercar of your choice.", image_placeholder: "/services/supercar.webp", ai_hint: "luxury car night", price: "$5" },
  { id: "e2", icon: "Video", title: "Future Career Video", description: "See your child as an astronaut, scientist, or any dream profession in a short cinematic video.", image_placeholder: "/services/astronaut.webp", ai_hint: "child scientist cinematic", price: "$7" },
  { id: "e3", icon: "GraduationCap", title: "AI Graduation Photo", description: "Missed your graduation photo? We'll create a professional and elegant one for you.", image_placeholder: "/services/wisuda.webp", ai_hint: "professional headshot", price: "$4" },
  { id: "e4", icon: "PawPrint", title: "Pet Cartoon Portrait", description: "Turn your beloved pet's photo into an adorable and charming cartoon character.", image_placeholder: "/services/cartoon-pet.webp", ai_hint: "animated dog character", price: "$4" },
  { id: "e5", icon: "Rocket", title: "Fantasy & Superhero Portrait", description: "Become a superhero, a fantasy world knight, or a space explorer in stunning AI art.", image_placeholder: "/services/superhero.webp", ai_hint: "man cinematic character", price: "$6" },
  { id: "e6", icon: "Sparkles", title: "Custom AI Edit", description: "Have another creative idea? Tell us, and our AI will bring it to life.", image_placeholder: "/services/custom-ai.webp", ai_hint: "glowing particles", price: "Contact Us" },
];

const steps = [
  { icon: MessageCircle, title: "Choose a Service", description: "Browse our AI editing styles and pick the one you love." },
  { icon: Upload, title: "Upload Your Photo", description: "Send us your photo through our order form or WhatsApp." },
  { icon: Wand2, title: "AI Magic Happens", description: "Our AI engine transforms your photo into a masterpiece." },
  { icon: Send, title: "Get Your Result", description: "Receive your stunning result within 24 hours, guaranteed." },
];

const faqs = [
  { q: "How long does it take to get the result?", a: "Most orders are completed within 24 hours. Rush orders can be delivered in as little as 6 hours." },
  { q: "What payment methods do you accept?", a: "We accept international payments via PayPal, credit/debit cards, and bank transfer for Indonesian customers." },
  { q: "Can I request revisions?", a: "Yes! We offer 1 free revision for every order. Additional revisions are available at a small fee." },
  { q: "What file formats will I receive?", a: "We deliver high-resolution files in PNG or MP4 format, ready for social media or printing." },
  { q: "Do you accept bulk orders?", a: "Absolutely! We offer special discounts for bulk orders of 10+ images. Contact us for a custom quote." },
];

export default async function EnglishPage() {
  const services: Service[] = await getServices();
  const settings: SiteSettings = await getSiteSettings();

  const displayServices = services.length > 0 
    ? services 
    : enServices;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LocalBusinessJsonLd />
      <ServicesJsonLd />
      <BreadcrumbJsonLd items={[{ name: "Home", url: "/en" }]} />

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full pt-10 pb-12 md:pt-16 md:pb-20 lg:py-28 xl:py-36 animate-fade-in-up">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_540px] gap-8 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-5 text-center lg:text-left">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary mx-auto lg:mx-0">
                    <Sparkles className="h-3 w-3" />
                    Powered by Generative AI
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none font-headline text-primary-foreground leading-tight">
                    Magical Transformation for Your{" "}
                    <span className="text-primary">Photos & Videos</span>
                  </h1>
                  <p className="max-w-[560px] text-muted-foreground text-base md:text-lg mx-auto lg:mx-0">
                    Unleash your wildest imagination with AI Jasa Edit. Turn ordinary photos into breathtaking works of art — all with the magic touch of AI.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Button asChild size="lg" className="h-12 px-6 text-base rounded-xl w-full sm:w-auto">
                    <Link href="#order">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Start Your Project
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base rounded-xl w-full sm:w-auto">
                    <Link href="#services">
                      View AI Styles
                      <MoveRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-6 pt-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">50+</p>
                    <p className="text-xs text-muted-foreground">AI Styles</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">24h</p>
                    <p className="text-xs text-muted-foreground">Delivery</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">100%</p>
                    <p className="text-xs text-muted-foreground">Satisfaction</p>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-sm mx-auto lg:max-w-none lg:order-last">
                <Image
                  src="/hero-image.webp"
                  alt="AI Transformation Hero Image"
                  width={540}
                  height={540}
                  priority
                  className="w-full aspect-square overflow-hidden rounded-2xl object-cover shadow-2xl shadow-primary/20 animate-slow-float"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="w-full py-12 md:py-20 lg:py-28 bg-background/80 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-10 md:mb-14">
              <div className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">
                Our Services
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-primary-foreground">
                Limitless Creativity with AI
              </h2>
              <p className="max-w-[700px] text-muted-foreground text-sm md:text-base lg:text-lg">
                We offer a wide range of unique photo and video editing services powered by cutting-edge AI technology.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {enServices.map((service) => (
                <Card key={service.id} className="group flex flex-col bg-card hover:bg-secondary/40 transition-all duration-300 border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 rounded-2xl overflow-hidden">
                  <div className="relative overflow-hidden">
                    <Image
                      src={service.image_placeholder}
                      alt={service.title}
                      width={400}
                      height={220}
                      className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border">
                        {renderIcon(service.icon, { className: "h-4 w-4 text-accent" })}
                      </div>
                      <span className="text-xs font-bold text-white bg-primary/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        {service.price}
                      </span>
                    </div>
                  </div>
                  <CardContent className="flex-1 flex flex-col p-4 md:p-5">
                    <h3 className="text-base font-semibold text-foreground mb-1.5 line-clamp-1">{service.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-12 md:py-20 lg:py-28 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-10 md:mb-14">
              <div className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">
                Simple Process
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-primary-foreground">
                How It Works
              </h2>
              <p className="max-w-[600px] text-muted-foreground text-sm md:text-base">
                From upload to final result — it only takes 4 easy steps.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div key={i} className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <span className="absolute top-3 right-3 text-xs font-bold text-primary/40">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-sm font-bold mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-20 lg:py-28 bg-background/80 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-10">
              <div className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">
                FAQ
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-primary-foreground">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-all">
                  <h3 className="text-sm font-bold mb-2 text-foreground">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Order / CTA Section */}
        <section id="order" className="w-full py-12 md:py-20 lg:py-28 bg-background/80 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-8 md:mb-12">
              <div className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">
                Get Started
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-primary">
                Order AI Jasa Edit Services
              </h2>
              <p className="max-w-[600px] text-muted-foreground text-sm md:text-base">
                Choose a service, fill in your details, upload your photo — then complete payment. Results delivered within 24 hours.
              </p>
            </div>
            <div className="mx-auto max-w-2xl">
              <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-muted/50" />}>
                <OrderForm services={services} settings={settings} />
              </Suspense>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-background/90 border-t safe-bottom">
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 mb-8">
            <div className="flex flex-col gap-3">
              <Link href="/en" className="flex items-center gap-2">
                <Image src="/icon-pwa.png" alt="AI Jasa Edit" width={24} height={24} className="rounded" />
                <span className="font-bold text-sm">AI Jasa Edit</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                Indonesia's leading AI-powered photo and video editing service. Bringing your creative vision to life.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-foreground">Navigation</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#services" className="hover:text-primary transition-colors">Services</a></li>
                <li><a href="#order" className="hover:text-primary transition-colors">Order Now</a></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="/affiliate" className="hover:text-primary transition-colors font-medium text-emerald-500/80">🎁 Affiliate Program</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">🇮🇩 Bahasa Indonesia</Link></li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-foreground">Contact Us</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>WhatsApp: <a href="tel:+628123456789" className="hover:text-primary transition-colors">+62 812-3456-7890</a></li>
                <li>Email: <a href="mailto:halo@aijasaedit.id" className="hover:text-primary transition-colors">halo@aijasaedit.id</a></li>
              </ul>
              <div className="flex items-center gap-1 mt-1">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">Response within 1 hour</span>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              &copy; {new Date().getFullYear()} AI Jasa Edit. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Made with <span className="text-primary">♥</span> and AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
