/**
 * CYBER CUJ — Administrator Operations Controller
 * Handles authentication, CMS navigation, CRUD operations, state persistence, and data backups.
 */

class AdminApp {
  constructor() {
    this.currentTab = 'overview';
    this.credsKey = 'CYBER_CUJ_ADMIN_CREDS';
    this.authSessionKey = 'CYBER_CUJ_ADMIN_SESSION';
    this.init();
  }

  init() {
    this.initAuth();
    this.initNavigation();
    this.initModals();
    this.initAvatarControls();
    this.initCRUD();
    this.initSettings();
    this.renderAll();

    // Listen for external updates
    window.addEventListener('siteDataUpdated', () => {
      this.renderAll();
      this.notifyPreviewFrame();
    });
  }

  /* ==========================================================================
     1. AUTHENTICATION CONTROLLER
     ========================================================================== */
  getCredentials() {
    try {
      const stored = localStorage.getItem(this.credsKey);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return { user: 'admin', pass: 'cuj_cyber_admin_2025' };
  }

  setCredentials(user, pass) {
    localStorage.setItem(this.credsKey, JSON.stringify({ user, pass }));
  }

  isAuthenticated() {
    return sessionStorage.getItem(this.authSessionKey) === 'true' ||
           localStorage.getItem(this.authSessionKey) === 'true';
  }

  initAuth() {
    const authOverlay = document.getElementById('auth-overlay');
    const adminWrapper = document.getElementById('admin-wrapper');
    const loginForm = document.getElementById('admin-login-form');
    const logoutBtn = document.getElementById('admin-logout-btn');

    if (this.isAuthenticated()) {
      authOverlay.style.display = 'none';
      adminWrapper.style.display = 'flex';
    } else {
      authOverlay.style.display = 'flex';
      adminWrapper.style.display = 'none';
    }

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userInput = document.getElementById('admin-user').value.trim();
        const passInput = document.getElementById('admin-pass').value.trim();
        const remember = document.getElementById('auth-remember').checked;
        const validCreds = this.getCredentials();

        if (userInput === validCreds.user && passInput === validCreds.pass) {
          if (remember) {
            localStorage.setItem(this.authSessionKey, 'true');
          } else {
            sessionStorage.setItem(this.authSessionKey, 'true');
          }

          authOverlay.style.transition = 'opacity 0.3s ease';
          authOverlay.style.opacity = '0';
          setTimeout(() => {
            authOverlay.style.display = 'none';
            adminWrapper.style.display = 'flex';
            this.showToast('Authentication Successful. Welcome, Admin.', 'success');
          }, 300);
        } else {
          this.showToast('Invalid credentials! Check hints below.', 'error');
          const card = document.querySelector('.auth-card');
          card.classList.add('shake');
          setTimeout(() => card.classList.remove('shake'), 400);
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem(this.authSessionKey);
        localStorage.removeItem(this.authSessionKey);
        window.location.reload();
      });
    }
  }

  /* ==========================================================================
     2. NAVIGATION & TABS
     ========================================================================== */
  initNavigation() {
    const links = document.querySelectorAll('.sidebar-link[data-tab]');
    const menuToggle = document.getElementById('admin-menu-toggle');
    const sidebar = document.querySelector('.admin-sidebar');

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.getAttribute('data-tab');
        this.switchTab(tab);
        if (window.innerWidth <= 768 && sidebar) {
          sidebar.classList.remove('open');
        }
      });
    });

    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    // Update sidebar links
    document.querySelectorAll('.sidebar-link').forEach(l => {
      l.classList.toggle('active', l.getAttribute('data-tab') === tabName);
    });

    // Update Panes
    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === `pane-${tabName}`);
    });

    // Update Breadcrumb
    const breadcrumb = document.getElementById('breadcrumb-current');
    if (breadcrumb) {
      const titles = {
        overview: 'Overview',
        branding: 'Site Identity & Hero',
        sections: 'Sections & Layout',
        events: 'Events Manager',
        team: 'Team & Organizers',
        domains: 'Technical Domains',
        ctf: 'CTF Arena & Flags',
        resources: 'Resources Hub',
        achievements: 'Achievements',
        applications: 'Student Applications',
        settings: 'Settings & Backup'
      };
      breadcrumb.textContent = titles[tabName] || tabName;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ==========================================================================
     3. RENDER ALL MODULES
     ========================================================================== */
  renderAll() {
    const data = window.SiteData.get();
    this.renderOverviewMetrics(data);
    this.renderBranding(data);
    this.renderSections(data);
    this.renderEvents(data);
    this.renderTeam(data);
    this.renderDomains(data);
    this.renderCTF(data);
    this.renderResources(data);
    this.renderAchievements(data);
    this.renderApplications(data);
  }

  renderOverviewMetrics(data) {
    const evEl = document.getElementById('stat-total-events');
    const memEl = document.getElementById('stat-total-members');
    const ctfEl = document.getElementById('stat-total-challenges');
    const appEl = document.getElementById('stat-total-apps');

    if (evEl) evEl.textContent = (data.events || []).length;
    if (memEl) memEl.textContent = (data.stats ? data.stats.members : 450) + '+';
    if (ctfEl) ctfEl.textContent = (data.stats ? data.stats.ctfChallenges : 65) + '+';
    if (appEl) appEl.textContent = (data.applications || []).length;

    // Badges in sidebar
    const bEvents = document.getElementById('badge-events-count');
    const bTeam = document.getElementById('badge-team-count');
    const bAch = document.getElementById('badge-achievements-count');
    const bApps = document.getElementById('badge-applications-count');

    if (bEvents) bEvents.textContent = (data.events || []).length;
    if (bTeam) bTeam.textContent = (data.team || []).length;
    if (bAch) bAch.textContent = (data.achievements || []).length;
    if (bApps) {
      const pending = (data.applications || []).filter(a => a.status === 'Pending').length;
      bApps.textContent = pending;
      bApps.style.display = pending > 0 ? 'inline-block' : 'none';
    }
  }

  renderBranding(data) {
    const b = data.branding || {};
    const s = data.stats || {};

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };

    setVal('brand-site-name', b.siteName);
    setVal('brand-org-name', b.orgName);
    setVal('brand-subtitle', b.subtitle);
    setVal('brand-tagline', b.tagline);
    setVal('brand-desc', b.description);

    setVal('stat-members-input', s.members);
    setVal('stat-ctf-input', s.ctfChallenges);
    setVal('stat-workshops-input', s.workshops);
    setVal('stat-events-input', s.eventsConducted);

    setVal('telemetry-defcon', b.defenseStatus);
    setVal('telemetry-nodes', b.activeNodes);
    setVal('telemetry-subnet', b.campusSubnet);
    setVal('contact-email', b.contactEmail);
    setVal('campus-address', b.campusAddress);

    const waJoin = b.whatsappJoinUrl || 'https://chat.whatsapp.com/DYOucc2Amn5LBPZqAg87v5?s=cl&p=a&mlu=4&ilr=4';
    setVal('whatsapp-join-url', waJoin);
    const testLink = document.getElementById('admin-test-wa-link');
    if (testLink) testLink.href = waJoin;
  }

  renderSections(data) {
    const sec = data.sectionsVisibility || {};
    const setChecked = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = val !== false;
    };

    setChecked('sec-toggle-hero', sec.hero);
    setChecked('sec-toggle-about', sec.about);
    setChecked('sec-toggle-domains', sec.domains);
    setChecked('sec-toggle-events', sec.events);
    setChecked('sec-toggle-ctf', sec.ctf);
    setChecked('sec-toggle-team', sec.team);
    setChecked('sec-toggle-resources', sec.resources);
    setChecked('sec-toggle-achievements', sec.achievements);
    setChecked('sec-toggle-join', sec.join);
  }

  renderEvents(data) {
    const tbody = document.getElementById('events-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    const events = data.events || [];

    if (!events.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No events found. Click "+ Add New Event" above.</td></tr>`;
      return;
    }

    events.forEach(ev => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="font-weight: 600; color: #ffffff;">${this.escapeHTML(ev.title)}</div>
          <span class="badge-tag cyan">${this.escapeHTML(ev.type.toUpperCase())}</span>
        </td>
        <td>
          <div style="color: var(--text-primary); font-family: var(--font-mono); font-size: 0.8rem;">${this.escapeHTML(ev.date)}</div>
          <div style="color: var(--text-muted); font-size: 0.75rem;">${this.escapeHTML(ev.time || '')}</div>
        </td>
        <td>${this.escapeHTML(ev.venue)}</td>
        <td>
          <span class="badge-tag ${ev.status === 'Upcoming' ? 'green' : 'amber'}">${this.escapeHTML(ev.status)}</span>
        </td>
        <td>
          <div class="table-actions">
            <button class="action-btn" onclick="window.adminApp.openEditEventModal('${ev.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Edit
            </button>
            <button class="action-btn delete" onclick="window.adminApp.deleteEvent('${ev.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              Delete
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderTeam(data) {
    const tbody = document.getElementById('team-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    const team = data.team || [];

    team.forEach(tm => {
      const tr = document.createElement('tr');
      const avatarThumb = tm.avatar ? `
        <img src="${this.escapeHTML(tm.avatar)}" alt="${this.escapeHTML(tm.name)}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--neon-cyan); flex-shrink: 0; box-shadow: 0 0 8px rgba(0, 229, 255, 0.3);">
      ` : `
        <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(0, 229, 255, 0.1); border: 1.5px solid var(--neon-cyan); display: flex; align-items: center; justify-content: center; color: var(--neon-cyan); flex-shrink: 0;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
      `;

      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 12px;">
            ${avatarThumb}
            <div>
              <div style="font-weight: 600; color: #ffffff;">${this.escapeHTML(tm.name)}</div>
              <div style="color: var(--neon-cyan); font-family: var(--font-mono); font-size: 0.78rem;">${this.escapeHTML(tm.role)}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="badge-tag ${tm.category === 'faculty' ? 'purple' : 'green'}">${tm.category === 'faculty' ? 'Faculty Advisor' : 'Student Core'}</span>
        </td>
        <td style="max-width: 320px; font-size: 0.82rem; color: var(--text-secondary);">${this.escapeHTML(tm.spec)}</td>
        <td style="font-family: var(--font-mono); font-size: 0.8rem;">${this.escapeHTML(tm.email || '—')}</td>
        <td>
          <div class="table-actions">
            <button class="action-btn" onclick="window.adminApp.openEditTeamModal('${tm.id}')">Edit</button>
            <button class="action-btn delete" onclick="window.adminApp.deleteTeam('${tm.id}')">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderDomains(data) {
    const tbody = document.getElementById('domains-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    const domains = data.domains || [];

    domains.forEach(dm => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <span class="badge-tag cyan" style="margin-bottom: 4px;">${this.escapeHTML(dm.code)}</span>
          <div style="font-weight: 600; color: #ffffff;">${this.escapeHTML(dm.title)}</div>
        </td>
        <td style="max-width: 380px; font-size: 0.82rem; color: var(--text-secondary);">${this.escapeHTML(dm.desc)}</td>
        <td>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${(dm.tags || []).map(t => `<span class="badge-tag amber" style="font-size: 0.7rem;">${this.escapeHTML(t)}</span>`).join('')}
          </div>
        </td>
        <td>
          <div class="table-actions">
            <button class="action-btn" onclick="window.adminApp.openEditDomainModal('${dm.id}')">Edit</button>
            <button class="action-btn delete" onclick="window.adminApp.deleteDomain('${dm.id}')">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderCTF(data) {
    const ctf = data.ctfConfig || {};
    const mini = ctf.miniChallenge || {};
    const stats = ctf.stats || {};

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };

    setVal('ctf-challenge-title', mini.title);
    setVal('ctf-challenge-payload', mini.payload);
    setVal('ctf-challenge-hint', mini.hint);
    setVal('ctf-accepted-flags', (mini.acceptedFlags || []).join('\n'));

    setVal('ctf-stat-challenges', stats.challengesCount);
    setVal('ctf-stat-solves', stats.totalSolves);
    setVal('ctf-stat-uptime', stats.uptime);
  }

  renderResources(data) {
    const tbody = document.getElementById('resources-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    const resources = data.resources || [];

    resources.forEach(res => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="badge-tag cyan">${this.escapeHTML(res.cat)}</span></td>
        <td style="font-weight: 600; color: #ffffff;">${this.escapeHTML(res.title)}</td>
        <td style="max-width: 350px; font-size: 0.82rem; color: var(--text-secondary);">${this.escapeHTML(res.desc)}</td>
        <td><a href="${res.link}" target="_blank" style="color: var(--neon-cyan); font-family: var(--font-mono); font-size: 0.78rem;">Visit Link &rarr;</a></td>
        <td>
          <div class="table-actions">
            <button class="action-btn" onclick="window.adminApp.openEditResourceModal('${res.id}')">Edit</button>
            <button class="action-btn delete" onclick="window.adminApp.deleteResource('${res.id}')">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  getAchievementIconSVG(iconName) {
    switch (iconName) {
      case 'shield':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
      case 'cert':
      case 'certification':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>';
      case 'star':
      case 'hackathon':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      case 'flag':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>';
      case 'trophy':
      case 'medal':
      default:
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>';
    }
  }

  renderAchievements(data, filterQuery = '') {
    const tbody = document.getElementById('achievements-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    let items = data.achievements || [];

    // Update sidebar badge
    const badge = document.getElementById('badge-achievements-count');
    if (badge) badge.textContent = items.length;

    if (filterQuery) {
      const q = filterQuery.toLowerCase();
      items = items.filter(a =>
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.year && a.year.toLowerCase().includes(q)) ||
        (a.desc && a.desc.toLowerCase().includes(q))
      );
    }

    if (!items.length) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 24px;">${filterQuery ? 'No achievements matched your search query.' : 'No achievements configured yet. Click "+ Add Achievement" above.'}</td></tr>`;
      return;
    }

    items.forEach(ach => {
      const iconSVG = this.getAchievementIconSVG(ach.icon);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="color: var(--accent-amber); display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); flex-shrink: 0;">
              ${iconSVG}
            </span>
            <span class="badge-tag amber">${this.escapeHTML(ach.year)}</span>
          </div>
        </td>
        <td style="font-weight: 600; color: #ffffff;">${this.escapeHTML(ach.title)}</td>
        <td style="max-width: 420px; font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">${this.escapeHTML(ach.desc)}</td>
        <td>
          <div class="table-actions">
            <button class="action-btn" onclick="window.adminApp.openEditAchievementModal('${ach.id}')">Edit</button>
            <button class="action-btn delete" onclick="window.adminApp.deleteAchievement('${ach.id}')">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderApplications(data) {
    const tbody = document.getElementById('applications-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    const apps = data.applications || [];

    if (!apps.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No membership registrations submitted yet.</td></tr>`;
      return;
    }

    apps.forEach(app => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 600; color: #ffffff;">${this.escapeHTML(app.name)}</td>
        <td style="font-family: var(--font-mono); font-size: 0.78rem;">
          <div>${this.escapeHTML(app.email)}</div>
          <div style="color: var(--text-muted);">${this.escapeHTML(app.roll || '')}</div>
        </td>
        <td style="font-size: 0.82rem;">${this.escapeHTML(app.dept || '')}</td>
        <td><span class="badge-tag cyan">${this.escapeHTML(app.domain || 'General')}</span></td>
        <td style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--text-muted);">${this.escapeHTML(app.submittedAt || '')}</td>
        <td>
          <span class="badge-tag ${app.status === 'Approved' ? 'green' : (app.status === 'Reviewed' ? 'amber' : 'rose')}">${this.escapeHTML(app.status || 'Pending')}</span>
        </td>
        <td>
          <div class="table-actions">
            <button class="action-btn" onclick="window.adminApp.viewApplication('${app.id}')">Dossier</button>
            <button class="action-btn" onclick="window.adminApp.toggleAppStatus('${app.id}')">Status</button>
            <button class="action-btn delete" onclick="window.adminApp.deleteApplication('${app.id}')">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  /* ==========================================================================
     4. CRUD HANDLERS & SAVE ACTIONS
     ========================================================================== */
  initCRUD() {
    // Save Branding
    const saveBrandingBtn = document.getElementById('save-branding-btn');
    if (saveBrandingBtn) {
      saveBrandingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const data = window.SiteData.get();
        data.branding.siteName = document.getElementById('brand-site-name').value.trim();
        data.branding.orgName = document.getElementById('brand-org-name').value.trim();
        data.branding.subtitle = document.getElementById('brand-subtitle').value.trim();
        data.branding.tagline = document.getElementById('brand-tagline').value.trim();
        data.branding.description = document.getElementById('brand-desc').value.trim();

        data.stats.members = parseInt(document.getElementById('stat-members-input').value, 10) || 450;
        data.stats.ctfChallenges = parseInt(document.getElementById('stat-ctf-input').value, 10) || 65;
        data.stats.workshops = parseInt(document.getElementById('stat-workshops-input').value, 10) || 40;
        data.stats.eventsConducted = parseInt(document.getElementById('stat-events-input').value, 10) || 20;

        data.branding.defenseStatus = document.getElementById('telemetry-defcon').value.trim();
        data.branding.activeNodes = document.getElementById('telemetry-nodes').value.trim();
        data.branding.campusSubnet = document.getElementById('telemetry-subnet').value.trim();
        data.branding.contactEmail = document.getElementById('contact-email').value.trim();
        data.branding.campusAddress = document.getElementById('campus-address').value.trim();

        const waUrlInput = document.getElementById('whatsapp-join-url');
        if (waUrlInput) {
          data.branding.whatsappJoinUrl = waUrlInput.value.trim() || 'https://chat.whatsapp.com/DYOucc2Amn5LBPZqAg87v5?s=cl&p=a&mlu=4&ilr=4';
          if (!data.branding.socials) data.branding.socials = {};
          data.branding.socials.whatsapp = data.branding.whatsappJoinUrl;
        }

        window.SiteData.save(data);
        this.showToast('Branding & Telemetry successfully saved!', 'success');
      });
    }

    // Save Sections Visibility
    const saveSectionsBtn = document.getElementById('save-sections-btn');
    if (saveSectionsBtn) {
      saveSectionsBtn.addEventListener('click', () => {
        const data = window.SiteData.get();
        data.sectionsVisibility = {
          hero: document.getElementById('sec-toggle-hero').checked,
          about: document.getElementById('sec-toggle-about').checked,
          domains: document.getElementById('sec-toggle-domains').checked,
          events: document.getElementById('sec-toggle-events').checked,
          ctf: document.getElementById('sec-toggle-ctf').checked,
          team: document.getElementById('sec-toggle-team').checked,
          resources: document.getElementById('sec-toggle-resources').checked,
          achievements: document.getElementById('sec-toggle-achievements').checked,
          join: document.getElementById('sec-toggle-join').checked
        };
        window.SiteData.save(data);
        this.showToast('Section visibility rules applied to public website!', 'success');
      });
    }

    // Save CTF Settings
    const saveCTFBtn = document.getElementById('save-ctf-btn');
    if (saveCTFBtn) {
      saveCTFBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const data = window.SiteData.get();
        if (!data.ctfConfig) data.ctfConfig = {};
        if (!data.ctfConfig.miniChallenge) data.ctfConfig.miniChallenge = {};
        if (!data.ctfConfig.stats) data.ctfConfig.stats = {};

        data.ctfConfig.miniChallenge.title = document.getElementById('ctf-challenge-title').value.trim();
        data.ctfConfig.miniChallenge.payload = document.getElementById('ctf-challenge-payload').value.trim();
        data.ctfConfig.miniChallenge.hint = document.getElementById('ctf-challenge-hint').value.trim();
        
        const rawFlags = document.getElementById('ctf-accepted-flags').value.split('\n');
        data.ctfConfig.miniChallenge.acceptedFlags = rawFlags.map(f => f.trim()).filter(Boolean);

        data.ctfConfig.stats.challengesCount = document.getElementById('ctf-stat-challenges').value.trim();
        data.ctfConfig.stats.totalSolves = document.getElementById('ctf-stat-solves').value.trim();
        data.ctfConfig.stats.uptime = document.getElementById('ctf-stat-uptime').value.trim();

        window.SiteData.save(data);
        this.showToast('CTF Arena configuration updated!', 'success');
      });
    }

    // Event Search
    const evSearch = document.getElementById('events-search-input');
    if (evSearch) {
      evSearch.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        document.querySelectorAll('#events-table-body tr').forEach(row => {
          row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      });
    }

    // Event Form Submit
    const evForm = document.getElementById('event-modal-form');
    if (evForm) {
      evForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = window.SiteData.get();
        const id = document.getElementById('ev-id').value || ('ev-' + Date.now());

        const newEvent = {
          id: id,
          title: document.getElementById('ev-title').value.trim(),
          type: document.getElementById('ev-type').value,
          status: document.getElementById('ev-status').value,
          date: document.getElementById('ev-date').value.trim(),
          time: document.getElementById('ev-time').value.trim(),
          venue: document.getElementById('ev-venue').value.trim(),
          description: document.getElementById('ev-desc').value.trim(),
          speakers: document.getElementById('ev-speakers').value.trim(),
          prerequisites: document.getElementById('ev-prereq').value.trim(),
          agenda: document.getElementById('ev-agenda').value.trim()
        };

        if (!Array.isArray(data.events)) data.events = [];
        const existingIdx = data.events.findIndex(x => x.id === id);
        if (existingIdx >= 0) {
          data.events[existingIdx] = newEvent;
        } else {
          data.events.unshift(newEvent);
        }

        window.SiteData.save(data);
        this.closeModals();
        this.showToast('Event saved successfully!', 'success');
      });
    }

    // Team Form Submit
    const tmForm = document.getElementById('team-modal-form');
    if (tmForm) {
      tmForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = window.SiteData.get();
        if (!Array.isArray(data.team)) data.team = [];
        const id = document.getElementById('tm-id').value || ('tm-' + Date.now());

        const newMember = {
          id: id,
          name: document.getElementById('tm-name').value.trim(),
          category: document.getElementById('tm-category').value,
          role: document.getElementById('tm-role').value.trim(),
          spec: document.getElementById('tm-spec').value.trim(),
          avatar: document.getElementById('tm-avatar') ? document.getElementById('tm-avatar').value.trim() : '',
          email: document.getElementById('tm-email').value.trim(),
          github: document.getElementById('tm-github').value.trim(),
          linkedin: document.getElementById('tm-linkedin').value.trim(),
          twitter: document.getElementById('tm-twitter').value.trim(),
          website: ''
        };

        const idx = data.team.findIndex(x => x.id === id);
        if (idx >= 0) {
          data.team[idx] = newMember;
        } else {
          data.team.push(newMember);
        }

        window.SiteData.save(data);
        this.closeModals();
        this.showToast('Team member saved!', 'success');
      });
    }

    // Domain Form Submit
    const dmForm = document.getElementById('domain-modal-form');
    if (dmForm) {
      dmForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = window.SiteData.get();
        if (!Array.isArray(data.domains)) data.domains = [];
        const id = document.getElementById('dm-id').value || ('dom-' + Date.now());

        const newDomain = {
          id: id,
          code: document.getElementById('dm-code').value.trim(),
          title: document.getElementById('dm-title').value.trim(),
          desc: document.getElementById('dm-desc').value.trim(),
          tags: document.getElementById('dm-tags').value.split(',').map(t => t.trim()).filter(Boolean),
          icon: 'shield'
        };

        const idx = data.domains.findIndex(x => x.id === id);
        if (idx >= 0) {
          data.domains[idx] = newDomain;
        } else {
          data.domains.push(newDomain);
        }

        window.SiteData.save(data);
        this.closeModals();
        this.showToast('Domain saved!', 'success');
      });
    }

    // Resource Form Submit
    const resForm = document.getElementById('resource-modal-form');
    if (resForm) {
      resForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = window.SiteData.get();
        if (!Array.isArray(data.resources)) data.resources = [];
        const id = document.getElementById('res-id').value || ('res-' + Date.now());

        const newRes = {
          id: id,
          cat: document.getElementById('res-cat').value.trim(),
          sub: document.getElementById('res-sub').value.trim(),
          title: document.getElementById('res-title').value.trim(),
          desc: document.getElementById('res-desc').value.trim(),
          link: document.getElementById('res-link').value.trim()
        };

        const idx = data.resources.findIndex(x => x.id === id);
        if (idx >= 0) {
          data.resources[idx] = newRes;
        } else {
          data.resources.push(newRes);
        }

        window.SiteData.save(data);
        this.closeModals();
        this.showToast('Resource link saved!', 'success');
      });
    }

    // Achievement Search Filter
    const achSearch = document.getElementById('achievement-search');
    if (achSearch) {
      achSearch.addEventListener('input', (e) => {
        const data = window.SiteData.get();
        this.renderAchievements(data, e.target.value.trim());
      });
    }

    // Achievement Form Submit
    const achForm = document.getElementById('achievement-modal-form');
    if (achForm) {
      achForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = window.SiteData.get();
        if (!Array.isArray(data.achievements)) {
          data.achievements = [];
        }
        const id = document.getElementById('ach-id').value || ('ach-' + Date.now());
        const iconEl = document.getElementById('ach-icon');

        const newAch = {
          id: id,
          year: document.getElementById('ach-year').value.trim(),
          title: document.getElementById('ach-title').value.trim(),
          desc: document.getElementById('ach-desc').value.trim(),
          icon: iconEl ? iconEl.value : 'trophy'
        };

        const idx = data.achievements.findIndex(x => x.id === id);
        if (idx >= 0) {
          data.achievements[idx] = newAch;
        } else {
          data.achievements.push(newAch);
        }

        window.SiteData.save(data);
        this.closeModals();
        this.showToast('Achievement saved successfully!', 'success');
      });
    }
  }

  /* ==========================================================================
     5. MODAL HELPERS (ADD / EDIT)
     ========================================================================== */
  initModals() {
    // Backdrop click to close
    document.querySelectorAll('.admin-modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModals();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModals();
    });
  }

  /* ==========================================================================
     5b. AVATAR & PHOTO UPLOAD CONTROLS
     ========================================================================== */
  initAvatarControls() {
    const fileInput = document.getElementById('tm-avatar-file');
    const urlInput = document.getElementById('tm-avatar-url');
    const applyUrlBtn = document.getElementById('tm-avatar-apply-url');
    const clearBtn = document.getElementById('tm-avatar-clear-btn');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
          this.showToast('Please select a valid image file (PNG, JPG, WebP, etc.).', 'error');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            // Scale down to max 400px to maintain quality while keeping localStorage lightweight
            const maxDim = 400;
            let width = img.width;
            let height = img.height;

            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
            this.setTeamAvatarPreview(optimizedDataUrl);
            if (urlInput) urlInput.value = '';
            this.showToast('Photo uploaded and preview updated!', 'success');
          };
          img.onerror = () => {
            this.showToast('Failed to load image file.', 'error');
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    if (applyUrlBtn && urlInput) {
      const handleApply = () => {
        const url = urlInput.value.trim();
        if (!url) {
          this.showToast('Please enter an image URL.', 'info');
          return;
        }
        this.setTeamAvatarPreview(url);
        if (fileInput) fileInput.value = '';
        this.showToast('Image URL applied to avatar!', 'success');
      };

      applyUrlBtn.addEventListener('click', handleApply);
      urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleApply();
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.setTeamAvatarPreview('');
        if (fileInput) fileInput.value = '';
        if (urlInput) urlInput.value = '';
        this.showToast('Profile photo removed.', 'info');
      });
    }
  }

  setTeamAvatarPreview(avatarSrc) {
    const hiddenInput = document.getElementById('tm-avatar');
    const previewImg = document.getElementById('tm-avatar-img');
    const placeholder = document.getElementById('tm-avatar-placeholder');

    if (hiddenInput) hiddenInput.value = avatarSrc || '';

    if (avatarSrc) {
      if (previewImg) {
        previewImg.src = avatarSrc;
        previewImg.style.display = 'block';
      }
      if (placeholder) {
        placeholder.style.display = 'none';
      }
    } else {
      if (previewImg) {
        previewImg.src = '';
        previewImg.style.display = 'none';
      }
      if (placeholder) {
        placeholder.style.display = 'flex';
      }
    }
  }

  /* ==========================================================================
     5c. FULL VIEW LIVE PREVIEW CONTROLS
     ========================================================================== */
  openFullPreview() {
    const modal = document.getElementById('full-preview-modal');
    if (!modal) return;
    modal.classList.add('active');
    this.refreshPreview();
    document.body.style.overflow = 'hidden';
  }

  closeFullPreview() {
    const modal = document.getElementById('full-preview-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  setPreviewDevice(device) {
    const container = document.getElementById('preview-frame-container');
    if (!container) return;

    container.className = `preview-frame-container ${device}`;

    document.querySelectorAll('.preview-device-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-device') === device);
    });
  }

  refreshPreview() {
    const iframe = document.getElementById('full-preview-iframe');
    if (!iframe) return;
    iframe.src = `index.html?t=${Date.now()}`;
  }

  notifyPreviewFrame() {
    const iframe = document.getElementById('full-preview-iframe');
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage({ type: 'REFRESH_SITE_DATA' }, '*');
      } catch (e) {}
    }
  }

  closeModals() {
    document.querySelectorAll('.admin-modal').forEach(m => m.classList.remove('active'));
    this.closeFullPreview();
  }

  openAddEventModal() {
    document.getElementById('event-modal-form').reset();
    document.getElementById('ev-id').value = '';
    document.getElementById('event-modal-title').textContent = 'Add New Event';
    document.getElementById('event-modal').classList.add('active');
  }

  openEditEventModal(id) {
    const data = window.SiteData.get();
    const ev = (data.events || []).find(x => x.id === id);
    if (!ev) return;

    document.getElementById('ev-id').value = ev.id;
    document.getElementById('ev-title').value = ev.title || '';
    document.getElementById('ev-type').value = ev.type || 'ctf';
    document.getElementById('ev-status').value = ev.status || 'Upcoming';
    document.getElementById('ev-date').value = ev.date || '';
    document.getElementById('ev-time').value = ev.time || '';
    document.getElementById('ev-venue').value = ev.venue || '';
    document.getElementById('ev-desc').value = ev.description || '';
    document.getElementById('ev-speakers').value = ev.speakers || '';
    document.getElementById('ev-prereq').value = ev.prerequisites || '';
    document.getElementById('ev-agenda').value = ev.agenda || '';

    document.getElementById('event-modal-title').textContent = 'Edit Event Details';
    document.getElementById('event-modal').classList.add('active');
  }

  deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    const data = window.SiteData.get();
    data.events = (data.events || []).filter(x => x.id !== id);
    window.SiteData.save(data);
    this.showToast('Event deleted.', 'info');
  }

  openAddTeamModal() {
    document.getElementById('team-modal-form').reset();
    document.getElementById('tm-id').value = '';
    this.setTeamAvatarPreview('');
    const urlInput = document.getElementById('tm-avatar-url');
    if (urlInput) urlInput.value = '';
    const fileInput = document.getElementById('tm-avatar-file');
    if (fileInput) fileInput.value = '';
    document.getElementById('team-modal-title').textContent = 'Add Team Member';
    document.getElementById('team-modal').classList.add('active');
  }

  openEditTeamModal(id) {
    const data = window.SiteData.get();
    const tm = (data.team || []).find(x => x.id === id);
    if (!tm) return;

    document.getElementById('tm-id').value = tm.id;
    document.getElementById('tm-name').value = tm.name || '';
    document.getElementById('tm-category').value = tm.category || 'student';
    document.getElementById('tm-role').value = tm.role || '';
    document.getElementById('tm-spec').value = tm.spec || '';
    document.getElementById('tm-email').value = tm.email || '';
    document.getElementById('tm-github').value = tm.github || '';
    document.getElementById('tm-linkedin').value = tm.linkedin || '';
    document.getElementById('tm-twitter').value = tm.twitter || '';

    const avatar = tm.avatar || '';
    this.setTeamAvatarPreview(avatar);
    const urlInput = document.getElementById('tm-avatar-url');
    if (urlInput) {
      urlInput.value = (avatar.startsWith('http://') || avatar.startsWith('https://')) ? avatar : '';
    }
    const fileInput = document.getElementById('tm-avatar-file');
    if (fileInput) fileInput.value = '';

    document.getElementById('team-modal-title').textContent = 'Edit Team Member';
    document.getElementById('team-modal').classList.add('active');
  }

  deleteTeam(id) {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    const data = window.SiteData.get();
    data.team = (data.team || []).filter(x => x.id !== id);
    window.SiteData.save(data);
    this.showToast('Member removed from team.', 'info');
  }

  openAddDomainModal() {
    document.getElementById('domain-modal-form').reset();
    document.getElementById('dm-id').value = '';
    document.getElementById('domain-modal-title').textContent = 'Add Technical Domain';
    document.getElementById('domain-modal').classList.add('active');
  }

  openEditDomainModal(id) {
    const data = window.SiteData.get();
    const dm = (data.domains || []).find(x => x.id === id);
    if (!dm) return;

    document.getElementById('dm-id').value = dm.id;
    document.getElementById('dm-code').value = dm.code || '';
    document.getElementById('dm-title').value = dm.title || '';
    document.getElementById('dm-desc').value = dm.desc || '';
    document.getElementById('dm-tags').value = (dm.tags || []).join(', ');

    document.getElementById('domain-modal-title').textContent = 'Edit Technical Domain';
    document.getElementById('domain-modal').classList.add('active');
  }

  deleteDomain(id) {
    if (!confirm('Delete this domain?')) return;
    const data = window.SiteData.get();
    data.domains = (data.domains || []).filter(x => x.id !== id);
    window.SiteData.save(data);
    this.showToast('Domain removed.', 'info');
  }

  openAddResourceModal() {
    document.getElementById('resource-modal-form').reset();
    document.getElementById('res-id').value = '';
    document.getElementById('resource-modal-title').textContent = 'Add Resource Link';
    document.getElementById('resource-modal').classList.add('active');
  }

  openEditResourceModal(id) {
    const data = window.SiteData.get();
    const res = (data.resources || []).find(x => x.id === id);
    if (!res) return;

    document.getElementById('res-id').value = res.id;
    document.getElementById('res-cat').value = res.cat || '';
    document.getElementById('res-sub').value = res.sub || '';
    document.getElementById('res-title').value = res.title || '';
    document.getElementById('res-desc').value = res.desc || '';
    document.getElementById('res-link').value = res.link || '';

    document.getElementById('resource-modal-title').textContent = 'Edit Resource Link';
    document.getElementById('resource-modal').classList.add('active');
  }

  deleteResource(id) {
    if (!confirm('Delete this resource?')) return;
    const data = window.SiteData.get();
    data.resources = (data.resources || []).filter(x => x.id !== id);
    window.SiteData.save(data);
    this.showToast('Resource deleted.', 'info');
  }

  openAddAchievementModal() {
    document.getElementById('achievement-modal-form').reset();
    document.getElementById('ach-id').value = '';
    const iconEl = document.getElementById('ach-icon');
    if (iconEl) iconEl.value = 'trophy';
    document.getElementById('achievement-modal-title').textContent = 'Add Achievement';
    document.getElementById('achievement-modal').classList.add('active');
  }

  openEditAchievementModal(id) {
    const data = window.SiteData.get();
    const ach = (data.achievements || []).find(x => x.id === id);
    if (!ach) return;

    document.getElementById('ach-id').value = ach.id;
    document.getElementById('ach-year').value = ach.year || '';
    document.getElementById('ach-title').value = ach.title || '';
    document.getElementById('ach-desc').value = ach.desc || '';
    const iconEl = document.getElementById('ach-icon');
    if (iconEl) iconEl.value = ach.icon || 'trophy';

    document.getElementById('achievement-modal-title').textContent = 'Edit Achievement';
    document.getElementById('achievement-modal').classList.add('active');
  }

  deleteAchievement(id) {
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    const data = window.SiteData.get();
    if (!Array.isArray(data.achievements)) data.achievements = [];
    data.achievements = data.achievements.filter(x => x.id !== id);
    window.SiteData.save(data);
    this.showToast('Achievement removed.', 'info');
  }

  viewApplication(id) {
    const data = window.SiteData.get();
    const app = (data.applications || []).find(x => x.id === id);
    if (!app) return;

    const content = document.getElementById('app-detail-content');
    content.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.8;">
        <div style="font-size: 1.2rem; font-weight: bold; color: #ffffff; margin-bottom: 8px;">${this.escapeHTML(app.name)}</div>
        <p><strong>Email:</strong> <a href="mailto:${this.escapeHTML(app.email)}" style="color: var(--neon-cyan);">${this.escapeHTML(app.email)}</a></p>
        <p><strong>Student Roll No:</strong> ${this.escapeHTML(app.roll || 'N/A')}</p>
        <p><strong>Department &amp; Year:</strong> ${this.escapeHTML(app.dept || 'N/A')}</p>
        <p><strong>Domain Interest:</strong> <span class="badge-tag cyan">${this.escapeHTML(app.domain || 'General')}</span></p>
        <p><strong>Experience Level:</strong> ${this.escapeHTML(app.experience || 'Beginner')}</p>
        <p><strong>Submitted At:</strong> ${this.escapeHTML(app.submittedAt || '')}</p>
        <div style="margin-top: 14px; padding: 12px; background: rgba(0, 0, 0, 0.4); border-radius: 6px; border: 1px solid var(--admin-border);">
          <strong>Applicant Statement / Motivation:</strong><br>
          <div style="color: var(--text-secondary); margin-top: 4px;">${this.escapeHTML(app.message || 'No additional notes provided.')}</div>
        </div>
      </div>
    `;

    document.getElementById('application-modal').classList.add('active');
  }

  toggleAppStatus(id) {
    const data = window.SiteData.get();
    const app = (data.applications || []).find(x => x.id === id);
    if (!app) return;

    if (app.status === 'Pending') app.status = 'Reviewed';
    else if (app.status === 'Reviewed') app.status = 'Approved';
    else app.status = 'Pending';

    window.SiteData.save(data);
    this.showToast(`Application status updated to: ${app.status}`, 'info');
  }

  deleteApplication(id) {
    if (!confirm('Delete applicant record?')) return;
    const data = window.SiteData.get();
    data.applications = (data.applications || []).filter(x => x.id !== id);
    window.SiteData.save(data);
    this.showToast('Application deleted.', 'info');
  }

  /* ==========================================================================
     6. SETTINGS & BACKUP HANDLERS
     ========================================================================== */
  initSettings() {
    // Quick Export in Header & Settings
    const quickExport = document.getElementById('export-backup-quick');
    const downloadBtn = document.getElementById('download-json-backup');

    if (quickExport) quickExport.addEventListener('click', () => window.SiteData.exportJSON());
    if (downloadBtn) downloadBtn.addEventListener('click', () => window.SiteData.exportJSON());

    // Import Backup JSON
    const importInput = document.getElementById('import-json-file');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const res = window.SiteData.importJSON(event.target.result);
          if (res.success) {
            this.showToast('Site data imported and synchronized!', 'success');
          } else {
            this.showToast('Failed to import: ' + res.error, 'error');
          }
        };
        reader.readAsText(file);
      });
    }

    // Factory Reset
    const resetBtn = document.getElementById('reset-factory-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('CRITICAL WARNING: This will reset all events, members, domains, and applications back to factory defaults. Continue?')) {
          window.SiteData.reset();
          this.showToast('System data reset to default factory state.', 'info');
        }
      });
    }

    // Change Password Form
    const changePassForm = document.getElementById('change-pass-form');
    if (changePassForm) {
      changePassForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newUser = document.getElementById('new-admin-user').value.trim();
        const newPass = document.getElementById('new-admin-pass').value.trim();

        if (newPass.length < 8) {
          this.showToast('Passphrase must be at least 8 characters long!', 'error');
          return;
        }

        this.setCredentials(newUser, newPass);
        changePassForm.reset();
        this.showToast('Admin credentials updated successfully!', 'success');
      });
    }
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('admin-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.style.padding = '12px 18px';
    toast.style.background = 'rgba(10, 16, 31, 0.95)';
    toast.style.borderRadius = '6px';
    toast.style.fontFamily = 'var(--font-mono)';
    toast.style.fontSize = '0.82rem';
    toast.style.color = '#ffffff';
    toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8)';
    toast.style.border = `1px solid ${type === 'error' ? 'var(--accent-rose)' : (type === 'success' ? 'var(--neon-green)' : 'var(--neon-cyan)')}`;
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';

    toast.innerHTML = `
      <span style="font-weight: bold; color: ${type === 'error' ? 'var(--accent-rose)' : (type === 'success' ? 'var(--neon-green)' : 'var(--neon-cyan)')};">
        ${type === 'error' ? '[!]' : '[+]'}
      </span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.adminApp = new AdminApp();
});
