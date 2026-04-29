import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

import theme1Img from '../public/images/theme1.jpg';
import theme2Img from '../public/images/theme2.jpg';
import theme3Img from '../public/images/theme3.jpg';
import theme4Img from '../public/images/theme4.jpg';

const attractions = [
  {
    title: "Indoor Theme Park",
    subtitle: "Record-breaking roller coasters",
    img: theme1Img
  },
  {
    title: "Water Park",
    subtitle: "Year-round tropical climate",
    img: theme2Img
  },
  {
    title: "Ski Resort",
    subtitle: "North America's first indoor snow park",
    img: theme3Img
  },
  {
    title: "Entertainment Arena",
    subtitle: "Events, shows, global experiences",
    img: theme4Img
  }
];

const Slide6Attractions = ({ isActive }) => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const bgWrappersRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (!isActive) return;

      gsap.fromTo(cardsRef.current,
          { opacity: 0, x: 80, scale: 0.95 },
          { 
            opacity: 1, 
            x: 0, 
            scale: 1, 
            duration: 0.8, 
            stagger: 0.2, 
            ease: "power3.out",
            delay: 0.6 
          }
        );

      // Continuous 10-second idle motion mapping
      bgWrappersRef.current.forEach((wrapper) => {
        gsap.fromTo(wrapper,
          { scale: 1 },
          { scale: 1.05, duration: 10, ease: "linear", yoyo: true, repeat: -1 }
        );
      });
      
    }, containerRef);

    return () => ctx.revert();
  }, [isActive]);

  return (
    <>
      <div className="bg-overlay-solid" style={{background: 'rgba(0, 0, 0, 0.42)'}}></div>
      
      <div className="slide-content center-layout" ref={containerRef} style={{ maxWidth: '1200px', padding: '0 40px' }}>
        <h2>Attractions & Entertainment</h2>
        <p style={{maxWidth: '800px', margin: '15px auto 50px auto'}}>
          Adrenaline-inducing rides, sub-zero snow parks, and immersive entertainment zones 
          integrated seamlessly under one roof.
        </p>
        
        <div className="attractions-grid">
          {attractions.map((item, i) => (
            <div 
              key={i} 
              className="attraction-card" 
              ref={el => cardsRef.current[i] = el}
            >
              <div 
                className="attr-bg-wrapper" 
                ref={el => bgWrappersRef.current[i] = el}
              >
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="attr-bg-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.style.background = '#1a1a1a';
                  }}
                />
              </div>
              <div className="attr-overlay"></div>
              
              <div className="attr-content">
                <h3 className="attr-title">{item.title}</h3>
                <p className="attr-subtitle">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Slide6Attractions;
