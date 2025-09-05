
import React from 'react';

const AnimatedCube = () => {
  return (
    <div className="w-16 h-16 mx-auto mb-6 perspective-1000">
      <div className="animate-cube w-full h-full relative transform-style-3d">
        <div className="absolute w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg opacity-80 
                        transform rotateY-0 translateZ-8"></div>
        <div className="absolute w-full h-full bg-gradient-to-br from-purple-600 to-emerald-500 rounded-lg opacity-60 
                        transform rotateY-90 translateZ-8"></div>
        <div className="absolute w-full h-full bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg opacity-40 
                        transform rotateY-180 translateZ-8"></div>
        <div className="absolute w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg opacity-20 
                        transform rotateY-270 translateZ-8"></div>
      </div>
    </div>
  );
};

export default AnimatedCube;
