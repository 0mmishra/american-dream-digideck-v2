import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import '../styles/simulator.css';

const BRANDS = ['Nike', 'Apple', 'Zara', 'Sephora'];

const zoneData = {
  'Luxury Avenue': {
    traffic: 40000,
    dwell: '45 mins',
    engagement: 'High',
  },
  'Theme Park Zone': {
    traffic: 80000,
    dwell: '70 mins',
    engagement: 'Very High',
  },
  'Water Park Zone': {
    traffic: 60000,
    dwell: '60 mins',
    engagement: 'High',
  },
  'Dining District': {
    traffic: 50000,
    dwell: '50 mins',
    engagement: 'Medium-High',
  },
};

const zoneOptions = Object.keys(zoneData);

function BrandSimulator({ isOpen, onClose, onDecisionRequest }) {
  const [selectedBrand, setSelectedBrand] = useState(BRANDS[0]);
  const [selectedZone, setSelectedZone] = useState(zoneOptions[0]);
  const [trafficCount, setTrafficCount] = useState(0);

  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const metricsRef = useRef([]);
  const messageRef = useRef(null);
  const countTweenRef = useRef(null);

  const selectedImpact = useMemo(() => zoneData[selectedZone], [selectedZone]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power3.out' }
      );

      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.95, y: 18 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }, overlayRef);

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
      ctx.revert();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !selectedImpact) return undefined;

    const countTarget = { value: 0 };
    countTweenRef.current?.kill();
    setTrafficCount(0);

    const ctx = gsap.context(() => {
      gsap.set(metricsRef.current, { opacity: 0, y: 20 });
      gsap.set(messageRef.current, { opacity: 0, y: 10 });

      countTweenRef.current = gsap.to(countTarget, {
        value: selectedImpact.traffic,
        duration: 1.1,
        ease: 'power3.out',
        onUpdate: () => setTrafficCount(Math.round(countTarget.value)),
      });

      gsap.to(metricsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
      });

      gsap.to(messageRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.45,
      });
    }, cardRef);

    return () => {
      countTweenRef.current?.kill();
      ctx.revert();
    };
  }, [isOpen, selectedImpact, selectedBrand]);

  const setMetricRef = (element, index) => {
    metricsRef.current[index] = element;
  };

  return (
    <>
      {isOpen && (
        <div
          className="brand-simulator-overlay"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="brand-simulator-title"
        >
          <button
            className="brand-simulator-close"
            type="button"
            onClick={onClose}
            aria-label="Close brand impact simulator"
          >
            X
          </button>

          <section className="brand-simulator-card" ref={cardRef}>
            <p className="brand-simulator-kicker">Brand Impact Simulator</p>
            <h2 id="brand-simulator-title">See where attention converts.</h2>

            <div className="brand-simulator-controls">
              <label>
                <span>Brand</span>
                <select
                  value={selectedBrand}
                  onChange={(event) => setSelectedBrand(event.target.value)}
                >
                  {BRANDS.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Zone</span>
                <select
                  value={selectedZone}
                  onChange={(event) => setSelectedZone(event.target.value)}
                >
                  {zoneOptions.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="brand-simulator-context">
              {selectedBrand} in {selectedZone}
            </div>

            <div className="brand-simulator-results" aria-live="polite">
              <article ref={(element) => setMetricRef(element, 0)}>
                <span>Estimated Daily Footfall</span>
                <strong>{trafficCount.toLocaleString()}</strong>
              </article>

              <article ref={(element) => setMetricRef(element, 1)}>
                <span>Average Dwell Time</span>
                <strong>{selectedImpact.dwell}</strong>
              </article>

              <article ref={(element) => setMetricRef(element, 2)}>
                <span>Engagement Level</span>
                <strong>{selectedImpact.engagement}</strong>
              </article>
            </div>

            <p className="brand-simulator-message" ref={messageRef}>
              You don't just rent space here. You own attention.
            </p>

            <button
              className="brand-decision-button"
              type="button"
              onClick={() => onDecisionRequest?.(selectedBrand, selectedZone)}
            >
              Why this works for you
            </button>
          </section>
        </div>
      )}
    </>
  );
}

export default BrandSimulator;
