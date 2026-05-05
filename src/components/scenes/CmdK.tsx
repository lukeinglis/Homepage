import { useState, useEffect, useRef, useMemo } from 'preact/hooks';
import { Icon } from './Icons';
import { BOOKMARKS, QUICK_ACTIONS } from '../../data/scene-data';

interface CmdKItem {
  kind: string;
  cat: string;
  name: string;
  sub: string;
  key: string;
}

export function CmdK({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const RECENTS_KEY = "homepage_cmdk_recent";
  const [recents, setRecents] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(RECENTS_KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => {
    if (open) { setQ(""); setSel(0); setTimeout(() => inputRef.current?.focus(), 30); }
  }, [open]);

  const items = useMemo<CmdKItem[]>(() => {
    const bm = BOOKMARKS.map(b => ({ kind: "bookmark", cat: b.cat, name: b.name, sub: b.url, key: b.cat + "|" + b.name }));
    const qa = QUICK_ACTIONS.map(a => ({ kind: "action", cat: "Quick action", name: a.name, sub: a.url || "⏎ run", key: "qa|" + a.name }));
    return [...qa, ...bm];
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) {
      const grouped: Record<string, CmdKItem[]> = {};
      items.forEach(it => { (grouped[it.cat] = grouped[it.cat] || []).push(it); });
      return { mode: "grouped" as const, grouped };
    }
    const needle = q.toLowerCase();
    const score = (s: string) => {
      s = s.toLowerCase();
      if (s.startsWith(needle)) return 1000;
      if (s.includes(needle)) return 500;
      let i = 0, j = 0, gap = 0;
      while (i < s.length && j < needle.length) {
        if (s[i] === needle[j]) { j++; gap = 0; }
        else gap++;
        i++;
      }
      return j === needle.length ? 100 - gap : -1;
    };
    const ranked = items
      .map(it => ({ it, s: Math.max(score(it.name), score(it.cat) * 0.6, score(it.sub || "") * 0.4) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 40)
      .map(x => x.it);
    return { mode: "flat" as const, flat: ranked };
  }, [q, items]);

  const flatList = filtered.mode === "flat"
    ? filtered.flat
    : (() => {
      const recentItems = recents.map(k => items.find(i => i.key === k)).filter(Boolean).slice(0, 6) as CmdKItem[];
      const rest: CmdKItem[] = [];
      Object.entries(filtered.grouped).forEach(([, list]) => list.forEach(i => rest.push(i)));
      return [...recentItems, ...rest];
    })();

  function activateItem(it: CmdKItem) {
    const next = [it.key, ...recents.filter(k => k !== it.key)].slice(0, 12);
    setRecents(next);
    try { localStorage.setItem(RECENTS_KEY, JSON.stringify(next)); } catch { /* empty */ }
    if (it.sub && it.sub !== "⏎ run") {
      const href = it.sub.startsWith("http") || it.sub.includes("://") ? it.sub : "https://" + it.sub;
      window.open(href, "_blank", "noopener");
    }
    onClose();
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(s + 1, flatList.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); }
    if (e.key === "Enter") {
      e.preventDefault();
      const it = flatList[sel];
      if (it) activateItem(it);
    }
  };

  if (!open) return null;

  const empty = filtered.mode === "grouped" && !q.trim();
  let runIdx = 0;

  const Row = ({ it, i }: { it: CmdKItem; i: number }) => {
    const active = i === sel;
    return (
      <div onMouseEnter={() => setSel(i)}
        onClick={() => activateItem(it)}
        className={`flex items-center gap-3 px-4 py-2 cursor-pointer ${active ? "" : ""}`}
        style={{ borderRadius: 8, background: active ? "rgba(255,255,255,0.10)" : undefined }}>
        <div className="rounded-md flex items-center justify-center hairline flex-none" style={{ width: 28, height: 28, background: it.kind === "action" ? "rgba(255,180,80,0.18)" : "rgba(255,255,255,0.04)" }}>
          <Icon name={it.kind === "action" ? "wand" : "bookmark"} size={13} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium leading-tight truncate text-white" style={{ fontSize: "13.5px" }}>{it.name}</div>
          <div className="font-mono truncate" style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.55)" }}>{it.cat}{it.sub ? " · " + it.sub : ""}</div>
        </div>
        {active && <div className="font-mono" style={{ fontSize: "10px", color: "rgba(255,255,255,0.65)" }}>⏎</div>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 cmdk-back flex items-start justify-center scene-enter" style={{ paddingTop: "14vh" }} onClick={onClose}>
      <div className="rounded-2xl overflow-hidden" style={{ width: 640, maxWidth: "92vw", background: "rgba(20,18,22,0.86)", backdropFilter: "blur(28px) saturate(140%)", border: "1px solid rgba(255,255,255,0.10)", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7)" }}
        onClick={(e: Event) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.10)" }}>
          <Icon name="search" size={16} className="text-muted" />
          <input
            ref={inputRef}
            value={q}
            onInput={(e: Event) => { setQ((e.target as HTMLInputElement).value); setSel(0); }}
            onKeyDown={onKey}
            placeholder="Search bookmarks, run actions..."
            className="flex-1 text-white"
            style={{ background: "transparent", outline: "none", fontSize: "15px", border: "none", color: "#fff" }}
          />
          <span className="kbd">esc</span>
        </div>
        <div className="overflow-y-auto scrolly py-2 text-white" style={{ maxHeight: "58vh" }}>
          {empty ? (
            <>
              {recents.length > 0 && (
                <div className="mb-2">
                  <div className="font-mono uppercase px-5 py-2" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)" }}>Recent</div>
                  <div className="px-2">
                    {recents.map(k => items.find(i => i.key === k)).filter(Boolean).slice(0, 6).map((it) => {
                      const i = runIdx++;
                      return <Row key={"r" + (it as CmdKItem).key} it={it as CmdKItem} i={i} />;
                    })}
                  </div>
                </div>
              )}
              {filtered.mode === "grouped" && Object.entries(filtered.grouped).map(([cat, list]) => (
                <div key={cat} className="mb-2">
                  <div className="font-mono uppercase px-5 py-2" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)" }}>{cat}</div>
                  <div className="px-2">
                    {list.map((it) => { const i = runIdx++; return <Row key={it.key} it={it} i={i} />; })}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="px-2">
              {flatList.map((it, i) => <Row key={it.key} it={it} i={i} />)}
              {flatList.length === 0 && (
                <div className="text-center py-10" style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>No matches for "{q}"</div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t font-mono" style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", borderColor: "rgba(255,255,255,0.10)" }}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5"><span className="kbd">↑</span><span className="kbd">↓</span> navigate</span>
            <span className="flex items-center gap-1.5"><span className="kbd">⏎</span> open</span>
          </div>
          <div className="flex items-center gap-1.5">{BOOKMARKS.length} bookmarks · {QUICK_ACTIONS.length} actions</div>
        </div>
      </div>
    </div>
  );
}
