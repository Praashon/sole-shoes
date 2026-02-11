"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Use a placeholder URL if env var is missing to prevent build crash, 
// but it won't work at runtime without the real URL.
// The user should run `npx convex dev` to get the URL in .env.local
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-convex-url.convex.cloud");

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
