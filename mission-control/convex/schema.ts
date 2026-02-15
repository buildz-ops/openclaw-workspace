import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    priority: v.string(),
    category: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  }),

  contacts: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    type: v.string(), // client, partner, etc.
    status: v.string(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }),

  observations: defineTable({
    content: v.string(),
    category: v.optional(v.string()),
    timestamp: v.number(),
  }),

  memories: defineTable({
    content: v.string(),
    context: v.optional(v.string()),
    importance: v.number(),
    timestamp: v.number(),
  }),

  contentItems: defineTable({
    title: v.string(),
    content: v.string(),
    status: v.string(), // idea, draft, scheduled, published
    platform: v.optional(v.string()),
    scheduledFor: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
  }),
});
