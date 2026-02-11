import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact — Sole Shoes",
  description:
    "Get in touch with Sole Shoes. We're here to help with orders, returns, and questions.",
  openGraph: {
    title: "Contact — Sole Shoes",
    description:
      "Get in touch with Sole Shoes. We're here to help with orders, returns, and questions.",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
