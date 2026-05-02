import { useState } from "preact/hooks";

interface QuickLink {
  name: string;
  url: string;
  icon?: string;
}

interface LinkSection {
  title: string;
  icon?: string;
  links: QuickLink[];
}

interface Props {
  links: QuickLink[];
  linkSections?: LinkSection[];
}

function CollapsibleSection({ section }: { section: LinkSection }) {
  const [open, setOpen] = useState(true);

  return (
    <div class="link-section">
      <button
        class="link-section-header"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        type="button"
      >
        {section.icon && <span class="link-section-icon">{section.icon}</span>}
        <span class="link-section-title">{section.title}</span>
        <span class={`link-section-chevron ${open ? "link-section-chevron-open" : ""}`}>
          &#9656;
        </span>
      </button>
      {open && (
        <nav class="quick-links-grid" aria-label={`${section.title} links`}>
          {section.links.map((link) => (
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
      )}
    </div>
  );
}

export function QuickLinksWidget({ links, linkSections }: Props) {
  const hasLinks = links && links.length > 0;
  const hasSections = linkSections && linkSections.length > 0;

  if (!hasLinks && !hasSections) {
    return (
      <div class="widget quick-links-widget">
        <p class="quick-links-empty">No links configured</p>
      </div>
    );
  }

  return (
    <div class="widget quick-links-widget">
      <h2 class="quick-links-title">Quick Links</h2>
      {hasLinks && (
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
      )}
      {hasSections &&
        linkSections.map((section) => (
          <CollapsibleSection key={section.title} section={section} />
        ))}
    </div>
  );
}
