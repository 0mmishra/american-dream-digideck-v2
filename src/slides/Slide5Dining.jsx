import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Utensils, Coffee, Wine, Store } from 'lucide-react';

import dine1Img from '../public/images/dine1.jpg';
import dine2Img from '../public/images/dine2.jpg';
import dine3Img from '../public/images/dine3.jpg';
import dine4Img from '../public/images/dine4.jpg';

const diningItems = [
  {
    title: "Fine Dining",
    desc: "World-class chefs and exclusive tasting menus.",
    img: dine1Img,
    Icon: Utensils
  },
  {
    title: "Cafés",
    desc: "Artisanal roasters and bespoke pastries.",
    img: dine2Img,
    Icon: Coffee
  },
  {
    title: "Lounge Bars",
    desc: "Mixology lounges and premium nightlife.",
    img: dine3Img,
    Icon: Wine
  },
  {
    title: "Food Hall",
    desc: "Curated global culinary experiences.",
    img: dine4Img,
    Icon: Store
  }
];

const Slide5Dining = ({ isActive }) => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const bgWrappersRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (!isActive) return;

      // Primary staggered entry (Opacity 0 -> 1, Y 60 -> 0, Scale 0.95 -> 1)
      gsap.fromTo(cardsRef.current,
          { opacity: 0, scale: 0.95, y: 60 },
          { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            duration: 0.8, 
            stagger: 0.2, 
            ease: "power3.out",
            delay: 0.6 // Execute cleanly after horizontal map lock
          }
        );

      // Continuous 8-second slow parallax background loops
      bgWrappersRef.current.forEach((wrapper) => {
        gsap.fromTo(wrapper,
          { scale: 1 },
          { scale: 1.05, duration: 8, ease: "power1.inOut", yoyo: true, repeat: -1 }
        );
      });
      
    }, containerRef); // Scoped to automatically cleanup when component is unmounted

    return () => ctx.revert(); // Force cleanup background animations when slide loses active context
  }, [isActive]);

  return (
    <>
      <div className="bg-overlay-solid" style={{background: 'rgba(10, 6, 3, 0.52)'}}></div>
      
      <div className="slide-content center-layout" ref={containerRef} style={{ maxWidth: '1400px', padding: '0 40px' }}>
        <h2>Dining & Lifestyle</h2>
        <p style={{maxWidth: '800px', margin: '15px auto 40px auto'}}>
          From Michelin-starred concepts to vibrant food halls. A culinary journey that complements the shopping experience.
        </p>
        
        <div className="dining-grid">
          {diningItems.map((item, i) => (
            <div 
              key={i} 
              className="dine-card" 
              ref={el => cardsRef.current[i] = el}
            >
              <div 
                className="dine-bg-wrapper" 
                ref={el => bgWrappersRef.current[i] = el}
              >
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="dine-bg-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.style.background = '#18181b';
                  }}
                />
              </div>
              <div className="dine-overlay"></div>
              
              <div className="dine-content">
                <item.Icon size={32} color="#ffffff" style={{ opacity: 0.9 }} />
                <h3 className="dine-title">{item.title}</h3>
                <p className="dine-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Slide5Dining;
