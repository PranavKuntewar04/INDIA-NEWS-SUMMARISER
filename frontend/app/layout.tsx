import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "India News Briefing — AI-Curated News Summaries",
  description:
    "High-signal, low-noise briefings on the critical developments shaping India today. Summarized by AI, verifiable via source links.",
  keywords: [
    "India news",
    "AI summary",
    "news briefing",
    "India today",
    "AI curated",
  ],
  openGraph: {
    title: "India News Briefing",
    description:
      "AI-curated synthesis of the most important Indian news, updated every hour.",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "India News Briefing — AI-Curated Summaries",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "India News Briefing",
    description:
      "AI-curated synthesis of the most important Indian news, updated every hour.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased min-h-screen flex flex-col transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
