import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ScrollSection({ id, label, className = '', children }) {
  const localRef = useRef(null);

  useEffect(() => {
    const section = localRef.current;
    if (!section) return undefined;

    const content = section.querySelector('.section-shell');
    const parallaxLayers = section.querySelectorAll('[data-parallax]');

    const ctx = gsap.context(() => {
      if (content) {
        gsap.fromTo(
          content,
          { opacity: 0, scale: 0.98, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      parallaxLayers.forEach((layer, index) => {
        gsap.fromTo(
          layer,
          { yPercent: -4 + index },
          {
            yPercent: 4 - index,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id={id}
      ref={localRef}
      className={`experience-section ${className}`.trim()}
      aria-label={label}
    >
      <div className="section-atmosphere" data-parallax />
      <div className="section-shell">{children}</div>
    </section>
  );
}

export default ScrollSection;
