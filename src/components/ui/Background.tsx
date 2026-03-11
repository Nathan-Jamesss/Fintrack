import React, { useEffect, useState } from 'react';

export function Background() {
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; size: string; duration: string; delay: string }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      duration: `${Math.random() * 10 + 10}s`,
      delay: `${Math.random() * 10}s`,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617]">
      {/* Mesh Grid */}
      <div className="absolute inset-0 mesh-grid opacity-20" />
      
      {/* Floating Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Particle Drift */}
      <div className="particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(2,6,23,0.4)_100%]" />
    </div>
  );
}
