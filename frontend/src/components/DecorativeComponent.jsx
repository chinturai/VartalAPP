import React, { useMemo } from "react";

const DecorativeComponent = () => {
  // Store random positions so they don’t change on re-render
  const floatingElements = useMemo(
    () =>
      [...Array(6)].map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.5 + 0.1,
      })),
    []
  );

  return (
    <div className="relative w-1/2 max-h-screen  flex justify-center items-center ">
      {/* Floating Chat Bubbles */}
      <div className="absolute bg-violet-500 text-white px-4 py-2 rounded-lg backdrop-blur-md animate-float duration-[6s] ease-in-out" style={{ top: "10%", left: "15%", animationDelay: "0.5s" }}>
        👋 Welcome to VartalAPP
      </div>
      <div className="absolute bg-yellow-400 text-black px-4 py-2 rounded-lg backdrop-blur-md animate-float duration-[6s] ease-in-out" style={{ top: "40%", right: "10%", animationDelay: "1s" }}>
      🫂 Network
      </div>
      <div className="absolute bg-red-500 text-white px-4 py-2 rounded-lg backdrop-blur-md animate-float duration-[6s] ease-in-out" style={{ bottom: "30%", left: "15%", animationDelay: "1.5s" }}>
        🔒 Secure
      </div>
      <div className="absolute bg-pink-600 text-white px-4 py-2 rounded-lg backdrop-blur-md animate-float duration-[6s] ease-in-out" style={{ bottom: "50%", left: "15%", animationDelay: "1.5s" }}>
        🪧 Trusted
      </div>
      <div className="absolute bg-white text-black px-4 py-2 rounded-lg backdrop-blur-md animate-float duration-[6s] ease-in-out" style={{ top: "70%", right: "10%", animationDelay: "1s" }}>
        😄 Simple
      </div>

      {/* Central Animated Element */}
      <div className="relative w-72 h-72 rounded-full bg-white/10 flex justify-center items-center">
        {/* Pulsing Effect */}
        <div className="absolute w-full h-full rounded-full border-2 border-white/20 animate-pulse1"></div>
        <div className="absolute w-full h-full rounded-full border-2 border-white/20 animate-pulse2"></div>
        <div className="absolute w-full h-full rounded-full border-2 border-white/20 animate-pulse3"></div>

        
      </div>

    </div>
  );
};

export default DecorativeComponent;
