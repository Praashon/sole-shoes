import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Hardcoded data for seeding (from lib/data.ts)
const seedData = [
  {
    name: "Nike Air Max 90",
    price: 120,
    category: "Running",
    imageUrl: "/nike_air_max_90_1770615356029.png",
    description: "Nothing as fly, nothing as comfortable, nothing as proven. The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle sole, stitched overlays and classic TPU accents. Clean colors and fresh materials give a modern look while Max Air cushioning adds comfort to your journey.",
    isNew: true,
    brand: "Nike",
    rating: 4.8,
    reviews: 124,
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    images: [
        "/nike_air_max_90_1770615356029.png",
        "/nike_air_max_90_1770615356029.png", 
        "/nike_air_max_90_1770615356029.png"
    ]
  },
  {
    name: "Adidas Ultraboost",
    price: 180,
    category: "Running",
    imageUrl: "/adidas_ultraboost_1770615371314.png",
    description: "Experience the ultimate energy return with Adidas Ultraboost. Designed for runners who demand comfort and performance.",
    brand: "Adidas",
    isSale: true,
    originalPrice: 220,
    rating: 4.7,
    reviews: 89,
    sizes: [7, 8, 9, 10, 11],
    images: [
        "/adidas_ultraboost_1770615371314.png",
        "/adidas_ultraboost_1770615371314.png", 
        "/adidas_ultraboost_1770615371314.png"
    ]
  },
  {
    name: "New Balance 550",
    price: 110,
    category: "Lifestyle",
    imageUrl: "/new_balance_550_1770615386976.png",
    description: "Simple, clean, and classic. The New Balance 550 is a tribute to the 90s pro ballers and the streetwear generation that defined a hoops era.",
    brand: "New Balance",
    rating: 4.9,
    reviews: 210,
    sizes: [6, 7, 8, 9, 10, 11, 12],
    images: [
        "/new_balance_550_1770615386976.png",
        "/new_balance_550_1770615386976.png", 
        "/new_balance_550_1770615386976.png"
    ]
  },
  {
    name: "Nike Dunk Low",
    price: 100,
    category: "Lifestyle",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuQ-S4T5U6V7W8X9Y0Z1a2b3c4d5e6f7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T",
    brand: "Nike",
    description: "Created for the hardwood but taken to the streets, the Nike Dunk Low returns with crisp sheen overlays and original team colors.",
    rating: 4.6,
    reviews: 156,
    sizes: [7, 8, 9, 10, 11],
     images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuQ-S4T5U6V7W8X9Y0Z1a2b3c4d5e6f7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T"
    ]
  },
  {
    name: "Adidas Yeezy Boost",
    price: 250,
    category: "Lifestyle",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuR-U7V8W9X0Y1Z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T",
    brand: "Adidas",
    isNew: true,
    description: "The YEEZY BOOST features an upper composed of re-engineered primeknit.",
    rating: 4.5,
    reviews: 50,
     sizes: [8, 9, 10, 11, 12],
    images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuR-U7V8W9X0Y1Z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T"
    ]
  },
   {
    name: "New Balance 990v5",
    price: 175,
    category: "Running",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuS-W9Y0X1Z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V",
    brand: "New Balance",
     description: "The 990v5 restores the great performance and iconic style of the 990's 30-year legacy.",
      rating: 4.8,
    reviews: 300,
     sizes: [7, 8, 9, 10, 11],
     images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuS-W9Y0X1Z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V"
     ]
  },
];

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getById = query({
    args: { id: v.string() }, // Accept string ID for URL compatibility
    handler: async (ctx, args) => {
        // We need to query by ID here. Since Convex IDs are weird, we might need to handle this.
        // For simplicity, we are assuming the ID passed is a Convex ID.
        // However, in our frontend, we might be using numeric IDs from legacy data.
        // The seed data will create new Convex IDs.
        // This means we need to find a way to map old routes to new IDs or update all routes.
        // Let's assume we update routes to use Convex IDs.
        try {
            return await ctx.db.get(args.id as any);
        } catch (e) {
            return null;
        }
    }
});

export const seed = mutation({
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    if (products.length > 0) return; // already seeded

    for (const product of seedData) {
      await ctx.db.insert("products", product);
    }
  },
});
