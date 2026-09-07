'use client';

import React, { useState, useEffect } from 'react';
import { useSiteData, EventItem, TeamMember } from '@/lib/site-data';
import { getCyberAudio } from '@/lib/audio';
import { cyberToast } from '@/components/ToastContainer';
import CyberNavbar from '@/components/CyberNavbar';
import CyberCanvas from '@/components/CyberCanvas';
import CyberTerminal from '@/components/CyberTerminal';
import EventModal from '@/components/EventModal';
import CTFArena from '@/components/CTFArena';

function renderDomainIcon(icon: string) {
  switch ((icon || '').toLowerCase()) {
    case 'crosshair':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" />
          <line x1="12" y1="6" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="18" />
        </svg>
      );
    case 'flag':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      );
    case 'search':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case 'globe':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case 'server':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      );
    case 'lock':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case 'eye':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'terminal':
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
  }
}

function renderAchievementIcon(icon: string) {
  switch ((icon || '').toLowerCase()) {
    case 'shield':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'cert':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case 'star':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case 'trophy':
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
        </svg>
      );
  }
}

export default function HomePage() {
  const { data, mounted } = useSiteData();
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [resourceFilter, setResourceFilter] = useState<string>('all');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [backToTopVisible, setBackToTopVisible] = useState<boolean>(false);

  // Join form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roll: '',
    dept: '',
    domain: 'Ethical Hacking',
    experience: 'Beginner',
    message: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      setBackToTopVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const b = data.branding;
  const s = data.stats;
  const v = data.sectionsVisibility;
  const waUrl = b.whatsappJoinUrl || 'https://chat.whatsapp.com/DYOucc2Amn5LBPZqAg87v5?s=cl&p=a&mlu=4&ilr=4';

  useEffect(() => {
    if (b?.siteName && b?.orgName) {
      document.title = `${b.siteName} — ${b.orgName}`;
    }
  }, [b?.siteName, b?.orgName]);

  const siteName = b.siteName || 'CYBER CUJ';
  const nameParts = siteName.split(' ');
  const firstWord = nameParts[0] || 'CYBER';
  const restWords = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  // Events filtering
  const filteredEvents = (data.events || []).filter((ev) => {
    if (eventFilter === 'all') return true;
    if (eventFilter === 'upcoming') return ev.status.toLowerCase() === 'upcoming';
    if (eventFilter === 'completed') return ev.status.toLowerCase() === 'completed';
    return ev.type.toLowerCase() === eventFilter.toLowerCase();
  });

  // Resources filtering
  const filteredResources = (data.resources || []).filter((res) => {
    if (resourceFilter === 'all') return true;
    return res.cat.toLowerCase().includes(resourceFilter.toLowerCase());
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.roll) {
      cyberToast('Please complete all required fields.', 'error');
      getCyberAudio().playError();
      return;
    }

    const { SiteDataStorage } = require('@/lib/site-data');
    SiteDataStorage.addApplication({
      name: formData.name,
      email: formData.email,
      roll: formData.roll,
      dept: formData.dept,
      domain: formData.domain,
      experience: formData.experience,
      message: formData.message
    });

    setFormData({
      name: '',
      email: '',
      roll: '',
      dept: '',
      domain: 'Ethical Hacking',
      experience: 'Beginner',
      message: ''
    });

    getCyberAudio().playSuccess();
    cyberToast(`Registration received for ${formData.name}! Application logged to CYBER CUJ roster.`, 'success');

    setTimeout(() => {
      cyberToast(
        `Operative Onboarding: <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="color: #25D366; text-decoration: underline; font-weight: bold; margin-left: 4px;">[Click here to Join Official WhatsApp Group]</a>`,
        'success'
      );
    }, 1200);
  };

  const faqs = [
    {
      q: 'Who can join the CYBER CUJ Security Club?',
      a: 'Any enrolled student of Central University of Jammu across all semesters, departments, and programs (B.Tech, M.Tech, MCA, MSc, etc.) is welcome to join. No prior ethical hacking experience is required!'
    },
    {
      q: 'Are all activities ethical and authorized?',
      a: '100% Yes. All penetration testing exercises, vulnerability scans, and exploits are performed exclusively in controlled lab sandboxes, isolated CTF containers, and pre-authorized targets.'
    },
    {
      q: 'Do I need Linux installed on my laptop?',
      a: 'While Linux (Kali, Ubuntu, Arch) is recommended for cybersecurity practice, you can get started using virtual machines (VirtualBox, VMware) or browser-based labs.'
    },
    {
      q: 'How frequently are club meetups and CTFs held?',
      a: 'We conduct bi-weekly technical workshops, monthly CTF challenges, and semester-long capture the flag bootcamps alongside national cyber defense tournaments.'
    }
  ];

  return (
    <>
      <CyberNavbar />

      {/* 1. HERO SECTION */}
      {v.hero && (
        <section id="hero" className="hero-section">
          <CyberCanvas />

          <div className="container">
            <div className="hero-grid">
              <div className="hero-content">
                <div className="hero-org-tag" id="hero-org-tag">
                  <span className="status-pulse"></span>
                  <span>{b.orgName} // Cyber Division</span>
                </div>

                <h1 className="hero-title">
                  <span className="glow-text">{firstWord}</span>
                  {restWords && <span className="cyber-accent"> {restWords}</span>}
                </h1>

                <div className="hero-subtitle">{b.subtitle}</div>

                <div className="hero-tagline-badge">&gt; {b.tagline} _</div>

                <p className="hero-description">{b.description}</p>

                <div className="hero-cta-group">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-lg join-club-link"
                    onClick={() => getCyberAudio().playSuccess()}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                    Join the Club
                  </a>
                  <a
                    href="#events"
                    className="btn btn-outline btn-lg"
                    onClick={() => getCyberAudio().playBlip(600, 0.04)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Explore Events
                  </a>
                </div>

                <div className="hero-telemetry">
                  <div className="telemetry-item">
                    <span className="telemetry-label">Defense Posture</span>
                    <span className="telemetry-val green">
                      <span className="status-pulse"></span> {b.defenseStatus}
                    </span>
                  </div>
                  <div className="telemetry-item">
                    <span className="telemetry-label">Active Nodes</span>
                    <span className="telemetry-val cyan">{b.activeNodes}</span>
                  </div>
                  <div className="telemetry-item">
                    <span className="telemetry-label">Campus Subnet</span>
                    <span className="telemetry-val">{b.campusSubnet}</span>
                  </div>
                </div>
              </div>

              <CyberTerminal />
            </div>
          </div>
        </section>
      )}

      {/* 2. ABOUT US SECTION */}
      {v.about && (
        <section id="about" className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">WHO WE ARE</div>
              <h2 className="section-title">Architecting Campus Defense &amp; Offensive Research</h2>
              <p className="section-desc">
                {b.orgName}’s premier student-led technical syndicate dedicated to elite training in ethical hacking, cyber warfare defense, and defensive infrastructure engineering.
              </p>
            </div>

            <div className="about-grid">
              <div className="about-text">
                <h3>Defending the Future of Digital India</h3>
                <p>
                  Established at {b.orgName}, {siteName} bridges the gap between academic computer science curricula and modern offensive/defensive cybersecurity operations.
                </p>
                <p>
                  Our operatives investigate zero-day vulnerabilities, dissect memory dumps, master kernel-level security, analyze malware sandboxes, and organize regional capture-the-flag competitions to train the next generation of certified security professionals.
                </p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 24 }}>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm join-club-link">
                    Join WhatsApp Community
                  </a>
                  <a href="#domains" className="btn btn-outline btn-sm">
                    View Technical Wings
                  </a>
                </div>
              </div>

              <div className="pillars-grid">
                <div className="pillar-item">
                  <div className="pillar-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>
                  </div>
                  <h4 className="pillar-title">Offensive Security Labs</h4>
                  <p className="pillar-desc">Hands-on red team drills, penetration testing, exploit development, and weaponized binary analysis in controlled sandbox environments.</p>
                </div>

                <div className="pillar-item">
                  <div className="pillar-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  </div>
                  <h4 className="pillar-title">Defensive Infrastructure</h4>
                  <p className="pillar-desc">Hardening network perimeters, analyzing SIEM event logs, orchestrating incident response, and cryptographic implementation audits.</p>
                </div>

                <div className="pillar-item">
                  <div className="pillar-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  </div>
                  <h4 className="pillar-title">CTF Competitive Squad</h4>
                  <p className="pillar-desc">Representing {b.orgName} at prestigious national and international Capture The Flag tournaments across all security tracks.</p>
                </div>

                <div className="pillar-item">
                  <div className="pillar-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  </div>
                  <h4 className="pillar-title">Cyber Hygiene &amp; Outreach</h4>
                  <p className="pillar-desc">Educating campus students and Jammu &amp; Kashmir communities on digital safety, anti-phishing hygiene, UPI fraud prevention, and safe internet practices.</p>
                </div>
              </div>
            </div>

            {/* Statistics Banner */}
            <div className="stats-banner" style={{ marginTop: 48 }}>
              <div className="stat-box">
                <div className="stat-number">{s.members}+</div>
                <div className="stat-label">Active Operatives</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{s.ctfChallenges}+</div>
                <div className="stat-label">CTF Challenges Solved</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{s.workshops}+</div>
                <div className="stat-label">Hands-on Workshops</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{s.eventsConducted}+</div>
                <div className="stat-label">Operations Conducted</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. TECHNICAL DOMAINS SECTION */}
      {v.domains && (
        <section id="domains" className="section" style={{ background: 'rgba(5, 8, 17, 0.4)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-tag green">SPECIALIZED WINGS</div>
              <h2 className="section-title">Core Operational Domains</h2>
              <p className="section-desc">
                Operatives choose specialized paths to develop deep tactical expertise. Cross-domain collaboration forms our complete security operations framework.
              </p>
            </div>

            <div className="domains-grid">
              {(data.domains || []).map((dm) => (
                <div key={dm.id} className="domain-card">
                  <div className="domain-header">
                    <div className="domain-icon">
                      {renderDomainIcon(dm.icon)}
                    </div>
                    <span className="domain-code">{dm.code}</span>
                  </div>
                  <h3 className="domain-title">{dm.title}</h3>
                  <p className="domain-desc">{dm.desc}</p>
                  <div className="domain-tags">
                    {dm.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="domain-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. EVENTS SECTION */}
      {v.events && (
        <section id="events" className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">OPERATIONS &amp; SCHEDULE</div>
              <h2 className="section-title">Events &amp; Competitions</h2>
              <p className="section-desc">
                Upcoming CTF battles, zero-day threat seminars, live exploit workshops, and university outreach sessions at Central University of Jammu.
              </p>
            </div>

            <div className="events-filter-bar">
              {['all', 'upcoming', 'completed', 'ctf', 'workshop'].map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`filter-btn ${eventFilter === f ? 'active' : ''}`}
                  onClick={() => {
                    setEventFilter(f);
                    getCyberAudio().playBlip(550, 0.03);
                  }}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="events-grid">
              {filteredEvents.map((ev) => (
                <div key={ev.id} className="event-card">
                  <div className="event-status-strip">
                    <span className={`event-badge ${ev.status.toLowerCase()}`}>
                      <span className="status-pulse"></span> {ev.status.toUpperCase()}
                    </span>
                    <span className="event-type-tag">{ev.type.toUpperCase()}</span>
                  </div>
                  <h3 className="event-title">{ev.title}</h3>
                  <div className="event-meta">
                    <div className="event-meta-item">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      <span>{ev.date}</span>
                    </div>
                    <div className="event-meta-item">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      <span>{ev.venue}</span>
                    </div>
                  </div>
                  <p className="event-desc">{ev.description}</p>
                  <div className="event-actions">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setSelectedEvent(ev);
                        getCyberAudio().playBlip(700, 0.04);
                      }}
                    >
                      View Details
                    </button>
                    <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)' }}>
                      {ev.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. CTF ARENA SECTION */}
      {v.ctf && <CTFArena config={data.ctfConfig} />}

      {/* 6. TEAM & ORGANIZERS SECTION */}
      {v.team && (
        <section id="team" className="section" style={{ background: 'rgba(5, 8, 17, 0.4)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-tag green">COMMAND HIERARCHY</div>
              <h2 className="section-title">Core Leadership &amp; Advisors</h2>
              <p className="section-desc">
                Guided by esteemed faculty and driven by passionate student security researchers at Central University of Jammu.
              </p>
            </div>

            {/* Faculty Advisors */}
            <div className="team-role-heading">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
              <span>Faculty Advisory</span>
            </div>

            <div className="team-grid">
              {(data.team || [])
                .filter((m) => m.category === 'faculty')
                .map((tm) => (
                  <div key={tm.id} className="team-card">
                    <div className="member-avatar-wrap">
                      <div className="member-avatar">
                        {tm.avatar ? (
                          <img src={tm.avatar} alt={tm.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        )}
                      </div>
                      <span className="member-status-indicator" title="Status: Online"></span>
                    </div>
                    <h3 className="member-name">{tm.name}</h3>
                    <div className="member-role">{tm.role}</div>
                    <p className="member-spec">{tm.spec}</p>
                    <div className="member-socials">
                      {tm.email && (
                        <a href={`mailto:${tm.email}`} className="member-social-link" title="Official Email">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                        </a>
                      )}
                      {tm.linkedin && (
                        <a href={tm.linkedin} target="_blank" rel="noopener noreferrer" className="member-social-link" title="LinkedIn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                        </a>
                      )}
                      {tm.website && (
                        <a href={tm.website} target="_blank" rel="noopener noreferrer" className="member-social-link" title="Website / Profile">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Student Core Leadership */}
            <div className="team-role-heading" style={{ marginTop: 24 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              <span>Student Core Leadership</span>
            </div>

            <div className="team-grid">
              {(data.team || [])
                .filter((m) => m.category === 'student')
                .map((tm) => (
                  <div key={tm.id} className="team-card">
                    <div className="member-avatar-wrap">
                      <div className="member-avatar">
                        {tm.avatar ? (
                          <img src={tm.avatar} alt={tm.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        )}
                      </div>
                      <span className="member-status-indicator" title="Status: Active Operative"></span>
                    </div>
                    <h3 className="member-name">{tm.name}</h3>
                    <div className="member-role">{tm.role}</div>
                    <p className="member-spec">{tm.spec}</p>
                    <div className="member-socials">
                      {tm.email && (
                        <a href={`mailto:${tm.email}`} className="member-social-link" title="Email">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                        </a>
                      )}
                      {tm.github && (
                        <a href={tm.github} target="_blank" rel="noopener noreferrer" className="member-social-link" title="GitHub">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                        </a>
                      )}
                      {tm.linkedin && (
                        <a href={tm.linkedin} target="_blank" rel="noopener noreferrer" className="member-social-link" title="LinkedIn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                        </a>
                      )}
                      {tm.twitter && (
                        <a href={tm.twitter} target="_blank" rel="noopener noreferrer" className="member-social-link" title="Twitter / X">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. RESOURCES SECTION */}
      {v.resources && (
        <section id="resources" className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">KNOWLEDGE BASE</div>
              <h2 className="section-title">Curated Cyber Resources &amp; Labs</h2>
              <p className="section-desc">
                Handpicked learning materials, free practice laboratories, and tactical cheat sheets recommended by CYBER CUJ senior mentors.
              </p>
            </div>

            <div className="resources-grid">
              {filteredResources.map((res) => (
                <div key={res.id} className="resource-card">
                  <div className="res-header">
                    <span className="res-cat-tag">{res.cat}</span>
                    <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {res.sub}
                    </span>
                  </div>
                  <h3 className="res-title">{res.title}</h3>
                  <p className="res-desc">{res.desc}</p>
                  <a href={res.link} target="_blank" rel="noopener noreferrer" className="res-link">
                    <span>Access Lab Platform</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. ACHIEVEMENTS SECTION */}
      {v.achievements && (
        <section id="achievements" className="section" style={{ background: 'rgba(5, 8, 17, 0.4)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-tag green">HALL OF FAME</div>
              <h2 className="section-title">Club Achievements &amp; Accolades</h2>
              <p className="section-desc">
                Honors won by CYBER CUJ student operatives in state hackathons, national CTF tournaments, and accredited security certifications.
              </p>
            </div>

            <div className="achieve-grid">
              {(data.achievements || []).length > 0 ? (
                (data.achievements || []).map((ach) => (
                  <div key={ach.id} className="achieve-card">
                    <div className="achieve-icon">
                      {renderAchievementIcon(ach.icon)}
                    </div>
                    <div className="achieve-content">
                      <div className="achieve-year">{ach.year}</div>
                      <h3 className="achieve-title">{ach.title}</h3>
                      <p className="achieve-desc">{ach.desc}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: 40, fontFamily: 'var(--font-mono)' }}>
                  [!] No achievements currently published. Check back soon!
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 9. JOIN US & FAQ SECTION */}
      {v.join && (
        <section id="join" className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">RECRUITMENT PROTOCOL</div>
              <h2 className="section-title">Join the CYBER CUJ Initiative</h2>
              <p className="section-desc">
                Step into the frontline of cybersecurity research. Train with university peers, compete in CTF tournaments, and build defensive skills.
              </p>
            </div>

            {/* WhatsApp Community Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.12), rgba(0, 229, 255, 0.08))',
                border: '1px solid rgba(37, 211, 102, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '24px 28px',
                marginBottom: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 20,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#25D366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.15rem', marginBottom: 4 }}>Official CYBER CUJ WhatsApp Community</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                    Instant updates, CTF team formation, zero-day threat bulletins, and live community chat.
                  </p>
                </div>
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary join-club-link"
                style={{ background: '#25D366', borderColor: '#25D366', color: '#050811' }}
              >
                Join WhatsApp Group ↗
              </a>
            </div>

            <div className="join-grid">
              {/* Registration Form */}
              <div className="join-form-box">
                <h3 className="form-title">Membership Application</h3>
                <p className="form-subtitle">Fill in your dossier details to request admission to CYBER CUJ active squads.</p>

                <form onSubmit={handleFormSubmit} className="cyber-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="reg-name">Full Name *</label>
                      <input
                        type="text"
                        id="reg-name"
                        className="form-control"
                        placeholder="e.g. Sahil Verma"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="reg-email">University Email *</label>
                      <input
                        type="email"
                        id="reg-email"
                        className="form-control"
                        placeholder="username@cuj.ac.in"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="reg-roll">Roll Number *</label>
                      <input
                        type="text"
                        id="reg-roll"
                        className="form-control"
                        placeholder="e.g. CUJ2024CSE019"
                        required
                        value={formData.roll}
                        onChange={(e) => setFormData({ ...formData, roll: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="reg-dept">Department &amp; Year</label>
                      <input
                        type="text"
                        id="reg-dept"
                        className="form-control"
                        placeholder="e.g. CS&amp;IT (2nd Year)"
                        value={formData.dept}
                        onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="reg-domain">Preferred Domain</label>
                      <select
                        id="reg-domain"
                        className="form-control"
                        value={formData.domain}
                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      >
                        <option value="Ethical Hacking">Ethical Hacking &amp; Exploits</option>
                        <option value="Penetration Testing">Penetration Testing</option>
                        <option value="Capture The Flag (CTF)">Capture The Flag (CTF)</option>
                        <option value="Digital Forensics">Digital Forensics &amp; IR</option>
                        <option value="Web Application Security">Web Application Security</option>
                        <option value="Network Security">Network Security &amp; Sniffing</option>
                        <option value="Applied Cryptography">Applied Cryptography</option>
                        <option value="OSINT">OSINT &amp; Threat Intelligence</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="reg-exp">Current Experience Level</label>
                      <select
                        id="reg-exp"
                        className="form-control"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      >
                        <option value="Beginner">Beginner (Curious to learn)</option>
                        <option value="Intermediate">Intermediate (CTF player / Linux user)</option>
                        <option value="Advanced">Advanced (Bug hunter / Cert holder)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reg-msg">Motivation / Areas of Interest</label>
                    <textarea
                      id="reg-msg"
                      className="form-control"
                      rows={3}
                      placeholder="Briefly state what you hope to explore with CYBER CUJ..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                    Submit Operative Dossier
                  </button>
                </form>
              </div>

              {/* FAQ Accordion */}
              {v.faq !== false && (
                <div>
                  <div className="section-tag green" style={{ marginBottom: 20 }}>
                    Frequently Asked Questions
                  </div>
                  <div className="faq-list">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className={`faq-item ${faqOpen === idx ? 'open' : ''}`}>
                        <button
                          type="button"
                          className="faq-question"
                          onClick={() => {
                            setFaqOpen(faqOpen === idx ? null : idx);
                            getCyberAudio().playBlip(550, 0.03);
                          }}
                        >
                          <span>{faq.q}</span>
                          <span className="faq-icon">{faqOpen === idx ? '−' : '+'}</span>
                        </button>
                        {faqOpen === idx && (
                          <div className="faq-answer">
                            <p>{faq.a}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 10. FOOTER */}
      <footer className="cyber-footer">
        <div className="container">
          <div className="footer-top-grid">
            {/* Brand Col */}
            <div>
              <div className="brand-logo" style={{ marginBottom: 16 }}>
                <div className="h-10 w-10">
                  <img src="/logo.png" alt={`${siteName} Logo`} width="40" height="40" style={{ borderRadius: '50%', marginTop: '0.5rem' }} />
                </div>
                <div className="brand-text-wrap">
                  <span className="brand-name">{firstWord}{restWords && <span>{restWords}</span>}</span>
                  <span className="brand-affil">{b.orgName}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 18 }}>
                The premier student-driven cybersecurity research and defense club at {b.orgName}. Training ethical hackers and defending campus perimeters.
              </p>
            </div>

            {/* Quick Links */}
            <div style={{ padding: '0 12px' }}>
              <h4 className="footer-col-title">Navigation</h4>
              <ul className="footer-links">
                <li><a href="#about">About Initiative</a></li>
                <li><a href="#domains">Technical Wings</a></li>
                <li><a href="#events">Upcoming Operations</a></li>
                <li><a href="#ctf">CTF Arena</a></li>
                <li><a href="#team">Command Hierarchy</a></li>
                <li><a href="#resources">Learning Hub</a></li>
              </ul>
            </div>

            {/* Technical Tracks */}
            <div style={{ padding: '0 12px' }}>
              <h4 className="footer-col-title">Specializations</h4>
              <ul className="footer-links">
                <li><a href="#domains">Offensive Exploitation</a></li>
                <li><a href="#domains">Digital Forensics &amp; IR</a></li>
                <li><a href="#domains">Applied Cryptography</a></li>
                <li><a href="#domains">Web Application Security</a></li>
                <li><a href="#domains">OSINT Reconnaissance</a></li>
                <li><a href="#domains">Perimeter Defense</a></li>
              </ul>
            </div>

            {/* Contact & Campus Info */}
            <div style={{ padding: '0 12px' }}>

              <h4 className="footer-col-title">Campus Headquarters</h4>
              <div className="footer-contact-item" style={{ marginBottom: 8, justifyContent: 'flex-start' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: 'var(--neon-green)' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <span>{b.contactEmail}</span>
              </div>
              <div className="footer-contact-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: 'var(--neon-cyan)' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <div style={{ fontSize: '0.8 rem', lineHeight: 1.4 }}>
                  <div>Department of Computer Science &amp; IT</div>
                  <span style={{ color: 'var(--text-muted)' }}>{b.campusAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom Strip */}
          <div className="footer-bottom">
            <div>&copy; 2026 {siteName} — {b.orgName}. All rights reserved.</div>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <button
        type="button"
        id="back-to-top"
        className={`back-to-top ${backToTopVisible ? 'visible' : ''}`}
        aria-label="Scroll to top of page"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          getCyberAudio().playBlip(750, 0.04);
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          whatsappUrl={waUrl}
        />
      )}
    </>
  );
}
