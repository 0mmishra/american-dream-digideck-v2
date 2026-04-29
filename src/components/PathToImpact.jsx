import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const journeySteps = [
  {
    label: 'Entry / Arrival',
    shortLabel: 'Entry',
    footfall: '90K',
    dwell: '8 mins',
    insight: 'First impression. Visitors orient, scan, and choose their path.',
    x: 90,
    y: 250,
  },
  {
    label: 'Retail',
    shortLabel: 'Retail',
    footfall: '70K',
    dwell: '55 mins',
    insight: 'High intent discovery. Visitors are comparing, deciding.',
    x: 300,
    y: 150,
  },
  {
    label: 'Dining',
    shortLabel: 'Dining',
    footfall: '50K',
    dwell: '50 mins',
    insight: 'Extended dwell time increases recall and social conversation.',
    x: 505,
    y: 245,
  },
  {
    label: 'Attractions',
    shortLabel: 'Play',
    footfall: '80K',
    dwell: '70 mins',
    insight: 'Peak emotion creates memory, sharing, and repeat visits.',
    x: 710,
    y: 145,
  },
  {
    label: 'Events',
    shortLabel: 'Events',
    footfall: '62K',
    dwell: '65 mins',
    insight: 'Cultural moments concentrate attention and urgency.',
    x: 920,
    y: 245,
  },
];

function PathToImpact({ brand = 'Your Brand', isOpen, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const overlayRef = useRef(null);
  const bgRef = useRef(null);
  const pathRef = useRef(null);
  const markerRef = useRef(null);
  const panelRef = useRef(null);
  const finalRef = useRef(null);
  const timelineRef = useRef(null);

  const moveMarker = (progress) => {
    const path = pathRef.current;
    const marker = markerRef.current;
    if (!path || !marker) return;

    const totalLength = path.getTotalLength();
    const point = path.getPointAtLength(totalLength * progress);
    gsap.set(marker, { attr: { cx: point.x, cy: point.y } });
  };

  const setPathProgress = (progress) => {
    const path = pathRef.current;
    if (!path) return;

    const totalLength = path.getTotalLength();
    gsap.set(path, { strokeDashoffset: totalLength * (1 - progress) });
  };

  const jumpToStep = (index) => {
    timelineRef.current?.pause();
    const nextProgress = index / (journeySteps.length - 1);
    setIsComplete(false);
    setActiveStep(index);
    setPathProgress(nextProgress);
    moveMarker(nextProgress);
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const path = pathRef.current;
    const totalLength = path.getTotalLength();
    const progressState = { value: 0 };

    setActiveStep(0);
    setIsComplete(false);
    moveMarker(0);

    const ctx = gsap.context(() => {
      gsap.set(path, {
        strokeDasharray: totalLength,
        strokeDashoffset: totalLength,
      });

      gsap.set(panelRef.current, { opacity: 0, y: 20 });
      gsap.set(finalRef.current, { opacity: 0, y: 18 });

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.55, ease: 'power3.out' }
      );

      gsap.to(bgRef.current, {
        xPercent: 1.4,
        yPercent: -1,
        duration: 13,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      timelineRef.current = gsap.timeline({ delay: 0.3 });

      timelineRef.current
        .to(path, {
          strokeDashoffset: 0,
          duration: 2.6,
          ease: 'power3.inOut',
        }, 0)
        .to(progressState, {
          value: 1,
          duration: 7.2,
          ease: 'power2.inOut',
          onUpdate: () => {
            moveMarker(progressState.value);
            const index = Math.min(
              journeySteps.length - 1,
              Math.round(progressState.value * (journeySteps.length - 1))
            );
            setActiveStep(index);
          },
          onComplete: () => {
            setIsComplete(true);
            gsap.to(finalRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
            });
          },
        }, 0.2);
    }, overlayRef);

    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
      timelineRef.current?.kill();
      ctx.revert();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current.querySelectorAll('.path-step-kicker, h2, .path-metric, .path-step-insight'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power3.out',
          stagger: 0.07,
        }
      );
    }, panelRef);

    return () => ctx.revert();
  }, [activeStep, isOpen]);

  const active = journeySteps[activeStep];

  return (
    <>
      {isOpen && (
        <div className="path-impact-overlay" ref={overlayRef} role="dialog" aria-modal="true">
          <div className="path-impact-bg" ref={bgRef} aria-hidden="true" />
          <button className="path-impact-close" type="button" onClick={onClose} aria-label="Close customer journey">
            X
          </button>

          <section className="path-impact-stage">
            <div className="path-impact-copy" ref={panelRef} key={activeStep}>
              <p className="path-step-kicker">{brand} path to impact</p>
              <h2>{active.label}</h2>
              <div className="path-metrics">
                <article className="path-metric">
                  <span>Footfall</span>
                  <strong>{active.footfall}</strong>
                </article>
                <article className="path-metric">
                  <span>Dwell</span>
                  <strong>{active.dwell}</strong>
                </article>
              </div>
              <p className="path-step-insight">{active.insight}</p>
            </div>

            <div className="path-map" aria-label="Customer journey map">
              <svg viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid meet">
                <path
                  className="path-line-ghost"
                  d="M90 250 C190 80 245 85 300 150 C390 260 430 305 505 245 C590 172 640 82 710 145 C790 218 840 302 920 245"
                />
                <path
                  ref={pathRef}
                  className="path-line-active"
                  d="M90 250 C190 80 245 85 300 150 C390 260 430 305 505 245 C590 172 640 82 710 145 C790 218 840 302 920 245"
                />
                <circle ref={markerRef} className="brand-pin" cx="90" cy="250" r="8" />
              </svg>

              <div className="path-nodes">
                {journeySteps.map((step, index) => (
                  <button
                    key={step.label}
                    type="button"
                    className={`path-node ${index === activeStep ? 'active' : ''}`}
                    style={{ left: `${step.x / 10}%`, top: `${step.y / 4.2}%` }}
                    onClick={() => jumpToStep(index)}
                    aria-label={step.label}
                  >
                    <span>{step.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={`path-impact-final ${isComplete ? 'visible' : ''}`} ref={finalRef}>
              <strong>You are present at every moment of intent.</strong>
              <span>That is not exposure. That is influence.</span>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default PathToImpact;
