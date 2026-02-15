import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("messages").order("desc").take(100);
  },
});

export const send = mutation({
  args: {
    content: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      content: args.content,
      role: args.role,
      timestamp: Date.now(),
    });
  },
});
