/**
 * CYBER CUJ — Mini CTF Challenge Engine & Web Audio Synthesizer
 * Handles interactive flag verification, hints, sound synthesis, and celebratory effects.
 */

// Sound Synthesizer using Web Audio API (No external sound files required)
class CyberAudio {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
  }

  toggle(enable) {
    if (enable === undefined) {
      this.enabled = !this.enabled;
    } else {
      this.enabled = enable;
    }
    if (this.enabled) {
      this.init();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.playBlip(600, 0.08);
    }
    return this.enabled;
  }

  playBlip(freq = 520, duration = 0.05) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  playSuccess() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.12, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.35);
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  playError() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }
}

window.cyberAudio = new CyberAudio();

// CTF Challenge Logic
document.addEventListener('DOMContentLoaded', () => {
  const flagForm = document.getElementById('mini-ctf-form');
  const flagInput = document.getElementById('flag-input');
  const flagFeedback = document.getElementById('flag-feedback');
  const hintToggleBtn = document.getElementById('toggle-hint-btn');
  const hintBox = document.getElementById('challenge-hint');

  // Valid flags
  const validFlags = [
    'CUJ{w3lc0m3_t0_cuj_cyb3r_4r3n4}',
    'CUJ{learn_hack_defend}',
    'CUJ{central_uni_jammu_2025}',
    'CUJ{terminal_god_mode}'
  ];

  // Check if previously solved
  if (localStorage.getItem('cyber_cuj_ctf_solved') === 'true') {
    if (flagFeedback) {
      flagFeedback.innerHTML = `
        <span style="color: var(--neon-green);">
          [+] CHALLENGE COMPLETED: You previously captured this flag! Status: VIP Hacker.
        </span>
      `;
    }
  }

  // Hint Toggle
  if (hintToggleBtn && hintBox) {
    hintToggleBtn.addEventListener('click', () => {
      if (hintBox.style.display === 'none' || !hintBox.style.display) {
        hintBox.style.display = 'block';
        hintToggleBtn.textContent = 'Hide Hint [-]';
      } else {
        hintBox.style.display = 'none';
        hintToggleBtn.textContent = 'Decrypt Hint [+]';
      }
      window.cyberAudio.playBlip(700, 0.04);
    });
  }

  // Submission handler
  if (flagForm && flagInput && flagFeedback) {
    flagForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitted = flagInput.value.trim();

      if (!submitted) {
        flagFeedback.innerHTML = `<span style="color: var(--accent-amber);">[!] Please enter a flag in the format CUJ{...}</span>`;
        window.cyberAudio.playError();
        return;
      }

      if (validFlags.includes(submitted)) {
        // Success
        localStorage.setItem('cyber_cuj_ctf_solved', 'true');
        flagFeedback.innerHTML = `
          <div style="padding: 12px; background: rgba(0, 255, 157, 0.1); border: 1px solid var(--neon-green); border-radius: 6px; color: var(--neon-green);">
            <strong>[SUCCESS]</strong> Flag Accepted! <strong>100 PTS</strong> awarded.<br>
            Welcome to the CYBER CUJ Hall of Hackers.
          </div>
        `;
        window.cyberAudio.playSuccess();
        triggerGlitchSuccessAnimation();
        
        // Show celebratory toast
        if (window.showCyberToast) {
          window.showCyberToast('FLAG CAPTURED! +100 PTS to your operative profile.', 'success');
        }
      } else {
        // Failure
        flagFeedback.innerHTML = `
          <span style="color: var(--accent-rose);">
            [-] ACCESS DENIED: Invalid flag checksum. Try analyzing the base64 string in the briefing!
          </span>
        `;
        window.cyberAudio.playError();
        flagInput.classList.add('shake');
        setTimeout(() => flagInput.classList.remove('shake'), 400);
      }
    });
  }
});

// Subtle celebration glitch/particle burst
function triggerGlitchSuccessAnimation() {
  const container = document.querySelector('.ctf-arena-card');
  if (!container) return;

  container.style.transition = 'box-shadow 0.3s ease';
  container.style.boxShadow = '0 0 50px rgba(0, 255, 157, 0.8), 0 0 100px rgba(0, 229, 255, 0.4)';
  setTimeout(() => {
    container.style.boxShadow = '';
  }, 1200);
}
