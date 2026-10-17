/**
 * Interactive Wax-Seal Letter Engine
 * Realistic envelope unfolding, wax crack, and heartfelt letters
 */

(function () {
  'use strict';

  const LETTERS_DATA = {
    family: {
      category: 'Chapter 1 — Family & Heritage',
      title: 'To the Roots of Your Heart',
      date: 'Written with infinite gratitude and love',
      content: `My Dearest Bhumika,

When I look at you, I do not just see the incredible woman standing before me today—I see the tender love, quiet sacrifices, and gentle patience of the family who nurtured your soul from the very beginning.

I see your mother’s graceful kindness in the warmth of your smile, and your father’s steady strength in the courage of your convictions. I see the joy of your childhood days, where every small laughter echoed into the woman of boundless empathy you have become.

Family is the soil that gave your sunflower its deepest roots. They taught you how to love unconditionally, how to be resilient when the winds blow cold, and how to create a home in every room you enter.

Never forget how deeply you are cherished by the people who watched you take your very first steps. Your family is your forever sanctuary, and having their love woven into your heart is the greatest blessing you will ever carry.

May you always remember the hands that held yours first, and the love that will forever call you home.`,
      closing: 'With endless admiration and reverence,',
      signature: 'To Your Beautiful Roots 🌼'
    },

    friends: {
      category: 'Chapter 2 — Friendship & Laughter',
      title: 'To the Souls Who Light Up Your Sky',
      date: 'To the laughter that echoes across years',
      content: `Dearest Bhumika,

They say that good friends are like wildflowers scattered along life's winding roads—they don't need a map or a reason; they simply bloom alongside you and make every single mile brighter.

Your friends are a testament to the warmth of your own heart. People gravitate to you because you radiate a sunshine that is genuine, forgiving, and endlessly fun. From the uncontrollable late-night giggles over nothing to the deep conversations that heal the tired corners of your soul, these bonds are precious gold.

Thank you for being the friend who listens without judgment, who celebrates every friend's triumph as if it were your own, and who brings silliness and joy wherever you go.

Hold these friendships close to your chest. Cherish the road trips, the silly photos, the shared secrets, and the comforting silence of just being together. In a world that is always in a hurry, having friends who love you exactly as you are is pure magic.`,
      closing: 'To unending laughter and wild adventures,',
      signature: 'Your Cherished Circle 🌻'
    },

    us: {
      category: 'Chapter 3 — Abhay & Bhumika',
      title: 'My Eternal Sunshine, My Bhumika',
      date: 'Forever and always, from Abhay',
      content: `My Dearest Kuhu,
      haan this my part now and yes i took help of ai a lot to write all these beautiful messages kyunki yaar samajh hii nahi aaraha tha 
      maine toh bas shayad vahi likhvaya gpt se jo truly tumhare aaspaas ke log feel karte hain tumhare liye.
      Mujhe bilkul bhi samajh nahi aaraha hain ki main kya aur kaise bolu.
      But iss birthday pe main tumse bas heart to heart conversate karna chahta huun 
      yes the very first moment hum jab mile the tabse hii main tumhare peeche lattu hogya tha iss vajah se nahi ki tum acche dikhti ho acchi chup chaap baithti ho lekin sirf isiliye kyunki 
      mujhe sachme aise person ki talaash thi jo meri energy ko match kar sake i dont know ki how or what things have planned by god for me but yes yeh jaroor tha ki mera dsvv aana safal hogya
      main humesha se hii tumhe sirf apna banane ki khoj main laga rehta tha pata nahi kyun but mujhe tumhe share krna bilkuul accha nhi lgta tha tumhare gharwalo se bhi nahi aur isi possessiveness 
      ki vajah se kayi baar maine rash decisions liye rash actions kiye aur sabse bekar cheez mujhe yeh lg rhi hain ki tumhe maine dukh diya jabki mera usme door door tak koi bhi intent nahi tha 
      but nevertheless main yeh sab baate leke nahi laana chahta huun main bas tumse yehi kehna chahta huun bhumika tandon ki tum bohot special person ho meri hii nahi balki sabki zindagi main aur sab tumhe bohot pyaar karte hain
      aur shayad sabse jyada main chahe tum maano yaa naa maano maine shayad hii kisi se itna pyaar kiya hain jitna tumse kiya hoga aur main sachme tumse yeh vaada krta huun ki aaj ke baad shayad hi meri vajah se mere kisi past trauma ki vjh se 
      meri kisi bad aadat ki vajah se tumhe kuch beetana padega and yes yehi nahi har birthday pe main tumhe bas yahi feel karana chahta huun ki jo tum akelapan yaa fir lonely feel karti ho voh naa karo shayad abhi main tumhe nahi samajh paa raha huunn shayad ekdum smajhh
      bhi nahi paunga but vaada jaroor karta huun ki kuch saal main tumhe vishwaas jaroor dila dunga ki koi tumhe samajhta hain toh voh abhay sharma hii hain kyunki at the end agar momos ka dhyaan rakhna hain toh momos ki mummy ka bhi dhyaan rakhna pdega
      aur main humesha tumhara dhyaan rakhunga ho skta hain kabhi kabhi kuch galti kardu but please mujhe maaf kardena kyunki sachme hindi picturo ke sharukh jaisa pyaar kiya hain tumse aankh band karke jab subah ki roshni main khada hota huun toh yahi feel krta huun 
      ki iss roshni main tumhare pyaare pyaare haath mere baalo ko sehla rhe hain aur yahi sochke khush hojata huun chalo ab jyada nahi bolunnga nahi toh tum sochogi ki kya feku aadmi hain
      aur haan i really really very very love you and yes shayad main voh nahi tha jo tumhe chahiye but main voh jarur banunga jisko tum chahti ho vaada raha and yes a very very very happy birthday once again thankyou for coming to earth to make me human...... yours forever and ever
      haan tumhare liye ek special song bhi hain sachme voh song ki ek ek line bata degi main tumhare liye kya feel karta huun by heart............ `,
      closing: 'Eternally, unconditionally, and completely yours,',
      signature: 'Abhay ♡'
    }
  };

  // Play a soft gentle paper unfold sound using Web Audio API
  function playPaperChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;

      // Soft wax seal crack + sweet bell chime
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.35); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.6); // C6

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch (e) {
      // Audio not permitted yet or not supported
    }
  }

  // Open Letter Modal
  function openLetterModal(letterKey) {
    const data = LETTERS_DATA[letterKey] || LETTERS_DATA.us;

    let modal = document.getElementById('letter-reading-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'letter-reading-modal';
      modal.className = 'letter-modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="letter-modal-box">
        <button class="letter-close-btn" id="close-letter-desk" aria-label="Close Letter">&times;</button>
        
        <!-- Interactive Envelope -->
        <div class="envelope-container" id="interactive-envelope" title="Click wax seal to open letter">
          <div class="envelope-body">
            <div class="envelope-flap-top"></div>
            <div class="wax-seal" id="interactive-wax-seal">
              <span>💌</span>
              <div class="seal-pulse-hint">Break Seal & Open</div>
            </div>
            <div class="envelope-pocket"></div>
          </div>
        </div>

        <!-- Unfolding Vintage Letter -->
        <div class="letter-paper" id="interactive-letter-paper">
          <div class="card-floral-crest">
            <span>🌻</span><span>✦</span><span>🌼</span><span>✦</span><span>🌻</span>
          </div>
          <div class="letter-header">
            <span class="letter-category">${data.category}</span>
            <h2 class="letter-title">${data.title}</h2>
            <div class="letter-date">${data.date}</div>
          </div>

          <div class="letter-content">${data.content}</div>

          <div class="letter-signature-area">
            <div class="letter-closing">${data.closing}</div>
            <div class="letter-signature">${data.signature}</div>
          </div>

          <div class="letter-modal-actions">
            <button class="btn btn-secondary" id="fold-back-letter-btn">
              <span>✉️</span> Fold Back
            </button>
            <button class="btn btn-primary" id="save-letter-print-btn">
              <span>✨</span> Keep in Heart
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');

    const envelope = modal.querySelector('#interactive-envelope');
    const seal = modal.querySelector('#interactive-wax-seal');
    const paper = modal.querySelector('#interactive-letter-paper');
    const closeBtn = modal.querySelector('#close-letter-desk');
    const foldBtn = modal.querySelector('#fold-back-letter-btn');
    const printBtn = modal.querySelector('#save-letter-print-btn');

    function openEnvelope() {
      if (envelope.classList.contains('opened')) return;
      playPaperChime();
      envelope.classList.add('opened');
      setTimeout(() => {
        paper.classList.add('visible');
        paper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 500);
    }

    function foldEnvelope() {
      envelope.classList.remove('opened');
      paper.classList.remove('visible');
    }

    seal.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });

    envelope.addEventListener('click', openEnvelope);

    foldBtn.addEventListener('click', foldEnvelope);

    printBtn.addEventListener('click', () => {
      window.print();
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    // Auto trigger open on envelope after 300ms if desired
    setTimeout(openEnvelope, 400);
  }

  function initLetterTriggers() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-letter]');
      if (trigger) {
        e.preventDefault();
        const letterKey = trigger.getAttribute('data-open-letter');
        openLetterModal(letterKey);
      }
    });
  }

  window.LetterSystem = {
    openLetter: openLetterModal,
    data: LETTERS_DATA
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLetterTriggers);
  } else {
    initLetterTriggers();
  }
})();
