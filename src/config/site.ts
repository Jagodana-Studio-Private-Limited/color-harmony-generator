export const siteConfig = {
  name: "Color Harmony Generator",
  title: "Color Harmony Generator — Free Color Scheme Builder",
  description:
    "Generate complementary, triadic, analogous, and other color harmony schemes from any base color. Preview swatches, copy hex/HSL/RGB values, and export as CSS variables or Tailwind config. 100% client-side.",
  url: "https://color-harmony-generator.tools.jagodana.com",
  ogImage: "/opengraph-image",

  headerIcon: "Palette",
  brandAccentColor: "#a855f7",

  keywords: [
    "color harmony generator",
    "color scheme generator",
    "complementary colors",
    "triadic color scheme",
    "analogous colors",
    "color wheel tool",
    "css color variables",
    "tailwind color config",
    "free color tool",
  ],
  applicationCategory: "DesignApplication",

  themeColor: "#ec4899",

  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: ["https://twitter.com/jagodana"],

  links: {
    github:
      "https://github.com/Jagodana-Studio-Private-Limited/color-harmony-generator",
    website: "https://jagodana.com",
  },

  footer: {
    about:
      "Free color harmony generator. Compute complementary, triadic, analogous, and other color schemes from any base color — no signup required.",
    featuresTitle: "Features",
    features: [
      "6 harmony types",
      "Hex, HSL, and RGB values",
      "Copy individual swatches",
      "Export as CSS variables",
      "Export as Tailwind config",
    ],
  },

  hero: {
    badge: "6 Harmony Types",
    titleLine1: "Color Harmony",
    titleGradient: "Generator",
    subtitle:
      "Pick any base color and instantly see complementary, triadic, analogous, split-complementary, tetradic, and monochromatic schemes. Copy hex values or export as CSS variables and Tailwind config.",
  },

  featureCards: [
    {
      icon: "🎨",
      title: "6 Harmony Types",
      description:
        "Complementary, triadic, analogous, split-complementary, tetradic, and monochromatic — all computed in real time.",
    },
    {
      icon: "📋",
      title: "Copy Any Format",
      description:
        "Click any swatch to copy its hex, HSL, or RGB value. Export the full scheme as CSS variables or Tailwind config.",
    },
    {
      icon: "⚡",
      title: "100% Client-Side",
      description:
        "All color math runs in your browser. No server, no uploads, no account needed.",
    },
  ],

  relatedTools: [
    {
      name: "Color Contrast Checker",
      url: "https://color-contrast-checker.tools.jagodana.com",
      icon: "🔍",
      description: "Check WCAG contrast ratios for accessibility.",
    },
    {
      name: "Color Format Converter",
      url: "https://color-format-converter.tools.jagodana.com",
      icon: "🔄",
      description: "Convert between hex, HSL, RGB, and more.",
    },
    {
      name: "Tailwind Shades Generator",
      url: "https://tailwind-shades-generator.tools.jagodana.com",
      icon: "🌈",
      description: "Generate a full 50–950 Tailwind color scale.",
    },
    {
      name: "CSS Gradient Generator",
      url: "https://css-gradient-generator.tools.jagodana.com",
      icon: "🎭",
      description: "Build beautiful CSS gradients visually.",
    },
    {
      name: "Color Blindness Simulator",
      url: "https://color-blindness-simulator.tools.jagodana.com",
      icon: "👁️",
      description: "Preview how your palette looks to color-blind users.",
    },
    {
      name: "Tailwind Color Finder",
      url: "https://tailwind-color-finder.tools.jagodana.com",
      icon: "🎯",
      description: "Find the closest Tailwind color to any hex value.",
    },
  ],

  howToSteps: [
    {
      name: "Pick a base color",
      text: "Use the color picker or type any hex value to set your starting color.",
      url: "",
    },
    {
      name: "Browse harmony schemes",
      text: "Instantly see 6 color harmony types computed from your base color.",
      url: "",
    },
    {
      name: "Copy or export",
      text: "Click any swatch to copy its value, or export the full scheme as CSS custom properties or a Tailwind config object.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  faq: [
    {
      question: "What is color harmony?",
      answer:
        "Color harmony refers to combinations of colors that are visually pleasing together, based on their positions on the color wheel. Common types include complementary (opposite colors), triadic (three equally spaced colors), analogous (adjacent colors), and tetradic (four colors forming a rectangle). Using harmonious colors creates visual balance in design.",
    },
    {
      question: "What is a complementary color?",
      answer:
        "A complementary color is the color directly opposite a given color on the color wheel — exactly 180 degrees away in hue. The complement of blue is orange, and red's complement is cyan. Complementary pairs create maximum contrast, making them ideal for highlighting elements in a design.",
    },
    {
      question: "What is the difference between triadic and tetradic color schemes?",
      answer:
        "A triadic scheme uses three colors equally spaced 120 degrees apart on the color wheel, creating vibrant, balanced contrast. A tetradic (square) scheme uses four colors arranged as two complementary pairs, 90 degrees apart. Tetradic schemes offer more variety but need careful balance to avoid visual overload.",
    },
    {
      question: "How do I use the exported CSS variables?",
      answer:
        "Click Export CSS to get a :root block with named CSS custom properties for each color. Paste it into your stylesheet and reference colors with var(--harmony-1), var(--harmony-2), etc. The Tailwind export gives a colors object you can paste directly into your tailwind.config.js extend section.",
    },
  ],

  pages: {
    "/": {
      title: "Color Harmony Generator — Free Color Scheme Builder",
      description:
        "Generate complementary, triadic, analogous, and other color harmony schemes from any base color. Export as CSS variables or Tailwind config. 100% client-side.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
