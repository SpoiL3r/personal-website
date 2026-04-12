import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/layout/ThemeProvider";
import { LocaleProvider } from "@/lib/contexts/LocaleContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vaibhav Singh - Software Engineer",
  description:
    "Software engineer focused on backend systems, APIs, and reliable enterprise product infrastructure.",
  metadataBase: new URL("https://vaibhav-singh.in"),
  openGraph: {
    title: "Vaibhav Singh - Software Engineer",
    description:
      "Software engineer focused on backend systems, APIs, and reliable enterprise product infrastructure.",
    type: "website",
    url: "https://vaibhav-singh.in",
    siteName: "Vaibhav Singh",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaibhav Singh - Software Engineer",
    description:
      "Software engineer focused on backend systems, APIs, and reliable enterprise product infrastructure.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        suppressHydrationWarning
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {`try {
  const storedTheme = localStorage.getItem("theme");
  const theme = storedTheme === "light" ? "light" : "dark";
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
} catch {
  document.documentElement.classList.remove("light");
  document.documentElement.style.colorScheme = "dark";
}`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Vaibhav Singh",
              jobTitle: "Software Engineer",
              worksFor: { "@type": "Organization", name: "SAP Labs India" },
              url: "https://vaibhav-singh.in",
              sameAs: [
                "https://github.com/SpoiL3r",
                "https://linkedin.com/in/vaibhavcs",
              ],
            }),
          }}
        />
        <ThemeProvider>
          <LocaleProvider>
            <a href="#home" className="skip-to-content">Skip to content</a>
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
