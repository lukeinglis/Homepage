// Tiny inline SVG icons. We avoid loading the lucide pack at runtime —
// these are just the ones we actually use, drawn lightly.
function Icon({ name, size=16, stroke=1.6, className="" }) {
  const s = size, sw = stroke;
  const common = { width:s, height:s, viewBox:"0 0 24 24", fill:"none",
    stroke:"currentColor", strokeWidth:sw, strokeLinecap:"round",
    strokeLinejoin:"round", className };
  switch(name){
    case "command":   return <svg {...common}><path d="M9 7a2 2 0 1 0-2 2h10a2 2 0 1 0-2-2v10a2 2 0 1 0 2-2H7a2 2 0 1 0 2 2z"/></svg>;
    case "search":    return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "clock":     return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "calendar":  return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>;
    case "mail":      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></svg>;
    case "video":     return <svg {...common}><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/></svg>;
    case "play":      return <svg {...common}><path d="M7 5v14l12-7z" fill="currentColor" stroke="none"/></svg>;
    case "pause":     return <svg {...common}><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/></svg>;
    case "skip":      return <svg {...common}><path d="m5 5 9 7-9 7zM18 5v14"/></svg>;
    case "sun":       return <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></svg>;
    case "moon":      return <svg {...common}><path d="M21 13a9 9 0 1 1-10-10 7 7 0 0 0 10 10z"/></svg>;
    case "cloud":     return <svg {...common}><path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11-2 4 4 0 0 0 1 10z"/></svg>;
    case "cloud-rain":return <svg {...common}><path d="M7 14h10a4 4 0 0 0 0-8 6 6 0 0 0-11-2 4 4 0 0 0 1 10z"/><path d="M9 19v2M13 19v2M17 19v2"/></svg>;
    case "cloud-sun": return <svg {...common}><circle cx="7" cy="8" r="2.5"/><path d="M7 2v1.5M7 12.5V14M2.5 8H1M13 8h-1.5M3.8 4.8 3 4M11 4l-.8.8"/><path d="M10 18h7a3.5 3.5 0 0 0 0-7 5 5 0 0 0-9-1"/></svg>;
    case "tv":        return <svg {...common}><rect x="3" y="5" width="18" height="13" rx="2"/><path d="M8 21h8M12 18v3"/></svg>;
    case "trophy":    return <svg {...common}><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M5 4H3v2a3 3 0 0 0 3 3M19 4h2v2a3 3 0 0 1-3 3"/></svg>;
    case "flame":     return <svg {...common}><path d="M12 3s4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 1-4-2 1-4 4-4 7a7 7 0 0 0 14 0c0-5-4-8-7-11z"/></svg>;
    case "chef":      return <svg {...common}><path d="M7 21h10M8 21v-7M16 21v-7M6 14h12c2 0 3-2 3-4a4 4 0 0 0-4-4 4 4 0 0 0-7 0 4 4 0 0 0-4 4c0 2 1 4 3 4z"/></svg>;
    case "shopping":  return <svg {...common}><path d="M5 7h14l-1.5 11a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>;
    case "music":     return <svg {...common}><path d="M9 18V6l11-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>;
    case "headphones":return <svg {...common}><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><rect x="3" y="14" width="5" height="7" rx="2"/><rect x="16" y="14" width="5" height="7" rx="2"/></svg>;
    case "stock":     return <svg {...common}><path d="M3 17 9 11l4 4 8-8"/><path d="M14 4h7v7"/></svg>;
    case "wallet":    return <svg {...common}><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 14h2"/></svg>;
    case "github":    return <svg {...common}><path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>;
    case "claude":    return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M9 9c0 4 6 4 6 0M9 15c0-4 6-4 6 0"/></svg>;
    case "doc":       return <svg {...common}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M9 14h6M9 18h4"/></svg>;
    case "slide":     return <svg {...common}><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>;
    case "sheet":     return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16M15 4v16"/></svg>;
    case "slack":     return <svg {...common}><rect x="3" y="10" width="8" height="3" rx="1.5"/><rect x="13" y="11" width="3" height="8" rx="1.5"/><rect x="11" y="3" width="3" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="3" rx="1.5"/></svg>;
    case "jira":      return <svg {...common}><path d="M12 3 3 12l4 4 5-5 5 5 4-4z"/></svg>;
    case "obsidian":  return <svg {...common}><path d="m12 3 7 5-1.5 11-5.5 2-5.5-2L5 8z"/><path d="m9 14 3-7 3 7-3 4z"/></svg>;
    case "bookmark":  return <svg {...common}><path d="M6 3h12v18l-6-4-6 4z"/></svg>;
    case "list":      return <svg {...common}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
    case "sparkles":  return <svg {...common}><path d="m12 4 1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6zM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z"/></svg>;
    case "pin":       return <svg {...common}><path d="M12 2 9 7l-5 1 4 4-1 5 5-3 5 3-1-5 4-4-5-1z"/></svg>;
    case "link":      return <svg {...common}><path d="M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 1 0-5.6-5.6l-1 1"/><path d="M14 10a4 4 0 0 0-5.6 0l-3 3a4 4 0 1 0 5.6 5.6l1-1"/></svg>;
    case "circle":    return <svg {...common}><circle cx="12" cy="12" r="9"/></svg>;
    case "dot":       return <svg {...common}><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/></svg>;
    case "arrow-up":  return <svg {...common}><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
    case "arrow-dn":  return <svg {...common}><path d="M12 5v14M19 12l-7 7-7-7"/></svg>;
    case "wand":      return <svg {...common}><path d="M14 4 4 14l3 3 10-10z"/><path d="M19 9V5M22 7h-4M14 21v-4M16 19h-4"/></svg>;
    case "external":  return <svg {...common}><path d="M14 5h5v5M19 5l-9 9M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5"/></svg>;
    case "chevron":   return <svg {...common}><path d="m9 6 6 6-6 6"/></svg>;
    default:          return <svg {...common}><circle cx="12" cy="12" r="3"/></svg>;
  }
}
window.Icon = Icon;
