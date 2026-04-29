import { useEffect, useRef } from 'react';
import gsap from 'gsap';

import zaraImg from '../public/images/zara.png';
import hmImg from '../public/images/h&m.png';
import nikeImg from '../public/images/nike.png';
import appImg from '../public/images/app.png';
import sepImg from '../public/images/sep.png';
import cosImg from '../public/images/cos.png';
import mangoImg from '../public/images/Mango.png';
import footLockerImg from '../public/images/foot_locker.png';

const brandsData = [
  { name: 'Zara', src: zaraImg },
  { name: 'H&M', src: hmImg },
  { name: 'Nike', src: nikeImg },
  { name: 'Apple', src: appImg },
  { name: 'Sephora', src: sepImg },
  { name: 'Cos', src: cosImg },
  { name: 'Mango', src: mangoImg },
  { name: 'Foot Locker', src: footLockerImg },
];

const Slide3Retail = ({ isActive }) => {
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (!isActive || !gridRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.6,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isActive]);

  return (
    <>
      <div
        className="bg-image"
        style={{
          opacity: 0.15,
          filter: 'blur(4px)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#000',
        }}
      />
      <div className="bg-overlay" style={{ background: 'rgba(0,0,0,0.7)', zIndex: -1 }} />

      <div className="slide-content center-layout" ref={containerRef}>
        <h2>Retail demand engine</h2>
        <p style={{ marginBottom: '80px' }}>
          Designed for the modern consumer, blending offline discovery with digital seamlessness.
        </p>

        <div className="brand-grid" ref={gridRef}>
          {brandsData.map((brand) => (
            <div key={brand.name} className="brand-logo-item">
              <img
                src={brand.src}
                alt={brand.name}
                className="brand-img"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                  event.currentTarget.nextSibling.style.display = 'block';
                }}
              />
              <span className="brand-text-fallback">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Slide3Retail;
