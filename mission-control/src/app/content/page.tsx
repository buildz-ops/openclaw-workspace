"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/nav";
import ContentView from "@/components/views/content-view";

export default function ContentPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <Navigation />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-8"
      >
        <h1 className="text-3xl font-bold mb-6 text-gradient">Content</h1>
        <ContentView />
      </motion.main>
    </div>
  );
}
