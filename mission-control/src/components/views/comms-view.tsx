"use client";

import { useEffect, useState } from "react";
import MissionPageHeader from "@/components/mission/mission-page-header";
import MissionPanel from "@/components/mission/mission-panel";
import MissionPill from "@/components/mission/mission-pill";
import { fetchMission } from "@/lib/fetch-mission";
import { CommsItem } from "@/lib/types/mission";

export default function CommsView() {
  const [clients, setClients] = useState<CommsItem[]>([]);
  const [ecosystem, setEcosystem] = useState<CommsItem[]>([]);

  useEffect(() => {
    Promise.all([
      fetchMission<{ clients: CommsItem[] }>("/api/clients"),
      fetchMission<{ ecosystem: CommsItem[] }>("/api/ecosystem"),
    ])
      .then(([clientsRes, ecosystemRes]) => {
        setClients(clientsRes.data.clients);
        setEcosystem(ecosystemRes.data.ecosystem);
      })
      .catch(() => {
        setClients([]);
        setEcosystem([]);
      });
  }, []);

  return (
    <div className="mc-stack mc-route-layout">
      <MissionPageHeader title="Comms" subtitle="Client and ecosystem relationship map" />

      <div className="mc-grid-2 mc-fill-grid">
        <MissionPanel className="mc-route-panel" title="Clients" subtitle="notes/areas/clients.md">
          <div className="mc-list mc-scroll-area">
            {clients.map((client) => (
              <article key={client.id} className="mc-list-item">
                <div className="mc-row">
                  <p className="mc-list-title">{client.name}</p>
                  <MissionPill tone="info">{client.status}</MissionPill>
                </div>
                <p className="mc-list-sub">{client.type}</p>
              </article>
            ))}
            {clients.length === 0 ? (
              <article className="mc-list-item">
                <p className="mc-list-sub">Source missing or empty.</p>
              </article>
            ) : null}
          </div>
        </MissionPanel>

        <MissionPanel className="mc-route-panel" title="Ecosystem" subtitle="notes/areas/ecosystem.md">
          <div className="mc-list mc-scroll-area">
            {ecosystem.map((item) => (
              <article key={item.id} className="mc-list-item">
                <div className="mc-row">
                  <p className="mc-list-title">{item.name}</p>
                  <MissionPill tone="neutral">{item.type}</MissionPill>
                </div>
                <p className="mc-list-sub">{item.status}</p>
              </article>
            ))}
            {ecosystem.length === 0 ? (
              <article className="mc-list-item">
                <p className="mc-list-sub">Source missing or empty.</p>
              </article>
            ) : null}
          </div>
        </MissionPanel>
      </div>
    </div>
  );
}
