export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Trixy",
  description: "Prediction market platform with generating yields.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  links: {
    github: "https://github.com/TrixyProtocol",
    x: "https://x.com/trixy_fun",
  },
};
