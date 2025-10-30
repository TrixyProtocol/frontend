export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Trixy Protocol",
  description: "Prediction market platform with generating yields.",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://app.trixy.fun",
  links: {
    github: "https://github.com/TrixyProtocol",
    x: "https://x.com/trixy_fun",
    mail: "mailto:support@trixy.fun",
  },
};
