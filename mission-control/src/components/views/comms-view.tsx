"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Building, Network } from "lucide-react";

export default function CommsView() {
  const [clients, setClients] = useState<any[]>([]);
  const [ecosystem, setEcosystem] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => setClients(data.clients || []));

    fetch("/api/ecosystem")
      .then((res) => res.json())
      .then((data) => setEcosystem(data.ecosystem || []));
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Users className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold">Clients</h2>
        </div>
        <div className="space-y-3">
          {clients.length === 0 ? (
            <p className="text-neutral-400">No clients yet</p>
          ) : (
            clients.map((client) => (
              <div key={client.id} className="p-3 rounded-2xl bg-white/5">
                <div className="font-medium">{client.name}</div>
                <div className="text-sm text-neutral-400">{client.status}</div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-3xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Network className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold">Ecosystem</h2>
        </div>
        <div className="space-y-3">
          {ecosystem.length === 0 ? (
            <p className="text-neutral-400">No ecosystem connections yet</p>
          ) : (
            ecosystem.map((item) => (
              <div key={item.id} className="p-3 rounded-2xl bg-white/5">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-neutral-400">{item.type}</div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
