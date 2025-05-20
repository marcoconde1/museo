import React from 'react';

const VideoBanner = () => {
  return (
    <div className="relative top-0 left-0 w-full h-screen z-0 overflow-hidden">
      <div className="relative h-full transition-all duration-300 ease-out">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          src="/resources/video_home.mp4"
        />

        {/* Texto principal abajo a la izquierda */}
        <div
          className="absolute bottom-13 left-4"
          style={{
            pointerEvents: 'none',
          }}
        >
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest">
            PRESERVANDO EL PASADO
          </h1>
          <div className="h-4 md:h-6" />
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest">
            EXPLORANDO EL FUTURO
          </h1>
        </div>

        {/* Ubicación abajo a la derecha */}
        <div className="absolute bottom-4 right-4 text-xs opacity-80">
          Salar de Uyuni, Bolivia
        </div>
      </div>
    </div>
  );
};

export default VideoBanner;