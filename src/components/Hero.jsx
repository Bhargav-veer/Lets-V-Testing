import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  const images = [assets.hero_img, assets.hero_img2, assets.hero_img3]; // Add more images as needed
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // State to track if the slideshow is paused

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 1800); // Change image every 3 seconds

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [images.length, isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true); // Pause the slideshow when the mouse enters the image
  };

  const handleMouseLeave = () => {
    setIsPaused(false); // Resume the slideshow when the mouse leaves the image
  };

  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'>
      {/* Hero Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
        <div className='text-[#414141]'>
          <div className='flex items-center gap-2'>
            <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
            <p className='font-medium text-sm md:text-base'>OUR BESTSELLERS</p>
          </div>
          <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Latest Arrivals</h1>
          <div className='flex items-center gap-2'>
            <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
            <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
          </div>
        </div>
      </div>
      {/* Hero Right Side */}
      <img
        className='w-full sm:w-1/2 transition-opacity duration-500'
        src={images[currentImageIndex]}
        alt="Hero"
        onMouseEnter={handleMouseEnter} // Pause on hover
        onMouseLeave={handleMouseLeave} // Resume on mouse leave
      />
    </div>
  )
}

export default Hero