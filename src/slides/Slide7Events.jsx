import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

import event1Img from '../public/images/event1.jpg';
import event2Img from '../public/images/event2.jpg';
import event3Img from '../public/images/event3.jpg';
import event4Img from '../public/images/event4.jpg';

const events = [
  {
    title: "50+",
    subtitle: "Major Events Annually",
    img: event1Img
  },
  {
    title: "Interactive",
    subtitle: "Digital integration across the property",
    img: event2Img
  },
  {
    title: "Global Reach",
    subtitle: "International brand activations",
    img: event3Img
  },
  {
    title: "High Engagement",
    subtitle: "Mass audience interaction",
    img: event4Img
  }
];

const Slide7Events = ({ isActive }) => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const bgWrappersRef = useRef([]);
  const countTargetRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (!isActive) return;

      // Stagger Entry for all event cards
      gsap.fromTo(cardsRef.current,
          { opacity: 0, y: 60, scale: 0.95 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.8, 
            stagger: 0.2, 
            ease: "power3.out",
            delay: 0.6 
          }
        );

        // Targeted 50+ Counter Sequence injection
        if (countTargetRef.current) {
          gsap.fromTo(countTargetRef.current, 
            { innerHTML: 0 },
            { 
              innerHTML: 50, 
              duration: 1.5, 
              snap: { innerHTML: 1 }, 
              ease: "power3.out",
              delay: 0.8 // Starts incrementing right as the card slides into frame
            }
          );
        }

      // Continuous 12-second idle motion mapping for each layer
      bgWrappersRef.current.forEach((wrapper) => {
        gsap.fromTo(wrapper,
          { scale: 1 },
          { scale: 1.05, duration: 12, ease: "linear", yoyo: true, repeat: -1 }
        );
      });
      
    }, containerRef);

    return () => ctx.revert();
  }, [isActive]);

  return (
    <>
      <div className="bg-overlay-solid" style={{background: 'rgba(0, 0, 0, 0.64)'}}></div>
      
      <div className="slide-content center-layout" ref={containerRef} style={{ maxWidth: '1400px', padding: '0 40px' }}>
        <h2>Events & Platform</h2>
        <p style={{maxWidth: '800px', margin: '15px auto 50px auto'}}>
          A dynamic platform for brand activations, pop-ups, and global events. We offer more than space; we offer an audience.
        </p>
        
        <div className="events-grid">
          {events.map((item, i) => {
            const isCounterCard = item.title === "50+";
            
            return (
              <div 
                key={i} 
                className="event-card" 
                ref={el => cardsRef.current[i] = el}
              >
                <div 
                  className="evt-bg-wrapper" 
                  ref={el => bgWrappersRef.current[i] = el}
                >
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="evt-bg-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.style.background = '#1a1a1a';
                    }}
                  />
                </div>
                <div className="evt-overlay"></div>
                
                <div className="evt-content">
                  <h3 className="evt-title">
                    {/* Strategically decouple the "+" sign so GSAP natively calculates numerical integers exclusively */}
                    {isCounterCard ? (
                      <><span ref={countTargetRef}>0</span>+</>
                    ) : (
                      item.title
                    )}
                  </h3>
                  <p className="evt-subtitle">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Slide7Events;
