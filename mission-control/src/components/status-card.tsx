"use client";

import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export default function StatusCard({ title, value, icon: Icon, trend, trendUp }: StatusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="glass rounded-3xl p-6 glass-hover cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-2xl bg-white/5">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${trendUp ? "text-green-400" : "text-red-400"}`}>
            {trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{trend}</span>
          </div>
        )}
      </div>
      <h3 className="text-sm text-neutral-400 mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  );
}
