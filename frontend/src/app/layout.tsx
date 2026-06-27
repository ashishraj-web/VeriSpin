import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "VeriSpin — Provably Fair On-Chain Lottery";
const description =
  "A decentralized lottery dApp powered by Chainlink VRF V2.5 on Ethereum Sepolia. Every winner is selected by verifiable, tamper-proof randomness — no operator, no house, no manipulation.";

export const metadata: Metadata = {
  metadataBase: new URL("https://verispin.vercel.app"),
  title,
  description,
  keywords: [
    "VeriSpin",
    "Chainlink VRF",
    "smart contract lottery",
    "Ethereum",
    "Sepolia",
    "web3",
    "dApp",
    "Next.js",
    "ethers.js",
    "provably fair",
  ],
  authors: [{ name: "VeriSpin" }],
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "VeriSpin",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
