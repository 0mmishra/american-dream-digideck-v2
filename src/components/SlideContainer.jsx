import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Slide1Hero from '../slides/Slide1Hero';
import Slide2Why from '../slides/Slide2Why';
import Slide3Retail from '../slides/Slide3Retail';
import Slide4Luxury from '../slides/Slide4Luxury';
import Slide5Dining from '../slides/Slide5Dining';
import Slide6Attractions from '../slides/Slide6Attractions';
import Slide7Events from '../slides/Slide7Events';
import Slide8Opportunity from '../slides/Slide8Opportunity';

const SlideContainer = ({ activeSlide, setActiveSlide }) => {
  const containerRef = useRef(null);
  const previousSlide = useRef(activeSlide);

  const slides = [
    <Slide1Hero setActiveSlide={setActiveSlide} />,
    <Slide2Why />,
    <Slide3Retail />,
    <Slide4Luxury />,
    <Slide5Dining />,
    <Slide6Attractions />,
    <Slide7Events />,
    <Slide8Opportunity setActiveSlide={setActiveSlide} />
  ];

  useEffect(() => {
    if (activeSlide === previousSlide.current) return;

    const slidesElements = containerRef.current.children;
    const currentEl = slidesElements[activeSlide];
    const prevEl = slidesElements[previousSlide.current];

    const isMovingForward = activeSlide > previousSlide.current;

    // Reset current element to prepare for animation
    gsap.set(currentEl, {
      opacity: 0.8,
      x: isMovingForward ? "100%" : "-100%",
      scale: 1, /* remove previous scaling logic */
      zIndex: 10,
      visibility: 'visible'
    });

    gsap.set(prevEl, {
      zIndex: 5
    });

    const tl = gsap.timeline();

    tl.to(prevEl, {
      opacity: 0.8,
      x: isMovingForward ? "-100%" : "100%",
      duration: 0.9,
      ease: "power3.inOut"
    }, 0);

    tl.to(currentEl, {
      opacity: 1,
      x: "0%",
      duration: 0.9,
      ease: "power3.inOut"
    }, 0);

    // Call animation triggers inside the specific slide if they exist
    const animateIn = currentEl.querySelector('.animate-in');
    if (animateIn) {
      gsap.fromTo(animateIn.children, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.5 }
      );
    }
    
    const countItems = currentEl.querySelectorAll('.count-anim');
    countItems.forEach(item => {
        const val = item.getAttribute('data-val');
        gsap.fromTo(item, 
            { innerHTML: 0 },
            { 
              innerHTML: val, 
              duration: 2, 
              snap: { innerHTML: 1 },
              delay: 0.5,
              ease: "power2.out"
            }
        );
    });

    previousSlide.current = activeSlide;

  }, [activeSlide]);

  return (
    <div className="slides-wrapper" ref={containerRef}>
      {slides.map((SlideComponent, index) => (
        <div 
          key={index} 
          className={`slide ${index === activeSlide ? 'active' : ''}`}
        >
          {React.cloneElement(SlideComponent, { isActive: index === activeSlide })}
        </div>
      ))}
    </div>
  );
};

export default SlideContainer;
