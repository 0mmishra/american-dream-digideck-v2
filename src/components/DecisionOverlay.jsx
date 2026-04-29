import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';

const decisionData = {
  hero: {
    zone: 'the property',
    traffic: 65000,
    dwell: '58 mins',
    audience: 'multi-intent, discovery-led',
    insight:
      'This gives your brand the rare combination of scale, intent, and repeated exposure. You are not waiting for attention. The environment is already creating it.',
  },
  retail: {
    zone: 'Retail',
    traffic: 70000,
    dwell: '55 mins',
    audience: 'shopping-ready, digitally fluent',
    insight:
      'Retail works because visitors are already comparing, discovering, and deciding. Your brand can convert curiosity into purchase without forcing a change in behavior.',
  },
  luxury: {
    zone: 'Luxury',
    traffic: 40000,
    dwell: '45 mins',
    audience: 'premium, high-income',
    insight:
      'Luxury is about controlled scarcity and confidence. This zone surrounds your brand with the right context, so presence becomes status instead of simple visibility.',
  },
  dining: {
    zone: 'Dining',
    traffic: 50000,
    dwell: '50 mins',
    audience: 'social, lifestyle-driven',
    insight:
      'Dining creates time, conversation, and memory. Your brand benefits from visitors who are relaxed, receptive, and spending longer inside the experience.',
  },
  attractions: {
    zone: 'Attractions',
    traffic: 80000,
    dwell: '70 mins',
    audience: 'high-energy, youth-heavy',
    insight:
      'Attractions create emotion at scale. For your brand, that means high recall, repeat visits, and moments people actively want to share.',
  },
  events: {
    zone: 'Events',
    traffic: 62000,
    dwell: '65 mins',
    audience: 'activated, trend-aware',
    insight:
      'Events turn attention into momentum. This is where your brand can own a cultural moment instead of simply occupying media space.',
  },
};

const zoneAliases = {
  'Luxury Avenue': 'luxury',
  'Theme Park Zone': 'attractions',
  'Water Park Zone': 'attractions',
  'Dining District': 'dining',
  Luxury: 'luxury',
  Retail: 'retail',
  Dining: 'dining',
  Attractions: 'attractions',
  Events: 'events',
};

function resolveZoneKey(zone) {
  return zoneAliases[zone] || zone || 'hero';
}

function formatTraffic(value) {
  return value.toLocaleString();
}

function DecisionOverlay({ brand = 'Your Brand', zone = 'retail', isOpen, onClose }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const headlineRef = useRef(null);
  const bulletRefs = useRef([]);
  const insightRef = useRef(null);
  const finalRef = useRef(null);

  const pitch = useMemo(() => {
    const zoneKey = resolveZoneKey(zone);
    return decisionData[zoneKey] || decisionData.retail;
  }, [zone]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.98, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'power3.out' }
      );

      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.62, ease: 'power3.out', delay: 0.08 }
      );

      gsap.fromTo(
        bulletRefs.current,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.09,
          delay: 0.28,
        }
      );

      gsap.fromTo(
        insightRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.56, ease: 'power3.out', delay: 0.58 }
      );

      gsap.fromTo(
        finalRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.62, ease: 'power3.out', delay: 0.86 }
      );
    }, overlayRef);

    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
      ctx.revert();
    };
  }, [isOpen, onClose, pitch]);

  if (!isOpen) return null;

  const points = [
    ['Daily footfall', formatTraffic(pitch.traffic)],
    ['Dwell time', pitch.dwell],
    ['Audience', pitch.audience],
  ];

  return (
    <div className="decision-overlay" ref={overlayRef} role="dialog" aria-modal="true">
      <button className="decision-close" type="button" onClick={onClose} aria-label="Close decision overlay">
        X
      </button>

      <section className="decision-panel" ref={panelRef}>
        <div className="decision-container">
          <p className="decision-kicker">Smart Decision Overlay</p>
          <h2 ref={headlineRef}>
            For {brand}, this is not just presence. It is dominance in {pitch.zone}.
          </h2>

          <div className="decision-cards">
            {points.map(([label, value], index) => (
              <article className="decision-card" key={label} ref={(element) => { bulletRefs.current[index] = element; }}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>

          <p className="decision-insight" ref={insightRef}>{pitch.insight}</p>
          <p className="decision-final" ref={finalRef}>You do not just exist here. You lead.</p>
        </div>
      </section>
    </div>
  );
}

export default DecisionOverlay;
