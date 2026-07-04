import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solstice — Hand-Poured Candles",
  description: "Small-batch candles poured by hand. Join the waitlist for early access to our first collection, shipping this winter.",
  openGraph: {
    title: "Solstice — Hand-Poured Candles",
    url: "https://solstice.cc",
    siteName: "Solstice Candle Studio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://zkvkbpxrxnfynqqeytke.supabase.co/storage/v1/object/public/marketing-assets/solstice/cleo/1783194822827-hero.png",
        width: 1200,
        height: 630,
        alt: "Solstice — a matte ceramic candle vessel on linen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
