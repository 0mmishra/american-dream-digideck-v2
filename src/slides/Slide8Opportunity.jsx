import React from 'react';

const Slide8Opportunity = ({ onBackToTop }) => {
  return (
    <>
      <div className="bg-overlay-solid"></div>
      
      <div className="slide-content center-layout animate-in premium-glass" style={{maxWidth: '800px', padding: '80px 40px'}}>
        <h2 style={{fontSize: '64px'}}>The Opportunity</h2>
        <p style={{marginBottom: '40px', fontSize: '24px', color: '#fff'}}>
          Join the ecosystem. Secure your prime location in the future of retail and entertainment.
        </p>
        
        <div style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
          <button className="cta-button" onClick={() => alert('Leasing inquiry initiated (Demo)')}>
            Leasing Inquiry
          </button>
          <button className="cta-button" style={{background: 'transparent', border: '1px solid #fff', color: '#fff'}} onClick={onBackToTop}>
            Back to Start
          </button>
        </div>
      </div>
    </>
  );
};

export default Slide8Opportunity;
