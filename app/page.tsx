'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ChevronLeft, ChevronRight, Play, CheckCircle, ArrowRight } from 'lucide-react';

// Types
interface Product {
  name: string;
  category: 'black' | 'espresso' | 'doppio';
  image: string;
}

interface Testimonial {
  name: string;
  text: string;
  avatar: string;
  stars: number;
}

// Mock Data
const PRODUCTS: Product[] = [
  {
    name: 'Cappuccino',
    category: 'espresso',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=500&auto=format&fit=crop',
  },
  {
    name: 'Americano',
    category: 'black',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=500&auto=format&fit=crop',
  },
  {
    name: 'Espresso',
    category: 'doppio',
    image: 'https://images.unsplash.com/photo-1510707577719-0d1583af622b?q=80&w=500&auto=format&fit=crop',
  },
  {
    name: 'Cold Brew',
    category: 'black',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=500&auto=format&fit=crop',
  },
  {
    name: 'Macchiato',
    category: 'espresso',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=500&auto=format&fit=crop',
  },
  {
    name: 'Ristretto',
    category: 'doppio',
    image: 'https://images.unsplash.com/photo-1579888944880-e9834431e784?q=80&w=500&auto=format&fit=crop',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Shalima Hayden',
    text: '"I Have Tested Caffeine Coffee Many Times, Really Amazing To Me. The Combination Was Very Good. One Thing Is To Serve Extraordinary Coffee With Caffeine. I Will Order From Caffeine For Any Of My Coffee Needs."',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    stars: 5,
  },
  {
    name: 'Marcus Vance',
    text: '"The ambiance is only matched by the quality of their beans. Every cup is brewed to absolute perfection. Their pour-overs are a masterclass in coffee flavor extraction."',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    stars: 5,
  },
  {
    name: 'Sophia Lin',
    text: '"Caffeine has completely redefined my daily ritual. The staff is incredibly knowledgeable and passionate. Try their signature espresso - it is pure heaven."',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
    stars: 5,
  },
];

export default function Home() {
  // Navigation & UI state
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);

  // Slider reference
  const sliderRef = useRef<HTMLDivElement>(null);

  // Sticky Header Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for Scroll Reveals
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const elementsToReveal = document.querySelectorAll(
      '.reveal-up, .reveal-left, .reveal-right, .reveal-fade, .reveal-scale'
    );

    elementsToReveal.forEach((el) => observer.observe(el));

    return () => {
      elementsToReveal.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Filter products based on active tab
  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  // Slider navigation
  const slideNext = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.firstElementChild?.clientWidth || 300;
      const gap = 40; // 2.5rem
      sliderRef.current.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
    }
  };

  const slidePrev = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.firstElementChild?.clientWidth || 300;
      const gap = 40;
      sliderRef.current.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
    }
  };

  // Testimonial navigation
  const testimonialNext = () => {
    setActiveTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const testimonialPrev = () => {
    setActiveTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  // Form submission
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className="bg-[#110B07] text-white min-h-screen relative overflow-x-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 bg-[#D6BA9D] text-[#110B07] px-6 py-4 rounded-none shadow-2xl flex items-center gap-3 z-[9999] font-medium"
          >
            <CheckCircle size={20} />
            Successfully subscribed to the Caffeine Newsletter!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <a href="#" className="logo">Caffeine</a>
          
          <nav className="nav-menu">
            <a href="#" className="nav-link active">Home</a>
            <a href="#menu" className="nav-link">Menu</a>
            <a href="#about" className="nav-link">About Us</a>
            <a href="#footer" className="nav-link">Facilities</a>
          </nav>

          <div className="header-utilities">
            {/* <a href="#signin" className="signin-btn">Sign In</a> */}
            <button className="search-btn" aria-label="Search">
              <Search size={20} />
            </button>
            {/* Mobile Menu Toggle */}
            <button 
              className="menu-toggle" 
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              aria-label="Toggle Menu"
            >
              {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <nav className="drawer-nav">
          <a href="#" className="drawer-link" onClick={() => setIsDrawerOpen(false)}>Home</a>
          <a href="#menu" className="drawer-link" onClick={() => setIsDrawerOpen(false)}>Menu</a>
          <a href="#about" className="drawer-link" onClick={() => setIsDrawerOpen(false)}>About Us</a>
          <a href="#footer" className="drawer-link" onClick={() => setIsDrawerOpen(false)}>Facilities</a>
          {/* <a href="#signin" className="drawer-link drawer-signin" onClick={() => setIsDrawerOpen(false)}>Sign In</a> */}
        </nav>
      </div>

      {/* Scroll Expansion Hero Section */}
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/assets/19157857-uhd_4096_2160_60fps.mp4"
        bgImageSrc="/assets/pexels-sarahpictures-10357548.jpg"
        title="Discover The Art Of Perfect Coffee"
        date="Est. 2026"
        scrollToExpand="Scroll down to expand"
        textBlend
      >
        
        {/* Children content fades in once the video is expanded */}
        <div className="w-full text-white bg-[#110B07]">
          
          {/* Alternating Feature Section A - Coffee Heaven */}
          <section id="about" className="feature-section light-theme -mx-8 md:-mx-16 lg:-mx-20">
            <div className="feature-container">
              <div className="feature-visual reveal-left">
                <div className="image-offset-frame">
                  <div className="geometric-accent line-left"></div>
                  <Image 
                    src="/assets/barista_latte_art.png" 
                    alt="Barista pouring latte art" 
                    width={420} 
                    height={525} 
                    className="feature-image"
                  />
                </div>
              </div>
              <div className="feature-content reveal-right">
                <h2 className="feature-title">Coffee Heaven</h2>
                <p className="feature-desc">Experience the pinnacle of coffee crafting. Our baristas are trained to extract full complexity, aroma, and delicate flavor profiles, pouring a masterpiece in every single cup of rich espresso.</p>
                <a href="#menu" className="btn btn-dark">
                  View Menu
                  <ArrowRight size={18} className="ml-2 inline" />
                </a>
              </div>
            </div>
          </section>

          {/* Alternating Feature Section B - Jean's Coffee */}
          <section className="feature-section light-theme -mx-8 md:-mx-16 lg:-mx-20 pt-0">
            <div className="feature-container">
              <div className="feature-content reveal-left order-2 lg:order-1">
                <h2 className="feature-title">Jean's Coffee</h2>
                <p className="feature-desc">Sourced responsibly from selected high-altitude farms, our special roast highlights bright, natural notes. Perfectly balanced with creamy texture to ensure you feel at peace with every single sip.</p>
                <a href="#menu" className="btn btn-dark">
                  Explore Blend
                  <ArrowRight size={18} className="ml-2 inline" />
                </a>
              </div>
              <div className="feature-visual reveal-right order-1 lg:order-2">
                <div className="image-offset-frame">
                  <div className="geometric-accent line-right"></div>
                  <Image 
                    src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop" 
                    alt="Iced and hot coffee selection" 
                    width={420} 
                    height={525} 
                    className="feature-image"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Best Selling Item Section */}
          <section id="menu" className="best-selling-section caramel-theme -mx-8 md:-mx-16 lg:-mx-20">
            <div className="best-selling-container">
              <header className="section-header reveal-up">
                <h2 className="section-title">Best Selling Item</h2>
                <p className="section-subtitle">Our crowd favorites, curated with passion. Choose from smooth drip blends to bold specialty espresso pours.</p>
              </header>

              {/* Filter Tabs */}
              <div className="filter-tabs reveal-up">
                <button 
                  className={`filter-tab ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  All
                </button>
                <button 
                  className={`filter-tab ${activeCategory === 'black' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('black')}
                >
                  Black
                </button>
                <button 
                  className={`filter-tab ${activeCategory === 'espresso' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('espresso')}
                >
                  Espresso
                </button>
                <button 
                  className={`filter-tab ${activeCategory === 'doppio' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('doppio')}
                >
                  Doppio
                </button>
              </div>

              {/* Product Slider Grid (Framer Motion Layout) */}
              <div className="slider-wrapper reveal-fade w-full" ref={sliderRef}>
                <motion.div layout className="product-grid pb-8 snap-x snap-mandatory">
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
                        key={product.name} 
                        className="product-card min-w-[280px] snap-center sm:snap-start"
                      >
                        <div className="card-inner">
                          <div className="card-image-wrapper">
                            <Image 
                              src={product.image} 
                              alt={product.name} 
                              width={300} 
                              height={300} 
                              className="product-image"
                            />
                          </div>
                          <h3 className="product-name">{product.name}</h3>
                          <button className="btn-order-now" onClick={() => alert(`Ordered ${product.name}!`)}>Order Now</button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Slider Controls */}
              <div className="slider-controls reveal-up">
                <button className="slider-arrow btn-prev" aria-label="Previous Product" onClick={slidePrev}>
                  <ChevronLeft size={24} />
                </button>
                <button className="slider-arrow btn-next" aria-label="Next Product" onClick={slideNext}>
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </section>

          {/* Testimonial Section */}
          <section className="testimonial-section light-theme -mx-8 md:-mx-16 lg:-mx-20">
            <div className="testimonial-container">
              <h2 className="testimonial-header reveal-up">What Our Customer Says</h2>
              
              <div className="testimonial-slider-wrapper">
                <button className="nav-arrow testimonial-prev" aria-label="Previous Testimonial" onClick={testimonialPrev}>
                  <ChevronLeft size={24} />
                </button>

                <div className="testimonial-card-outer w-full relative min-h-[350px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTestimonialIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full flex flex-col items-center text-center mt-12"
                    >
                      {/* Customer Avatar */}
                      <div className="avatar-container -mt-[140px] mb-8">
                        <Image 
                          src={TESTIMONIALS[activeTestimonialIndex].avatar} 
                          alt={TESTIMONIALS[activeTestimonialIndex].name} 
                          width={100} 
                          height={100} 
                          className="testimonial-avatar"
                        />
                      </div>
                      
                      <div className="flex flex-col items-center gap-6">
                        <p className="testimonial-text max-w-2xl">{TESTIMONIALS[activeTestimonialIndex].text}</p>
                        <div className="star-rating">
                          {Array.from({ length: TESTIMONIALS[activeTestimonialIndex].stars }).map((_, i) => (
                            <span key={i} className="star">&#9733;</span>
                          ))}
                        </div>
                        <h4 className="reviewer-name">{TESTIMONIALS[activeTestimonialIndex].name}</h4>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <button className="nav-arrow testimonial-next" aria-label="Next Testimonial" onClick={testimonialNext}>
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </section>

          {/* Newsletter Banner */}
          <div className="newsletter-banner reveal-up">
            <div className="newsletter-content">
              <h3 className="newsletter-title">Stay Up To Date On<br />All News And Offers.</h3>
            </div>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <div className="input-group">
                <input type="email" placeholder="Enter Your Email Address" required className="newsletter-input" />
                <button type="submit" className="newsletter-submit" aria-label="Subscribe">
                  <ArrowRight size={24} />
                </button>
              </div>
            </form>
          </div>

          {/* Footer & Brand Section */}
          <footer id="footer" className="site-footer -mx-8 md:-mx-16 lg:-mx-20">
            <div className="footer-container">
              
              {/* Brand Block */}
              <div className="footer-col brand-col">
                <div className="brand-box">
                  <span className="brand-logo">Caffeine</span>
                </div>
                <p className="brand-desc">Enjoy Better And Better Quality Coffee With Caffeine.</p>
              </div>
              
              {/* Contact Info */}
              <div className="footer-col contact-col">
                <h4 className="footer-col-title">Contact Us</h4>
                <ul className="contact-list">
                  <li><strong>Email:</strong> <a href="mailto:Caffeine@Gmail.Com">Caffeine@Gmail.Com</a></li>
                  <li><strong>Call Us:</strong> <a href="tel:+122156251420">(221) 562 - 51420</a></li>
                  <li><strong>Text Us:</strong> <a href="sms:+122156251420">(221) 562 - 51420</a></li>
                  <li><strong>Address:</strong> 311 Brooklyn Street Covington, VA 24426</li>
                </ul>
              </div>
              
              {/* Social Video & Follow Us */}
              <div className="footer-col social-col">
                <div className="video-thumbnail-container">
                  <Image 
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop" 
                    alt="Coffee shop atmosphere" 
                    width={300} 
                    height={168} 
                    className="video-thumbnail"
                  />
                  <button className="play-overlay" aria-label="Play video" onClick={() => alert('Playing brand video...')}>
                    <Play size={20} fill="currentColor" className="ml-1" />
                  </button>
                </div>
                <div className="follow-us-section">
                  <span className="follow-label">Follow Us</span>
                  <div className="social-icons">
                    <a href="#" className="social-icon" aria-label="Pinterest">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
                      </svg>
                    </a>
                    <a href="#" className="social-icon" aria-label="Instagram">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </a>
                    <a href="#" className="social-icon" aria-label="Twitter">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </a>
                    <a href="#" className="social-icon" aria-label="Facebook">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
            </div>
            
            <div className="footer-bottom">
              <p className="copyright">Copyright 2026 Tophats Agency</p>
            </div>
          </footer>

        </div>

      </ScrollExpandMedia>

    </div>
  );
}
