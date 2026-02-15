"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/nav";
import CommsView from "@/components/views/comms-view";

export default function CommsPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <Navigation />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-8"
      >
        <h1 className="text-3xl font-bold mb-6 text-gradient">Communications</h1>
        <CommsView />
      </motion.main>
    </div>
  );
}
