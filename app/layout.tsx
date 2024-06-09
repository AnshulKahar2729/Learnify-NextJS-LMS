import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { cn } from "@/lib/utils";
import ToasterProvider from "@/components/providers/ToasterProvider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LMS PLATFORM",
  description: "Learning Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn("h-screen", inter.className)}>
          <ToasterProvider/>
          {children}
        </body>
      </html>
    </ClerkProvider>

  );
}
