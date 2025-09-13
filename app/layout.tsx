import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ChatGPT Daily Use Cases – Interactive Deck",
  description: "Persona-based interactive presentation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
