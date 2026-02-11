import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    userId: v.id("users"),
    items: v.array(
      v.object({
        productId: v.string(),
        name: v.string(),
        quantity: v.number(),
        size: v.number(),
        price: v.number(),
      })
    ),
    total: v.number(),
    paymentIntentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Nepal VAT (13%)
    const VAT_RATE = 0.13;
    const subtotal = args.total / (1 + VAT_RATE);
    const vatAmount = args.total - subtotal;

    // Generate order number
    const date = new Date();
    const year = date.getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-NP-${year}-${randomSuffix}`;

    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      items: args.items,
      total: args.total,
      subtotal: subtotal,
      vat: vatAmount,
      orderNumber: orderNumber,
      status: "paid",
      paymentIntentId: args.paymentIntentId,
      createdAt: Date.now(),
    });
    return orderId;
  },
});

export const getByPaymentIntent = query({
  args: { paymentIntentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_payment_intent", (q) =>
        q.eq("paymentIntentId", args.paymentIntentId)
      )
      .first();
  },
});

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});
