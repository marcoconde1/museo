import React, { useState, useEffect } from 'react';
import VideoBanner from '../components/VideoBanner';
import LowerContent from '../components/LowerContent';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const MAX_SCROLL = 100; // Debe coincidir con el del Navbar
  const MAX_SCALE_REDUCTION = 0.003; // 10% de reducción máxima

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scale = 1 - Math.min(scrollY / MAX_SCROLL, 1) * MAX_SCALE_REDUCTION;
  const borderRadius = `${Math.min(scrollY / 5, 20)}px`;

  return (
    <div className="text-white">
      <div 
        className="mb-8 transition-all duration-300 ease-out overflow-hidden invert-trigger"
        style={{
          transform: `scale(${scale})`,
          borderRadius: borderRadius,
          transformOrigin: 'center top',
          marginLeft: `${Math.min(scrollY / 5, 20)}px`,
          marginRight: `${Math.min(scrollY / 5, 20)}px`
        }}
      >
       
        <VideoBanner />
     
      </div>
      <LowerContent />
    </div>
  );
};

export default Home;

