"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface BannerProps {
  images: string[];
}

const Banner: React.FC<BannerProps> = ({ images }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Banner ${index + 1}`}
          fill
          priority={index === 0} 
          style={{ objectFit: "contain" }} 
          className={`transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </>
  );
};

export default Banner;