import { CalendarDays, Gem, Grid3X3, Home, Landmark, ShoppingBag, Utensils, Waves, X } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const ICONS = {
  hero: Home,
  retail: ShoppingBag,
  luxury: Gem,
  dining: Utensils,
  attractions: Waves,
  events: CalendarDays,
};

function CanvasNavigation({
  modules,
  activeModule,
  isMenuOpen,
  onNavigate,
  onOpenMenu,
  onCloseMenu,
}) {
  const navRef = useRef(null);

  useLayoutEffect(() => {
    if (!navRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <header className="canvas-topbar">
        <span className="canvas-brand-mark" aria-hidden="true">
          <Landmark size={18} />
        </span>
        <button type="button" className="module-menu-trigger" onClick={onOpenMenu} aria-label="Open module menu">
          <Grid3X3 size={18} />
        </button>
      </header>

      <nav ref={navRef} className="canvas-side-nav" aria-label="Module navigation">
        {modules.map((module) => {
          const isActive = module.id === activeModule;
          const Icon = ICONS[module.id] || Grid3X3;

          return (
            <button
              key={module.id}
              type="button"
              className={`canvas-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(module.id)}
              aria-current={isActive ? 'true' : undefined}
              aria-label={module.label}
            >
              <Icon size={18} />
              <span className="nav-tooltip">{module.label}</span>
            </button>
          );
        })}
      </nav>

      {isMenuOpen && (
        <div className="module-menu-overlay" role="dialog" aria-modal="true" aria-label="Choose module">
          <button type="button" className="menu-close icon-button" onClick={onCloseMenu} aria-label="Close menu">
            <X size={20} />
          </button>
          <div className="module-menu-grid">
            {modules.map((module) => (
              <button
                key={module.id}
                type="button"
                className={`module-menu-card ${module.id === activeModule ? 'active' : ''}`}
                onClick={() => onNavigate(module.id)}
              >
                <span>{module.eyebrow}</span>
                <strong>{module.label}</strong>
                <p>{module.detail}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default CanvasNavigation;
