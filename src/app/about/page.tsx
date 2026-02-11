import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About — Sole Shoes",
  description:
    "We curate sneakers that balance design and function. Learn about Sole Shoes.",
  openGraph: {
    title: "About — Sole Shoes",
    description:
      "We curate sneakers that balance design and function. Learn about Sole Shoes.",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
