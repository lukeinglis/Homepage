// Cooking modules — editorial, warm, food-magazine.

function TonightHero({ size="large" }) {
  const t = window.TONIGHT;
  return (
    <div className="module warm p-0 overflow-hidden module-enter" style={{animationDelay:"40ms"}}>
      <div className="grid" style={{gridTemplateColumns: size==="large" ? "1.05fr 1fr" : "1fr"}}>
        {/* hero image placeholder — striped warm */}
        <div className="relative" style={{minHeight: size==="large" ? 280 : 200,
          background:`
            repeating-linear-gradient(135deg, rgba(120,55,25,0.85) 0 16px, rgba(160,75,35,0.85) 16px 32px),
            linear-gradient(180deg, #d97a3a, #6e2d12)`}}>
          <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at 30% 30%, rgba(255,210,150,0.35), transparent 60%)"}}/>
          <div className="absolute left-4 top-4">
            <span className="chip" style={{background:"rgba(0,0,0,0.35)", borderColor:"rgba(255,220,180,0.3)", color:"#ffe8c8"}}>Tonight · 5:45 PM start</span>
          </div>
          <div className="absolute left-4 bottom-4 right-4 font-mono text-[10px] uppercase tracking-[0.18em]" style={{color:"rgba(255,220,180,0.7)"}}>
            [ hero plate · braise + polenta ]
          </div>
        </div>
        <div className="p-5 flex flex-col">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.16em]" style={{color:"#caa67a"}}>Tonight's plan</div>
          <div className="font-serif text-[28px] leading-[1.15] mt-1.5" style={{color:"#f3e6d3"}}>{t.title}</div>
          <div className="text-[12.5px] mt-1 italic" style={{color:"#caa67a", fontFamily:"var(--serif)"}}>{t.source}</div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div><div className="font-mono text-[10px] text-muted uppercase tracking-wider">Prep</div><div className="font-serif text-[20px]">{t.prep}m</div></div>
            <div><div className="font-mono text-[10px] text-muted uppercase tracking-wider">Cook</div><div className="font-serif text-[20px]">{Math.floor(t.cook/60)}h {t.cook%60}m</div></div>
            <div><div className="font-mono text-[10px] text-muted uppercase tracking-wider">Serves</div><div className="font-serif text-[20px]">{t.serves}</div></div>
          </div>

          <div className="text-[12.5px] mt-3 leading-relaxed" style={{color:"rgba(243,230,211,0.85)"}}>{t.note}</div>

          <div className="flex items-center gap-2 mt-auto pt-4">
            <button className="font-mono text-[11px] px-3 py-1.5 rounded-md" style={{background:"#d97a3a", color:"#1a1410"}}>Start cooking mode</button>
            <button className="font-mono text-[11px] px-3 py-1.5 rounded-md hairline">Recipe ↗</button>
            <button className="font-mono text-[11px] px-3 py-1.5 rounded-md hairline">Kitchen playlist ▶</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecipeShelf() {
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"140ms"}}>
      <div className="flex items-baseline justify-between mb-3">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">Saved · recently</div>
        <button className="font-mono text-[10.5px] text-muted">All ↗</button>
      </div>
      <div className="space-y-2.5">
        {window.RECIPES.map((r,i)=>(
          <div key={i} className="flex items-center gap-3 py-1.5">
            <div className="w-9 h-9 rounded-md flex-none" style={{
              background: i%4===0
                ? "linear-gradient(135deg,#a4533c,#5a2616)"
                : i%4===1
                ? "linear-gradient(135deg,#9a3b3b,#3a1010)"
                : i%4===2
                ? "linear-gradient(135deg,#8a8c4a,#3a3c1c)"
                : "linear-gradient(135deg,#c08a4a,#5a3818)"
            }}/>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium leading-tight truncate font-serif">{r.title}</div>
              <div className="font-mono text-[10.5px] text-muted">{r.src} · {r.min}m · saved {r.saved}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GroceriesModule() {
  const need = window.GROCERIES.filter(g => !g.x);
  const have = window.GROCERIES.filter(g => g.x);
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"180ms"}}>
      <div className="flex items-baseline justify-between mb-3">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">Grocery list · for tonight</div>
        <div className="font-mono text-[10.5px] text-muted">{need.length} to get</div>
      </div>
      <div className="space-y-1.5">
        {need.map((g,i)=>(
          <div key={i} className="flex items-center gap-2.5 text-[13px]">
            <span className="w-3.5 h-3.5 rounded-sm hairline"/>
            <span>{g.t}</span>
          </div>
        ))}
        {have.map((g,i)=>(
          <div key={i} className="flex items-center gap-2.5 text-[13px] text-muted line-through">
            <span className="w-3.5 h-3.5 rounded-sm" style={{background:"rgba(180,140,90,0.6)"}}/>
            <span>{g.t}</span>
          </div>
        ))}
      </div>
      <button className="mt-3 font-mono text-[11px] px-3 py-1.5 rounded-md hairline w-full">Send to Instacart ↗</button>
    </div>
  );
}

function CookingVideos() {
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"220ms"}}>
      <div className="flex items-center gap-2 mb-3">
        <Icon name="video" size={14}/>
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em]">Watch while cooking</div>
      </div>
      <div className="space-y-2.5">
        {window.COOK_VIDEOS.map((v,i)=>(
          <div key={i} className="flex gap-3">
            <div className="w-[68px] h-[40px] rounded flex-none relative overflow-hidden" style={{background: i===0 ? "linear-gradient(135deg,#3a2a18,#0c0805)" : i===1 ? "linear-gradient(135deg,#52301a,#1a0a04)" : "linear-gradient(135deg,#5e3520,#1f0d05)"}}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon name="play" size={14}/>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium leading-tight">{v.title}</div>
              <div className="font-mono text-[10.5px] text-muted mt-0.5">{v.ch} · {v.dur}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeasonalNote() {
  return (
    <div className="module p-4 module-enter warm" style={{animationDelay:"260ms"}}>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.16em]" style={{color:"#caa67a"}}>Seasonal · spring</div>
      <div className="font-serif italic text-[18px] leading-tight mt-1.5" style={{color:"#f3e6d3"}}>
        Asparagus is in. So are ramps if you can find them. Lean lighter on the braises by next week.
      </div>
    </div>
  );
}

function WeekendMealPlan() {
  return (
    <div className="module p-4 module-enter" style={{animationDelay:"160ms"}}>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted mb-3">Weekend menu</div>
      <div className="space-y-2.5">
        {[
          { day:"Sat brunch", what:"Buttermilk pancakes, bacon, soft eggs", chip:"easy" },
          { day:"Sat dinner", what:"Grilled spatchcock chicken, charred lemon", chip:"grill" },
          { day:"Sun brunch", what:"Frittata — leftover greens & gruyère", chip:"clean-out" },
          { day:"Sun dinner", what:"Short ribs over polenta", chip:"main event" },
        ].map((m,i)=>(
          <div key={i} className="flex items-baseline gap-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted w-[80px] flex-none">{m.day}</div>
            <div className="text-[13px] font-serif flex-1">{m.what}</div>
            <span className="chip">{m.chip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { TonightHero, RecipeShelf, GroceriesModule, CookingVideos, SeasonalNote, WeekendMealPlan });
