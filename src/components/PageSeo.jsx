import React from "react";
import { Helmet } from "react-helmet-async";
import {
  SITE_URL,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
} from "../seoConstants";

/**
 * Per-route title, description, canonical, and social tags.
 * Home uses index.html defaults until Helmet runs; keep those in sync with DEFAULT_* in seoConstants.
 */
export default function PageSeo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = "",
  noindex = false,
  ogImage = DEFAULT_OG_IMAGE,
  jsonLd,
}) {
  const canonical = path
    ? `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
    : SITE_URL;
  const robots = noindex ? "noindex, nofollow" : "index, follow";
  const jsonLdItems = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  const serializeJsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <Helmet htmlAttributes={{ lang: "en" }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={robots} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Basement Bike Mechanic" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLdItems.map((data, i) => (
        <script key={`jsonld-${i}`} type="application/ld+json">
          {serializeJsonLd(data)}
        </script>
      ))}
    </Helmet>
  );
}
