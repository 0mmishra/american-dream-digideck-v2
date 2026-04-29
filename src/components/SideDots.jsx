import React from 'react';

const SideDots = ({ totalSlides, activeSlide, setActiveSlide }) => {
  return (
    <div className="side-dots">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <div
          key={index}
          className={`dot ${activeSlide === index ? 'active' : ''}`}
          onClick={() => setActiveSlide(index)}
        />
      ))}
    </div>
  );
};

export default SideDots;
