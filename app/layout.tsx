import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bizsearch24 - Login & Register",
  description: "Log In to Bizsearch24 to manage your listings and profile.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-slate-800 antialiased`}>
        {children}
      </body>
    </html>
  );
}
