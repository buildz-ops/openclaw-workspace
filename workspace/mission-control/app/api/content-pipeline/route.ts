import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    toReview: 18,
    inProgress: 7,
    published: 42,
    scheduled: 12,
    items: [
      { title: "Q1 Marketing Strategy", status: "review", assignee: "Sarah" },
      { title: "Product Launch Blog", status: "draft", assignee: "Mike" },
      { title: "Customer Case Study", status: "review", assignee: "Emma" },
      { title: "Technical Documentation", status: "in-progress", assignee: "Alex" },
    ],
  });
}
