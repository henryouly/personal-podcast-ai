import type { Metadata } from "next";
import { Providers } from "../components/Providers";
import "../index.css";

export const metadata: Metadata = {
  title: "Personal Broadcast System",
  description: "Turn your favorite RSS feeds into AI-narrated podcasts automatically.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
