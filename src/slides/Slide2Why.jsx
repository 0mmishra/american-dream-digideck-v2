import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const Slide2Why = ({ isActive }) => {
  const leftCardRef = useRef(null);
  const stat1Ref = useRef(null);
  const stat2Ref = useRef(null);
  const stat3Ref = useRef(null);

  useEffect(() => {
    if (isActive) {
      const tl = gsap.timeline({ delay: 0.8 }); // Wait for horizontal slide in
      const counters = [stat1Ref.current, stat2Ref.current, stat3Ref.current]
        .map((item) => item?.querySelector('.count-anim'))
        .filter(Boolean);

      // Start all elements invisible and at different distant coordinates
      gsap.set(leftCardRef.current, { x: -150, opacity: 0 });
      gsap.set(stat1Ref.current, { y: -100, opacity: 0 });
      gsap.set(stat2Ref.current, { x: 150, opacity: 0 });
      gsap.set(stat3Ref.current, { y: 100, opacity: 0 });

      // Bring them together to x:0, y:0 simultaneously in a staggered cluster
      tl.to(leftCardRef.current, { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, 0)
        .to(stat1Ref.current, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 0.2)
        .to(stat2Ref.current, { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 0.4)
        .to(stat3Ref.current, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 0.6);

      counters.forEach((counter, index) => {
        const targetValue = Number(counter.dataset.val || 0);
        gsap.fromTo(
          counter,
          { innerHTML: 0 },
          {
            innerHTML: targetValue,
            duration: 1.4,
            snap: { innerHTML: 1 },
            ease: 'power3.out',
            delay: 0.65 + index * 0.12,
          }
        );
      });
    }
  }, [isActive]);

  return (
    <>
      <div className="bg-overlay-solid"></div>
      
      <div className="slide-content split-layout">
        <div className="split-left premium-glass" ref={leftCardRef} style={{ opacity: 0, transform: 'translateX(-150px)' }}>
          <h2>Why This Property?</h2>
          <p>
            Positioned at the epicenter of global commerce, we redefine the retail landscape. 
            It's not just a mall; it's a living ecosystem of luxury, entertainment, and lifestyle.
          </p>
        </div>
        
        <div className="split-right">
          <div className="stat-item premium-glass" ref={stat1Ref} style={{ opacity: 0, transform: 'translateY(-100px)' }}>
            <span className="stat-number count-anim" data-val="40">40</span>
            <span className="stat-label">Million+ Annual Visitors</span>
          </div>
          
          <div className="stat-item premium-glass" ref={stat2Ref} style={{ opacity: 0, transform: 'translateX(150px)' }}>
            <span className="stat-number count-anim" data-val="3">3</span>
            <span className="stat-label">Million Sq Ft Retail Space</span>
          </div>
          
          <div className="stat-item premium-glass" ref={stat3Ref} style={{ opacity: 0, transform: 'translateY(100px)' }}>
            <span className="stat-number count-anim" data-val="15">15</span>
            <span className="stat-label">Minutes from Manhattan</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Slide2Why;
