import { MessageSquare } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

function CTAStack({ onActivation, onSimulator, onJourney, onChat, isChatOpen }) {
  const stackRef = useRef(null);

  useEffect(() => {
    if (!stackRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        stackRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', delay: 0.6 }
      );
    }, stackRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="cta-stack" ref={stackRef}>
      <button className="cta-primary" type="button" onClick={onActivation}>
        Design Your Activation
      </button>

      <div className="cta-secondary-group">
        <button className="cta-secondary" type="button" onClick={onSimulator}>
          Simulate Your Brand
        </button>
        <button className="cta-secondary" type="button" onClick={onJourney}>
          See Customer Journey
        </button>
      </div>

      <button
        className={`cta-chat ${isChatOpen ? 'active' : ''}`}
        type="button"
        onClick={onChat}
        aria-label="Open AI Assistant"
      >
        <MessageSquare size={22} />
      </button>
    </div>
  );
}

export default CTAStack;
