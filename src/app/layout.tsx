import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WealthWise",
  description: "Personal finance tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
