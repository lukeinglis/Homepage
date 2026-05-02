interface QuickLink {
  name: string;
  url: string;
  icon?: string;
}

interface Props {
  links: QuickLink[];
}

export function QuickLinksWidget({ links }: Props) {
  if (!links || links.length === 0) {
    return (
      <div class="widget quick-links-widget">
        <p class="quick-links-empty">No links configured</p>
      </div>
    );
  }

  return (
    <div class="widget quick-links-widget">
      <h2 class="quick-links-title">Quick Links</h2>
      <nav class="quick-links-grid" aria-label="Quick links">
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            class="quick-link-card"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
          >
            {link.icon && <span class="quick-link-icon">{link.icon}</span>}
            <span class="quick-link-name">{link.name}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
