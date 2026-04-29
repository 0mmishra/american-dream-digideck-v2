import { ArrowUp } from 'lucide-react';

function SectionNavigation({ items, activeSection, onNavigate }) {
  return (
    <>
      <nav className="section-nav" aria-label="Section navigation">
        {items.map((item) => {
          const isActive = item.id === activeSection;

          return (
            <button
              key={item.id}
              type="button"
              className={`section-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'true' : undefined}
            >
              <span className="section-nav-dot" />
              <span className="section-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        className="back-to-top"
        onClick={() => onNavigate('hero')}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </>
  );
}

export default SectionNavigation;
