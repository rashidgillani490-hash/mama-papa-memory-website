import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dreamy Memories | For Mama & Papa",
  description: "A little digital gift, made with love by your son.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
