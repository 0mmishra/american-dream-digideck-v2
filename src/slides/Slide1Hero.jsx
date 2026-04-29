import heroVideo from '../public/videos/hero.mp4';

const Slide1Hero = () => {
  return (
    <div className="hero-stage">
      <div className="hero-media-frame" data-parallax>
        <video autoPlay loop muted playsInline src={heroVideo} className="hero-video"></video>
        <div className="hero-overlay" aria-hidden="true" />
      </div>
    </div>
  );
};

export default Slide1Hero;
