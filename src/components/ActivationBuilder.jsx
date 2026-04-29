import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

const activationTypes = ['Pop-up Store', 'Flagship Launch', 'Brand Experience', 'Live Event'];
const zones = ['Luxury Avenue', 'Theme Park Zone', 'Water Park Zone', 'Dining District'];
const durations = ['1 Day', '3 Days', '1 Week'];

const zoneLogic = {
  'Luxury Avenue': {
    baseTraffic: 40000,
    audience: 'high-income, premium intent',
    timing: 'Thursday evening to Sunday',
  },
  'Theme Park Zone': {
    baseTraffic: 80000,
    audience: 'families, youth-heavy, high energy',
    timing: 'Weekend afternoons',
  },
  'Water Park Zone': {
    baseTraffic: 60000,
    audience: 'families, tourists, leisure-led',
    timing: 'Friday to Sunday midday',
  },
  'Dining District': {
    baseTraffic: 50000,
    audience: 'social, lifestyle-driven, longer dwell',
    timing: 'Evenings and dining peaks',
  },
};

const typeLogic = {
  'Pop-up Store': {
    multiplier: 1,
    engagement: 'hands-on product trial',
  },
  'Flagship Launch': {
    multiplier: 1.18,
    engagement: 'premium, curated reveal',
  },
  'Brand Experience': {
    multiplier: 1.28,
    engagement: 'immersive, shareable interaction',
  },
  'Live Event': {
    multiplier: 1.38,
    engagement: 'interactive, social momentum',
  },
};

const durationMultiplier = {
  '1 Day': 1,
  '3 Days': 2.7,
  '1 Week': 5.8,
};

function formatReach(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return value.toLocaleString();
}

function ActivationBuilder({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState(null);
  const [zone, setZone] = useState(null);
  const [duration, setDuration] = useState(null);
  const [reachCount, setReachCount] = useState(0);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const optionRefs = useRef([]);
  const resultRefs = useRef([]);
  const countTweenRef = useRef(null);

  const recommendation = useMemo(() => {
    if (!type || !zone || !duration) return null;

    const zoneData = zoneLogic[zone];
    const typeData = typeLogic[type];
    const reach = Math.round(zoneData.baseTraffic * typeData.multiplier * durationMultiplier[duration]);

    return {
      reach,
      audience: zoneData.audience,
      engagement: typeData.engagement,
      timing: zoneData.timing,
    };
  }, [duration, type, zone]);

  const closeBuilder = () => onClose();

  const resetBuilder = () => {
    setStep(1);
    setType(null);
    setZone(null);
    setDuration(null);
    setReachCount(0);
  };

  const selectValue = (value) => {
    if (step === 1) {
      setType(value);
      setStep(2);
      return;
    }

    if (step === 2) {
      setZone(value);
      setStep(3);
      return;
    }

    setDuration(value);
    setStep(4);
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    resetBuilder();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power3.out' }
      );

      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }
      );
    }, overlayRef);

    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
      countTweenRef.current?.kill();
      ctx.revert();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current.querySelectorAll('.activation-kicker, h2, .activation-progress, .activation-summary'),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.42, ease: 'power3.out', stagger: 0.06 }
      );

      gsap.fromTo(
        optionRefs.current.filter(Boolean),
        { opacity: 0, y: 18, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: 'power3.out',
          stagger: 0.07,
          delay: 0.08,
        }
      );
    }, panelRef);

    return () => ctx.revert();
  }, [isOpen, step]);

  useEffect(() => {
    if (step !== 4 || !recommendation) return undefined;

    const counter = { value: 0 };
    countTweenRef.current?.kill();
    setReachCount(0);

    const ctx = gsap.context(() => {
      countTweenRef.current = gsap.to(counter, {
        value: recommendation.reach,
        duration: 1.2,
        ease: 'power3.out',
        onUpdate: () => setReachCount(Math.round(counter.value)),
      });

      gsap.fromTo(
        resultRefs.current.filter(Boolean),
        { opacity: 0, y: 18, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.08,
        }
      );
    }, panelRef);

    return () => {
      countTweenRef.current?.kill();
      ctx.revert();
    };
  }, [recommendation, step]);

  const stepConfig = [
    {
      title: 'Select activation type',
      options: activationTypes,
      selected: type,
    },
    {
      title: 'Select zone',
      options: zones,
      selected: zone,
    },
    {
      title: 'Select duration',
      options: durations,
      selected: duration,
    },
  ][step - 1];

  return (
    <>
      {isOpen && (
        <div className="activation-overlay" ref={overlayRef} role="dialog" aria-modal="true">
          <button className="activation-close" type="button" onClick={closeBuilder} aria-label="Close activation builder">
            X
          </button>

          <section className="activation-panel" ref={panelRef}>
            {step < 4 && stepConfig && (
              <>
                <p className="activation-kicker">Floor Activation Builder</p>
                <h2>{stepConfig.title}</h2>
                <div className="activation-progress">
                  <span>{String(step).padStart(2, '0')}</span>
                  <div>
                    <i style={{ width: `${(step / 3) * 100}%` }} />
                  </div>
                  <span>03</span>
                </div>

                <div className="activation-options">
                  {stepConfig.options.map((option, index) => (
                    <button
                      key={option}
                      ref={(element) => { optionRefs.current[index] = element; }}
                      className={`activation-option ${stepConfig.selected === option ? 'selected' : ''}`}
                      type="button"
                      onClick={() => selectValue(option)}
                    >
                      <span>{option}</span>
                    </button>
                  ))}
                </div>

                {(type || zone || duration) && (
                  <div className="activation-summary">
                    {[type, zone, duration].filter(Boolean).join(' / ')}
                  </div>
                )}
              </>
            )}

            {step === 4 && recommendation && (
              <>
                <p className="activation-kicker">Recommended Strategy</p>
                <h2>Your Activation Strategy</h2>

                <div className="activation-result-layout">
                  <article className="activation-summary-card" ref={(element) => { resultRefs.current[0] = element; }}>
                    <span>Plan</span>
                    <strong>{type}</strong>
                    <p>{zone}</p>
                    <em>{duration}</em>
                  </article>

                  <div className="activation-metrics">
                    <article ref={(element) => { resultRefs.current[1] = element; }}>
                      <span>Estimated Reach</span>
                      <strong>{formatReach(reachCount)}</strong>
                    </article>
                    <article ref={(element) => { resultRefs.current[2] = element; }}>
                      <span>Audience Type</span>
                      <strong>{recommendation.audience}</strong>
                    </article>
                    <article ref={(element) => { resultRefs.current[3] = element; }}>
                      <span>Engagement Style</span>
                      <strong>{recommendation.engagement}</strong>
                    </article>
                    <article ref={(element) => { resultRefs.current[4] = element; }}>
                      <span>Best Timing</span>
                      <strong>{recommendation.timing}</strong>
                    </article>
                  </div>
                </div>

                <p className="activation-final" ref={(element) => { resultRefs.current[5] = element; }}>
                  Designed for attention. Built for conversion.
                </p>

                <button className="activation-reset" type="button" onClick={resetBuilder}>
                  Build another
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}

export default ActivationBuilder;
