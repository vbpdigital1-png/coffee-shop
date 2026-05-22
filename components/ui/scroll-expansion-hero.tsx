'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(true);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Calculate dynamic dimensions using functions so they update seamlessly if isMobile changes
  const videoWidth = useTransform(scrollYProgress, (pos) => {
    const startWidth = isMobile ? 85 : 40; // 85% width on mobile initially
    const currentWidth = startWidth + (100 - startWidth) * Math.min(pos / 0.8, 1);
    return `${currentWidth}%`;
  });

  const videoHeight = useTransform(scrollYProgress, (pos) => {
    const startHeight = isMobile ? 50 : 60; // 50vh on mobile initially
    const currentHeight = startHeight + (100 - startHeight) * Math.min(pos / 0.8, 1);
    return `${currentHeight}vh`;
  });

  const videoBorderRadius = useTransform(scrollYProgress, (pos) => {
    const radius = 24 - (24 * Math.min(pos / 0.8, 1));
    return `${radius}px`;
  });

  const textTranslateX = useTransform(scrollYProgress, (pos) => {
    const maxTranslate = isMobile ? 120 : 60; // How far the text splits apart
    return pos * maxTranslate;
  });

  const opacityFadeOut = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const bgOpacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  
  // The children content should fade in slightly before the video reaches 100%
  const contentFadeIn = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div className="relative bg-[#110B07] overflow-x-hidden">
      {/* 200vh tall container to create the scroll runway */}
      <div ref={containerRef} className="h-[200vh] relative w-full">
        
        {/* Sticky container that stays in view while we scroll down the runway */}
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center">
          
          {/* Background Image that fades out */}
          <motion.div className="absolute inset-0 z-0" style={{ opacity: bgOpacityFade }}>
            <Image
              src={bgImageSrc}
              alt="Background"
              width={1920}
              height={1080}
              className="w-full h-full object-cover grayscale opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-black/60" />
          </motion.div>

          {/* The Expanding Video Card */}
          <motion.div
            className="relative z-10 overflow-hidden shadow-2xl flex items-center justify-center"
            style={{
              width: videoWidth,
              height: videoHeight,
              borderRadius: videoBorderRadius,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            {mediaType === 'video' ? (
               <video
                 src={mediaSrc}
                 poster={posterSrc}
                 autoPlay
                 muted
                 loop
                 playsInline
                 className="w-full h-full object-cover"
               />
            ) : (
              <Image
                src={mediaSrc}
                alt={title || 'Media'}
                fill
                className="object-cover"
              />
            )}
            <motion.div className="absolute inset-0 bg-black/40" style={{ opacity: opacityFadeOut }} />
          </motion.div>

          {/* Title Text that splits apart */}
          <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none ${textBlend ? 'mix-blend-difference text-white' : 'text-blue-200'}`}>
            <div className="flex flex-col items-center justify-center w-full relative h-full">
              
              <div className="flex items-center justify-center text-center w-full gap-4 lg:gap-8 px-4">
                <motion.h2
                  className="text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] font-bold tracking-tighter"
                  style={{ x: useTransform(textTranslateX, (val) => `-${val}vw`) }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className="text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] font-bold tracking-tighter"
                  style={{ x: useTransform(textTranslateX, (val) => `${val}vw`) }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>
              
              <motion.div style={{ opacity: opacityFadeOut }} className="absolute bottom-16 flex flex-col items-center gap-3 w-full">
                {date && <p className="text-xl md:text-2xl font-serif tracking-wide text-blue-100/80">{date}</p>}
                {scrollToExpand && (
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-blue-100/60">{scrollToExpand}</p>
                    <motion.div 
                      animate={{ y: [0, 8, 0] }} 
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-[1px] h-12 bg-gradient-to-b from-blue-100/60 to-transparent"
                    />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section below the hero */}
      <motion.div style={{ opacity: contentFadeIn }} className="relative z-30 bg-[#110B07] min-h-screen">
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollExpandMedia;
