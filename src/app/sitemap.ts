import { MetadataRoute } from "next";
import { SPECIALTIES_STATIC } from "@/lib/api";

const SITE_URL = "https://medicoshub.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const specialtyUrls = SPECIALTIES_STATIC.map((sp) => ({
    url: `${SITE_URL}/${sp.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    { url: SITE_URL,                      lastModified: new Date(), changeFrequency: "daily",  priority: 1.0 },
    { url: `${SITE_URL}/newsletter`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ...specialtyUrls,
  ];
}
