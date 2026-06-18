'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

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

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 28,
    mass: 0.6,
    restDelta: 0.001,
  });

  const videoWidth = useTransform(smoothProgress, (pos) => {
    const eased = 1 - Math.pow(1 - Math.min(pos / 0.95, 1), 3);
    const startWidth = isMobile ? 88 : 42;
    return `${startWidth + (100 - startWidth) * eased}%`;
  });

  const videoHeight = useTransform(smoothProgress, (pos) => {
    const eased = 1 - Math.pow(1 - Math.min(pos / 0.95, 1), 3);
    const startHeight = isMobile ? 48 : 58;
    return `${startHeight + (100 - startHeight) * eased}vh`;
  });

  const videoBorderRadius = useTransform(smoothProgress, (pos) => {
    const eased = 1 - Math.pow(1 - Math.min(pos / 0.95, 1), 2);
    return `${24 - 24 * eased}px`;
  });

  const textTranslateX = useTransform(smoothProgress, (pos) => {
    const eased = 1 - Math.pow(1 - Math.min(pos / 0.7, 1), 2);
    const maxTranslate = isMobile ? 100 : 55;
    return eased * maxTranslate;
  });

  const opacityFadeOut = useTransform(smoothProgress, [0, 0.15, 0.55], [1, 0.6, 0]);
  const bgOpacityFade = useTransform(smoothProgress, [0, 0.4, 0.9], [1, 0.5, 0]);
  const videoOverlayFade = useTransform(smoothProgress, [0.5, 0.85], [0.4, 0]);

  const contentOpacity = useTransform(smoothProgress, [0.72, 0.98], [0, 1]);
  const contentY = useTransform(smoothProgress, [0.72, 0.98], [48, 0]);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div className="relative bg-[#110B07] overflow-x-hidden">
      <div ref={containerRef} className="h-[170vh] relative w-full">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center">
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

          <motion.div
            className="relative z-10 overflow-hidden shadow-2xl flex items-center justify-center will-change-[width,height,border-radius]"
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
            <motion.div className="absolute inset-0 bg-black" style={{ opacity: videoOverlayFade }} />
          </motion.div>

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
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-[1px] h-12 bg-gradient-to-b from-blue-100/60 to-transparent"
                    />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="relative z-30 -mt-[12vh]"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollExpandMedia;
