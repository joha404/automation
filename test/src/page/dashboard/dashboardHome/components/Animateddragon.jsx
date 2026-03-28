import React, { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import dragonJSON from "../../../../utils/dragon.json";

const AnimatedDragon = () => {
  const lottieRef = useRef(null);

  const [position, setPosition] = useState({ top: 0, left: 0 });

  const getRandomPosition = () => {
    const dragonSize = 200;

    const maxX = window.innerWidth - dragonSize;
    const maxY = window.innerHeight - dragonSize;

    return {
      left: Math.random() * maxX,
      top: Math.random() * maxY,
    };
  };

  const playOnce = () => {
    if (lottieRef.current) {
      setPosition(getRandomPosition());
      lottieRef.current.goToAndPlay(0, true);
    }
  };

  useEffect(() => {
    playOnce();

    const interval = setInterval(() => {
      playOnce();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="dragon-overlay"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={dragonJSON}
        loop={false}
        autoplay={false}
        style={{
          width: 500,
          height: 500,
        }}
      />

      <style jsx>{`
        .dragon-overlay {
          position: absolute;
          pointer-events: none;
          z-index: 9;
          opacity: 0.25;
        }
      `}</style>
    </div>
  );
};

export default AnimatedDragon;
