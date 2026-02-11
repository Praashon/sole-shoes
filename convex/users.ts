import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { scrypt } from "@noble/hashes/scrypt.js";
import { randomBytes, bytesToHex, hexToBytes } from "@noble/hashes/utils.js";

// --- Password Hashing Utilities ---

const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, dkLen: 64 };

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(32);
  const derived = scrypt(new TextEncoder().encode(password), salt, SCRYPT_PARAMS);
  return `${bytesToHex(salt)}:${bytesToHex(derived)}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = hexToBytes(saltHex);
  const derived = scrypt(new TextEncoder().encode(password), salt, SCRYPT_PARAMS);
  return bytesToHex(derived) === hashHex;
}

// --- Mutations & Queries ---

export const signup = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check for existing user
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("User already exists");
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(args.password);

    const userId = await ctx.db.insert("users", {
      email: args.email,
      password: hashedPassword,
      name: args.name,
    });
    return userId;
  },
});

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Verify hashed password
    const isValid = await verifyPassword(args.password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    // Return user data WITHOUT the password field
    const { password: _, ...safeUser } = user;
    return safeUser;
  },
});

export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    firstName: v.string(),
    lastName: v.string(),
    dob: v.string(),
    age: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      firstName: args.firstName,
      lastName: args.lastName,
      dob: args.dob,
      age: args.age,
    });
  },
});

export const verifyEmail = mutation({
  args: {
    userId: v.id("users"),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Ownership check — caller must prove they own the account by matching email
    const user = await ctx.db.get(args.userId);
    if (!user || user.email !== args.email) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.userId, {
      emailVerified: true,
    });
  },
});

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    // Exclude password from query results
    const { password: _, ...safeUser } = user;
    return safeUser;
  },
});
