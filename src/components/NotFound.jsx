import React from "react";

export default function NotFound() {
  return (
    <div className="relative w-100 h-screen overflow-hidden bg-black">
  <video
    autoPlay
    loop
    muted
    className="absolute top-1/2 left-1/2 w-[90%] h-[90%] -translate-x-1/2 -translate-y-1/2 object-contain"
  >
    <source src="/404.mp4" type="video/mp4" />
  </video>

  
</div>
  );
}