import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/layout/ThemeProvider";
import TrophyHUD from "@/components/trophy/TrophyHUD";
import PlatinumCelebration from "@/components/trophy/PlatinumCelebration";
import ProfileStatus from "@/components/layout/ProfileStatus";
import VisitorFlags from "@/components/layout/VisitorFlags";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { LocaleProvider } from "@/lib/contexts/LocaleContext";
import { TrophyProvider } from "@/lib/contexts/TrophyContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-signature",
  subsets: ["latin"],
  weight: ["700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Vaibhav Singh · Software Engineer",
  description:
    "Software Engineer with 6+ years building distributed systems and cloud-native applications. Currently at SAP Labs India.",
  metadataBase: new URL("https://vaibhav-singh.in"),
  openGraph: {
    title: "Vaibhav Singh · Software Engineer",
    description:
      "Software Engineer with 6+ years building distributed systems and cloud-native applications. Currently at SAP Labs India.",
    type: "website",
    url: "https://vaibhav-singh.in",
    siteName: "Vaibhav Singh",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Vaibhav Singh · Software Engineer",
    description:
      "Software Engineer with 6+ years building distributed systems and cloud-native applications. Currently at SAP Labs India.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${instrumentSerif.variable}`}
    >
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ThemeProvider>
          <TrophyProvider>
            <LocaleProvider>
              <Navbar />
              {/* Profile + status — fixed overlay, top-left (Teams-style) */}
              <ProfileStatus />
              {/* Trophy HUD — fixed overlay, offset below the navbar */}
               <div className="trophy-hud-wrap" style={{ position: "fixed", top: "68px", right: "16px", zIndex: 40 }}>
                 <TrophyHUD />
               </div>
              <main style={{ flex: 1 }}>{children}</main>
              <Footer />
              <ErrorBoundary>
                <VisitorFlags />
              </ErrorBoundary>
              <PlatinumCelebration />
            </LocaleProvider>
          </TrophyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


