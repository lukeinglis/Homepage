---
tags:
  - factory
  - research
  - personal-website
  - links
topic: Old site link structure and categorization
date: 2026-05-02
source: factory-archivist
---

# Old Site Link Structure

## Source
Old site JSON configs at `old-site-reference/config/`.

## Findings

The old site used a master catalog + per-day override pattern:
- `sites.json`: Master catalog with 6 sections, ~30 links total
- `day-0.json` through `day-7.json`: Per-day overrides selecting subsets
- `day-template.json`: Empty template for unused days

### Sections (6 total)
1. **Socials** (4): Twitter/X, Instagram, Reddit, YouTube
2. **Sports News** (3): Auburn On3, Auburn Message Board, Chelsea FC
3. **Sports Betting** (5): DraftKings, Action Network, KenPom, ETR, Fantasy Labs
4. **Fantasy Sports** (5): ESPN Fantasy Baseball, Yahoo FF x3, Sleeper
5. **Professional** (3): Gmail, Yahoo Mail, LinkedIn
6. **Finances** (4): Bank placeholders (need real URLs)

### Link Properties
Each link had: `name/label`, `url`, `type` (link or iframe), `icon` (Lucide name or emoji), `color`, `hover`, `extra` (Tailwind classes).

### Day Distribution Pattern
- **Day 7 (Sunday/home)**: Most populated, all 6 sections
- **Weekdays (day-1 through day-5)**: Sparser, typically Quick Access + Social Media
- **Day 0**: Include directive pointing to another file

### Section/Target Pattern
Day configs used named sections with target IDs:
```json
{
  "sections": [
    { "target": "quick", "title": "Quick Access", "links": [...] },
    { "target": "social", "title": "Social Media", "links": [...] }
  ]
}
```

## Gap vs Current Site
| Feature | Old Site | Current Site |
|---------|----------|--------------|
| Links per day | 10-20+ across sections | 4 flat links |
| Organization | Named sections | Single array |
| Unique links | ~30 | ~12 (duplicated) |
| Styling | Per-link Tailwind | None (theme-driven) |
| Embedded content | iframe support | Not supported |

## Relevance
Directly informs [[personal-website]] Issue #1 (port personalized links). The sectioned approach should be replicated via a `LinkSection` type in the current site's config.
