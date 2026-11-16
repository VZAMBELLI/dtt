"use client";
import { useState } from "react";
import Link from "next/link";
import { LEVELS, LAYERS, RANK, type Level } from "@/lib/layers";

export function LayerExplorer({ compact = false }: { compact?: boolean }) {
  const [level, setLevel] = useState<Level>("essencial");
  const cur = LEVELS.find(l => l.id === level)!;
  return (
    <div className="layers">
      <div className="levels" role="tablist" aria-label="Nível de segurança">
        {LEVELS.map(l => (
          <button key={l.id} role="tab" aria-selected={level === l.id} className={`level${level === l.id ? " on" : ""}`} onClick={() => setLevel(l.id)} type="button">
            <span className="level__bars" aria-hidden="true">{[0, 1, 2].map(i => <i key={i} className={i <= RANK[l.id] ? "f" : ""} />)}</span>
            <b>{l.name}</b>
            <small>{l.who}</small>
          </button>
        ))}
      </div>
      <p className="levels__text">{cur.text}</p>

      <ol className="stackl">
        {LAYERS.map(layer => {
          const active = layer.tech.filter(t => RANK[t.level] <= RANK[level]);
          return (
            <li key={layer.n} className={`stackl__row${active.length ? "" : " off"}`}>
              <div className="stackl__head">
                <span className="mono">{layer.n}</span>
                <h3>{layer.name}</h3>
                {!compact && <p>{layer.idea}</p>}
              </div>
              <ul className="stackl__tech">
                {layer.tech.map(t => {
                  const on = RANK[t.level] <= RANK[level];
                  return <li key={t.t} className={on ? "on" : ""}><b>{t.t}</b><span>{t.d}</span></li>;
                })}
              </ul>
              {!compact && <Link className="link stackl__more" href={`/explorar?q=${encodeURIComponent(layer.q)}`}>Ver opções →</Link>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
