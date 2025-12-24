/**
 * TRAINER PRO - Main JavaScript
 * Core functionality and interactions
 */

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
