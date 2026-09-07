/**
 * CYBER CUJ — Main Application Script
 * Features:
 *  - Dynamic CMS Hydration from SiteData store (real-time admin updates)
 *  - Interactive Cyber Canvas (Node network + mouse gravity)
 *  - Interactive Terminal Emulator (Live commands, admin redirect, quick buttons)
 *  - Animated Statistics Counter (IntersectionObserver)
 *  - Event Filtering & Interactive Modal Viewer
 *  - Resource Search Engine
 *  - Join Us Form Handler & Real-time Administrator Storage
 *  - FAQ Accordion & Mobile Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  hydrateFromSiteData();
  initNavbar();
  initCyberCanvas();
  initTerminal();
  initStatsCounter();
  initEventsSystem();
  initResourceSearch();
  initJoinForm();
  initFAQ();
  initToggles();

  // Listen for real-time changes saved in Administrator panel (same tab)
  window.addEventListener('siteDataUpdated', () => {
    hydrateFromSiteData();
  });

  // Cross-Tab Instant Sync: When admin saves in another tab or window,
  // the home page in full view updates IMMEDIATELY without needing a page refresh!
  window.addEventListener('storage', (e) => {
    if (e.key === 'CYBER_CUJ_SITE_DATA' || e.key === 'CYBER_CUJ_ADMIN_AUTH') {
      hydrateFromSiteData();
    }
  });

  // Auto-refresh when user focuses back on the full-view tab
  window.addEventListener('focus', () => {
    hydrateFromSiteData();
  });

  // Preview iframe message listener
  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'REFRESH_SITE_DATA') {
      hydrateFromSiteData();
    }
  });
});

/* ==========================================================================
   0. DYNAMIC CMS HYDRATION (Connected to SiteData)
   ========================================================================== */
function hydrateFromSiteData() {
  if (!window.SiteData) return;
  const data = window.SiteData.get();

  // 1. Branding & Hero
  const b = data.branding || {};
  const s = data.stats || {};
  const sec = data.sectionsVisibility || {};

  // Page Document Title
  if (b.siteName && b.orgName) {
    document.title = `${b.siteName} — ${b.orgName}`;
  }

  // Navbar Brand Text
  const navName = document.getElementById('nav-brand-name');
  if (navName && b.siteName) {
    const parts = b.siteName.split(' ');
    navName.innerHTML = parts.length > 1
      ? `${escapeHTML(parts[0])}<span>${escapeHTML(parts.slice(1).join(' '))}</span>`
      : escapeHTML(b.siteName);
  }

  const navAffil = document.getElementById('nav-brand-affil');
  if (navAffil && b.orgName) navAffil.textContent = b.orgName;

  // Hero Org Tag
  const heroOrgText = document.getElementById('hero-org-text');
  if (heroOrgText && b.orgName) {
    heroOrgText.textContent = `${b.orgName} // Cyber Division`;
  }

  // Hero Main Title
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle && b.siteName) {
    const parts = b.siteName.split(' ');
    if (parts.length > 1) {
      heroTitle.innerHTML = `<span class="glow-text">${escapeHTML(parts[0])}</span> <span class="cyber-accent">${escapeHTML(parts.slice(1).join(' '))}</span>`;
    } else {
      heroTitle.innerHTML = `<span class="glow-text">${escapeHTML(b.siteName)}</span>`;
    }
  }

  const heroSub = document.getElementById('hero-subtitle');
  if (heroSub && b.subtitle) heroSub.textContent = b.subtitle;

  const heroTag = document.getElementById('hero-tagline');
  if (heroTag && b.tagline) heroTag.textContent = `> ${b.tagline} _`;

  const heroDesc = document.getElementById('hero-description');
  if (heroDesc && b.description) heroDesc.textContent = b.description;

  const heroDefcon = document.getElementById('hero-defcon');
  if (heroDefcon && b.defenseStatus) {
    heroDefcon.innerHTML = `<span class="status-pulse"></span> ${escapeHTML(b.defenseStatus)}`;
  }

  const heroNodes = document.getElementById('hero-nodes');
  if (heroNodes && b.activeNodes) heroNodes.textContent = b.activeNodes;

  const heroSubnet = document.getElementById('hero-subnet');
  if (heroSubnet && b.campusSubnet) heroSubnet.textContent = b.campusSubnet;

  // Footer Brand & Info Hydration
  const footerName = document.getElementById('footer-brand-name');
  if (footerName && b.siteName) {
    const parts = b.siteName.split(' ');
    footerName.innerHTML = parts.length > 1
      ? `${escapeHTML(parts[0])}<span>${escapeHTML(parts.slice(1).join(' '))}</span>`
      : escapeHTML(b.siteName);
  }

  const footerAffil = document.getElementById('footer-brand-affil');
  if (footerAffil && b.orgName) footerAffil.textContent = b.orgName;

  const footerAffilOrg = document.getElementById('footer-affil-org');
  if (footerAffilOrg && b.orgName) footerAffilOrg.textContent = b.orgName;

  const footerDesc = document.getElementById('footer-desc');
  if (footerDesc && b.description) footerDesc.textContent = b.description;

  const footerEmail = document.getElementById('footer-contact-email');
  if (footerEmail && b.contactEmail) footerEmail.textContent = b.contactEmail;

  const footerAddr = document.getElementById('footer-campus-address');
  if (footerAddr && b.campusAddress) footerAddr.textContent = b.campusAddress;

  // WhatsApp Community & Join Links Hydration
  const waUrl = b.whatsappJoinUrl || 'https://chat.whatsapp.com/DYOucc2Amn5LBPZqAg87v5?s=cl&p=a&mlu=4&ilr=4';
  const joinBtns = document.querySelectorAll('.join-club-link');
  joinBtns.forEach(btn => {
    btn.setAttribute('href', waUrl);
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');
  });

  // 2. Statistics Targets
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length >= 4) {
    statNumbers[0].setAttribute('data-target', s.members || 450);
    statNumbers[1].setAttribute('data-target', s.ctfChallenges || 65);
    statNumbers[2].setAttribute('data-target', s.workshops || 40);
    statNumbers[3].setAttribute('data-target', s.eventsConducted || 20);
  }

  // 3. Domains Grid Hydration
  const domainsGrid = document.getElementById('domains-grid');
  if (domainsGrid && data.domains && data.domains.length) {
    domainsGrid.innerHTML = data.domains.map(dm => `
      <div class="domain-card">
        <div class="domain-header">
          <div class="domain-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <span class="domain-badge">${escapeHTML(dm.code)}</span>
        </div>
        <h3 class="domain-title">${escapeHTML(dm.title)}</h3>
        <p class="domain-desc">${escapeHTML(dm.desc)}</p>
        <div class="domain-tags">
          ${(dm.tags || []).map(t => `<span class="tech-chip">${escapeHTML(t)}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // 4. Events Grid Hydration
  const eventsGrid = document.getElementById('events-grid');
  if (eventsGrid && data.events && data.events.length) {
    eventsGrid.innerHTML = data.events.map(ev => `
      <div class="event-card" data-type="${escapeHTML(ev.type)}">
        <div class="event-top">
          <span class="event-type-badge">${escapeHTML(ev.type.toUpperCase())}</span>
          <span class="event-status ${ev.status === 'Upcoming' ? 'upcoming' : ''}">${escapeHTML(ev.status)}</span>
        </div>
        <h3 class="event-title">${escapeHTML(ev.title)}</h3>
        <div class="event-meta">
          <div class="event-meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>${escapeHTML(ev.date)} ${ev.time ? `(${escapeHTML(ev.time)})` : ''}</span>
          </div>
          <div class="event-meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${escapeHTML(ev.venue)}</span>
          </div>
        </div>
        <p class="event-desc">${escapeHTML(ev.description)}</p>
        <div class="event-footer">
          <span class="mono" style="font-size: 0.8rem; color: var(--neon-cyan);">${ev.speakers ? escapeHTML(ev.speakers.slice(0, 24)) + '...' : 'CUJ Cyber Lab'}</span>
          <button class="btn btn-outline btn-sm view-event-btn" data-id="${escapeHTML(ev.id)}">View Details</button>
        </div>
      </div>
    `).join('');
  }

  // 5. Team Section Hydration
  const facultyGrid = document.getElementById('team-faculty-grid');
  const leadsGrid = document.getElementById('team-leads-grid');
  if (data.team) {
    const faculty = data.team.filter(t => t.category === 'faculty');
    const leads = data.team.filter(t => t.category !== 'faculty');

    if (facultyGrid && faculty.length) {
      facultyGrid.innerHTML = faculty.map(tm => renderTeamCardHTML(tm)).join('');
    }
    if (leadsGrid && leads.length) {
      leadsGrid.innerHTML = leads.map(tm => renderTeamCardHTML(tm)).join('');
    }
  }

  // 6. Resources Grid Hydration
  const resourcesGrid = document.getElementById('resources-grid');
  if (resourcesGrid && data.resources && data.resources.length) {
    resourcesGrid.innerHTML = data.resources.map(res => `
      <div class="resource-card">
        <div class="res-header">
          <span class="res-cat-tag">${escapeHTML(res.cat)}</span>
          <span class="mono" style="font-size: 0.72rem; color: var(--text-muted);">${escapeHTML(res.sub || '')}</span>
        </div>
        <h3 class="res-title">${escapeHTML(res.title)}</h3>
        <p class="res-desc">${escapeHTML(res.desc)}</p>
        <a href="${escapeHTML(res.link)}" target="_blank" rel="noopener noreferrer" class="res-link">
          Access Resource <span>&rarr;</span>
        </a>
      </div>
    `).join('');
  }

  // 7. Achievements Grid Hydration
  const achieveGrid = document.getElementById('achieve-grid');
  if (achieveGrid && Array.isArray(data.achievements)) {
    if (data.achievements.length) {
      achieveGrid.innerHTML = data.achievements.map(ach => `
        <div class="achieve-card">
          <div class="achieve-icon-badge">
            ${getAchievementIconSVG(ach.icon)}
          </div>
          <div class="achieve-content">
            <div class="achieve-year">${escapeHTML(ach.year)}</div>
            <h3 class="achieve-title">${escapeHTML(ach.title)}</h3>
            <p class="achieve-desc">${escapeHTML(ach.desc)}</p>
          </div>
        </div>
      `).join('');
    } else {
      achieveGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px; font-family: var(--font-mono);">
          [!] No achievements currently published. Check back soon!
        </div>
      `;
    }
  }

  // 8. CTF Arena Clue & Flags
  if (data.ctfConfig && data.ctfConfig.miniChallenge) {
    const mini = data.ctfConfig.miniChallenge;
    const clueBox = document.querySelector('.challenge-clue-box');
    if (clueBox && mini.payload) {
      clueBox.innerHTML = `
        <div class="label">// Intercepted Transmission Payload</div>
        <div style="font-weight: bold; font-size: 1.05rem; letter-spacing: 0.05em; color: #67e8f9;">
          ${escapeHTML(mini.payload)}
        </div>
        <div id="challenge-hint" style="display: none; margin-top: 10px; padding-top: 10px; border-top: 1px dashed rgba(0, 229, 255, 0.2); font-size: 0.8rem; color: var(--accent-amber);">
          ${escapeHTML(mini.hint || '')}
        </div>
      `;
    }
  }

  // 9. Section Visibility Rules
  const setDisplay = (id, visible) => {
    const el = document.getElementById(id);
    if (el) el.style.display = visible === false ? 'none' : '';
  };

  setDisplay('hero', sec.hero);
  setDisplay('about', sec.about);
  setDisplay('domains', sec.domains);
  setDisplay('events', sec.events);
  setDisplay('ctf', sec.ctf);
  setDisplay('team', sec.team);
  setDisplay('resources', sec.resources);
  setDisplay('achievements', sec.achievements);
  setDisplay('join', sec.join);
}

function renderTeamCardHTML(tm) {
  const avatarContent = tm.avatar
    ? `<img src="${escapeHTML(tm.avatar)}" alt="${escapeHTML(tm.name)}" loading="lazy">`
    : `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

  return `
    <div class="team-card">
      <div class="member-avatar-wrap">
        <div class="member-avatar">
          ${avatarContent}
        </div>
        <span class="member-status-indicator" title="Online"></span>
      </div>
      <h3 class="member-name">${escapeHTML(tm.name)}</h3>
      <div class="member-role">${escapeHTML(tm.role)}</div>
      <p class="member-spec">${escapeHTML(tm.spec)}</p>
      <div class="member-socials">
        ${tm.email ? `<a href="mailto:${escapeHTML(tm.email)}" class="member-social-link" title="Email" aria-label="Email"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></a>` : ''}
        ${tm.github ? `<a href="${escapeHTML(tm.github)}" target="_blank" rel="noopener" class="member-social-link" aria-label="GitHub"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a>` : ''}
        ${tm.linkedin ? `<a href="${escapeHTML(tm.linkedin)}" target="_blank" rel="noopener" class="member-social-link" aria-label="LinkedIn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>` : ''}
        ${tm.twitter ? `<a href="${escapeHTML(tm.twitter)}" target="_blank" rel="noopener" class="member-social-link" aria-label="Twitter"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>` : ''}
      </div>
    </div>
  `;
}

function getAchievementIconSVG(iconName) {
  switch (iconName) {
    case 'shield':
      return '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
    case 'cert':
    case 'certification':
      return '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>';
    case 'star':
    case 'hackathon':
      return '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    case 'flag':
      return '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>';
    case 'trophy':
    case 'medal':
    default:
      return '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>';
  }
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* ==========================================================================
   1. NAVBAR & NAVIGATION
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.cyber-navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    highlightNavOnScroll();
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.cyberAudio) window.cyberAudio.playBlip(750, 0.04);
    });
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      if (window.cyberAudio) window.cyberAudio.playBlip(600, 0.04);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

  }

  function highlightNavOnScroll() {
    const scrollPos = window.scrollY + 100;
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   2. INTERACTIVE CYBER CANVAS
   ========================================================================== */
function initCyberCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = Math.min(window.innerWidth < 768 ? 40 : 85, 100);
  const maxDistance = 140;

  const mouse = { x: null, y: null, radius: 160 };

  function resize() {
    width = canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth;
    height = canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.9;
      this.vy = (Math.random() - 0.5) * 0.9;
      this.radius = Math.random() * 2 + 1;
      this.baseColor = Math.random() > 0.4 ? 'rgba(0, 229, 255,' : 'rgba(0, 255, 157,';
      this.alpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.baseColor}${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.baseColor.includes('229') ? '#00e5ff' : '#00ff9d';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. INTERACTIVE HERO TERMINAL EMULATOR
   ========================================================================== */
function initTerminal() {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const shortcutButtons = document.querySelectorAll('.term-cmd-btn');

  if (!terminalBody || !terminalInput) return;

  const commands = {
    help: () => `
      <div class="terminal-output highlight">
        Available Commands:<br>
        - <strong>about</strong>     : Learn about CYBER CUJ & CU Jammu<br>
        - <strong>domains</strong>   : View club focus areas (8 domains)<br>
        - <strong>events</strong>    : View upcoming events & CTFs<br>
        - <strong>ctf</strong>       : Information about CTF arena & challenges<br>
        - <strong>flag</strong>      : Clue to the mini CTF flag<br>
        - <strong>whoami</strong>    : Display current session operative info<br>
        - <strong>cuj</strong>       : Central University of Jammu info<br>
        - <strong>matrix</strong>    : Simulated cyber stream<br>
        - <strong>clear</strong>     : Wipe terminal buffer
      </div>`,
    
    about: () => `
      <div class="terminal-output success">
        [+] CYBER CUJ — Cyber Security Club of Central University of Jammu.<br>
        A student-led initiative fostering technical excellence in ethical hacking, penetration testing, CTF competitions, forensics, and national cyber awareness.
      </div>`,

    domains: () => `
      <div class="terminal-output highlight">
        [ACTIVE DOMAINS]<br>
        1. Ethical Hacking & Red Teaming<br>
        2. Penetration Testing & Vuln Assessment<br>
        3. Capture The Flag (CTF) Arena<br>
        4. Digital Forensics & Incident Response<br>
        5. Web Application Security<br>
        6. Network Security & Packet Analysis<br>
        7. Applied Cryptography<br>
        8. Open Source Intelligence (OSINT)
      </div>`,

    events: () => {
      const evs = (window.SiteData ? window.SiteData.get().events : []) || [];
      return `
        <div class="terminal-output">
          [SCHEDULED OPERATIONS (${evs.length})]<br>
          ${evs.slice(0, 4).map(e => `* ${escapeHTML(e.title)} (${escapeHTML(e.date)})`).join('<br>')}<br>
          Scroll to Events section for full itinerary.
        </div>`;
    },

    ctf: () => `
      <div class="terminal-output highlight">
        [CTF ARENA ACCESS]<br>
        Categories: Web, Crypto, Forensics, OSINT, Rev, Pwn.<br>
        Scroll down to the CTF Arena section to test your flag decryption skills!
      </div>`,

    flag: () => {
      const mini = (window.SiteData ? window.SiteData.get().ctfConfig?.miniChallenge : null);
      const payload = mini ? mini.payload : 'Q1VKe3czbGMwbTNfdDBfY3VqX2N5YjNyXzRyM240fQ==';
      return `
        <div class="terminal-output success">
          [SECRET TRANSMISSION DETECTED]<br>
          Ciphertext: ${escapeHTML(payload)}<br>
          Tip: Standard RFC 4648 Base64 decode. Submit in the CTF Arena below!
        </div>`;
    },

    whoami: () => `
      <div class="terminal-output">
        user: guest_agent@cuj-sec-node<br>
        privileges: standard_trainee<br>
        node: Central University of Jammu [32.5518° N, 75.0592° E]<br>
        session: ENCRYPTED (TLS 1.3 / AES-256-GCM)
      </div>`,

    cuj: () => `
      <div class="terminal-output">
        Central University of Jammu (CUJ)<br>
        Established by Central Universities Act, 2009.<br>
        Campus: Rahya-Suchani (Bagla), Samba District, Jammu & Kashmir.<br>
        Department: Computer Science & Information Technology.
      </div>`,

    matrix: () => `
      <div class="terminal-output" style="color: #00ff9d; font-size: 0.76rem;">
        01000011 01011001 01000010 01000101 01010010 00100000 01000011 01010101 01001010<br>
        [STREAM] >> 0x7F 0x45 0x4C 0x46 (ELF 64-bit LSB pie executable, x86-64)<br>
        [OK] Core kernel verified. Defense shields initialized.
      </div>`,

    clear: () => '__CLEAR__'
  };

  function appendLine(htmlContent) {
    const div = document.createElement('div');
    div.className = 'terminal-line';
    div.innerHTML = htmlContent;
    terminalBody.appendChild(div);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function handleCommand(cmd) {
    const cleanCmd = cmd.trim().toLowerCase();
    if (!cleanCmd) return;

    appendLine(`<span class="terminal-prompt">guest@cuj:~$</span> ${escapeHTML(cmd)}`);

    if (commands[cleanCmd]) {
      const output = commands[cleanCmd]();
      if (output === '__CLEAR__') {
        terminalBody.innerHTML = `
          <div class="terminal-line">
            <span class="terminal-prompt">cuj-sec:~$</span> System buffer refreshed. Type 'help' for commands.
          </div>
        `;
      } else {
        appendLine(output);
      }
    } else {
      appendLine(`
        <div class="terminal-output" style="color: var(--accent-rose);">
          Command not found: '${escapeHTML(cmd)}'. Type '<strong>help</strong>' for valid commands.
        </div>
      `);
    }

    if (window.cyberAudio) window.cyberAudio.playBlip(550, 0.03);
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      handleCommand(val);
    }
  });

  shortcutButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        handleCommand(cmd);
      }
    });
  });
}

/* ==========================================================================
   4. ANIMATED STATS COUNTER
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
          const duration = 1800;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsBanner = document.querySelector('.stats-banner');
  if (statsBanner) {
    observer.observe(statsBanner);
  }
}

/* ==========================================================================
   5. EVENTS SYSTEM & DETAIL MODAL
   ========================================================================== */
function initEventsSystem() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const modal = document.getElementById('event-modal');
  const modalClose = document.getElementById('modal-close-btn');

  // Filtering
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const cards = document.querySelectorAll('.event-card');

      cards.forEach(card => {
        const type = card.getAttribute('data-type');
        if (filter === 'all' || filter === type) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      if (window.cyberAudio) window.cyberAudio.playBlip(620, 0.03);
    });
  });

  // Modal Open Handler (Delegated)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.view-event-btn');
    if (!btn) return;

    const eventId = btn.getAttribute('data-id');
    const allEvents = (window.SiteData ? window.SiteData.get().events : []) || [];
    const event = allEvents.find(ev => ev.id === eventId);
    if (!event || !modal) return;

    document.getElementById('modal-title').textContent = event.title;
    document.getElementById('modal-badge').textContent = event.type.toUpperCase();
    document.getElementById('modal-date').textContent = event.date;
    document.getElementById('modal-venue').textContent = event.venue;
    document.getElementById('modal-time').textContent = event.time || 'TBD';
    document.getElementById('modal-desc').textContent = event.description;
    document.getElementById('modal-speakers').textContent = event.speakers || 'CUJ Cyber Leads';
    document.getElementById('modal-prereq').textContent = event.prerequisites || 'None';
    document.getElementById('modal-agenda').textContent = event.agenda || 'Detailed schedule will be broadcasted to registered attendees.';

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (window.cyberAudio) window.cyberAudio.playBlip(700, 0.04);
  });

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (window.cyberAudio) window.cyberAudio.playBlip(450, 0.03);
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. RESOURCE SEARCH ENGINE
   ========================================================================== */
function initResourceSearch() {
  const searchInput = document.getElementById('resource-search');
  const emptyState = document.getElementById('resources-empty');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const cards = document.querySelectorAll('.resource-card');
    const query = e.target.value.toLowerCase().trim();
    let visibleCount = 0;

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  });
}

/* ==========================================================================
   7. JOIN US FORM & NOTIFICATIONS (Integrated with Admin Store)
   ========================================================================== */
function initJoinForm() {
  const form = document.getElementById('join-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const roll = document.getElementById('reg-roll').value.trim();
    const dept = document.getElementById('reg-dept').value;
    const domain = document.getElementById('reg-domain').value;
    const exp = document.getElementById('reg-experience') ? document.getElementById('reg-experience').value : 'Beginner';
    const msg = document.getElementById('reg-message') ? document.getElementById('reg-message').value.trim() : '';

    if (!name || !email || !roll) {
      showCyberToast('Please fill in all required recruitment fields.', 'error');
      if (window.cyberAudio) window.cyberAudio.playError();
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showCyberToast('Please provide a valid student or personal email address.', 'error');
      if (window.cyberAudio) window.cyberAudio.playError();
      return;
    }

    // Persist to Shared SiteData for Administrator Review
    if (window.SiteData && window.SiteData.addApplication) {
      window.SiteData.addApplication({
        name,
        email,
        roll,
        dept,
        domain,
        experience: exp,
        message: msg
      });
    }

    // Success response
    form.reset();
    showCyberToast(`Registration received for ${name}! Application sent to CYBER CUJ Administrator.`, 'success');
    if (window.cyberAudio) window.cyberAudio.playSuccess();

    setTimeout(() => {
      const waLink = (window.SiteData && window.SiteData.get().branding.whatsappJoinUrl) || 'https://chat.whatsapp.com/DYOucc2Amn5LBPZqAg87v5?s=cl&p=a&mlu=4&ilr=4';
      showCyberToast(`Operative Onboarding: <a href="${waLink}" target="_blank" rel="noopener noreferrer" style="color: #25D366; text-decoration: underline; font-weight: bold; margin-left: 4px;">[Click here to Join Official WhatsApp Group]</a>`, 'success');
    }, 1200);
  });
}

window.showCyberToast = function(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  toast.innerHTML = `
    <span style="font-weight: bold;">${type === 'error' ? '[!]' : '[+]'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(60px)';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
};

/* ==========================================================================
   8. FAQ ACCORDION
   ========================================================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      item.classList.toggle('active');
      if (window.cyberAudio) window.cyberAudio.playBlip(isActive ? 480 : 640, 0.03);
    });
  });
}

/* ==========================================================================
   9. TOGGLES (Audio Synthesizer & Scanline Overlay)
   ========================================================================== */
function initToggles() {
  const audioBtn = document.getElementById('audio-toggle');
  const scanlinesBtn = document.getElementById('scanlines-toggle');

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const state = window.cyberAudio.toggle();
      audioBtn.classList.toggle('active', state);
      audioBtn.setAttribute('title', state ? 'Audio Effects: Enabled' : 'Audio Effects: Disabled');
      showCyberToast(state ? 'Cyber synth audio enabled' : 'Audio muted', 'info');
    });
  }

  if (scanlinesBtn) {
    scanlinesBtn.addEventListener('click', () => {
      document.body.classList.toggle('scanlines-disabled');
      const disabled = document.body.classList.contains('scanlines-disabled');
      scanlinesBtn.setAttribute('title', disabled ? 'Scanlines: OFF' : 'Scanlines: ON');
      if (window.cyberAudio) window.cyberAudio.playBlip(disabled ? 400 : 700, 0.03);
    });
  }
}
