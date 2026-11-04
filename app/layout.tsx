import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shuvo AI Studio - AI Image to Video",
  description:
    "Turn your images into cinematic AI videos with Shuvo AI Studio.",
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
