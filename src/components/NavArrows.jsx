import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NavArrows = ({ activeSlide, totalSlides, changeSlideSafe }) => {
  return (
    <>
      <button 
        className={`nav-arrow nav-arrow-left ${activeSlide === 0 ? 'disabled' : ''}`}
        onClick={() => changeSlideSafe(activeSlide - 1)}
        disabled={activeSlide === 0}
        aria-label="Previous Slide"
      >
        <ChevronLeft size={36} />
      </button>

      <button 
        className={`nav-arrow nav-arrow-right ${activeSlide === totalSlides - 1 ? 'disabled' : ''}`}
        onClick={() => changeSlideSafe(activeSlide + 1)}
        disabled={activeSlide === totalSlides - 1}
        aria-label="Next Slide"
      >
        <ChevronRight size={36} />
      </button>
    </>
  );
};

export default NavArrows;
