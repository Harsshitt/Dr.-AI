// src/components/FullWidthWave.jsx
import React from "react";



export default function FullWidthWave({ top = "10px", height = "80px" }) {
  const topValue = typeof top === "number" ? `${top}px` : top;
  const heightValue = typeof height === "number" ? `${height}px` : height;

  const css = `
  .drai-wave-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: ${topValue};
    width: 100vw;
    overflow: visible;
    pointer-events: none;
    z-index: 50;
    height: ${heightValue};
    display: block;
  }
  .drai-full-wave {
    width: 100%;
    height: 10%;
    display: block;
  }
  .drai-zigzag {
    stroke-dasharray: 1200;
    stroke-dashoffset: 1200;
    animation: drai-draw 1.6s ease forwards, drai-pulse 3s infinite 1.6s;
    stroke: rgba(220,40,40,0.12);
    stroke-width: 6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  @keyframes drai-draw {
    to { stroke-dashoffset: 0; }
  }
  @keyframes drai-pulse {
    0%   { stroke-opacity: 0.10; transform: translateY(0); }
    50%  { stroke-opacity: 0.16; transform: translateY(0.6px); }
    100% { stroke-opacity: 0.10; transform: translateY(0); }
  }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="drai-wave-wrapper" aria-hidden="true">
        <svg
          className="drai-full-wave"
          viewBox="0 0 2000 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline
            className="drai-zigzag"
            points="0,60 150,10 300,70 450,30 600,80 750,20 900,70 1050,30 1200,75 1350,15 1500,60 1650,20 1800,60 2000,60"
            fill="none"
          />
        </svg>
      </div>
    </>
  );
}
