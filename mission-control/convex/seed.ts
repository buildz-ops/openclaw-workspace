import { mutation } from "./_generated/server";

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // Seed sample tasks
    await ctx.db.insert("tasks", {
      title: "Build Mission Control Dashboard",
      description: "Create a JARVIS-style dashboard for AI agent monitoring",
      status: "in-progress",
      priority: "high",
      category: "development",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await ctx.db.insert("tasks", {
      title: "Review daily memory logs",
      description: "Check and organize daily memory files",
      status: "pending",
      priority: "medium",
      category: "maintenance",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Seed sample contacts
    await ctx.db.insert("contacts", {
      name: "Sample Client",
      email: "client@example.com",
      type: "client",
      status: "active",
      notes: "Initial contact",
      createdAt: Date.now(),
    });

    // Seed sample observations
    await ctx.db.insert("observations", {
      content: "System initialized successfully",
      category: "system",
      timestamp: Date.now(),
    });

    // Seed sample memories
    await ctx.db.insert("memories", {
      content: "Mission Control dashboard project started",
      context: "development",
      importance: 8,
      timestamp: Date.now(),
    });

    // Seed sample content
    await ctx.db.insert("contentItems", {
      title: "Introduction to AI Agents",
      content: "Draft content about AI agents...",
      status: "draft",
      platform: "blog",
      createdAt: Date.now(),
    });

    return { success: true, message: "Database seeded successfully" };
  },
});
