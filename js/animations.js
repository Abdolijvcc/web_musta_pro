/**
 * TRAINER PRO - Advanced Animations
 * Typing effect, 3D tilt, and other advanced animations
 */

// ========== TYPING EFFECT ==========
class TypingEffect {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
    }

    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        } else {
            // Remove cursor effect after typing is done
            this.element.style.borderRight = 'none';
        }
    }

    start() {
        this.element.textContent = '';
        this.element.style.borderRight = '3px solid var(--accent)';
        this.type();
    }
}

// Initialize typing effect for hero title (optional - can be enabled)
// const heroTitle = document.querySelector('.hero-text h1');
// if (heroTitle) {
//   const originalText = heroTitle.textContent;
//   const typingEffect = new TypingEffect(heroTitle, originalText, 80);
//   setTimeout(() => typingEffect.start(), 500);
// }

// ========== 3D TILT EFFECT ==========
class Tilt3D {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            maxTilt: options.maxTilt || 10,
            perspective: options.perspective || 1000,
            scale: options.scale || 1.05,
            speed: options.speed || 400,
            ...options
        };

        this.init();
    }

    init() {
        this.element.style.transformStyle = 'preserve-3d';
        this.element.style.transition = `transform ${this.options.speed}ms ease-out`;

        this.element.addEventListener('mouseenter', () => {
            this.element.style.willChange = 'transform';
        });

        this.element.addEventListener('mousemove', (e) => this.handleMouseMove(e));

        this.element.addEventListener('mouseleave', () => {
            this.element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            this.element.style.willChange = 'auto';
        });
    }

    handleMouseMove(e) {
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * this.options.maxTilt;
        const rotateY = ((centerX - x) / centerX) * this.options.maxTilt;

        this.element.style.transform = `
      perspective(${this.options.perspective}px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(${this.options.scale})
    `;
    }
}

// Apply 3D tilt to cards
document.querySelectorAll('.card-3d').forEach(card => {
    new Tilt3D(card, {
        maxTilt: 5,
        scale: 1.03,
        speed: 300
    });
});

// ========== MOUSE FOLLOW EFFECT ==========
class MouseFollower {
    constructor() {
        this.cursor = null;
        this.cursorDot = null;
        this.init();
    }

    init() {
        // Only on desktop
        if (window.innerWidth < 768) return;

        // Create cursor elements
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
      position: fixed;
      width: 40px;
      height: 40px;
      border: 2px solid var(--accent);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.15s ease-out, opacity 0.15s;
      opacity: 0;
    `;

        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'custom-cursor-dot';
        this.cursorDot.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      background: var(--accent);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      transition: transform 0.05s ease-out, opacity 0.15s;
      opacity: 0;
    `;

        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorDot);

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.opacity = '1';
            this.cursorDot.style.opacity = '1';

            this.cursor.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
            this.cursorDot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
        });

        // Hover effects
        document.querySelectorAll('a, button, .screenshot-item').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform += ' scale(1.5)';
                this.cursor.style.borderColor = 'var(--success)';
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = this.cursor.style.transform.replace(' scale(1.5)', '');
                this.cursor.style.borderColor = 'var(--accent)';
            });
        });
    }
}

// Initialize custom cursor (optional - can be disabled if too much)
// new MouseFollower();

// ========== GRADIENT ANIMATION CONTROL ==========
function initGradientAnimations() {
    const gradientElements = document.querySelectorAll('.animated-gradient');

    gradientElements.forEach(el => {
        el.style.backgroundSize = '200% 200%';
    });
}

initGradientAnimations();

// ========== SCROLL PROGRESS INDICATOR (OPTIONAL) ==========
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--accent));
    z-index: 9999;
    transition: width 0.1s ease-out;
    width: 0%;
  `;

    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Uncomment to enable scroll progress
// createScrollProgress();

// ========== STAGGER ANIMATION DELAYS ==========
function applyStaggerDelays() {
    document.querySelectorAll('[class*="stagger-"]').forEach(el => {
        const match = el.className.match(/stagger-(\d+)/);
        if (match) {
            const delay = parseInt(match[1]) * 100; // 100ms per stagger level
            el.style.transitionDelay = delay + 'ms';
            el.style.animationDelay = delay + 'ms';
        }
    });
}

applyStaggerDelays();

// ========== RIPPLE EFFECT ON BUTTONS ==========
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      top: ${y}px;
      left: ${x}px;
      pointer-events: none;
      animation: ripple 0.6s ease-out;
    `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// ========== PERFORMANCE MONITORING ==========
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`⚡ Page loaded in ${loadTime}ms`);
        }, 0);
    });
}

console.log('✅ Advanced animations initialized');
