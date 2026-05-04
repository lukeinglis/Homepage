// Cmd+K command palette — fast, fuzzy, keyboard-driven.

function CmdK({ open, onClose }) {
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState(0);
  const inputRef = React.useRef(null);
  const RECENTS_KEY = "homepage_cmdk_recent";
  const [recents, setRecents] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENTS_KEY) || "[]"); } catch { return []; }
  });

  React.useEffect(() => {
    if (open) { setQ(""); setSel(0); setTimeout(() => inputRef.current?.focus(), 30); }
  }, [open]);

  // sources
  const items = React.useMemo(() => {
    const bm = window.BOOKMARKS.map(b => ({ kind:"bookmark", cat:b.cat, name:b.name, sub:b.url, key: b.cat+"|"+b.name }));
    const qa = window.QUICK_ACTIONS.map(a => ({ kind:"action", cat:"Quick action", name:a.name, sub:"⏎ run", key:"qa|"+a.name }));
    return [...qa, ...bm];
  }, []);

  // fuzzy
  const filtered = React.useMemo(() => {
    if (!q.trim()) {
      // group by category for clean empty-state
      const grouped = {};
      items.forEach(it => { (grouped[it.cat] = grouped[it.cat] || []).push(it); });
      return { mode:"grouped", grouped };
    }
    const needle = q.toLowerCase();
    const score = (s) => {
      s = s.toLowerCase();
      if (s.startsWith(needle)) return 1000;
      if (s.includes(needle)) return 500;
      // simple subseq
      let i=0,j=0,gap=0;
      while (i < s.length && j < needle.length) {
        if (s[i] === needle[j]) { j++; gap=0; }
        else gap++;
        i++;
      }
      return j === needle.length ? 100 - gap : -1;
    };
    const ranked = items
      .map(it => ({ it, s: Math.max(score(it.name), score(it.cat)*0.6, score(it.sub||"")*0.4) }))
      .filter(x => x.s > 0)
      .sort((a,b) => b.s - a.s)
      .slice(0, 40)
      .map(x => x.it);
    return { mode:"flat", flat: ranked };
  }, [q, items]);

  const flatList = filtered.mode === "flat"
    ? filtered.flat
    : (() => {
        // empty-state ordering: recents first, then categories
        const recentItems = recents.map(k => items.find(i => i.key === k)).filter(Boolean).slice(0,6);
        const rest = [];
        Object.entries(filtered.grouped).forEach(([cat, list]) => list.forEach(i => rest.push(i)));
        return [...recentItems, ...rest];
      })();

  const onKey = (e) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(s+1, flatList.length-1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setSel(s => Math.max(s-1, 0)); }
    if (e.key === "Enter") {
      e.preventDefault();
      const it = flatList[sel];
      if (it) {
        const next = [it.key, ...recents.filter(k => k !== it.key)].slice(0, 12);
        setRecents(next);
        try { localStorage.setItem(RECENTS_KEY, JSON.stringify(next)); } catch {}
        onClose();
      }
    }
  };

  if (!open) return null;

  // build sectioned render for empty state
  const empty = filtered.mode === "grouped" && !q.trim();
  let runIdx = 0;
  const Row = ({ it, i }) => {
    const active = i === sel;
    return (
      <div onMouseEnter={() => setSel(i)}
           className={`flex items-center gap-3 px-4 py-2 cursor-pointer ${active?"bg-white/10":""}`}
           style={{borderRadius: 8}}>
        <div className="w-7 h-7 rounded-md flex items-center justify-center hairline flex-none" style={{background: it.kind==="action" ? "rgba(255,180,80,0.18)" : "rgba(255,255,255,0.04)"}}>
          <Icon name={it.kind==="action" ? "wand" : "bookmark"} size={13}/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-medium leading-tight truncate text-white">{it.name}</div>
          <div className="font-mono text-[10.5px] text-white/55 truncate">{it.cat}{it.sub ? " · " + it.sub : ""}</div>
        </div>
        {active && <div className="font-mono text-[10px] text-white/65">⏎</div>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 cmdk-back flex items-start justify-center pt-[14vh] scene-enter" onClick={onClose}>
      <div className="w-[640px] max-w-[92vw] rounded-2xl overflow-hidden"
           onClick={(e)=>e.stopPropagation()}
           style={{background: "rgba(20,18,22,0.86)", backdropFilter:"blur(28px) saturate(140%)", border:"1px solid rgba(255,255,255,0.10)", boxShadow:"0 30px 80px -20px rgba(0,0,0,0.7)"}}>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <Icon name="search" size={16} className="text-white/60"/>
          <input
            ref={inputRef}
            value={q}
            onChange={e => { setQ(e.target.value); setSel(0); }}
            onKeyDown={onKey}
            placeholder="Search bookmarks, run actions, ‘play music’, ‘what's on tonight’…"
            className="flex-1 bg-transparent outline-none text-white placeholder-white/40 text-[15px]"
          />
          <span className="kbd">esc</span>
        </div>
        <div className="max-h-[58vh] overflow-y-auto scrolly py-2 text-white">
          {empty ? (
            <>
              {recents.length > 0 && (
                <div className="mb-2">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 px-5 py-2">Recent</div>
                  <div className="px-2">
                    {recents.map(k => items.find(i => i.key === k)).filter(Boolean).slice(0,6).map((it) => {
                      const i = runIdx++;
                      return <Row key={"r"+it.key} it={it} i={i}/>;
                    })}
                  </div>
                </div>
              )}
              {Object.entries(filtered.grouped).map(([cat, list]) => (
                <div key={cat} className="mb-2">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 px-5 py-2">{cat}</div>
                  <div className="px-2">
                    {list.map((it) => { const i = runIdx++; return <Row key={it.key} it={it} i={i}/>; })}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="px-2">
              {flatList.map((it,i)=> <Row key={it.key} it={it} i={i}/>)}
              {flatList.length === 0 && (
                <div className="text-center text-white/50 text-[13px] py-10">No matches for "{q}"</div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/10 text-[11px] text-white/55 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5"><span className="kbd">↑</span><span className="kbd">↓</span> navigate</span>
            <span className="flex items-center gap-1.5"><span className="kbd">⏎</span> open</span>
          </div>
          <div className="flex items-center gap-1.5">{window.BOOKMARKS.length} bookmarks · {window.QUICK_ACTIONS.length} actions</div>
        </div>
      </div>
    </div>
  );
}

window.CmdK = CmdK;
