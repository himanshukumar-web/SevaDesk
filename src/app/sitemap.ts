import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://sevadesk.in";

  const services = await prisma.service.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  const serviceRoutes = services.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticRoutes = [
    "",
    "/services",
    "/type-document",
    "/cyber-cafes",
    "/pricing",
    "/faq",
    "/privacy",
    "/terms",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
