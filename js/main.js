/**
 * The Sunflower Sanctuary — Main Orchestration Script
 * Ambient Audio Synthesizer, Deep Story Modals, and Interactive Features
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Romantic Audio Manager & Custom Song Engine
     Supports:
     - Direct file in project: assets/audio/our-song.mp3
     - In-browser MP3 upload (saved to IndexedDB / localStorage)
     - Audio URL streaming
     - Ambient acoustic synthesizer fallback
     ========================================================================== */
  const AUDIO_CONFIG = {
    localPath: 'assets/audio/our-song.mp3',
    defaultTitle: 'Our Romantic Melody',
    defaultArtist: 'Dedicated to Bhumika'
  };

  class RomanticAudioManager {
    constructor() {
      this.audioEl = new Audio();
      this.audioEl.loop = true;
      this.audioEl.volume = 0.65;
      this.isPlaying = false;
      this.isCustom = false;

      // Ambient Synthesizer Fallback
      this.ctx = null;
      this.synthTimer = null;
      this.noteIndex = 0;
      this.melody = [
        392.00, 493.88, 587.33, 783.99, 659.25, 587.33, 493.88, 440.00,
        261.63, 329.63, 392.00, 523.25, 493.88, 392.00, 329.63, 293.66,
        329.63, 392.00, 493.88, 659.25, 587.33, 493.88, 392.00, 369.99,
        293.66, 369.99, 440.00, 587.33, 523.25, 440.00, 369.99, 392.00
      ];

      this.initSource();
    }

    initSource() {
      const customAudio = localStorage.getItem('bhumika_custom_audio');
      if (customAudio) {
        this.audioEl.src = customAudio;
        this.isCustom = true;
      } else {
        // Try local file assets/audio/our-song.mp3
        this.audioEl.src = AUDIO_CONFIG.localPath;
      }

      this.audioEl.addEventListener('error', () => {
        // If file doesn't exist, we switch to gentle synth fallback without any error banner
        this.isCustom = false;
      });
    }

    getSongInfo() {
      const customTitle = localStorage.getItem('bhumika_song_title');
      if (customTitle) {
        return { title: customTitle, status: 'Custom Song' };
      }
      if (this.isCustom || this.audioEl.src.includes('our-song.mp3')) {
        return { title: AUDIO_CONFIG.defaultTitle, status: AUDIO_CONFIG.defaultArtist };
      }
      return { title: 'Our Sanctuary Melody', status: 'Ambient Chime' };
    }

    play() {
      this.isPlaying = true;

      // Try playing audio element first
      if (this.audioEl.src) {
        const playPromise = this.audioEl.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Playing custom audio
            })
            .catch(() => {
              // Fallback to synthesizer
              this.startSynth();
            });
          return;
        }
      }

      this.startSynth();
    }

    pause() {
      this.isPlaying = false;
      this.audioEl.pause();
      this.stopSynth();
    }

    toggle() {
      if (this.isPlaying) {
        this.pause();
        return false;
      } else {
        this.play();
        return true;
      }
    }

    /* Ambient Synthesizer Fallback Methods */
    initContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playNote(freq) {
      if (!this.ctx || !this.isPlaying) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      oscHarmonic.type = 'sine';
      oscHarmonic.frequency.setValueAtTime(freq * 2, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(2, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(filter);
      oscHarmonic.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      oscHarmonic.start(now);
      osc.stop(now + 2.3);
      oscHarmonic.stop(now + 2.3);
    }

    startSynth() {
      this.initContext();
      this.stepSynth();
    }

    stepSynth() {
      if (!this.isPlaying) return;
      const freq = this.melody[this.noteIndex % this.melody.length];
      this.playNote(freq);
      this.noteIndex++;
      const delay = (this.noteIndex % 4 === 0) ? 900 : 550;
      this.synthTimer = setTimeout(() => this.stepSynth(), delay);
    }

    stopSynth() {
      if (this.synthTimer) {
        clearTimeout(this.synthTimer);
        this.synthTimer = null;
      }
    }

    setCustomSong(dataUrl, title = 'Our Special Song') {
      try {
        localStorage.setItem('bhumika_custom_audio', dataUrl);
        localStorage.setItem('bhumika_song_title', title);
      } catch (e) {
        console.warn('Storage limit for base64 audio, using in-memory source', e);
      }
      this.audioEl.src = dataUrl;
      this.isCustom = true;
      this.stopSynth();
      if (this.isPlaying) {
        this.audioEl.play();
      }
    }

    resetDefault() {
      localStorage.removeItem('bhumika_custom_audio');
      localStorage.removeItem('bhumika_song_title');
      this.audioEl.src = AUDIO_CONFIG.localPath;
      this.isCustom = false;
      if (this.isPlaying) {
        this.pause();
        this.play();
      }
    }
  }

  const audioManager = new RomanticAudioManager();

  /* ==========================================================================
     2. Floating Audio Widget Controls & Song Settings Modal
     ========================================================================== */
  function initAudioWidget() {
    const widget = document.getElementById('audio-widget');
    if (!widget) return;

    // Add gear/settings button if not present
    if (!widget.querySelector('.audio-settings-btn')) {
      const settingsBtn = document.createElement('button');
      settingsBtn.className = 'audio-settings-btn';
      settingsBtn.title = 'Change Song / Add Your Own Music';
      settingsBtn.innerHTML = '⚙️';
      widget.appendChild(settingsBtn);

      settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openSongCustomizer();
      });
    }

    const disk = widget.querySelector('.audio-disk');
    const titleText = widget.querySelector('.audio-title');
    const statusText = widget.querySelector('.audio-status');
    const bars = widget.querySelector('.audio-bars');

    function updateWidgetDisplay() {
      const info = audioManager.getSongInfo();
      if (titleText) titleText.textContent = info.title;
      if (statusText) statusText.textContent = audioManager.isPlaying ? 'Now Playing' : info.status;
    }

    updateWidgetDisplay();

    widget.addEventListener('click', (e) => {
      if (e.target.closest('.audio-settings-btn')) return;

      const isPlaying = audioManager.toggle();
      if (isPlaying) {
        disk.classList.add('spinning');
        bars.classList.add('playing');
        widget.classList.add('active');
        if (statusText) statusText.textContent = 'Now Playing';
      } else {
        disk.classList.remove('spinning');
        bars.classList.remove('playing');
        widget.classList.remove('active');
        updateWidgetDisplay();
      }
    });
  }

  // Open Song Customizer Dialog
  function openSongCustomizer() {
    let overlay = document.getElementById('song-customizer-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'song-customizer-overlay';
      overlay.className = 'story-modal-overlay';
      overlay.innerHTML = `
        <div class="song-modal-box">
          <button class="modal-close-btn" id="close-song-modal">&times;</button>
          <div style="font-size: 2.2rem; margin-bottom: 0.4rem;">🎵 🌻</div>
          <h3 class="font-serif" style="font-size: 1.6rem; margin-bottom: 0.3rem;">Choose Our Song</h3>
          <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.4rem;">
            Personalize the background music for Bhumika with your favorite song or special melody.
          </p>

          <!-- Method 1: Drop audio file into project folder -->
          <div class="song-option-pill">
            <strong style="display: flex; align-items: center; gap: 0.4rem; color: var(--text-heading); font-size: 0.95rem;">
              <span>📁</span> Method 1: Put MP3 into Project Folder (Recommended)
            </strong>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.3rem;">
              Place any song file at: <code style="background: rgba(234, 179, 8, 0.2); padding: 2px 6px; border-radius: 4px; font-weight: 600;">assets/audio/our-song.mp3</code>. It plays automatically!
            </p>
          </div>

          <!-- Method 2: Upload file from computer -->
          <div class="song-option-pill">
            <strong style="display: flex; align-items: center; gap: 0.4rem; color: var(--text-heading); font-size: 0.95rem; margin-bottom: 0.4rem;">
              <span>🎧</span> Method 2: Upload MP3 from Computer
            </strong>
            <input type="file" id="song-file-input" accept="audio/*" style="font-size: 0.85rem; width: 100%;" />
            <p style="font-size: 0.8rem; color: var(--text-light); margin-top: 0.3rem;">
              Select an MP3, WAV, or M4A file from your phone or PC.
            </p>
          </div>

          <!-- Method 3: Song URL -->
          <div class="song-option-pill">
            <strong style="display: flex; align-items: center; gap: 0.4rem; color: var(--text-heading); font-size: 0.95rem; margin-bottom: 0.4rem;">
              <span>🔗</span> Method 3: Audio Link (URL)
            </strong>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" id="song-url-input" placeholder="https://example.com/song.mp3" 
                     style="flex: 1; padding: 0.5rem 0.8rem; border: 1px solid var(--glass-border); border-radius: var(--radius-sm); font-size: 0.85rem; background: #fff;" />
              <button class="btn btn-primary" id="save-song-url-btn" style="padding: 0.5rem 1rem; font-size: 0.85rem;">Save</button>
            </div>
          </div>

          <!-- Custom Song Title Label -->
          <div style="margin-top: 1rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-heading); margin-bottom: 0.3rem;">
              Song Title Displayed on Player:
            </label>
            <input type="text" id="song-title-input" placeholder="e.g. Ed Sheeran - Perfect" 
                   style="width: 100%; padding: 0.55rem 0.8rem; border: 1px solid var(--glass-border); border-radius: var(--radius-sm); font-size: 0.9rem; background: #fff;" />
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; border-top: 1px dashed rgba(234, 179, 8, 0.3); padding-top: 1rem;">
            <button id="reset-song-default-btn" style="background: none; border: none; font-size: 0.85rem; color: #DC2626; cursor: pointer;">
              Reset to Ambient Melody
            </button>
            <button class="btn btn-primary" id="save-song-settings-btn" style="padding: 0.55rem 1.4rem; font-size: 0.9rem;">
              Done
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      const closeBtn = overlay.querySelector('#close-song-modal');
      const saveBtn = overlay.querySelector('#save-song-settings-btn');
      const resetBtn = overlay.querySelector('#reset-song-default-btn');
      const fileInput = overlay.querySelector('#song-file-input');
      const urlInput = overlay.querySelector('#song-url-input');
      const saveUrlBtn = overlay.querySelector('#save-song-url-btn');
      const titleInput = overlay.querySelector('#song-title-input');

      const savedTitle = localStorage.getItem('bhumika_song_title') || '';
      titleInput.value = savedTitle;

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target.result;
            const songName = file.name.replace(/\.[^/.]+$/, '');
            const displayTitle = titleInput.value.trim() || songName;
            audioManager.setCustomSong(dataUrl, displayTitle);
            updateWidgetAfterSave();
            closeModal();
          };
          reader.readAsDataURL(file);
        }
      });

      saveUrlBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if (url) {
          const displayTitle = titleInput.value.trim() || 'Our Special Song';
          audioManager.setCustomSong(url, displayTitle);
          updateWidgetAfterSave();
          closeModal();
        }
      });

      titleInput.addEventListener('input', () => {
        const newTitle = titleInput.value.trim();
        if (newTitle) {
          localStorage.setItem('bhumika_song_title', newTitle);
        }
      });

      resetBtn.addEventListener('click', () => {
        audioManager.resetDefault();
        updateWidgetAfterSave();
        closeModal();
      });

      function updateWidgetAfterSave() {
        const widget = document.getElementById('audio-widget');
        if (widget) {
          const titleText = widget.querySelector('.audio-title');
          const statusText = widget.querySelector('.audio-status');
          const info = audioManager.getSongInfo();
          if (titleText) titleText.textContent = info.title;
          if (statusText) statusText.textContent = info.status;
        }
      }

      function closeModal() {
        overlay.classList.remove('active');
      }

      closeBtn.addEventListener('click', closeModal);
      saveBtn.addEventListener('click', closeModal);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
      });
    }

    overlay.classList.add('active');
  }

  /* ==========================================================================
     3. Navbar Scroll Spy & Mobile Menu
     ========================================================================== */
  function initNavigation() {
    const nav = document.querySelector('.sanctuary-nav');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });

    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
      });

      document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
        }
      });
    }
  }

  /* ==========================================================================
     4. Deep Meaning Photo Modal / Lightbox
     ========================================================================== */
  function initStoryModals() {
    let overlay = document.getElementById('story-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'story-modal-overlay';
      overlay.className = 'story-modal-overlay';
      overlay.innerHTML = `
        <div class="story-modal-box">
          <button class="modal-close-btn" id="close-story-modal">&times;</button>
          <img class="modal-photo-banner" id="modal-img" src="" alt="Memory Image" />
          <div class="modal-header-tag" id="modal-tag">Deep Meaning</div>
          <h2 class="modal-title font-serif" id="modal-title">Moment Title</h2>
          <div class="modal-deep-story" id="modal-story">Story description</div>
          <div class="modal-personal-reflection" id="modal-reflection">
            "A gentle thought dedicated to Bhumika."
          </div>
          <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
            <button class="btn btn-secondary" id="modal-done-btn">Cherish Moment</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      const closeBtn = overlay.querySelector('#close-story-modal');
      const doneBtn = overlay.querySelector('#modal-done-btn');

      const closeModal = () => overlay.classList.remove('active');
      closeBtn.addEventListener('click', closeModal);
      doneBtn.addEventListener('click', closeModal);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
      });
    }

    // Trigger on clicking "Explore Deep Meaning" or clicking memory card
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.memory-card');
      const exploreBtn = e.target.closest('.explore-deep-btn');

      if (e.target.closest('.card-change-photo-btn')) return; // let photo customizer handle it

      if (card && (exploreBtn || e.target.closest('.card-img-wrapper') || e.target.closest('.card-title'))) {
        const img = card.querySelector('.card-img');
        const tag = card.querySelector('.card-tag') ? card.querySelector('.card-tag').textContent : 'Deep Meaning';
        const title = card.querySelector('.card-title') ? card.querySelector('.card-title').textContent : 'A Cherished Memory';
        const fullStory = card.getAttribute('data-full-story') || card.querySelector('.card-excerpt').textContent;
        const reflection = card.getAttribute('data-reflection') || 'You make every memory feel like golden sunshine.';

        const modalImg = overlay.querySelector('#modal-img');
        const modalTag = overlay.querySelector('#modal-tag');
        const modalTitle = overlay.querySelector('#modal-title');
        const modalStory = overlay.querySelector('#modal-story');
        const modalReflection = overlay.querySelector('#modal-reflection');

        modalImg.src = img.src;
        modalTag.textContent = tag;
        modalTitle.textContent = title;
        modalStory.textContent = fullStory;
        modalReflection.textContent = `"${reflection}"`;

        overlay.classList.add('active');
      }
    });
  }

  /* ==========================================================================
     5. Scroll Reveal & Subtle Animations
     ========================================================================== */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.memory-card, .chapter-card, .letter-invite-card, .section-head');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(25px)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      observer.observe(el);
    });
  }

  /* ==========================================================================
     6. Sunflower Planting Interactive Feature
     ========================================================================== */
  function initPlantSunflower() {
    const plantBtn = document.getElementById('plant-sunflower-btn');
    const counterEl = document.getElementById('sunflower-counter');

    if (!plantBtn || !counterEl) return;

    let count = parseInt(localStorage.getItem('bhumika_sunflowers') || '108', 10);
    counterEl.textContent = count;

    plantBtn.addEventListener('click', () => {
      count++;
      localStorage.setItem('bhumika_sunflowers', count);
      counterEl.textContent = count;

      plantBtn.innerHTML = '<span>🌻</span> Sunflower Planted with Love!';
      plantBtn.style.transform = 'scale(1.05)';
      setTimeout(() => {
        plantBtn.innerHTML = '<span>🌻</span> Plant Another Sunflower';
        plantBtn.style.transform = 'scale(1)';
      }, 1400);
    });
  }

  // Initialization
  function initAll() {
    initNavigation();
    initAudioWidget();
    initStoryModals();
    initScrollReveal();
    initPlantSunflower();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
