/**
 * Drifting Flower Petals & Sparkle Interaction Engine
 * Sunflower & Daisy Petals gently drifting with natural breeze
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const PETAL_COLORS = [
    { base: '#FEF08A', highlight: '#FDE047', shadow: '#EAB308' }, // Butter yellow
    { base: '#FDE68A', highlight: '#FBBF24', shadow: '#CA8A04' }, // Warm sunflower
    { base: '#FFFDF5', highlight: '#FEF9C3', shadow: '#FDE68A' }, // White daisy
    { base: '#FED7AA', highlight: '#FB923C', shadow: '#EA580C' }  // Peach blossom
  ];

  class Petal {
    constructor(w, h) {
      this.reset(w, h, true);
    }

    reset(w, h, randomY = false) {
      this.x = Math.random() * w;
      this.y = randomY ? Math.random() * h : -20 - Math.random() * 50;
      this.size = 9 + Math.random() * 11;
      this.speedY = 0.8 + Math.random() * 1.2;
      this.speedX = -0.5 + Math.random() * 1.0;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 1.8;
      this.flip = Math.random() * Math.PI;
      this.flipSpeed = 0.02 + Math.random() * 0.03;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = 0.02 + Math.random() * 0.02;
      this.swayRadius = 20 + Math.random() * 25;
      this.color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      this.opacity = 0.55 + Math.random() * 0.35;
    }

    update(w, h, windForce) {
      this.swayAngle += this.swaySpeed;
      this.flip += this.flipSpeed;
      this.rotation += this.rotationSpeed;

      this.y += this.speedY;
      this.x += Math.sin(this.swayAngle) * 0.8 + this.speedX + windForce;

      if (this.y > h + 30 || this.x < -40 || this.x > w + 40) {
        this.reset(w, h, false);
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.scale(1, Math.cos(this.flip));
      ctx.globalAlpha = this.opacity;

      // Draw graceful curved petal
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size * 0.5, -this.size * 0.5, this.size * 1.2, -this.size * 0.2, this.size * 1.4, this.size * 0.6);
      ctx.bezierCurveTo(this.size * 1.1, this.size * 1.2, this.size * 0.3, this.size * 1.2, 0, 0);
      ctx.closePath();

      // Subtle gradient on petal
      const grad = ctx.createLinearGradient(0, 0, this.size * 1.2, this.size * 0.8);
      grad.addColorStop(0, this.color.base);
      grad.addColorStop(0.6, this.color.highlight);
      grad.addColorStop(1, this.color.shadow);

      ctx.fillStyle = grad;
      ctx.fill();

      ctx.restore();
    }
  }

  function initPetalsCanvas() {
    let canvas = document.getElementById('petals-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'petals-canvas';
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const petalCount = window.innerWidth < 768 ? 16 : 28;
    const petals = Array.from({ length: petalCount }, () => new Petal(width, height));

    let wind = 0.2;
    let windPhase = 0;

    function render() {
      ctx.clearRect(0, 0, width, height);

      windPhase += 0.008;
      wind = Math.sin(windPhase) * 0.45;

      petals.forEach((p) => {
        p.update(width, height, wind);
        p.draw(ctx);
      });

      requestAnimationFrame(render);
    }

    render();

    // Click to scatter golden petal sparkles
    window.addEventListener('click', (e) => {
      // Don't trigger if clicked on an input or upload button
      if (e.target.closest('input, button, a')) return;

      createPetalSparkles(e.clientX, e.clientY);
    });
  }

  function createPetalSparkles(x, y) {
    const count = 7;
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'petal-sparkle';
      const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
      const distance = 40 + Math.random() * 50;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const rot = Math.random() * 360;

      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.setProperty('--tx', `${tx}px`);
      sparkle.style.setProperty('--ty', `${ty}px`);
      sparkle.style.setProperty('--rot', `${rot}deg`);

      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 950);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPetalsCanvas);
  } else {
    initPetalsCanvas();
  }
})();
