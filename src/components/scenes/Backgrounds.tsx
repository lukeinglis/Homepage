import { useMemo } from 'preact/hooks';

interface ParticlesProps {
  count?: number;
  color?: string;
  spd?: number;
  size?: number;
}

interface RainProps {
  count?: number;
}

interface SnowProps {
  count?: number;
}

function Particles({ count = 40, color = "rgba(255,255,255,0.5)", spd = 18, size = 2 }: ParticlesProps) {
  const dots = useMemo(() => Array.from({ length: count }).map((_, i) => {
    const top = Math.random() * 100, left = Math.random() * 100;
    const dur = (spd + Math.random() * spd) + "s";
    const delay = (-Math.random() * spd) + "s";
    const r = (Math.random() * size + 0.5).toFixed(1);
    const which = i % 3 === 0 ? "drift1" : i % 3 === 1 ? "drift2" : "drift3";
    const sparkDur = (2 + Math.random() * 4).toFixed(1);
    return { top, left, dur, delay, r, which, sparkDur };
  }), []);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {dots.map((d, i) => (
        <span key={i} style={{
          position: "absolute", top: d.top + "%", left: d.left + "%",
          width: d.r + "px", height: d.r + "px", borderRadius: "50%",
          background: color, animation: `${d.which} ${d.dur} ${d.delay} ease-in-out infinite, sparkle ${d.sparkDur}s ${d.delay} ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

function Rain({ count = 70 }: RainProps) {
  const drops = useMemo(() => Array.from({ length: count }).map(() => {
    const left = Math.random() * 100;
    const dur = (0.7 + Math.random() * 0.7).toFixed(2) + "s";
    const delay = (-Math.random() * 1.4).toFixed(2) + "s";
    const len = 12 + Math.random() * 22;
    const op = (0.18 + Math.random() * 0.30).toFixed(2);
    return { left, dur, delay, len, op };
  }), []);
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {drops.map((d, i) => (
        <span key={i} style={{
          position: "absolute", top: 0, left: d.left + "%",
          width: "1px", height: d.len + "px",
          background: `linear-gradient(180deg, transparent, rgba(255,255,255,${d.op}))`,
          animation: `rainfall ${d.dur} ${d.delay} linear infinite`,
          transform: "translateY(-10%)",
        }} />
      ))}
    </div>
  );
}

function Snow({ count = 80 }: SnowProps) {
  const flakes = useMemo(() => Array.from({ length: count }).map(() => {
    const left = Math.random() * 100;
    const dur = (6 + Math.random() * 8).toFixed(1) + "s";
    const delay = (-Math.random() * 8).toFixed(1) + "s";
    const r = (Math.random() * 2 + 1).toFixed(1);
    const op = (0.4 + Math.random() * 0.5).toFixed(2);
    return { left, dur, delay, r, op };
  }), []);
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {flakes.map((d, i) => (
        <span key={i} style={{
          position: "absolute", top: 0, left: d.left + "%",
          width: d.r + "px", height: d.r + "px", borderRadius: "50%",
          background: `rgba(255,255,255,${d.op})`,
          filter: "blur(0.4px)",
          animation: `snowfall ${d.dur} ${d.delay} linear infinite`,
        }} />
      ))}
    </div>
  );
}

// ---- Boston, Beacon Hill morning ----
// Brick row houses at golden hour, Acorn Street vibes. Gas lamps still lit.
function BgBeaconHill() {
  return (
    <div className="absolute inset-0 grain" aria-hidden style={{ overflow: "hidden" }}>
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #f4d8b8 0%, #e8b698 32%, #c98875 58%, #8e5566 80%, #4d2f4a 100%)",
      }} />
      {/* sun */}
      <div className="absolute" style={{ left: "68%", top: "18%", width: 280, height: 280, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,235,190,0.95), rgba(255,200,140,0.4) 50%, transparent 75%)",
        filter: "blur(8px)" }} />
      {/* atmospheric haze */}
      <div className="absolute inset-x-0" style={{ top: "54%", height: "180px",
        background: "linear-gradient(180deg, transparent, rgba(255,220,180,0.45) 50%, transparent)",
        filter: "blur(30px)" }} />
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="bh-brick" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7a3528" /><stop offset="100%" stopColor="#3a1814" />
          </linearGradient>
          <linearGradient id="bh-brick2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8c4a36" /><stop offset="100%" stopColor="#421c16" />
          </linearGradient>
          <linearGradient id="bh-cobble" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2a26" /><stop offset="100%" stopColor="#1a100e" />
          </linearGradient>
        </defs>
        {/* far hill silhouette: Boston Common trees */}
        <path d="M0,540 C 200,500 380,520 580,510 C 780,498 980,520 1180,508 C 1380,498 1500,512 1600,506 L 1600,620 L 0,620 Z" fill="rgba(60,38,52,0.55)" />
        {/* dome of state house */}
        <g transform="translate(820,470)">
          <ellipse cx="0" cy="40" rx="32" ry="14" fill="rgba(180,150,80,0.85)" />
          <path d="M-32,40 Q 0 -10 32,40 Z" fill="rgba(200,170,90,0.95)" />
          <rect x="-3" y="-18" width="6" height="14" fill="rgba(200,170,90,0.95)" />
        </g>
        {/* row of brick houses: left side, receding */}
        <g>
          {[
            { x: 0, w: 180, h: 200, fill: "url(#bh-brick)" },
            { x: 180, w: 160, h: 220, fill: "url(#bh-brick2)" },
            { x: 340, w: 170, h: 210, fill: "url(#bh-brick)" },
            { x: 510, w: 150, h: 225, fill: "url(#bh-brick2)" },
            { x: 660, w: 165, h: 200, fill: "url(#bh-brick)" },
          ].map((h, i) => (
            <g key={i}>
              <rect x={h.x} y={620 - h.h} width={h.w} height={h.h} fill={h.fill} />
              {/* mansard roof */}
              <path d={`M${h.x},${620 - h.h} L ${h.x + h.w},${620 - h.h} L ${h.x + h.w - 12},${620 - h.h - 22} L ${h.x + 12},${620 - h.h - 22} Z`} fill="rgba(20,12,16,0.95)" />
              {/* windows: three rows */}
              {[0, 1, 2].map(row => (
                [0, 1, 2].map(col => (
                  <rect key={row + "-" + col}
                    x={h.x + 18 + col * (h.w - 50) / 2.2}
                    y={620 - h.h + 38 + row * (h.h - 60) / 3}
                    width={(h.w - 50) / 3.5} height={(h.h - 70) / 4.5}
                    fill={Math.random() > 0.55 ? "rgba(255,210,140,0.55)" : "rgba(40,28,32,0.7)"}
                    stroke="rgba(20,10,14,0.4)" strokeWidth="0.6" />
                ))
              ))}
              {/* door */}
              <rect x={h.x + h.w / 2 - 12} y={620 - 26} width="24" height="26" fill="rgba(40,20,30,0.95)" />
              <rect x={h.x + h.w / 2 - 13} y={620 - 32} width="26" height="6" fill="rgba(80,50,60,0.8)" />
            </g>
          ))}
        </g>
        {/* row of brick houses: right side */}
        <g>
          {[
            { x: 880, w: 160, h: 215, fill: "url(#bh-brick2)" },
            { x: 1040, w: 170, h: 200, fill: "url(#bh-brick)" },
            { x: 1210, w: 155, h: 225, fill: "url(#bh-brick2)" },
            { x: 1365, w: 170, h: 208, fill: "url(#bh-brick)" },
            { x: 1535, w: 120, h: 220, fill: "url(#bh-brick2)" },
          ].map((h, i) => (
            <g key={i}>
              <rect x={h.x} y={620 - h.h} width={h.w} height={h.h} fill={h.fill} />
              <path d={`M${h.x},${620 - h.h} L ${h.x + h.w},${620 - h.h} L ${h.x + h.w - 12},${620 - h.h - 22} L ${h.x + 12},${620 - h.h - 22} Z`} fill="rgba(20,12,16,0.95)" />
              {[0, 1, 2].map(row => (
                [0, 1, 2].map(col => (
                  <rect key={row + "-" + col}
                    x={h.x + 18 + col * (h.w - 50) / 2.2}
                    y={620 - h.h + 38 + row * (h.h - 60) / 3}
                    width={(h.w - 50) / 3.5} height={(h.h - 70) / 4.5}
                    fill={Math.random() > 0.5 ? "rgba(255,210,140,0.55)" : "rgba(40,28,32,0.7)"}
                    stroke="rgba(20,10,14,0.4)" strokeWidth="0.6" />
                ))
              ))}
              <rect x={h.x + h.w / 2 - 12} y={620 - 26} width="24" height="26" fill="rgba(40,20,30,0.95)" />
            </g>
          ))}
        </g>
        {/* gas lamps along the cobblestone */}
        {[120, 360, 580, 820, 1080, 1320].map((x, i) => (
          <g key={i} transform={`translate(${x},620)`}>
            <rect x="-1" y="0" width="2" height="50" fill="rgba(20,10,14,0.85)" />
            <circle cx="0" cy="-2" r="6" fill="rgba(255,220,150,0.95)" />
            <circle cx="0" cy="-2" r="14" fill="rgba(255,220,150,0.35)" filter="blur(3px)" />
          </g>
        ))}
        {/* cobblestone street */}
        <rect x="0" y="620" width="1600" height="280" fill="url(#bh-cobble)" />
        {/* cobble texture */}
        <g opacity="0.45">
          {[...Array(140)].map((_, i) => {
            const x = (i * 23) % 1600;
            const y = 630 + (i * 11 % 250);
            return <ellipse key={i} cx={x} cy={y} rx="6" ry="3" fill="rgba(80,55,50,0.5)" />;
          })}
        </g>
        {/* cobble shine line */}
        <path d="M0,820 Q 800,800 1600,820" stroke="rgba(255,200,150,0.18)" strokeWidth="2" fill="none" />
      </svg>
      <Particles count={18} color="rgba(255,210,160,0.55)" spd={36} size={1.8} />
      <div className="absolute font-mono uppercase" style={{ right: 22, bottom: 18, color: "rgba(255,225,200,0.7)", fontSize: "10px", letterSpacing: "0.22em" }}>Beacon Hill · Acorn Street · 7:42 AM</div>
    </div>
  );
}

// ---- Boston, Seaport at dusk ----
function BgSeaport() {
  return (
    <div className="absolute inset-0 grain" aria-hidden style={{ overflow: "hidden" }}>
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #0a1430 0%, #182554 24%, #4a3068 50%, #b14a48 78%, #f0823a 95%)",
      }} />
      {/* sun haze */}
      <div className="absolute" style={{ left: "30%", top: "58%", width: 520, height: 140, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,180,110,0.6), transparent 70%)", filter: "blur(16px)" }} />
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="sea-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2540" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0d1228" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* water with sun reflection */}
        <rect x="0" y="650" width="1600" height="250" fill="url(#sea-water)" />
        <ellipse cx="480" cy="680" rx="160" ry="14" fill="rgba(255,180,110,0.5)" filter="blur(2px)" />
        {[...Array(30)].map((_, i) => (
          <rect key={i} x={400 + i * 7} y={680 + (i % 5) * 6} width="22" height="1" fill="rgba(255,200,140,0.45)" />
        ))}
        {/* skyline silhouette: Seaport / Financial District */}
        <g fill="rgba(8,10,28,0.95)">
          {/* tall buildings cluster, modern glass towers */}
          <rect x="100" y="360" width="60" height="290" />
          <rect x="170" y="320" width="80" height="330" />
          <rect x="260" y="380" width="50" height="270" />
          <rect x="320" y="280" width="100" height="370" />{/* Pru-ish */}
          <polygon points="320,280 370,260 420,280" />
          <rect x="430" y="340" width="55" height="310" />
          <rect x="495" y="240" width="120" height="410" />{/* Hancock-ish */}
          <rect x="625" y="370" width="60" height="280" />
          <rect x="695" y="300" width="90" height="350" />
          <rect x="795" y="350" width="65" height="300" />
          <rect x="870" y="270" width="110" height="380" />
          <rect x="990" y="340" width="70" height="310" />
          <rect x="1070" y="380" width="55" height="270" />
          <rect x="1135" y="310" width="95" height="340" />
          <rect x="1240" y="360" width="65" height="290" />
          <rect x="1315" y="290" width="100" height="360" />
          <rect x="1425" y="350" width="60" height="300" />
          <rect x="1495" y="320" width="105" height="330" />
        </g>
        {/* Custom House clock tower-ish accent */}
        <g fill="rgba(20,16,38,0.9)" transform="translate(745,260)">
          <rect x="0" y="0" width="32" height="80" />
          <circle cx="16" cy="22" r="7" fill="rgba(255,220,160,0.85)" />
          <polygon points="0,0 16,-18 32,0" />
        </g>
        {/* lit windows */}
        <g>
          {[...Array(280)].map((_, i) => {
            const cols = [110, 180, 200, 220, 270, 290, 330, 360, 390, 440, 460, 510, 540, 570, 600, 640, 660, 720, 750, 780, 810, 840, 880, 910, 940, 970, 1000, 1040, 1080, 1110, 1150, 1180, 1210, 1260, 1290, 1330, 1360, 1390, 1440, 1470, 1510, 1550, 1580];
            const x = cols[i % cols.length];
            const y = 280 + (i * 13 % 360);
            const w = 5, h = 4;
            return <rect key={i} x={x} y={y} width={w} height={h} fill={i % 6 === 0 ? "rgba(255,220,160,0.95)" : i % 4 === 0 ? "rgba(255,200,140,0.7)" : "rgba(255,210,160,0.4)"} />;
          })}
        </g>
        {/* harbor cranes */}
        <g stroke="rgba(20,10,20,0.85)" strokeWidth="2.5" fill="none">
          <line x1="80" y1="640" x2="80" y2="450" />
          <line x1="80" y1="450" x2="180" y2="430" />
          <line x1="180" y1="430" x2="180" y2="500" />
          <line x1="80" y1="500" x2="180" y2="430" />
        </g>
        {/* Zakim cables suggestion right side */}
        <g stroke="rgba(255,210,160,0.22)" strokeWidth="0.8">
          <line x1="1430" y1="540" x2="1380" y2="780" />
          <line x1="1430" y1="540" x2="1410" y2="780" />
          <line x1="1430" y1="540" x2="1450" y2="780" />
          <line x1="1430" y1="540" x2="1490" y2="780" />
          <line x1="1430" y1="320" x2="1430" y2="780" stroke="rgba(255,210,160,0.4)" strokeWidth="2.5" />
        </g>
      </svg>
      <Rain count={35} />
      <Particles count={20} color="rgba(255,210,160,0.5)" spd={42} size={2} />
      <div className="absolute font-mono uppercase" style={{ right: 22, bottom: 18, color: "rgba(255,220,180,0.7)", fontSize: "10px", letterSpacing: "0.22em" }}>Boston · Seaport · 6:18 PM · light rain</div>
    </div>
  );
}

// ---- Weekend morning: coastal Cape vibe ----
function BgCapeMorning() {
  return (
    <div className="absolute inset-0 grain" aria-hidden style={{ overflow: "hidden" }}>
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #b9dee9 0%, #8fc3d2 36%, #d6c082 68%, #c79f5a 88%, #8a6433 100%)",
      }} />
      <div className="absolute" style={{ left: "66%", top: "12%", width: 240, height: 240, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,250,225,0.95), rgba(255,235,180,0.3) 60%, transparent 80%)", filter: "blur(6px)" }} />
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="cape-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b97a8" /><stop offset="100%" stopColor="#3a6a7c" />
          </linearGradient>
          <linearGradient id="cape-sand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2c188" /><stop offset="100%" stopColor="#a07a45" />
          </linearGradient>
        </defs>
        {/* far island */}
        <path d="M0,520 C 220,505 380,510 540,512 L 540,560 L 0,560 Z" fill="rgba(80,90,80,0.5)" />
        <path d="M820,520 C 980,505 1180,510 1380,512 C 1470,510 1540,512 1600,510 L 1600,560 L 820,560 Z" fill="rgba(80,90,80,0.55)" />
        {/* water */}
        <rect x="0" y="540" width="1600" height="160" fill="url(#cape-water)" />
        {/* shimmer */}
        {[...Array(40)].map((_, i) => (
          <rect key={i} x={i * 40 + (i % 3) * 8} y={580 + (i % 4) * 10} width="22" height="0.8" fill="rgba(255,235,200,0.4)" />
        ))}
        {/* sailboats */}
        {[[280, 580], [760, 565], [1140, 575]].map(([x, y], i) => (
          <g key={i}>
            <polygon points={`${x},${y} ${x},${y - 30} ${x + 18},${y}`} fill="rgba(255,250,240,0.92)" />
            <polygon points={`${x},${y} ${x - 12},${y} ${x},${y - 26}`} fill="rgba(255,250,240,0.88)" />
            <rect x={x - 14} y={y} width="32" height="4" fill="rgba(40,30,30,0.85)" />
          </g>
        ))}
        {/* lighthouse left */}
        <g transform="translate(120,420)">
          <rect x="0" y="0" width="22" height="120" fill="rgba(255,255,255,0.92)" />
          <rect x="0" y="30" width="22" height="14" fill="rgba(220,80,80,0.92)" />
          <rect x="0" y="74" width="22" height="14" fill="rgba(220,80,80,0.92)" />
          <rect x="-4" y="-12" width="30" height="14" fill="rgba(40,30,30,0.92)" />
          <polygon points="-4,-12 11,-32 26,-12" fill="rgba(40,30,30,0.92)" />
          <circle cx="11" cy="-5" r="3" fill="rgba(255,235,150,0.95)" />
        </g>
        {/* sand dune */}
        <path d="M0,700 C 200,650 400,680 700,665 C 900,656 1200,690 1600,660 L 1600,900 L 0,900 Z" fill="url(#cape-sand)" />
        {/* dune grass */}
        <g stroke="rgba(120,90,40,0.55)" strokeWidth="1" fill="none">
          {[...Array(80)].map((_, i) => {
            const x = (i * 22) % 1600;
            const y = 670 + (i % 6) * 4;
            return <path key={i} d={`M${x},${y} Q ${x + 1},${y - 12} ${x + 3},${y - 22}`} />;
          })}
        </g>
      </svg>
      <Particles count={14} color="rgba(255,255,255,0.7)" spd={38} size={1.8} />
      <div className="absolute font-mono uppercase" style={{ right: 22, bottom: 18, color: "rgba(40,30,20,0.65)", fontSize: "10px", letterSpacing: "0.22em" }}>Cape Cod · Saturday · 9:14 AM</div>
    </div>
  );
}

// ---- Weekend evening: North End restaurant block ----
function BgNorthEnd() {
  return (
    <div className="absolute inset-0 grain" aria-hidden style={{ overflow: "hidden" }}>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 65% 70%, #c97a3c 0%, #6e2818 24%, #1f0d18 56%, #0a0410 90%)",
      }} />
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="ne-brick" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a261c" /><stop offset="100%" stopColor="#2a0e0a" />
          </linearGradient>
          <linearGradient id="ne-brick2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6c3022" /><stop offset="100%" stopColor="#321410" />
          </linearGradient>
        </defs>
        {/* far night sky w church spire */}
        <g transform="translate(840,300)">
          <rect x="-3" y="0" width="6" height="100" fill="rgba(20,10,16,0.85)" />
          <polygon points="-3,0 0,-40 3,0" fill="rgba(20,10,16,0.85)" />
          <circle cx="0" cy="-44" r="2.5" fill="rgba(255,220,150,0.7)" />
        </g>
        {/* row of restaurant buildings */}
        <g>
          {[
            { x: 0, w: 230, h: 380, fill: "url(#ne-brick)" },
            { x: 230, w: 200, h: 360, fill: "url(#ne-brick2)" },
            { x: 430, w: 240, h: 400, fill: "url(#ne-brick)" },
            { x: 670, w: 180, h: 370, fill: "url(#ne-brick2)" },
            { x: 850, w: 220, h: 390, fill: "url(#ne-brick)" },
            { x: 1070, w: 200, h: 360, fill: "url(#ne-brick2)" },
            { x: 1270, w: 230, h: 400, fill: "url(#ne-brick)" },
            { x: 1500, w: 100, h: 380, fill: "url(#ne-brick2)" },
          ].map((h, i) => (
            <g key={i}>
              <rect x={h.x} y={620 - h.h} width={h.w} height={h.h} fill={h.fill} />
              {/* upper windows lit */}
              {[0, 1, 2, 3].map(row => (
                [0, 1, 2].map(col => (
                  <rect key={row + "-" + col}
                    x={h.x + 20 + col * ((h.w - 60) / 2.5)}
                    y={620 - h.h + 34 + row * ((h.h - 180) / 4)}
                    width={(h.w - 60) / 3.6} height={(h.h - 200) / 5.5}
                    fill={Math.random() > 0.4 ? "rgba(255,200,130,0.85)" : "rgba(40,24,28,0.7)"} />
                ))
              ))}
              {/* awning over door */}
              <rect x={h.x + 8} y={595} width={h.w - 16} height="28"
                fill={i % 3 === 0 ? "rgba(40,80,55,0.95)" : i % 3 === 1 ? "rgba(140,40,40,0.95)" : "rgba(80,55,30,0.95)"} />
              {/* awning stripe */}
              {[...Array(8)].map((_, k) => (
                <rect key={k} x={h.x + 8 + k * ((h.w - 16) / 8)} y={595} width={(h.w - 16) / 16} height="28" fill="rgba(255,255,255,0.18)" />
              ))}
              {/* warm doorway */}
              <rect x={h.x + h.w / 2 - 22} y={585} width="44" height="35" fill="rgba(255,200,130,0.92)" />
            </g>
          ))}
        </g>
        {/* string lights spanning the street */}
        <g>
          {[...Array(36)].map((_, i) => {
            const x = i * 45 + 10;
            return <g key={i}>
              <circle cx={x} cy={550 + Math.sin(i * 0.5) * 10} r="2.4" fill="rgba(255,225,160,0.95)" />
              <circle cx={x} cy={550 + Math.sin(i * 0.5) * 10} r="6" fill="rgba(255,225,160,0.35)" filter="blur(2px)" />
            </g>;
          })}
          <path d="M0,560 Q 800,580 1600,560" stroke="rgba(40,30,20,0.6)" strokeWidth="0.6" fill="none" />
        </g>
        {/* cobblestone street */}
        <rect x="0" y="620" width="1600" height="280" fill="rgba(20,12,16,0.95)" />
        {/* warm spill onto street */}
        <ellipse cx="800" cy="680" rx="700" ry="80" fill="rgba(255,180,110,0.18)" filter="blur(40px)" />
        {/* cafe table silhouettes */}
        {[280, 580, 920, 1220].map((x, i) => (
          <g key={i} transform={`translate(${x},680)`}>
            <ellipse cx="0" cy="20" rx="30" ry="6" fill="rgba(0,0,0,0.5)" />
            <rect x="-2" y="-4" width="4" height="24" fill="rgba(30,18,22,0.95)" />
            <ellipse cx="0" cy="-6" rx="22" ry="5" fill="rgba(50,30,30,0.95)" />
          </g>
        ))}
      </svg>
      <Particles count={20} color="rgba(255,210,160,0.7)" spd={42} size={2} />
      <div className="absolute font-mono uppercase" style={{ right: 22, bottom: 18, color: "rgba(255,220,180,0.7)", fontSize: "10px", letterSpacing: "0.22em" }}>North End · Hanover Street · 7:52 PM</div>
    </div>
  );
}

// ---- Auburn, Toomer's Corner ----
function BgAuburn() {
  return (
    <div className="absolute inset-0 grain" aria-hidden style={{ overflow: "hidden" }}>
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #03244d 0%, #0a3068 32%, #1f4a82 56%, #cc6a25 86%, #e87722 100%)",
      }} />
      {/* sun glow */}
      <div className="absolute" style={{ left: "60%", top: "50%", width: 520, height: 300, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,200,130,0.55), transparent 70%)", filter: "blur(40px)" }} />
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="aub-brick" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a2418" /><stop offset="100%" stopColor="#2a0c08" />
          </linearGradient>
        </defs>
        {/* college buildings: historic brick */}
        <rect x="0" y="320" width="280" height="300" fill="url(#aub-brick)" />
        <rect x="280" y="280" width="240" height="340" fill="rgba(80,40,28,0.9)" />
        {/* clock tower (Samford Hall vibe) */}
        <g transform="translate(540,180)">
          <rect x="0" y="0" width="120" height="440" fill="rgba(80,38,26,0.92)" />
          <rect x="-20" y="-20" width="160" height="20" fill="rgba(40,18,12,0.95)" />
          <rect x="20" y="-50" width="80" height="30" fill="rgba(80,38,26,0.92)" />
          <polygon points="20,-50 60,-100 100,-50" fill="rgba(40,18,12,0.95)" />
          <circle cx="60" cy="60" r="22" fill="rgba(255,220,160,0.9)" stroke="rgba(40,18,12,0.95)" strokeWidth="2" />
          <line x1="60" y1="60" x2="60" y2="46" stroke="rgba(40,18,12,0.95)" strokeWidth="2" />
          <line x1="60" y1="60" x2="74" y2="60" stroke="rgba(40,18,12,0.95)" strokeWidth="2" />
          {/* lit windows */}
          {[0, 1, 2, 3].map(row => (
            [0, 1, 2].map(col => (
              <rect key={row + "-" + col} x={20 + col * 36} y={140 + row * 70} width="22" height="38" fill={Math.random() > 0.4 ? "rgba(255,210,140,0.85)" : "rgba(40,18,12,0.7)"} />
            ))
          ))}
        </g>
        <rect x="660" y="320" width="220" height="300" fill="url(#aub-brick)" />
        <rect x="880" y="290" width="260" height="330" fill="rgba(80,40,28,0.9)" />
        <rect x="1140" y="330" width="240" height="290" fill="url(#aub-brick)" />
        <rect x="1380" y="310" width="220" height="310" fill="rgba(80,40,28,0.9)" />
        {/* lit windows on flanking buildings */}
        <g>
          {[...Array(120)].map((_, i) => {
            const cols = [20, 60, 100, 140, 180, 220, 300, 340, 380, 440, 700, 740, 780, 820, 900, 940, 980, 1020, 1060, 1100, 1160, 1200, 1240, 1280, 1320, 1360, 1400, 1440, 1480, 1520, 1560];
            const x = cols[i % cols.length];
            const y = 340 + (i * 17 % 240);
            return <rect key={i} x={x} y={y} width="14" height="22" fill={i % 4 === 0 ? "rgba(255,210,140,0.85)" : i % 3 === 0 ? "rgba(255,200,130,0.6)" : "rgba(40,20,12,0.7)"} />;
          })}
        </g>
        {/* live oaks at Toomer's corner: rolled in toilet paper */}
        <g transform="translate(220,420)">
          <rect x="-6" y="0" width="12" height="200" fill="rgba(20,10,8,0.95)" />
          <ellipse cx="0" cy="-10" rx="120" ry="80" fill="rgba(20,30,18,0.92)" />
          <ellipse cx="-50" cy="20" rx="80" ry="60" fill="rgba(20,30,18,0.95)" />
          <ellipse cx="60" cy="10" rx="80" ry="60" fill="rgba(20,30,18,0.95)" />
          {/* TP streamers */}
          <g stroke="rgba(255,255,255,0.92)" strokeWidth="2" fill="none">
            <path d="M-80,-40 Q -40,30 -10,80 Q -20,140 -40,200" />
            <path d="M-30,-60 Q 10,20 30,90 Q 20,150 0,200" />
            <path d="M40,-50 Q 70,30 90,90 Q 80,150 60,200" />
            <path d="M80,-30 Q 60,40 100,100 Q 110,160 90,200" />
            <path d="M-100,-20 Q -90,40 -120,100 Q -140,160 -110,200" />
          </g>
        </g>
        <g transform="translate(1380,420)">
          <rect x="-6" y="0" width="12" height="200" fill="rgba(20,10,8,0.95)" />
          <ellipse cx="0" cy="-10" rx="120" ry="80" fill="rgba(20,30,18,0.92)" />
          <ellipse cx="-50" cy="20" rx="80" ry="60" fill="rgba(20,30,18,0.95)" />
          <ellipse cx="60" cy="10" rx="80" ry="60" fill="rgba(20,30,18,0.95)" />
          <g stroke="rgba(255,255,255,0.92)" strokeWidth="2" fill="none">
            <path d="M-80,-40 Q -40,30 -10,80 Q -20,140 -40,200" />
            <path d="M-30,-60 Q 10,20 30,90 Q 20,150 0,200" />
            <path d="M40,-50 Q 70,30 90,90 Q 80,150 60,200" />
            <path d="M80,-30 Q 60,40 100,100 Q 110,160 90,200" />
          </g>
        </g>
        {/* street level + crowd silhouettes */}
        <rect x="0" y="620" width="1600" height="280" fill="rgba(8,6,16,0.85)" />
        <g fill="rgba(20,12,20,0.95)">
          {[...Array(50)].map((_, i) => {
            const x = i * 32 + 10;
            const h = 30 + (i % 5) * 6;
            return <g key={i}>
              <ellipse cx={x} cy={650 + h - 6} rx="9" ry="14" />
              <rect x={x - 7} y={650} width="14" height={h - 6} />
            </g>;
          })}
        </g>
        {/* orange/navy banner */}
        <rect x="640" y="620" width="320" height="14" fill="#e87722" />
        <rect x="640" y="634" width="320" height="14" fill="#03244d" />
      </svg>
      <Particles count={30} color="rgba(255,235,200,0.85)" spd={36} size={2.4} />
      <div className="absolute font-mono uppercase" style={{ right: 22, bottom: 18, color: "rgba(255,235,200,0.75)", fontSize: "10px", letterSpacing: "0.22em" }}>Toomer's Corner · Auburn · War Eagle</div>
    </div>
  );
}

// ---- Chelsea, Stamford Bridge ----
function BgChelsea() {
  return (
    <div className="absolute inset-0 grain" aria-hidden style={{ overflow: "hidden" }}>
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #08183a 0%, #0a2a66 26%, #1c4694 56%, #2f76b8 84%, #cfe1ee 100%)",
      }} />
      {/* stadium floodlight glow */}
      <div className="absolute" style={{ left: "24%", top: "4%", width: 280, height: 220, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,255,235,0.55), transparent 65%)", filter: "blur(30px)" }} />
      <div className="absolute" style={{ left: "66%", top: "4%", width: 280, height: 220, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,255,235,0.55), transparent 65%)", filter: "blur(30px)" }} />
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="che-stand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a2a66" /><stop offset="100%" stopColor="#02103a" />
          </linearGradient>
          <linearGradient id="che-pitch" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a8a4a" /><stop offset="100%" stopColor="#1c5028" />
          </linearGradient>
        </defs>
        {/* floodlight pylons */}
        <g stroke="rgba(20,10,16,0.95)" strokeWidth="3" fill="none">
          <line x1="220" y1="120" x2="200" y2="500" />
          <line x1="1380" y1="120" x2="1400" y2="500" />
        </g>
        <g fill="rgba(20,10,16,0.95)">
          <rect x="180" y="105" width="80" height="22" />
          <rect x="1340" y="105" width="80" height="22" />
        </g>
        {/* light rays from floodlights */}
        <g>
          <polygon points="220,127 80,500 360,500" fill="rgba(255,255,225,0.06)" />
          <polygon points="1380,127 1240,500 1520,500" fill="rgba(255,255,225,0.06)" />
        </g>
        {/* upper roof of stand */}
        <path d="M0,300 Q 800,250 1600,300 L 1600,360 L 0,360 Z" fill="rgba(8,16,40,0.95)" />
        {/* stadium stand: bowl */}
        <path d="M0,360 Q 800,420 1600,360 L 1600,640 L 0,640 Z" fill="url(#che-stand)" />
        {/* crowd: blue specks */}
        <g>
          {[...Array(700)].map((_, i) => {
            const x = (i * 23) % 1600;
            const y = 380 + (i * 13 % 240);
            const c = i % 5 === 0 ? "rgba(255,255,255,0.9)" : i % 7 === 0 ? "rgba(95,169,227,0.85)" : "rgba(40,90,170,0.7)";
            return <rect key={i} x={x} y={y} width="2" height="2.5" fill={c} />;
          })}
        </g>
        {/* hospitality boxes / advertising line */}
        <rect x="0" y="540" width="1600" height="22" fill="rgba(255,255,255,0.95)" />
        <rect x="0" y="540" width="1600" height="22" fill="rgba(95,169,227,0.6)" />
        {/* pitch */}
        <path d="M0,640 Q 800,600 1600,640 L 1600,900 L 0,900 Z" fill="url(#che-pitch)" />
        {/* pitch stripes */}
        {[...Array(10)].map((_, i) => (
          <path key={i} d={`M0,${660 + i * 22} Q 800,${620 + i * 24} 1600,${660 + i * 22}`} stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
        ))}
        {/* center circle */}
        <ellipse cx="800" cy="780" rx="80" ry="22" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
        <line x1="800" y1="700" x2="800" y2="900" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        {/* goal */}
        <rect x="700" y="780" width="200" height="3" fill="rgba(255,255,255,0.75)" />
      </svg>
      <Particles count={22} color="rgba(255,235,200,0.6)" spd={36} size={1.8} />
      <div className="absolute font-mono uppercase" style={{ right: 22, bottom: 18, color: "rgba(220,235,255,0.75)", fontSize: "10px", letterSpacing: "0.22em" }}>Stamford Bridge · Chelsea · matchday</div>
    </div>
  );
}

// ---- Camden Yards ----
function BgCamden() {
  return (
    <div className="absolute inset-0 grain" aria-hidden style={{ overflow: "hidden" }}>
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #0c1224 0%, #1c1a36 24%, #401a26 50%, #93421e 80%, #df4601 100%)",
      }} />
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="cy-warehouse" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7a3416" /><stop offset="100%" stopColor="#3e1808" />
          </linearGradient>
          <linearGradient id="cy-grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a8a4a" /><stop offset="100%" stopColor="#1c5028" />
          </linearGradient>
        </defs>
        {/* B&O warehouse: long building, characteristic */}
        <rect x="80" y="320" width="1280" height="220" fill="url(#cy-warehouse)" />
        {/* roof line */}
        <rect x="80" y="312" width="1280" height="10" fill="rgba(20,8,4,0.95)" />
        {/* warehouse window grid: 6 floors x 32 columns */}
        <g>
          {[...Array(6)].map((_, r) => (
            [...Array(32)].map((_, c) => (
              <rect key={r + "-" + c}
                x={100 + c * 39} y={336 + r * 32}
                width="22" height="20"
                fill={Math.random() > 0.45 ? "rgba(255,210,150,0.7)" : "rgba(40,16,8,0.85)"}
                stroke="rgba(20,8,4,0.5)" strokeWidth="0.4" />
            ))
          ))}
        </g>
        {/* "BOSTON & OHIO" suggestion line: abstract not literal */}
        <rect x="600" y="294" width="240" height="14" fill="rgba(20,8,4,0.95)" />
        {/* stadium light towers */}
        <g stroke="rgba(20,8,4,0.95)" strokeWidth="3" fill="none">
          <line x1="200" y1="120" x2="200" y2="320" />
          <line x1="1400" y1="120" x2="1400" y2="320" />
        </g>
        <g fill="rgba(20,8,4,0.95)">
          <rect x="170" y="105" width="60" height="20" />
          <rect x="1370" y="105" width="60" height="20" />
        </g>
        <polygon points="200,125 60,420 340,420" fill="rgba(255,255,225,0.10)" />
        <polygon points="1400,125 1260,420 1540,420" fill="rgba(255,255,225,0.10)" />
        {/* upper deck stadium curving in front of warehouse */}
        <path d="M0,540 Q 800,500 1600,540 L 1600,640 L 0,640 Z" fill="rgba(8,4,12,0.92)" />
        {/* crowd */}
        <g>
          {[...Array(380)].map((_, i) => {
            const x = (i * 23) % 1600;
            const y = 555 + (i * 11 % 80);
            const c = i % 6 === 0 ? "rgba(223,70,1,0.85)" : i % 9 === 0 ? "rgba(255,230,200,0.6)" : "rgba(40,20,12,0.85)";
            return <rect key={i} x={x} y={y} width="2.4" height="2.8" fill={c} />;
          })}
        </g>
        {/* dugout / wall */}
        <rect x="0" y="640" width="1600" height="20" fill="rgba(40,18,10,0.95)" />
        {/* outfield wall padding */}
        <rect x="0" y="660" width="1600" height="14" fill="rgba(20,40,30,0.92)" />
        {/* field */}
        <path d="M0,674 Q 800,640 1600,674 L 1600,900 L 0,900 Z" fill="url(#cy-grass)" />
        {/* foul lines */}
        <line x1="800" y1="900" x2="0" y2="700" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
        <line x1="800" y1="900" x2="1600" y2="700" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
        {/* infield dirt arc */}
        <path d="M520,900 Q 800,720 1080,900 Z" fill="rgba(160,100,60,0.85)" />
        {/* pitcher mound + plate */}
        <ellipse cx="800" cy="820" rx="22" ry="6" fill="rgba(160,100,60,0.95)" />
        <ellipse cx="800" cy="892" rx="6" ry="2.5" fill="rgba(255,255,255,0.95)" />
      </svg>
      <Particles count={28} color="rgba(255,210,160,0.65)" spd={42} size={2} />
      <div className="absolute font-mono uppercase" style={{ right: 22, bottom: 18, color: "rgba(255,210,170,0.75)", fontSize: "10px", letterSpacing: "0.22em" }}>Camden Yards · Orioles · first pitch 7:05</div>
    </div>
  );
}

// ---- Key West bar ----
function BgKeyWest() {
  return (
    <div className="absolute inset-0 grain" aria-hidden style={{ overflow: "hidden" }}>
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #f5b67a 0%, #e7724a 30%, #b13c4e 56%, #5a224f 80%, #1d1130 100%)",
      }} />
      {/* setting sun */}
      <div className="absolute" style={{ left: "58%", top: "38%", width: 200, height: 200, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,210,140,0.95), rgba(255,140,80,0.5) 60%, transparent 80%)", filter: "blur(8px)" }} />
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="kw-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a4524e" /><stop offset="100%" stopColor="#2a1024" />
          </linearGradient>
        </defs>
        {/* sun reflection on water */}
        <ellipse cx="1080" cy="610" rx="140" ry="14" fill="rgba(255,180,110,0.55)" filter="blur(2px)" />
        {/* water */}
        <rect x="0" y="580" width="1600" height="180" fill="url(#kw-water)" />
        {/* horizon shimmer */}
        {[...Array(40)].map((_, i) => (
          <rect key={i} x={i * 40} y={620 + (i % 5) * 8} width="20" height="0.8" fill="rgba(255,200,140,0.4)" />
        ))}
        {/* distant boat */}
        <g transform="translate(420,580)">
          <rect x="-14" y="0" width="28" height="6" fill="rgba(20,10,16,0.85)" />
          <polygon points="-2,0 -2,-22 14,0" fill="rgba(20,10,16,0.85)" />
        </g>
        {/* palm trees */}
        {[
          [120, 760, 200],
          [1380, 760, 220],
          [80, 770, 180],
        ].map(([x, y, h], i) => (
          <g key={i}>
            {/* trunk: curved */}
            <path d={`M${x},${y} Q ${x + 10},${y - h * 0.5} ${x + 20},${y - h}`} stroke="rgba(20,10,8,0.95)" strokeWidth="6" fill="none" />
            {/* fronds */}
            <g transform={`translate(${x + 20},${y - h})`}>
              {[-60, -30, 0, 30, 60, 90].map((deg, j) => (
                <path key={j} d={`M0,0 Q ${Math.cos(deg * Math.PI / 180) * 40},${Math.sin(deg * Math.PI / 180) * 40} ${Math.cos(deg * Math.PI / 180) * 80},${Math.sin(deg * Math.PI / 180) * 80 - 15}`}
                  stroke="rgba(20,30,18,0.9)" strokeWidth="3" fill="none" />
              ))}
            </g>
          </g>
        ))}
        {/* tiki bar: open-air thatched roof */}
        <g transform="translate(540,470)">
          {/* posts */}
          <rect x="0" y="80" width="6" height="180" fill="rgba(40,22,14,0.95)" />
          <rect x="200" y="80" width="6" height="180" fill="rgba(40,22,14,0.95)" />
          <rect x="400" y="80" width="6" height="180" fill="rgba(40,22,14,0.95)" />
          <rect x="500" y="80" width="6" height="180" fill="rgba(40,22,14,0.95)" />
          {/* thatched roof: triangular */}
          <polygon points="-40,80 250,-20 540,80" fill="rgba(110,72,30,0.95)" />
          {/* thatch lines */}
          {[...Array(20)].map((_, i) => (
            <line key={i} x1={-40 + i * 30} y1={80 - i * 5} x2={-40 + i * 30 + 10} y2={80 - i * 5 + 15} stroke="rgba(70,40,18,0.7)" strokeWidth="1" />
          ))}
          {/* bar counter */}
          <rect x="0" y="220" width="540" height="40" fill="rgba(60,30,18,0.95)" />
          {/* warm interior glow */}
          <rect x="6" y="80" width="494" height="140" fill="rgba(255,170,80,0.3)" />
          {/* bottles silhouette */}
          {[40, 80, 120, 160, 260, 300, 340, 380, 420, 460].map((bx, i) => (
            <rect key={i} x={bx} y={130 + (i % 3) * 8} width="10" height={40 + i} fill={i % 3 === 0 ? "rgba(80,40,30,0.85)" : i % 3 === 1 ? "rgba(40,80,60,0.85)" : "rgba(180,140,60,0.85)"} />
          ))}
          {/* hanging string lights along bar front */}
          {[...Array(14)].map((_, i) => (
            <g key={i}>
              <circle cx={i * 40 + 10} cy={88 + Math.sin(i * 0.6) * 4} r="2" fill="rgba(255,230,160,0.95)" />
              <circle cx={i * 40 + 10} cy={88 + Math.sin(i * 0.6) * 4} r="6" fill="rgba(255,230,160,0.4)" filter="blur(2px)" />
            </g>
          ))}
        </g>
        {/* foreground: sandy deck */}
        <rect x="0" y="730" width="1600" height="170" fill="rgba(40,22,14,0.95)" />
        {/* deck planks */}
        {[...Array(12)].map((_, i) => (
          <line key={i} x1="0" y1={740 + i * 14} x2="1600" y2={740 + i * 14} stroke="rgba(20,10,6,0.6)" strokeWidth="1" />
        ))}
        {/* people silhouettes at the bar */}
        <g fill="rgba(20,10,8,0.95)">
          {[600, 700, 820, 940, 1010].map((x, i) => (
            <g key={i}>
              <ellipse cx={x} cy={685} rx="10" ry="14" />
              <rect x={x - 8} y={695} width="16" height="42" />
            </g>
          ))}
        </g>
      </svg>
      <Particles count={20} color="rgba(255,220,170,0.6)" spd={42} size={2} />
      <div className="absolute font-mono uppercase" style={{ right: 22, bottom: 18, color: "rgba(255,220,180,0.8)", fontSize: "10px", letterSpacing: "0.22em" }}>Key West · Mallory Square · sunset hour</div>
    </div>
  );
}

// ---- Ski slope ----
function BgSki() {
  return (
    <div className="absolute inset-0 grain" aria-hidden style={{ overflow: "hidden" }}>
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #cee0ec 0%, #aac4d8 30%, #d0c4d2 56%, #f3c79c 84%, #e69770 100%)",
      }} />
      <div className="absolute" style={{ left: "68%", top: "34%", width: 240, height: 240, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,250,225,0.9), rgba(255,220,180,0.4) 60%, transparent 80%)", filter: "blur(8px)" }} />
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="ski-snow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fafcff" /><stop offset="100%" stopColor="#c2cfdb" />
          </linearGradient>
          <linearGradient id="ski-rock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7a8a9a" /><stop offset="100%" stopColor="#3a4858" />
          </linearGradient>
        </defs>
        {/* mountain peaks far */}
        <polygon points="0,520 220,300 380,440 520,260 720,420 880,300 1080,440 1260,260 1420,400 1600,310 1600,560 0,560" fill="url(#ski-rock)" opacity="0.7" />
        {/* snow caps */}
        <g fill="url(#ski-snow)">
          <polygon points="180,330 220,300 260,330 240,360 200,360" />
          <polygon points="490,290 520,260 560,290 540,320 510,320" />
          <polygon points="850,330 880,300 910,330 890,360 860,360" />
          <polygon points="1230,290 1260,260 1300,290 1280,320 1250,320" />
          <polygon points="1570,340 1600,310 1600,360" />
        </g>
        {/* mid mountain: closer ridge */}
        <polygon points="0,640 200,500 420,580 600,460 800,540 1000,480 1200,560 1400,490 1600,580 1600,720 0,720" fill="rgba(180,200,220,0.7)" />
        <polygon points="0,640 200,500 420,580 600,460 800,540 1000,480 1200,560 1400,490 1600,580 1600,640" fill="url(#ski-snow)" opacity="0.35" />
        {/* main slope foreground */}
        <path d="M0,720 Q 800,680 1600,720 L 1600,900 L 0,900 Z" fill="url(#ski-snow)" />
        {/* slope shadows (curves) */}
        <path d="M200,760 Q 600,800 900,820 Q 1200,840 1400,830" stroke="rgba(120,140,160,0.35)" strokeWidth="14" fill="none" opacity="0.5" />
        <path d="M100,800 Q 500,840 1100,860" stroke="rgba(120,140,160,0.3)" strokeWidth="20" fill="none" opacity="0.45" />
        {/* pine trees scattered on slope */}
        <g fill="rgba(20,40,28,0.95)">
          {[
            [80, 640], [140, 690], [220, 650], [260, 720], [330, 680], [400, 720], [480, 650], [540, 710],
            [620, 680], [700, 720], [780, 660], [860, 710], [940, 680], [1020, 710], [1100, 660], [1180, 710],
            [1260, 680], [1340, 720], [1420, 660], [1500, 710], [1560, 680]
          ].map(([x, y], i) => (
            <g key={i}>
              <polygon points={`${x},${y} ${x - 12},${y + 30} ${x + 12},${y + 30}`} />
              <polygon points={`${x},${y - 10} ${x - 16},${y + 20} ${x + 16},${y + 20}`} />
              <rect x={x - 2} y={y + 30} width="4" height="8" fill="rgba(60,30,18,0.95)" />
              {/* snow on tree */}
              <ellipse cx={x} cy={y - 8} rx="6" ry="3" fill="rgba(255,255,255,0.85)" />
              <ellipse cx={x - 8} cy={y + 18} rx="4" ry="2" fill="rgba(255,255,255,0.8)" />
              <ellipse cx={x + 10} cy={y + 22} rx="4" ry="2" fill="rgba(255,255,255,0.8)" />
            </g>
          ))}
        </g>
        {/* chair lift */}
        <g stroke="rgba(40,30,30,0.9)" strokeWidth="2" fill="none">
          <line x1="0" y1="600" x2="1600" y2="380" />
          <line x1="0" y1="612" x2="1600" y2="392" />
        </g>
        {/* lift towers */}
        {[200, 600, 1000, 1400].map((x, i) => {
          const y = 600 - (x / 1600) * 220;
          return <g key={i}>
            <rect x={x - 2} y={y} width="4" height="80" fill="rgba(40,30,30,0.95)" />
            <rect x={x - 12} y={y - 4} width="24" height="6" fill="rgba(40,30,30,0.95)" />
          </g>;
        })}
        {/* chairs on lift cable */}
        {[120, 380, 660, 920, 1180, 1440].map((x, i) => {
          const y = 612 - (x / 1600) * 220;
          return <g key={i}>
            <line x1={x} y1={y} x2={x} y2={y + 18} stroke="rgba(40,30,30,0.95)" strokeWidth="1.5" />
            <rect x={x - 9} y={y + 18} width="18" height="10" fill="rgba(180,40,40,0.9)" />
          </g>;
        })}
        {/* skiers on slope */}
        {[
          [320, 810], [560, 840], [780, 830], [1040, 860], [1260, 840]
        ].map(([x, y], i) => (
          <g key={i}>
            {/* tracks behind */}
            <path d={`M${x - 24},${y + 18} Q ${x - 12},${y + 12} ${x},${y + 8}`} stroke="rgba(120,140,160,0.5)" strokeWidth="2" fill="none" />
            <path d={`M${x - 22},${y + 22} Q ${x - 10},${y + 16} ${x + 2},${y + 12}`} stroke="rgba(120,140,160,0.5)" strokeWidth="2" fill="none" />
            {/* body */}
            <rect x={x - 3} y={y - 8} width="6" height="14" fill={i % 3 === 0 ? "#c44" : i % 3 === 1 ? "#246" : "#284"} />
            <circle cx={x} cy={y - 12} r="3.5" fill="rgba(40,30,30,0.95)" />
            {/* skis */}
            <line x1={x - 8} y1={y + 8} x2={x + 8} y2={y + 8} stroke="rgba(40,30,30,0.95)" strokeWidth="1.5" />
          </g>
        ))}
      </svg>
      <Snow count={70} />
      <div className="absolute font-mono uppercase" style={{ right: 22, bottom: 18, color: "rgba(40,40,60,0.7)", fontSize: "10px", letterSpacing: "0.22em" }}>Stowe · Vermont · fresh powder</div>
    </div>
  );
}

export { BgBeaconHill, BgSeaport, BgCapeMorning, BgNorthEnd, BgAuburn, BgChelsea, BgCamden, BgKeyWest, BgSki };
export { BgBeaconHill as BgWeekdayAM };
export { BgSeaport as BgWeekdayPM };
export { BgCapeMorning as BgWeekendAM };
export { BgNorthEnd as BgWeekendPM };
