import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "@/components/ui/toaster";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "StudyHub",
  description:
    "Empowering Learning Together, StudyHub is a platform that connects students to share knowledge and resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-screen">
      <body className={inter.className + " bg-accent h-full text-foreground"}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
