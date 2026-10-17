/**
 * Photo Customizer & Local Storage Manager
 * Allows Abhay to easily personalize photos with real pictures of Bhumika & loved ones
 */

(function () {
  'use strict';

  // Apply stored photos on load
  function applyStoredPhotos() {
    document.querySelectorAll('[data-photo-key]').forEach((img) => {
      const key = img.getAttribute('data-photo-key');
      const savedSrc = localStorage.getItem(`bhumika_photo_${key}`);
      if (savedSrc) {
        img.src = savedSrc;
      }
    });
  }

  // Open Photo Customization Modal
  function openPhotoCustomizer(photoKey, currentImgEl) {
    let overlay = document.getElementById('photo-upload-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'photo-upload-overlay';
      overlay.className = 'story-modal-overlay';
      overlay.innerHTML = `
        <div class="upload-modal-box">
          <button class="modal-close-btn" id="close-upload-modal">&times;</button>
          <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🌻</div>
          <h3 class="font-serif" style="font-size: 1.6rem; margin-bottom: 0.4rem;">Personalize Photograph</h3>
          <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.2rem;">
            Upload your personal photo of Bhumika or paste an image link. It will be saved instantly to your browser!
          </p>

          <div class="drop-zone" id="photo-drop-zone">
            <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">📷</span>
            <strong style="color: var(--text-heading); font-size: 1rem;">Click to browse or drop an image here</strong>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">Supports JPG, PNG, WEBP</p>
            <input type="file" id="photo-file-input" accept="image/*" style="display: none;" />
          </div>

          <div style="margin: 1.2rem 0; display: flex; align-items: center; gap: 0.8rem;">
            <div style="flex: 1; height: 1px; background: rgba(234, 179, 8, 0.3);"></div>
            <span style="font-size: 0.85rem; color: var(--text-light);">OR PASTE URL</span>
            <div style="flex: 1; height: 1px; background: rgba(234, 179, 8, 0.3);"></div>
          </div>

          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.2rem;">
            <input type="text" id="photo-url-input" placeholder="https://example.com/photo.jpg" 
              style="flex: 1; padding: 0.65rem 0.9rem; border: 1px solid var(--glass-border); border-radius: var(--radius-sm); font-size: 0.9rem; outline: none; background: #fff;" />
            <button class="btn btn-primary" id="save-photo-url-btn" style="padding: 0.65rem 1.1rem; font-size: 0.9rem;">Save</button>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; border-top: 1px dashed rgba(234, 179, 8, 0.3); padding-top: 1rem;">
            <button id="reset-default-photo-btn" style="background: none; border: none; font-size: 0.85rem; color: #DC2626; cursor: pointer;">
              Reset to original photo
            </button>
            <button class="btn btn-secondary" id="cancel-upload-btn" style="padding: 0.5rem 1rem; font-size: 0.85rem;">Done</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      // Event Listeners for Upload Modal
      const fileInput = overlay.querySelector('#photo-file-input');
      const dropZone = overlay.querySelector('#photo-drop-zone');
      const urlInput = overlay.querySelector('#photo-url-input');
      const saveUrlBtn = overlay.querySelector('#save-photo-url-btn');
      const resetBtn = overlay.querySelector('#reset-default-photo-btn');
      const closeBtn = overlay.querySelector('#close-upload-modal');
      const cancelBtn = overlay.querySelector('#cancel-upload-btn');

      dropZone.addEventListener('click', () => fileInput.click());

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target.result;
            savePhoto(currentKey, dataUrl, targetImg);
            closeOverlay();
          };
          reader.readAsDataURL(file);
        }
      });

      saveUrlBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if (url) {
          savePhoto(currentKey, url, targetImg);
          closeOverlay();
        }
      });

      resetBtn.addEventListener('click', () => {
        localStorage.removeItem(`bhumika_photo_${currentKey}`);
        const defaultSrc = targetImg.getAttribute('data-default-src');
        if (defaultSrc) targetImg.src = defaultSrc;
        closeOverlay();
      });

      closeBtn.addEventListener('click', closeOverlay);
      cancelBtn.addEventListener('click', closeOverlay);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeOverlay();
      });
    }

    let currentKey = photoKey;
    let targetImg = currentImgEl;

    function closeOverlay() {
      overlay.classList.remove('active');
    }

    overlay.classList.add('active');
  }

  function savePhoto(key, src, imgEl) {
    try {
      localStorage.setItem(`bhumika_photo_${key}`, src);
      if (imgEl) {
        imgEl.src = src;
      }
    } catch (err) {
      console.warn('Storage limit reached, saving temporarily in DOM', err);
      if (imgEl) imgEl.src = src;
    }
  }

  // Setup click triggers on all change-photo buttons
  function initPhotoManager() {
    applyStoredPhotos();

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.card-change-photo-btn');
      if (btn) {
        e.stopPropagation();
        e.preventDefault();
        const card = btn.closest('.memory-card');
        const img = card.querySelector('.card-img');
        const key = img.getAttribute('data-photo-key');
        if (key) {
          openPhotoCustomizer(key, img);
        }
      }
    });
  }

  window.PhotoManager = {
    applyStoredPhotos,
    openPhotoCustomizer
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhotoManager);
  } else {
    initPhotoManager();
  }
})();
