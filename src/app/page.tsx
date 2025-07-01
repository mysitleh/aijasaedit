import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import Services from "@/components/landing/services";
import HowItWorks from "@/components/landing/how-it-works";
import Showcase from "@/components/landing/showcase";
import OrderForm from "@/components/landing/order-form";
import Footer from "@/components/landing/footer";
import { getServices, type Service } from "./actions";

export default async function Home() {
  const services: Service[] = await getServices();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services services={services} />
        <HowItWorks services={services} />
        <Showcase />
        <section id="order" className="w-full py-12 md:py-24 lg:py-32 bg-background/80 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-primary">Pesan Layanan AI Jasa Edit</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Isi formulir di bawah ini untuk memulai transformasi foto atau video Anda bersama AI Jasa Edit.
              </p>
            </div>
            <div className="mx-auto max-w-2xl mt-8">
              <OrderForm services={services} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
