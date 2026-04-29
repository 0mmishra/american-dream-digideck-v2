import { Suspense, lazy, useCallback, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ActivationBuilder from './components/ActivationBuilder';
import BrandSimulator from './components/BrandSimulator';
import CanvasNavigation from './components/CanvasNavigation';
import ChatWidget from './components/ChatWidget';
import CTAStack from './components/CTAStack';
import DecisionOverlay from './components/DecisionOverlay';
import PathToImpact from './components/PathToImpact';
import Slide1Hero from './slides/Slide1Hero';
import heroVideo from './public/videos/hero.mp4';
import retailBg from './public/images/use.jpg';
import luxuryBg from './public/images/use3.jpg';
import diningBg from './public/images/dine3.jpg';
import attractionsBg from './public/images/theme1.jpg';
import eventsBg from './public/images/event4.jpg';
import './styles/menu.css';
import './styles/slides.css';

const RetailModule = lazy(() => import('./slides/Slide3Retail'));
const LuxuryModule = lazy(() => import('./slides/Slide4Luxury'));
const DiningModule = lazy(() => import('./slides/Slide5Dining'));
const AttractionsModule = lazy(() => import('./slides/Slide6Attractions'));
const EventsModule = lazy(() => import('./slides/Slide7Events'));

const MODULES = [
  {
    id: 'hero',
    label: 'Home',
    eyebrow: 'Interactive mall system',
    title: 'Explore the property freely',
    detail: 'A non-linear canvas for retail, luxury, dining, attractions, and event discovery.',
  },
  {
    id: 'retail',
    label: 'Retail',
    eyebrow: 'Ecosystem',
    title: 'Retail demand engine',
    detail: 'Brand mix, digital convenience, and everyday footfall work together as one platform.',
  },
  {
    id: 'luxury',
    label: 'Luxury',
    eyebrow: 'Positioning',
    title: 'A premium address',
    detail: 'A focused environment for couture, watches, jewelry, and high-touch client services.',
  },
  {
    id: 'dining',
    label: 'Dining',
    eyebrow: 'Lifestyle',
    title: 'Dwell-time magnet',
    detail: 'Signature restaurants, cafes, lounges, and food hall concepts extend every visit.',
  },
  {
    id: 'attractions',
    label: 'Attractions',
    eyebrow: 'Entertainment',
    title: 'Reasons to return',
    detail: 'Indoor destination anchors create repeatable family and tourist traffic beyond shopping.',
  },
  {
    id: 'events',
    label: 'Events',
    eyebrow: 'Platform',
    title: 'Programmable audience',
    detail: 'Activations, pop-ups, and seasonal moments turn the mall into a media surface.',
  },
];

const moduleLookup = MODULES.reduce((acc, module) => {
  acc[module.id] = module;
  return acc;
}, {});

const zones = {
  hero: {
    type: 'video',
    bg: heroVideo,
    label: 'Hero',
    motion: 'slow',
  },
  retail: {
    type: 'image',
    bg: retailBg,
    label: 'Retail',
    motion: 'slow',
  },
  luxury: {
    type: 'image',
    bg: luxuryBg,
    label: 'Luxury',
    motion: 'slow',
  },
  dining: {
    type: 'image',
    bg: diningBg,
    label: 'Dining',
    motion: 'soft',
  },
  attractions: {
    type: 'image',
    bg: attractionsBg,
    label: 'Attractions',
    motion: 'dynamic',
  },
  events: {
    type: 'image',
    bg: eventsBg,
    label: 'Events',
    motion: 'spotlight',
  },
};

function SectionFallback() {
  return <div className="module-loading" aria-label="Loading module" />;
}

function GlobalBackground({ activeZone }) {
  const [displayZone, setDisplayZone] = useState(activeZone);
  const layerRef = useRef(null);
  const mediaRef = useRef(null);
  const idleTweenRef = useRef(null);
  const transitionRef = useRef(null);
  const zone = zones[displayZone] || zones.hero;

  useLayoutEffect(() => {
    Object.values(zones).forEach((item) => {
      if (item.type === 'image') {
        const image = new Image();
        image.src = item.bg;
      }
    });
  }, []);

  useLayoutEffect(() => {
    if (displayZone === activeZone || !layerRef.current) return undefined;

    transitionRef.current?.kill();
    idleTweenRef.current?.kill();

    transitionRef.current = gsap.to(layerRef.current, {
      opacity: 0,
      scale: 1.05,
      duration: 0.55,
      ease: 'power3.inOut',
      onComplete: () => {
        setDisplayZone(activeZone);
      },
    });

    return () => transitionRef.current?.kill();
  }, [activeZone, displayZone]);

  useLayoutEffect(() => {
    if (!layerRef.current) return undefined;

    const layer = layerRef.current;
    const media = mediaRef.current;
    const motionDuration = zone.motion === 'dynamic' ? 7 : zone.motion === 'spotlight' ? 12 : 16;
    const motionScale = zone.motion === 'dynamic' ? 1.1 : 1.07;

    transitionRef.current?.kill();
    idleTweenRef.current?.kill();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        layer,
        { opacity: 0, scale: 1 },
        {
          opacity: 1,
          scale: 1.05,
          duration: 1.1,
          ease: 'power3.inOut',
        }
      );

      idleTweenRef.current = gsap.fromTo(
        media,
        { scale: 1.02, xPercent: -0.6, yPercent: -0.4 },
        {
          scale: motionScale,
          xPercent: 0.6,
          yPercent: 0.4,
          duration: motionDuration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        }
      );
    }, layer);

    return () => {
      idleTweenRef.current?.kill();
      ctx.revert();
    };
  }, [displayZone, zone.motion]);

  return (
    <div className={`global-bg global-bg-${displayZone}`} ref={layerRef} aria-hidden="true">
      {zone.type === 'video' ? (
        <video
          key={zone.bg}
          ref={mediaRef}
          className="global-bg-media"
          src={zone.bg}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      ) : (
        <img key={zone.bg} ref={mediaRef} className="global-bg-media" src={zone.bg} alt="" loading="eager" />
      )}
      <div className="global-bg-tone" />
    </div>
  );
}

function HeroModule({ onExplore, onNavigate }) {
  return (
    <div className="module-screen module-screen-hero">
      <Slide1Hero onExplore={onExplore} />
      <div className="hero-text">
        <p className="module-kicker">Non-linear digideck</p>
        <h1>
          City-scale
          <br />
          retail,
          <br />
          explored as a
          <br />
          system.
        </h1>
        <div className="hero-module-actions">
          <button type="button" className="canvas-primary-button" onClick={onExplore}>
            Explore
          </button>
          <button type="button" className="canvas-secondary-button" onClick={() => onNavigate('retail')}>
            Start with retail
          </button>
        </div>
      </div>
    </div>
  );
}

function renderModule(id, controls) {
  switch (id) {
    case 'hero':
      return <HeroModule {...controls} />;
    case 'retail':
      return <RetailModule isActive />;
    case 'luxury':
      return <LuxuryModule isActive />;
    case 'dining':
      return <DiningModule isActive />;
    case 'attractions':
      return <AttractionsModule isActive />;
    case 'events':
      return <EventsModule isActive />;
    default:
      return <HeroModule {...controls} />;
  }
}

function App() {
  const [activeModule, setActiveModule] = useState('hero');
  const [activeZone, setActiveZone] = useState('hero');
  const [visibleModule, setVisibleModule] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isJourneyOpen, setIsJourneyOpen] = useState(false);
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('Your Brand');
  const [selectedZone, setSelectedZone] = useState('hero');
  const moduleRef = useRef(null);
  const transitionRef = useRef(null);

  const handleSimulateClick = useCallback(() => {
    setIsSimulatorOpen(true);
  }, []);

  useLayoutEffect(() => {
    if (!moduleRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        moduleRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'power3.inOut',
          clearProps: 'transform',
        }
      );

      gsap.fromTo(
        moduleRef.current.querySelectorAll('h1, h2, .module-kicker, .hero-module-actions, .center-layout > p, .split-left, .brand-grid, .dining-grid, .attractions-grid, .events-grid'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.15,
        }
      );
    }, moduleRef);

    return () => ctx.revert();
  }, [visibleModule]);

  const loadModule = useCallback(
    (nextModule) => {
      if (nextModule === activeModule) {
        setIsMenuOpen(false);
        return;
      }

      transitionRef.current?.kill();
      setActiveModule(nextModule);
      setActiveZone(nextModule);
      setSelectedZone(nextModule);
      setIsMenuOpen(false);

      const current = moduleRef.current;
      if (!current) {
        setVisibleModule(nextModule);
        return;
      }

      transitionRef.current = gsap.to(current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.85,
        ease: 'power3.inOut',
        onComplete: () => {
          setVisibleModule(nextModule);
          transitionRef.current = null;
        },
      });
    },
    [activeModule]
  );

  const openDecisionOverlay = useCallback((brand = selectedBrand, zone = selectedZone) => {
    setSelectedBrand(brand || 'Your Brand');
    setSelectedZone(zone || activeModule);
    setIsOverlayOpen(true);
  }, [activeModule, selectedBrand, selectedZone]);

  return (
    <div className={`app-container zone-${activeZone}`} data-zone={activeZone}>
      <GlobalBackground activeZone={activeZone} />
      <main className="canvas" aria-live="polite">
        <CanvasNavigation
          modules={MODULES}
          activeModule={activeModule}
          isMenuOpen={isMenuOpen}
          onNavigate={loadModule}
          onOpenMenu={() => setIsMenuOpen(true)}
          onCloseMenu={() => setIsMenuOpen(false)}
        />

        <section ref={moduleRef} className="canvas-module" key={visibleModule}>
          <Suspense fallback={<SectionFallback />}>
            {renderModule(visibleModule, {
              onExplore: () => setIsMenuOpen(true),
              onNavigate: loadModule,
            })}
          </Suspense>
        </section>

        {activeModule !== 'hero' && (
          <button
            type="button"
            className="decision-trigger"
            onClick={() => openDecisionOverlay('Your Brand', activeModule)}
          >
            Why this works for you
          </button>
        )}
      </main>

      <CTAStack
        onActivation={() => setIsActivationOpen(true)}
        onSimulator={handleSimulateClick}
        onJourney={() => setIsJourneyOpen(true)}
        onChat={() => setIsChatOpen((current) => !current)}
        isChatOpen={isChatOpen}
      />
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <BrandSimulator
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onDecisionRequest={openDecisionOverlay}
      />
      <PathToImpact
        brand={selectedBrand}
        isOpen={isJourneyOpen}
        onClose={() => setIsJourneyOpen(false)}
      />
      <ActivationBuilder
        isOpen={isActivationOpen}
        onClose={() => setIsActivationOpen(false)}
      />
      <DecisionOverlay
        brand={selectedBrand}
        zone={selectedZone}
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
      />
    </div>
  );
}

export default App;
