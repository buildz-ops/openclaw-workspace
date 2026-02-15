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
    // 1. Store user message
    await ctx.db.insert("messages", {
      content: args.content,
      role: args.role,
      timestamp: Date.now(),
    });

    // 2. Simulate AI response (temporary until real agent integration)
    // In a real setup, this would trigger an external action or the agent would listen to this table
    if (args.role === "user") {
      // Simulate AI response
      const responses = [
        "Processing request...",
        "Acknowledged. Initiating sequence.",
        "System operating at nominal capacity.",
        "Understood.",
        "Command received.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // We can't use setTimeout with await inside easily in Convex mutation directly 
      // without blocking. But mutations run transactionally.
      // So we insert the reply immediately for now to show responsiveness.
      await ctx.db.insert("messages", {
        content: `[AUTO] ${randomResponse}`,
        role: "assistant",
        timestamp: Date.now() + 100, // slightly later
      });
    }
  },
});
