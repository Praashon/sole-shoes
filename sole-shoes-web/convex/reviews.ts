import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByProduct = query({
  args: { productId: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .order("desc")
      .collect();
  },
});

export const add = mutation({
  args: {
    productId: v.number(),
    userName: v.string(),
    userEmail: v.string(),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reviews", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
