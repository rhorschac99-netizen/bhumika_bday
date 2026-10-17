/**
 * Dynamic Butterfly Animation System
 * Realistic 3D Wing Flapping & Natural Flight Paths
 */

(function () {
  'use strict';

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const BUTTERFLY_SVG_PATH = `
    <svg class="wing-svg" viewBox="0 0 50 70" width="100%" height="100%">
      <path class="wing-base" d="M48,5 C40,0 20,8 10,25 C0,42 5,60 18,68 C28,74 38,62 42,50 C46,38 48,20 48,5 Z" fill="#FBBF24"/>
      <path class="wing-inner" d="M42,12 C35,8 22,14 15,26 C8,38 12,52 22,58 C30,62 38,50 40,40 Z" fill="#F59E0B" opacity="0.6"/>
      <circle cx="20" cy="30" r="3.5" fill="#FFFDF0" opacity="0.8"/>
      <circle cx="28" cy="45" r="2.5" fill="#FFFDF0" opacity="0.8"/>
      <path class="wing-edge" d="M12,28 Q18,34 26,30" stroke="#78350F" stroke-width="1.2" fill="none" opacity="0.7"/>
    </svg>
  `;

  const BUTTERFLY_THEMES = [
    'butterfly-theme-gold',
    'butterfly-theme-butter',
    'butterfly-theme-peach',
    'butterfly-theme-white'
  ];

  const BUTTERFLY_SIZES = ['butterfly-sm', 'butterfly-md', 'butterfly-lg'];

  class Butterfly {
    constructor(container, id) {
      this.container = container;
      this.id = id;
      this.element = null;
      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() * window.innerHeight;
      this.targetX = this.x;
      this.targetY = this.y;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.angle = 0;
      this.targetAngle = 0;
      this.speed = 1.2 + Math.random() * 1.4;
      this.scale = 0.75 + Math.random() * 0.45;
      this.flightPhase = Math.random() * Math.PI * 2;
      this.flightRadius = 30 + Math.random() * 50;
      this.theme = BUTTERFLY_THEMES[Math.floor(Math.random() * BUTTERFLY_THEMES.length)];
      this.sizeClass = BUTTERFLY_SIZES[Math.floor(Math.random() * BUTTERFLY_SIZES.length)];

      this.init();
    }

    init() {
      const el = document.createElement('div');
      el.className = `butterfly ${this.theme} ${this.sizeClass}`;
      el.id = `bf-${this.id}`;
      el.innerHTML = `
        <div class="butterfly-body-wrapper">
          <div class="butterfly-wing left-wing">${BUTTERFLY_SVG_PATH}</div>
          <div class="butterfly-center"></div>
          <div class="butterfly-wing right-wing">${BUTTERFLY_SVG_PATH}</div>
        </div>
      `;
      this.container.appendChild(el);
      this.element = el;
      this.pickNewTarget();
    }

    pickNewTarget() {
      const padding = 80;
      this.targetX = padding + Math.random() * (window.innerWidth - padding * 2);
      this.targetY = padding + Math.random() * (window.innerHeight - padding * 2);
      this.speed = 1.2 + Math.random() * 1.6;
    }

    update(mouseX, mouseY) {
      this.flightPhase += 0.04;

      // Distance to target
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 60 || Math.random() < 0.003) {
        this.pickNewTarget();
      }

      // Gentle organic drift using sine curves
      const organicWaveX = Math.cos(this.flightPhase) * 1.5;
      const organicWaveY = Math.sin(this.flightPhase * 1.3) * 1.5;

      // Mouse interaction: if cursor is near, gently flutter away
      if (mouseX !== null && mouseY !== null) {
        const mdx = this.x - mouseX;
        const mdy = this.y - mouseY;
        const mouseDist = Math.hypot(mdx, mdy);
        if (mouseDist < 140) {
          this.vx += (mdx / mouseDist) * 1.8;
          this.vy += (mdy / mouseDist) * 1.8;
          this.element.classList.add('excited');
        } else {
          this.element.classList.remove('excited');
        }
      }

      // Move toward target
      this.vx += (dx / dist) * 0.06;
      this.vy += (dy / dist) * 0.06;

      // Damping
      this.vx *= 0.94;
      this.vy *= 0.94;

      // Update positions
      this.x += this.vx * this.speed + organicWaveX;
      this.y += this.vy * this.speed + organicWaveY;

      // Screen boundary wrap
      if (this.x < -60) this.x = window.innerWidth + 40;
      if (this.x > window.innerWidth + 60) this.x = -40;
      if (this.y < -60) this.y = window.innerHeight + 40;
      if (this.y > window.innerHeight + 60) this.y = -40;

      // Heading rotation
      const heading = Math.atan2(this.vy, this.vx) * (180 / Math.PI) + 90;
      this.angle += (heading - this.angle) * 0.1;

      // Apply transform
      this.element.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) rotate(${this.angle}deg) scale(${this.scale})`;
    }
  }

  // Initialize Butterfly Flight Manager
  function initButterflySystem() {
    let container = document.getElementById('butterfly-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'butterfly-container';
      document.body.appendChild(container);
    }

    const butterflies = [];
    const count = window.innerWidth < 768 ? 4 : 7; // Responsive count

    for (let i = 0; i < count; i++) {
      butterflies.push(new Butterfly(container, i));
    }

    let mouseX = null;
    let mouseY = null;
    let mouseTimeout = null;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        mouseX = null;
        mouseY = null;
      }, 2000);
    });

    // Excitement trigger when hovering cards/buttons
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('.memory-card, .btn, .envelope-container, .chapter-card')) {
        butterflies.forEach((b) => {
          if (Math.random() < 0.4) {
            b.element.classList.add('excited');
            b.speed *= 1.4;
            setTimeout(() => b.element.classList.remove('excited'), 1200);
          }
        });
      }
    });

    // Animation Loop
    function animate() {
      butterflies.forEach((b) => b.update(mouseX, mouseY));
      requestAnimationFrame(animate);
    }

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initButterflySystem);
  } else {
    initButterflySystem();
  }
})();
