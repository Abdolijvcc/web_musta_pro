/**
 * TRAINER PRO - Main JavaScript
 * Core functionality and interactions
 */

// ========== DOWNLOAD COUNTER SYSTEM ==========
class DownloadCounter {
  constructor() {
    this.storageKey = 'trainerProDownloads';
    this.init();
  }

  init() {
    const data = this.getData();
    const today = this.getToday();

    // Check if it's a new day
    if (data.lastDate !== today) {
      const daysPassed = this.getDaysDifference(data.lastDate, today);
      data.baseCount += daysPassed * 50; // Add 50 per day
      data.lastDate = today;
    }

    // Check if it's a new visit (not visited in last 5 minutes)
    const now = Date.now();
    const timeSinceLastVisit = now - (data.lastVisit || 0);
    const fiveMinutes = 5 * 60 * 1000;

    if (timeSinceLastVisit > fiveMinutes) {
      // New visit: add 2-3 downloads randomly
      const increment = Math.random() > 0.5 ? 3 : 2;
      data.baseCount += increment;
      data.lastVisit = now;
      console.log(`🎯 New visit detected! +${increment} downloads`);
    }

    this.saveData(data);
    this.updateDisplay(data.baseCount);
  }

  getData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading download data:', e);
    }

    // Default data
    return {
      baseCount: 25000,
      lastDate: this.getToday(),
      lastVisit: Date.now()
    };
  }

  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving download data:', e);
    }
  }

  getToday() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  getDaysDifference(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  updateDisplay(count) {
    const elements = document.querySelectorAll('[data-count]');
    elements.forEach(el => {
      el.setAttribute('data-count', count);
      // Set initial value
      el.textContent = count.toLocaleString();
      // Trigger animation if visible
      if (el.classList.contains('visible')) {
        el.classList.remove('counted');
        animateCounter(el);
      }
    });
  }
}

// Initialize download counter
const downloadCounter = new DownloadCounter();

// ========== DOM ELEMENTS ==========
const trustBanner = document.getElementById('trustBanner');
const closeTrustBannerBtn = document.getElementById('closeTrustBanner');
const faqItems = document.querySelectorAll('.faq-item');
const screenshotItems = document.querySelectorAll('.screenshot-item');
const modal = document.getElementById('screenshotModal');
const modalImage = document.getElementById('modalImage');
const closeModalBtn = document.getElementById('closeModal');
const modalBackdrop = modal?.querySelector('.modal-backdrop');

// ========== TRUST BANNER ==========
if (closeTrustBannerBtn) {
  closeTrustBannerBtn.addEventListener('click', () => {
    trustBanner.style.animation = 'fadeInDown 0.3s ease-out reverse';
    setTimeout(() => {
      trustBanner.style.display = 'none';
      document.body.style.paddingTop = '0';
    }, 300);
  });
}

// Adjust body padding for trust banner
if (trustBanner) {
  document.body.style.paddingTop = trustBanner.offsetHeight + 'px';
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);

    if (target) {
      const offset = trustBanner?.offsetHeight || 0;
      const targetPosition = target.offsetTop - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Trigger counter animation if it's a stat number
      if (entry.target.classList.contains('stat-number')) {
        animateCounter(entry.target);
      }
    }
  });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
  observer.observe(el);
});

// ========== COUNTER ANIMATION ==========
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'));
  if (!target || element.classList.contains('counted')) return;

  element.classList.add('counted');
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toLocaleString() + '+';
    }
  };

  updateCounter();
}

// ========== FAQ ACCORDION ==========
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');

  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    // Close all other items
    faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('active');
      }
    });

    // Toggle current item
    item.classList.toggle('active');
  });
});

// ========== SCREENSHOT MODAL ==========
screenshotItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (img && modal && modalImage) {
      modalImage.src = img.src;
      modalImage.alt = img.alt;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
});

// Close modal
function closeModal() {
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}

if (modalBackdrop) {
  modalBackdrop.addEventListener('click', closeModal);
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal?.classList.contains('active')) {
    closeModal();
  }
});

// ========== LAZY LOADING IMAGES ==========
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ========== PARALLAX EFFECT ==========
let ticking = false;

function updateParallax() {
  const scrolled = window.pageYOffset;

  // Hero mockup parallax
  const heroMockup = document.querySelector('.hero-mockup');
  if (heroMockup) {
    heroMockup.style.transform = `translateY(${scrolled * 0.1}px)`;
  }

  // Hero grid parallax
  const heroGrid = document.querySelector('.hero-grid');
  if (heroGrid) {
    heroGrid.style.transform = `translateY(${scrolled * 0.05}px)`;
  }

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
});

// ========== MOBILE MENU (IF NEEDED) ==========
// Add mobile menu functionality here if you add a navigation menu

// ========== PERFORMANCE OPTIMIZATION ==========
// Debounce resize events
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Recalculate trust banner height
    if (trustBanner && trustBanner.style.display !== 'none') {
      document.body.style.paddingTop = trustBanner.offsetHeight + 'px';
    }
  }, 250);
});

// ========== CONSOLE MESSAGE ==========
console.log('%c🏋️ TRAINER PRO', 'font-size: 24px; font-weight: bold; color: #00D9FF;');
console.log('%cOpen Source & Transparent', 'font-size: 14px; color: #00FF94;');
console.log('%cGitHub: https://github.com/Abdolijvcc/musta_pro', 'font-size: 12px; color: #4A90E2;');

// ========== INIT ==========
console.log('✅ TRAINER PRO Landing Page Loaded');

// ========== REVIEW FORM ==========
const reviewForm = document.getElementById('reviewForm');
const starRating = document.getElementById('starRating');
const ratingValue = document.getElementById('ratingValue');
const reviewSuccess = document.getElementById('reviewSuccess');

// Star rating functionality
if (starRating) {
  const stars = starRating.querySelectorAll('.star-input');

  stars.forEach((star, index) => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.getAttribute('data-rating'));
      ratingValue.value = rating;

      // Update star display
      stars.forEach((s, i) => {
        if (i < rating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });

    // Hover effect
    star.addEventListener('mouseenter', () => {
      const rating = parseInt(star.getAttribute('data-rating'));
      stars.forEach((s, i) => {
        if (i < rating) {
          s.style.color = '#FFD700';
          s.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
        }
      });
    });
  });

  starRating.addEventListener('mouseleave', () => {
    const currentRating = parseInt(ratingValue.value);
    stars.forEach((s, i) => {
      if (i >= currentRating) {
        s.style.color = '';
        s.style.textShadow = '';
      }
    });
  });
}

// Form submission
if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('reviewName').value;
    const rating = parseInt(ratingValue.value);
    const text = document.getElementById('reviewText').value;

    // Validate rating
    if (rating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }

    // Log the review (not saved, just for demo)
    console.log('📝 Nueva opinión recibida:');
    console.log('Nombre:', name);
    console.log('Rating:', rating + '★');
    console.log('Opinión:', text);

    // Hide form, show success message
    reviewForm.style.display = 'none';
    reviewSuccess.style.display = 'block';

    // Reset form after 3 seconds
    setTimeout(() => {
      reviewForm.reset();
      ratingValue.value = 0;
      const stars = starRating.querySelectorAll('.star-input');
      stars.forEach(s => s.classList.remove('active'));
      reviewForm.style.display = 'flex';
      reviewSuccess.style.display = 'none';
    }, 3000);
  });
}
