import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Menu as MenuIcon, X } from 'lucide-react';

const Menu = ({ isOpen, setIsOpen, activeSlide, setActiveSlide }) => {
  const menuRef = useRef(null);

  const menuItems = [
    "Opening",
    "Why This Property",
    "Retail Ecosystem",
    "Luxury Positioning",
    "Dining & Lifestyle",
    "Attractions",
    "Events & Platform",
    "Opportunity"
  ];

  useEffect(() => {
    if (isOpen) {
      gsap.to(menuRef.current, {
        x: 0,
        duration: 0.6,
        ease: "power3.out"
      });
      // stagger list items
      gsap.fromTo(".menu-items li", 
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out", delay: 0.2 }
      );
    } else {
      gsap.to(menuRef.current, {
        x: "-100%",
        duration: 0.6,
        ease: "power3.in"
      });
    }
  }, [isOpen]);

  const handleMenuClick = (index) => {
    setActiveSlide(index);
    setIsOpen(false);
  };

  return (
    <>
      <div 
        className={`menu-toggle ${isOpen ? 'dark' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </div>

      <div 
        className={`overlay ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(false)}
      ></div>

      <div className="side-menu" ref={menuRef}>
        <h2>Directory</h2>
        <ul className="menu-items">
          {menuItems.map((item, index) => (
            <li 
              key={index} 
              className={activeSlide === index ? 'active' : ''}
              onClick={() => handleMenuClick(index)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Menu;
