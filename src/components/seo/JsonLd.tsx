type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Sole Shoes",
        description:
          "Curated collection of premium sneakers from Nike, Adidas, and New Balance.",
        url: "https://soleshoes.com",
        logo: "https://soleshoes.com/favicon.ico",
      }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  currency = "NPR",
  ratingValue,
  reviewCount,
}: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  ratingValue?: number;
  reviewCount?: number;
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
    },
  };

  if (ratingValue && reviewCount) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
    };
  }

  return <JsonLd data={data} />;
}
