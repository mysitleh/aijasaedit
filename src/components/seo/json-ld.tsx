import { HARDCODED_SERVICES, SITE_CONFIG } from "@/data/site-config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-jasa-edit.replit.app";

export function LocalBusinessJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "AI Jasa Edit",
    alternateName: "Jasa Edit Foto Video AI Indonesia",
    description:
      "Layanan edit foto dan video berbasis kecerdasan buatan (AI) terbaik di Indonesia. Transformasi foto biasa menjadi karya seni menakjubkan dengan harga terjangkau dan hasil dalam 24 jam.",
    url: siteUrl,
    logo: `${siteUrl}/logo-icon.png`,
    image: `${siteUrl}/og-image.png`,
    telephone: `+${SITE_CONFIG.whatsapp.number}`,
    priceRange: "Rp 60.000 – Rp 100.000",
    currenciesAccepted: "IDR",
    paymentAccepted: "Bank Transfer, QRIS, GoPay, OVO, Dana",
    areaServed: {
      "@type": "Country",
      name: "Indonesia",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${SITE_CONFIG.whatsapp.number}`,
      contactType: "customer service",
      availableLanguage: "Indonesian",
      contactOption: "TollFree",
    },
    sameAs: [
      `https://wa.me/${SITE_CONFIG.whatsapp.number}`,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServicesJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": HARDCODED_SERVICES.filter((s) => s.price !== "Hubungi Kami").map((svc) => ({
      "@type": "Service",
      name: svc.title,
      description: svc.description,
      provider: {
        "@type": "LocalBusiness",
        name: "AI Jasa Edit",
        url: siteUrl,
      },
      areaServed: "Indonesia",
      offers: {
        "@type": "Offer",
        price: svc.price.replace(/[^0-9]/g, ""),
        priceCurrency: "IDR",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/#order`,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FaqJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  coverImage,
  datePublished,
  author,
}: {
  title: string;
  description: string;
  slug: string;
  coverImage: string;
  datePublished: string;
  author?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: coverImage.startsWith("http") ? coverImage : `${siteUrl}${coverImage}`,
    datePublished,
    dateModified: datePublished,
    author: {
      "@type": "Person",
      name: author || "Tim AI Jasa Edit",
    },
    publisher: {
      "@type": "Organization",
      name: "AI Jasa Edit",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo-icon.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, url }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: url.startsWith("http") ? url : `${siteUrl}${url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
