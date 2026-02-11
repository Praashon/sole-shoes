"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import Stripe from "stripe";

export const createPaymentIntent = action({
  args: {
    amount: v.number(),
    currency: v.string(),
  },
  handler: async (ctx, args) => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }
    const stripe = new Stripe(key, {
      apiVersion: "2025-12-18.acacia" as any,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: args.amount,
      currency: args.currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    };
  },
});
