import type { Metadata } from "next";
import "./globals.css";
import "@uploadthing/react/styles.css";
export const metadata: Metadata = {
  title: "เว็บรุ่น",
  description: "Generation website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
