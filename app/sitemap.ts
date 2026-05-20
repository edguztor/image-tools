import { MetadataRoute } from "next";

const base = "https://image-tools-lyart.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = ["comprimir", "convertir", "webp", "heic", "redimensionar", "recortar", "rotar", "marca-agua"];
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...tools.map(t => ({
      url: `${base}/${t}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
