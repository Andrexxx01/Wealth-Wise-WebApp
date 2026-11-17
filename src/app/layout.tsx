import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "WealthWise",
  description: "Personal finance tracker",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieTheme = (await cookies()).get("wealthwise-theme")?.value;
  const theme = cookieTheme === "DARK" || cookieTheme === "SYSTEM" ? cookieTheme : "LIGHT";

  return (
    <html lang="en" className={theme === "DARK" ? "dark" : undefined}
      data-theme={theme} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (() => {
            const root = document.documentElement;
            const dark = root.dataset.theme === "DARK" ||
              (root.dataset.theme === "SYSTEM" && window.matchMedia("(prefers-color-scheme: dark)").matches);
            root.classList.toggle("dark", dark);
            root.style.colorScheme = dark ? "dark" : "light";
          })();
        ` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
