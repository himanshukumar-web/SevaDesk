import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { SevaAssistant } from "@/components/assistant/SevaAssistant";
import { getCurrentUser } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "SevaDesk | Government Documents, Made Simple",
  description:
    "Understand Indian government documents and citizen services, generate standardized application forms, and connect with verified local Cyber Café operators.",
  keywords: [
    "Government Documents India",
    "Income Certificate Application",
    "Domicile Certificate",
    "Cyber Cafe Near Me",
    "CSC Digital Seva Kendra",
    "PAN Card",
    "Driving Licence Sarathi",
    "Application Letter Hindi English",
  ],
  authors: [{ name: "SevaDesk Digital Public Service" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  const initialUser = currentUser
    ? {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        role: currentUser.role as "USER" | "CYBER_CAFE" | "SUPER_ADMIN",
        phone: currentUser.phone,
        state: currentUser.state,
        district: currentUser.district,
        city: currentUser.city,
        pincode: currentUser.pincode,
        isVerified: currentUser.isVerified,
        cyberCafe: currentUser.cyberCafe
          ? {
              id: currentUser.cyberCafe.id,
              shopName: currentUser.cyberCafe.shopName,
              verificationStatus: currentUser.cyberCafe.verificationStatus,
              isAvailable: currentUser.cyberCafe.isAvailable,
              rating: currentUser.cyberCafe.rating,
            }
          : null,
        subscriptions: currentUser.subscriptions.map((s) => ({
          plan: s.plan,
          status: s.status,
        })),
      }
    : null;

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem("sevadesk_theme");
                if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans">
        <ThemeProvider>
          <AuthProvider initialUser={initialUser}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <SevaAssistant />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );

}

