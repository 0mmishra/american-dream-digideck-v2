import { useEffect, useRef } from 'react';
import gsap from 'gsap';

import use1Img from '../public/images/use.jpg';
import use2Img from '../public/images/use2.jpg';
import use3Img from '../public/images/use3.jpg';

const Slide4Luxury = ({ isActive }) => {
  const imagesRef = useRef(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (!isActive) return undefined;

    const ctx = gsap.context(() => {
      const imgs = imagesRef.current.children;

      gsap.set(imgs, { opacity: 0, scale: 1, filter: 'blur(4px)' });

      const playSequence = (index) => {
        const currentImg = imgs[index];
        const nextIndex = (index + 1) % imgs.length;

        gsap.fromTo(
          currentImg,
          { opacity: 0, scale: 1, filter: 'blur(4px)' },
          { opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power2.inOut' }
        );

        gsap.to(currentImg, {
          scale: 1.08,
          duration: 4,
          ease: 'none',
        });

        gsap.delayedCall(3, () => {
          gsap.to(currentImg, {
            opacity: 0,
            duration: 1,
            ease: 'power2.inOut',
          });
          playSequence(nextIndex);
        });
      };

      playSequence(0);

      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isActive]);

  return (
    <>
      <div
        className="bg-overlay-solid"
        style={{
          background: 'linear-gradient(45deg, rgba(5,5,5,0.62) 0%, rgba(10,10,10,0.36) 100%)',
        }}
      />

      <div className="section-wrapper luxury-content-container" ref={containerRef}>
        <div className="section-layout luxury-section-layout">
          <div className="content-block luxury-text-block premium-glass" ref={textRef}>
            <span className="section-label">Positioning</span>
            <h2>A premium address</h2>
            <p>
              An exclusive avenue dedicated to high-end couture, premium timepieces, and bespoke services.
            </p>
            <ul className="luxury-brand-list">
              <li>Hermes</li>
              <li>Louis Vuitton</li>
              <li>Saint Laurent</li>
              <li>Tiffany & Co.</li>
            </ul>
          </div>

          <div className="luxury-visual-block" aria-hidden="true">
            <div className="luxury-image-frame">
              <div ref={imagesRef} className="luxury-image-stack">
                <img src={use1Img} alt="" />
                <img src={use2Img} alt="" />
                <img src={use3Img} alt="" />
              </div>
              <div className="luxury-image-overlay" />
              <div className="luxury-image-caption">
                <span>The Avenue</span>
                <strong>Where Elegance Resides</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Slide4Luxury;
