import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    password: v.string(), // In a real app, use Auth provider (Clerk/Auth0)
    name: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    dob: v.optional(v.string()), // Format: YYYY-MM-DD
    age: v.optional(v.number()),
    emailVerified: v.optional(v.boolean()),
  }).index("by_email", ["email"]),

  products: defineTable({
    name: v.string(),
    price: v.number(),
    category: v.string(),
    imageUrl: v.string(),
    description: v.string(),
    brand: v.string(),
    isNew: v.optional(v.boolean()),
    isSale: v.optional(v.boolean()),
    originalPrice: v.optional(v.number()),
    rating: v.number(),
    reviews: v.number(),
    sizes: v.array(v.number()),
    images: v.array(v.string()),
  }),

  orders: defineTable({
    userId: v.id("users"),
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        quantity: v.number(),
        size: v.number(),
        price: v.number(),
      })
    ),
    total: v.number(),
    subtotal: v.optional(v.number()),
    vat: v.optional(v.number()),
    orderNumber: v.optional(v.string()),
    status: v.string(), // "pending", "paid", "shipped"
    paymentIntentId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]).index("by_payment_intent", ["paymentIntentId"]),

  reviews: defineTable({
    productId: v.number(),
    userName: v.string(),
    userEmail: v.string(),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.number(),
  }).index("by_product", ["productId"]),
});
