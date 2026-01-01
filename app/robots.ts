import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://mealplanners.vercel.app/"; // Replace with actual domain

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/today",
        "/week",
        "/month",
        "/grocery",
        "/calendar",
        "/settings",
        "/meals",
        "/dashboard",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
