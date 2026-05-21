document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Sticky Header & Active Nav Links
  // =========================================================================
  const header = document.getElementById('main-header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleScroll = () => {
    // Add background color to header on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active navigation links highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Init on load


  // =========================================================================
  // 2. Mobile Drawer Menu
  // =========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const toggleMobileMenu = () => {
    header.classList.toggle('menu-active');
    mobileDrawer.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  };

  menuToggle.addEventListener('click', toggleMobileMenu);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('menu-active');
      mobileDrawer.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });
  });


  // =========================================================================
  // 3. Scroll Reveal Animations (Intersection Observer)
  // =========================================================================
  const revealElements = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .reveal-fade, .reveal-scale'
  );

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        // Once revealed, we don't need to observe it anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // =========================================================================
  // 4. Interactive Product Filter Tabs
  // =========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle active tab style
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      productCards.forEach(card => {
        // We use opacity + scale transitions for elegant filter reveals
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300); // Match transit timing
        }
      });
    });
  });


  // =========================================================================
  // 5. Best Selling Item Horizontal Product Slider
  // =========================================================================
  const sliderWrapper = document.querySelector('.slider-wrapper');
  const prevBtn = document.querySelector('.btn-prev');
  const nextBtn = document.querySelector('.btn-next');

  if (sliderWrapper && prevBtn && nextBtn) {
    const getScrollAmount = () => {
      const card = document.querySelector('.product-card');
      if (!card) return 300;
      // Scroll by card width + gap
      return card.clientWidth + 40; 
    };

    nextBtn.addEventListener('click', () => {
      sliderWrapper.scrollBy({
        left: getScrollAmount(),
        behavior: 'smooth'
      });
    });

    prevBtn.addEventListener('click', () => {
      sliderWrapper.scrollBy({
        left: -getScrollAmount(),
        behavior: 'smooth'
      });
    });
  }


  // =========================================================================
  // 6. Testimonial Slider & Content Cycling
  // =========================================================================
  const testimonials = [
    {
      name: "Shalima Hayden",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      rating: 5,
      text: "I Have Tested Caffeine Coffee Many Times, Really Amazing To Me. The Combination Was Very Good. One Thing Is To Serve Extraordinary Coffee With Caffeine. I Will Order From Caffeine For Any Of My Coffee Needs."
    },
    {
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      rating: 5,
      text: "The Rich Espresso Blends Here Are Second To None. The Ambiance Matches the Editorial Premium Vibe, and the Service is Simply Outstanding. An Essential Routine in My Daily Life."
    },
    {
      name: "Sophia Lin",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
      rating: 4,
      text: "Their Barista Artistry is Top-Tier. The Latte I Ordered Was So Beautiful I Didn't Want To Drink It, but the Taste Was Even Better. Caffeine has truly mastered the roast."
    }
  ];

  let currentTestimonialIndex = 0;
  const testimonialCard = document.querySelector('.testimonial-card-outer');
  const avatar = document.querySelector('.testimonial-avatar');
  const quote = document.querySelector('.testimonial-text');
  const ratingStars = document.querySelector('.star-rating');
  const reviewerName = document.querySelector('.reviewer-name');
  
  const prevTestimonialBtn = document.querySelector('.testimonial-prev');
  const nextTestimonialBtn = document.querySelector('.testimonial-next');

  const updateTestimonial = (index) => {
    if (!testimonialCard) return;

    // Slide/fade out effect
    testimonialCard.style.opacity = '0';
    testimonialCard.style.transform = 'scale(0.97) translateY(10px)';

    setTimeout(() => {
      const data = testimonials[index];
      
      // Update content
      avatar.src = data.avatar;
      avatar.alt = data.name;
      quote.textContent = `"${data.text}"`;
      reviewerName.textContent = data.name;

      // Update rating stars
      ratingStars.innerHTML = '';
      for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.innerHTML = i < data.rating ? '&#9733;' : '&#9734;';
        ratingStars.appendChild(star);
      }

      // Fade back in
      testimonialCard.style.opacity = '1';
      testimonialCard.style.transform = 'scale(1) translateY(0)';
    }, 400);
  };

  if (prevTestimonialBtn && nextTestimonialBtn) {
    prevTestimonialBtn.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
      updateTestimonial(currentTestimonialIndex);
    });

    nextTestimonialBtn.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
      updateTestimonial(currentTestimonialIndex);
    });
  }

});
