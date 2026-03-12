import type {Metadata} from 'next';
import { Poppins } from 'next/font/google'
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import CustomCursor from '@/components/ui/custom-cursor';
import { ThemeProvider } from '@/components/theme-provider';
import ScrollToTopButton from '@/components/landing/scroll-to-top-button';
import WhatsAppChat from '@/components/landing/whatsapp-chat';
import MobileBottomNav from '@/components/landing/mobile-bottom-nav';

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-poppins' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
    { media: "(prefers-color-scheme: light)", color: "#020617" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'AI Jasa Edit - Layanan Edit Foto & Video Berbasis AI',
  description: 'Ubah foto dan video Anda dengan kekuatan AI. Ciptakan visual yang memukau dengan mudah bersama AI Jasa Edit.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AI Jasa Edit",
  },
  openGraph: {
    title: 'AI Jasa Edit - Transformasi Foto & Video dengan AI',
    description: 'Wujudkan imajinasi Anda. Kami mengubah foto dan video biasa menjadi karya seni luar biasa dengan sentuhan keajaiban AI.',
    url: siteUrl,
    siteName: 'AI Jasa Edit',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Jasa Edit - Transformasi Ajaib untuk Foto & Video Anda',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Jasa Edit - Transformasi Foto & Video dengan AI',
    description: 'Wujudkan imajinasi Anda. Kami mengubah foto dan video biasa menjadi karya seni luar biasa dengan sentuhan keajaiban AI.',
    images: ['/og-image.png'],
  },
};



import { getSiteSettings } from "./actions/settings";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${poppins.variable} font-body antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
        >
            <CustomCursor />
            {children}
            <Toaster />
            <ScrollToTopButton />
            <WhatsAppChat whatsappNumber={settings.whatsappNumber} />
            <MobileBottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
