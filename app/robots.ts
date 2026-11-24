import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// The homepage and the plain pages may be indexed. Card and link pages, the
// private list, the review queue and the print sheets are for the people who
// hold them, not for search results.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/r/", "/reached", "/review", "/print/"],
    },
    host: SITE_URL,
  };
}
