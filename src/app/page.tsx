import { Suspense } from "react";
import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import StyleGallery from "@/components/landing/style-gallery";
import Services from "@/components/landing/services";
import HowItWorks from "@/components/landing/how-it-works";
import Showcase from "@/components/landing/showcase";
import FaqSection from "@/components/landing/faq-section";
import OrderForm from "@/components/landing/order-form";
import Footer from "@/components/landing/footer";
import { LocalBusinessJsonLd, ServicesJsonLd } from "@/components/seo/json-ld";
import { getServices, type Service } from "./actions";
import { getSiteSettings } from "./actions/settings";
import { type SiteSettings, DEFAULT_SETTINGS } from "@/types/settings";

export default async function Home() {
  const services: Service[] = await getServices();
  const settings: SiteSettings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LocalBusinessJsonLd />
      <ServicesJsonLd />
      <Header />
      <main className="flex-1">
        <Hero />
        <StyleGallery />
        <Services services={services} />
        <HowItWorks services={services} />
        <Showcase />
        <FaqSection />
        <section id="order" className="w-full py-12 md:py-20 lg:py-28 bg-background/80 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-8 md:mb-12">
              <div className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">
                Mulai Sekarang
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-primary">
                Pesan Layanan AI Jasa Edit
              </h2>
              <p className="max-w-[600px] text-muted-foreground text-sm md:text-base">
                Pilih layanan, isi data diri, unggah foto — lalu selesaikan pembayaran. Hasil dikirim dalam 1×24 jam.
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
      <Footer />
    </div>
  );
}
