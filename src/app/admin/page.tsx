'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import './admin.css';
import {
  useSiteData,
  SiteDataStorage,
  DEFAULT_SITE_DATA,
  SiteData,
  EventItem,
  TeamMember,
  DomainItem,
  ResourceItem,
  AchievementItem,
  ApplicationItem
} from '@/lib/site-data';

export default function AdminPage() {
  const { data, updateData, refresh } = useSiteData();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passInput, setPassInput] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('admin');
  const [authError, setAuthError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Modals state
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<DomainItem | null>(null);

  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);

  const [achievementModalOpen, setAchievementModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<AchievementItem | null>(null);

  // Decoupled Form States for smooth input & robust persistence
  const [identityForm, setIdentityForm] = useState(data.branding);
  const [statsForm, setStatsForm] = useState(data.stats);
  const [ctfForm, setCtfForm] = useState(data.ctfConfig);
  const [rawAcceptedFlags, setRawAcceptedFlags] = useState('');
  const [rawDomainTags, setRawDomainTags] = useState('');

  // Sync decoupled form states whenever global siteData is loaded or updated
  useEffect(() => {
    if (data?.branding) setIdentityForm(data.branding);
    if (data?.stats) setStatsForm(data.stats);
    if (data?.ctfConfig) {
      setCtfForm(data.ctfConfig);
      setRawAcceptedFlags((data.ctfConfig.miniChallenge?.acceptedFlags || []).join(', '));
    }
  }, [data]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Auth Initialization
  useEffect(() => {
    const isAuth = sessionStorage.getItem('CYBER_CUJ_ADMIN_AUTH') === 'true';
    if (isAuth) setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedCreds = localStorage.getItem('CYBER_CUJ_ADMIN_CREDS');
    let creds = { user: 'admin', pass: 'cuj_cyber_admin_2025' };
    if (storedCreds) {
      try {
        creds = JSON.parse(storedCreds);
      } catch (_) {}
    }

    if (userInput.trim() === creds.user && passInput === creds.pass) {
      setIsAuthenticated(true);
      sessionStorage.setItem('CYBER_CUJ_ADMIN_AUTH', 'true');
      setAuthError('');
    } else {
      setAuthError('INVALID SECURITY PASSPHRASE // ACCESS DENIED');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('CYBER_CUJ_ADMIN_AUTH');
    setIsAuthenticated(false);
    setPassInput('');
  };

  // Image resize helper for avatar uploads
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarPreview(dataUrl);
          if (editingMember) {
            setEditingMember({ ...editingMember, avatar: dataUrl });
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!isAuthenticated) {
    return (
      <div id="auth-overlay" className="auth-overlay" style={{ display: 'flex' }}>
        <div className="auth-card">
          <div className="auth-logo">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="auth-title">ADMINISTRATOR AUTHENTICATION</h2>
          <p className="auth-subtitle">Central University of Jammu // Cyber Division SOC</p>

          <form onSubmit={handleLogin}>
            <div className="auth-input-group">
              <label>Operator Username</label>
              <input
                type="text"
                className="admin-input"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="admin"
                required
              />
            </div>
            <div className="auth-input-group">
              <label>Security Passphrase</label>
              <input
                type="password"
                className="admin-input"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                placeholder="Enter passphrase"
                required
              />
            </div>

            {authError && (
              <div
                style={{
                  color: 'var(--accent-rose)',
                  fontSize: '0.8rem',
                  marginBottom: 14,
                  fontFamily: 'var(--font-mono)'
                }}
              >
                {authError}
              </div>
            )}

            <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%', padding: 12 }}>
              Authenticate Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  const b = data.branding;
  const s = data.stats;
  const v = data.sectionsVisibility;

  return (
    <div className="admin-layout" style={{ minHeight: '100vh', background: '#030712', color: '#e2e8f0' }}>
      {/* Top Header */}
      <header
        style={{
          borderBottom: '1px solid var(--admin-border)',
          padding: '14px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(7, 11, 21, 0.95)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid var(--neon-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--neon-cyan)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em' }}>
              CYBER CUJ <span style={{ color: 'var(--neon-cyan)' }}>// SOC ADMIN</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Operations Center v4.2</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link
            href="/"
            target="_blank"
            className="admin-btn admin-btn-outline"
            style={{ padding: '6px 14px', fontSize: '0.78rem' }}
          >
            View Public Site ↗
          </Link>
          <button
            type="button"
            className="action-btn delete"
            style={{ padding: '6px 14px', fontSize: '0.78rem' }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
        {/* Sidebar Nav */}
        <aside
          style={{
            width: 240,
            borderRight: '1px solid var(--admin-border)',
            background: 'rgba(5, 8, 17, 0.8)',
            padding: '20px 10px',
            flexShrink: 0
          }}
        >
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'identity', label: '⚡ Site Identity & Hero' },
            { id: 'sections', label: '🧩 Sections & Layout' },
            { id: 'events', label: '📅 Events Manager' },
            { id: 'team', label: '👥 Team & Organizers' },
            { id: 'domains', label: '🛡️ Technical Domains' },
            { id: 'ctf', label: '🚩 CTF Arena & Flags' },
            { id: 'resources', label: '📚 Resources Hub' },
            { id: 'achievements', label: '🏆 Achievements' },
            { id: 'applications', label: '📝 Applications' },
            { id: 'settings', label: '⚙️ Settings & Backup' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`sidebar-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === tab.id ? 'rgba(0, 229, 255, 0.12)' : 'transparent',
                border: activeTab === tab.id ? '1px solid var(--neon-cyan)' : '1px solid transparent',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                marginBottom: 6,
                cursor: 'pointer',
                fontSize: '0.84rem',
                fontFamily: 'var(--font-mono)'
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Pane */}
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: 20 }}>System Operations Overview</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18, marginBottom: 32 }}>
                <div className="dash-card">
                  <div className="dash-label">TOTAL EVENTS</div>
                  <div className="dash-val">{(data.events || []).length}</div>
                </div>
                <div className="dash-card">
                  <div className="dash-label">CORE OPERATIVES</div>
                  <div className="dash-val">{(data.team || []).length}</div>
                </div>
                <div className="dash-card">
                  <div className="dash-label">MEMBERSHIP APPS</div>
                  <div className="dash-val">{(data.applications || []).length}</div>
                </div>
                <div className="dash-card">
                  <div className="dash-label">TECHNICAL DOMAINS</div>
                  <div className="dash-val">{(data.domains || []).length}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <button type="button" className="admin-btn admin-btn-primary" onClick={() => setActiveTab('events')}>
                  + Add New Event
                </button>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setActiveTab('team')}>
                  + Add Team Member
                </button>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => SiteDataStorage.exportJSON()}>
                  Download JSON Backup
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: IDENTITY & HERO */}
          {activeTab === 'identity' && (
            <div style={{ maxWidth: 800 }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: 20 }}>Site Identity &amp; Hero Branding</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateData({
                    ...data,
                    branding: identityForm,
                    stats: statsForm
                  });
                  showToast('Site Identity & Statistics updated successfully!');
                }}
              >
                <div className="admin-field">
                  <label>Club Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={identityForm?.siteName || ''}
                    onChange={(e) => setIdentityForm({ ...identityForm, siteName: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label>University / Organization Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={identityForm?.orgName || ''}
                    onChange={(e) => setIdentityForm({ ...identityForm, orgName: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label>Tagline</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={identityForm?.tagline || ''}
                    onChange={(e) => setIdentityForm({ ...identityForm, tagline: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label>Subtitle</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={identityForm?.subtitle || ''}
                    onChange={(e) => setIdentityForm({ ...identityForm, subtitle: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label>Description</label>
                  <textarea
                    rows={4}
                    className="admin-input"
                    value={identityForm?.description || ''}
                    onChange={(e) => setIdentityForm({ ...identityForm, description: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label style={{ color: '#25D366' }}>WhatsApp Community Join Link</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={identityForm?.whatsappJoinUrl || ''}
                    onChange={(e) => setIdentityForm({ ...identityForm, whatsappJoinUrl: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                  <div className="admin-field">
                    <label>Defense Status</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={identityForm?.defenseStatus || ''}
                      onChange={(e) => setIdentityForm({ ...identityForm, defenseStatus: e.target.value })}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Active Nodes</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={identityForm?.activeNodes || ''}
                      onChange={(e) => setIdentityForm({ ...identityForm, activeNodes: e.target.value })}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Campus Subnet</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={identityForm?.campusSubnet || ''}
                      onChange={(e) => setIdentityForm({ ...identityForm, campusSubnet: e.target.value })}
                    />
                  </div>
                </div>

                {/* Homepage Statistics & Telemetry Counters */}
                <div style={{ marginTop: 26, paddingTop: 20, borderTop: '1px solid var(--admin-border)' }}>
                  <h3 style={{ fontSize: '1.08rem', marginBottom: 14, color: 'var(--neon-green)', letterSpacing: '0.04em' }}>
                    📊 Homepage Statistics &amp; Counters
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                    <div className="admin-field">
                      <label>Active Operatives Count</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={statsForm?.members ?? 450}
                        onChange={(e) => setStatsForm({ ...statsForm, members: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="admin-field">
                      <label>CTF Challenges Solved</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={statsForm?.ctfChallenges ?? 65}
                        onChange={(e) => setStatsForm({ ...statsForm, ctfChallenges: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="admin-field">
                      <label>Hands-on Workshops</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={statsForm?.workshops ?? 40}
                        onChange={(e) => setStatsForm({ ...statsForm, workshops: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="admin-field">
                      <label>Operations Conducted</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={statsForm?.eventsConducted ?? 20}
                        onChange={(e) => setStatsForm({ ...statsForm, eventsConducted: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: 20 }}>
                  Save Identity &amp; Stats Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: SECTIONS VISIBILITY */}
          {activeTab === 'sections' && (
            <div style={{ maxWidth: 650 }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: 20 }}>Section Visibility Toggles</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Toggle components to show or hide them dynamically on the public website.</p>
              {Object.keys(v).map((sec) => (
                <div
                  key={sec}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: 10
                  }}
                >
                  <span style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {sec} Section
                  </span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={v[sec]}
                      onChange={(e) => {
                        const updatedV = { ...v, [sec]: e.target.checked };
                        updateData({ ...data, sectionsVisibility: updatedV });
                        showToast(`${sec} section visibility toggled!`);
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: EVENTS MANAGER */}
          {activeTab === 'events' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: '1.4rem' }}>Events &amp; Competitions Manager</h2>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  onClick={() => {
                    setEditingEvent({
                      id: 'ev-' + Date.now(),
                      title: '',
                      type: 'workshop',
                      status: 'Upcoming',
                      date: '',
                      venue: '',
                      time: '',
                      description: '',
                      speakers: '',
                      prerequisites: '',
                      agenda: ''
                    });
                    setEventModalOpen(true);
                  }}
                >
                  + Add Event
                </button>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.events || []).map((ev) => (
                    <tr key={ev.id}>
                      <td><strong>{ev.title}</strong></td>
                      <td><span className="badge-tag">{ev.type}</span></td>
                      <td>
                        <span className={`badge-tag ${ev.status.toLowerCase() === 'upcoming' ? 'green' : ''}`}>
                          {ev.status}
                        </span>
                      </td>
                      <td>{ev.date}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            className="action-btn edit"
                            onClick={() => {
                              setEditingEvent({ ...ev });
                              setEventModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="action-btn delete"
                            onClick={() => {
                              if (confirm(`Delete event "${ev.title}"?`)) {
                                updateData({ ...data, events: data.events.filter((e) => e.id !== ev.id) });
                                showToast('Event deleted');
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: TEAM & ORGANIZERS */}
          {activeTab === 'team' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: '1.4rem' }}>Team &amp; Organizers Roster</h2>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  onClick={() => {
                    setEditingMember({
                      id: 'tm-' + Date.now(),
                      category: 'student',
                      name: '',
                      role: '',
                      spec: '',
                      avatar: '',
                      email: '',
                      linkedin: '',
                      website: '',
                      github: '',
                      twitter: ''
                    });
                    setAvatarPreview('');
                    setTeamModalOpen(true);
                  }}
                >
                  + Add Member
                </button>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.team || []).map((tm) => (
                    <tr key={tm.id}>
                      <td>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            border: '1px solid var(--neon-cyan)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0, 229, 255, 0.1)'
                          }}
                        >
                          {tm.avatar ? (
                            <img src={tm.avatar} alt={tm.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '0.7rem', color: 'var(--neon-cyan)' }}>CUJ</span>
                          )}
                        </div>
                      </td>
                      <td><strong>{tm.name}</strong></td>
                      <td>{tm.role}</td>
                      <td><span className="badge-tag">{tm.category}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            className="action-btn edit"
                            onClick={() => {
                              setEditingMember({ ...tm });
                              setAvatarPreview(tm.avatar || '');
                              setTeamModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="action-btn delete"
                            onClick={() => {
                              if (confirm(`Remove member "${tm.name}"?`)) {
                                updateData({ ...data, team: data.team.filter((m) => m.id !== tm.id) });
                                showToast('Member deleted');
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 6: DOMAINS */}
          {activeTab === 'domains' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: '1.4rem' }}>Technical Domains</h2>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  onClick={() => {
                    setEditingDomain({
                      id: 'dom-' + Date.now(),
                      code: `DOM-0${(data.domains || []).length + 1}`,
                      title: '',
                      desc: '',
                      tags: [],
                      icon: 'terminal'
                    });
                    setRawDomainTags('');
                    setDomainModalOpen(true);
                  }}
                >
                  + Add Domain
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                {(data.domains || []).map((dm) => (
                  <div key={dm.id} className="dash-card" style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span className="badge-tag green">{dm.code}</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          type="button"
                          className="action-btn edit"
                          onClick={() => {
                            setEditingDomain({ ...dm });
                            setRawDomainTags((dm.tags || []).join(', '));
                            setDomainModalOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="action-btn delete"
                          onClick={() => {
                            if (confirm(`Delete domain "${dm.title}"?`)) {
                              updateData({ ...data, domains: data.domains.filter((d) => d.id !== dm.id) });
                              showToast('Domain deleted');
                            }
                          }}
                        >
                          Del
                        </button>
                      </div>
                    </div>
                    <h4 style={{ color: '#ffffff', marginBottom: 6 }}>{dm.title}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 10 }}>{dm.desc}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {(dm.tags || []).map((t, idx) => (
                        <span key={idx} className="badge-tag" style={{ fontSize: '0.68rem' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CTF ARENA */}
          {activeTab === 'ctf' && (
            <div style={{ maxWidth: 700 }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: 20 }}>CTF Arena &amp; Mini-Challenge Config</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const parsedFlags = rawAcceptedFlags
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
                  const updatedCtf = {
                    ...ctfForm,
                    miniChallenge: {
                      ...ctfForm.miniChallenge,
                      acceptedFlags: parsedFlags
                    }
                  };
                  updateData({ ...data, ctfConfig: updatedCtf });
                  showToast('CTF configuration saved!');
                }}
              >
                <div className="admin-field">
                  <label>Headline</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={ctfForm?.headline || ''}
                    onChange={(e) => setCtfForm({ ...ctfForm, headline: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label>Tagline</label>
                  <textarea
                    rows={3}
                    className="admin-input"
                    value={ctfForm?.tagline || ''}
                    onChange={(e) => setCtfForm({ ...ctfForm, tagline: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label>Warmup Challenge Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={ctfForm?.miniChallenge?.title || ''}
                    onChange={(e) =>
                      setCtfForm({
                        ...ctfForm,
                        miniChallenge: { ...ctfForm.miniChallenge, title: e.target.value }
                      })
                    }
                  />
                </div>
                <div className="admin-field">
                  <label>Ciphertext Payload (e.g. Base64)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={ctfForm?.miniChallenge?.payload || ''}
                    onChange={(e) =>
                      setCtfForm({
                        ...ctfForm,
                        miniChallenge: { ...ctfForm.miniChallenge, payload: e.target.value }
                      })
                    }
                  />
                </div>
                <div className="admin-field">
                  <label>Decryptor Hint</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={ctfForm?.miniChallenge?.hint || ''}
                    onChange={(e) =>
                      setCtfForm({
                        ...ctfForm,
                        miniChallenge: { ...ctfForm.miniChallenge, hint: e.target.value }
                      })
                    }
                  />
                </div>
                <div className="admin-field">
                  <label>Accepted Flags (comma separated)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={rawAcceptedFlags}
                    onChange={(e) => setRawAcceptedFlags(e.target.value)}
                    placeholder="e.g. CUJ{flag_one}, CUJ{flag_two}"
                  />
                </div>

                <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: 14 }}>
                  Save CTF Settings
                </button>
              </form>
            </div>
          )}

          {/* TAB 8: RESOURCES */}
          {activeTab === 'resources' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: '1.4rem' }}>Resources Hub Manager</h2>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  onClick={() => {
                    setEditingResource({
                      id: 'res-' + Date.now(),
                      cat: 'Web Security',
                      sub: 'Offensive Web',
                      title: '',
                      desc: '',
                      link: ''
                    });
                    setResourceModalOpen(true);
                  }}
                >
                  + Add Resource
                </button>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Link</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.resources || []).map((res) => (
                    <tr key={res.id}>
                      <td><strong>{res.title}</strong></td>
                      <td><span className="badge-tag">{res.cat}</span></td>
                      <td>
                        <a href={res.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neon-cyan)' }}>
                          Link ↗
                        </a>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            className="action-btn edit"
                            onClick={() => {
                              setEditingResource({ ...res });
                              setResourceModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="action-btn delete"
                            onClick={() => {
                              if (confirm(`Delete resource "${res.title}"?`)) {
                                updateData({ ...data, resources: data.resources.filter((r) => r.id !== res.id) });
                                showToast('Resource deleted');
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 9: ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: '1.4rem' }}>Achievements &amp; Accolades</h2>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  onClick={() => {
                    setEditingAchievement({
                      id: 'ach-' + Date.now(),
                      year: '2026 // TOURNAMENT',
                      icon: 'trophy',
                      title: '',
                      desc: ''
                    });
                    setAchievementModalOpen(true);
                  }}
                >
                  + Add Achievement
                </button>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Year / Badge</th>
                    <th>Icon</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.achievements || []).map((ach) => (
                    <tr key={ach.id}>
                      <td><strong>{ach.title}</strong></td>
                      <td><span className="badge-tag green">{ach.year}</span></td>
                      <td>{ach.icon}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            className="action-btn edit"
                            onClick={() => {
                              setEditingAchievement({ ...ach });
                              setAchievementModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="action-btn delete"
                            onClick={() => {
                              if (confirm(`Delete achievement "${ach.title}"?`)) {
                                updateData({
                                  ...data,
                                  achievements: data.achievements.filter((a) => a.id !== ach.id)
                                });
                                showToast('Achievement deleted');
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 10: APPLICATIONS */}
          {activeTab === 'applications' && (
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: 20 }}>Student Applications Dossier</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email &amp; Roll</th>
                    <th>Domain</th>
                    <th>Experience</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.applications || []).map((app) => (
                    <tr key={app.id}>
                      <td><strong>{app.name}</strong></td>
                      <td>
                        {app.email}<br />
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{app.roll}</span>
                      </td>
                      <td><span className="badge-tag">{app.domain}</span></td>
                      <td>{app.experience}</td>
                      <td>{app.submittedAt}</td>
                      <td>
                        <select
                          className="admin-input"
                          style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                          value={app.status}
                          onChange={(e) => {
                            const updated = data.applications.map((a) =>
                              a.id === app.id ? { ...a, status: e.target.value } : a
                            );
                            updateData({ ...data, applications: updated });
                            showToast(`Status updated to ${e.target.value}`);
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Approved">Approved</option>
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="action-btn delete"
                          onClick={() => {
                            if (confirm(`Remove application from ${app.name}?`)) {
                              updateData({
                                ...data,
                                applications: data.applications.filter((a) => a.id !== app.id)
                              });
                              showToast('Application removed');
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 11: SETTINGS & BACKUP */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: 650 }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: 20 }}>Settings &amp; Backup Maintenance</h2>

              {/* Passphrase update */}
              <div className="dash-card" style={{ marginBottom: 24 }}>
                <h4 style={{ color: '#ffffff', marginBottom: 12 }}>Change Admin Passphrase</h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const newPass = (form.elements.namedItem('new_pass') as HTMLInputElement).value;
                    const confirmPass = (form.elements.namedItem('confirm_pass') as HTMLInputElement).value;
                    if (!newPass || newPass !== confirmPass) {
                      alert('Passphrases do not match or are empty');
                      return;
                    }
                    localStorage.setItem('CYBER_CUJ_ADMIN_CREDS', JSON.stringify({ user: 'admin', pass: newPass }));
                    showToast('Passphrase updated successfully!');
                    form.reset();
                  }}
                >
                  <div className="admin-field">
                    <label>New Passphrase</label>
                    <input type="password" name="new_pass" className="admin-input" required />
                  </div>
                  <div className="admin-field">
                    <label>Confirm Passphrase</label>
                    <input type="password" name="confirm_pass" className="admin-input" required />
                  </div>
                  <button type="submit" className="admin-btn admin-btn-primary">
                    Update Passphrase
                  </button>
                </form>
              </div>

              {/* JSON Backup & Restore */}
              <div className="dash-card" style={{ marginBottom: 24 }}>
                <h4 style={{ color: '#ffffff', marginBottom: 12 }}>Data Snapshot &amp; Migration</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                  Download a complete backup of all events, members, and configurations as JSON or import an existing snapshot.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button type="button" className="admin-btn admin-btn-outline" onClick={() => SiteDataStorage.exportJSON()}>
                    Export Snapshot (.json)
                  </button>
                  <label className="admin-btn admin-btn-outline" style={{ cursor: 'pointer' }}>
                    Import Snapshot (.json)
                    <input
                      type="file"
                      accept=".json"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          const res = SiteDataStorage.importJSON(evt.target?.result as string);
                          if (res.success) {
                            refresh();
                            showToast('Data imported successfully!');
                          } else {
                            alert('Import failed: ' + res.error);
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Factory Reset */}
              <div className="dash-card" style={{ borderColor: 'rgba(244, 63, 94, 0.4)' }}>
                <h4 style={{ color: 'var(--accent-rose)', marginBottom: 8 }}>Danger Zone: Factory Reset</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
                  Reset all configurations, events, members, and settings to the initial factory default state.
                </p>
                <button
                  type="button"
                  className="action-btn delete"
                  style={{ padding: '8px 16px' }}
                  onClick={() => {
                    if (confirm('Are you ABSOLUTELY SURE you want to factory reset all site data?')) {
                      SiteDataStorage.reset();
                      refresh();
                      showToast('Factory reset complete');
                    }
                  }}
                >
                  Factory Reset
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: EVENT ADD/EDIT */}
      {eventModalOpen && editingEvent && (
        <div className="admin-modal active" onClick={(e) => e.target === e.currentTarget && setEventModalOpen(false)}>
          <div className="admin-modal-content">
            <h3 style={{ marginBottom: 16 }}>{editingEvent.title ? 'Edit Event' : 'Add Event'}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const existing = data.events || [];
                const idx = existing.findIndex((ev) => ev.id === editingEvent.id);
                let updated = [...existing];
                if (idx >= 0) {
                  updated[idx] = editingEvent;
                } else {
                  updated.unshift(editingEvent);
                }
                updateData({ ...data, events: updated });
                setEventModalOpen(false);
                showToast('Event saved!');
              }}
            >
              <div className="admin-field">
                <label>Title *</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-field">
                  <label>Type</label>
                  <select
                    className="admin-input"
                    value={editingEvent.type}
                    onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value })}
                  >
                    <option value="ctf">CTF</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="awareness">Awareness</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>Status</label>
                  <select
                    className="admin-input"
                    value={editingEvent.status}
                    onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="admin-field">
                <label>Date *</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  value={editingEvent.date}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Venue</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingEvent.venue}
                  onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Time</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingEvent.time}
                  onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Description</label>
                <textarea
                  rows={3}
                  className="admin-input"
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Speakers &amp; Leads</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingEvent.speakers}
                  onChange={(e) => setEditingEvent({ ...editingEvent, speakers: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Prerequisites</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingEvent.prerequisites}
                  onChange={(e) => setEditingEvent({ ...editingEvent, prerequisites: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Agenda</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editingEvent.agenda}
                  onChange={(e) => setEditingEvent({ ...editingEvent, agenda: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setEventModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TEAM MEMBER ADD/EDIT */}
      {teamModalOpen && editingMember && (
        <div className="admin-modal active" onClick={(e) => e.target === e.currentTarget && setTeamModalOpen(false)}>
          <div className="admin-modal-content">
            <h3 style={{ marginBottom: 16 }}>{editingMember.name ? 'Edit Member' : 'Add Team Member'}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const existing = data.team || [];
                const idx = existing.findIndex((m) => m.id === editingMember.id);
                let updated = [...existing];
                const finalMember = { ...editingMember, avatar: avatarPreview };
                if (idx >= 0) {
                  updated[idx] = finalMember;
                } else {
                  updated.unshift(finalMember);
                }
                updateData({ ...data, team: updated });
                setTeamModalOpen(false);
                showToast('Team member saved!');
              }}
            >
              {/* Photo Upload & Preview */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16 }}>
                <div
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    border: '2px solid var(--neon-cyan)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 229, 255, 0.1)',
                    flexShrink: 0
                  }}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)' }}>Avatar</span>
                  )}
                </div>
                <div>
                  <label className="admin-btn admin-btn-outline" style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '6px 12px' }}>
                    Upload Photo
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                  </label>
                  {avatarPreview && (
                    <button
                      type="button"
                      className="action-btn delete"
                      style={{ marginLeft: 8, fontSize: '0.78rem' }}
                      onClick={() => setAvatarPreview('')}
                    >
                      Remove Photo
                    </button>
                  )}
                  <div style={{ marginTop: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Or paste direct image URL below
                  </div>
                </div>
              </div>

              <div className="admin-field">
                <label>Image URL (Optional)</label>
                <input
                  type="url"
                  className="admin-input"
                  value={avatarPreview}
                  onChange={(e) => setAvatarPreview(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="admin-field">
                <label>Full Name *</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-field">
                  <label>Role *</label>
                  <input
                    type="text"
                    className="admin-input"
                    required
                    value={editingMember.role}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label>Category</label>
                  <select
                    className="admin-input"
                    value={editingMember.category}
                    onChange={(e) => setEditingMember({ ...editingMember, category: e.target.value as 'faculty' | 'student' })}
                  >
                    <option value="student">Student Leader</option>
                    <option value="faculty">Faculty Advisor</option>
                  </select>
                </div>
              </div>
              <div className="admin-field">
                <label>Specialization &amp; Bio</label>
                <textarea
                  rows={3}
                  className="admin-input"
                  value={editingMember.spec}
                  onChange={(e) => setEditingMember({ ...editingMember, spec: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-field">
                  <label>Email</label>
                  <input
                    type="email"
                    className="admin-input"
                    value={editingMember.email}
                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label>LinkedIn</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={editingMember.linkedin}
                    onChange={(e) => setEditingMember({ ...editingMember, linkedin: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-field">
                  <label>GitHub</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={editingMember.github}
                    onChange={(e) => setEditingMember({ ...editingMember, github: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label>Twitter / X</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={editingMember.twitter}
                    onChange={(e) => setEditingMember({ ...editingMember, twitter: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setTeamModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DOMAIN ADD/EDIT */}
      {domainModalOpen && editingDomain && (
        <div className="admin-modal active" onClick={(e) => e.target === e.currentTarget && setDomainModalOpen(false)}>
          <div className="admin-modal-content">
            <h3 style={{ marginBottom: 16 }}>{editingDomain.title ? 'Edit Domain' : 'Add Domain'}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const existing = data.domains || [];
                const idx = existing.findIndex((d) => d.id === editingDomain.id);
                let updated = [...existing];
                const parsedDomain = {
                  ...editingDomain,
                  tags: rawDomainTags.split(',').map((s) => s.trim()).filter(Boolean)
                };
                if (idx >= 0) {
                  updated[idx] = parsedDomain;
                } else {
                  updated.unshift(parsedDomain);
                }
                updateData({ ...data, domains: updated });
                setDomainModalOpen(false);
                showToast('Domain saved!');
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                <div className="admin-field">
                  <label>Code</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingDomain.code}
                    onChange={(e) => setEditingDomain({ ...editingDomain, code: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label>Title *</label>
                  <input
                    type="text"
                    className="admin-input"
                    required
                    value={editingDomain.title}
                    onChange={(e) => setEditingDomain({ ...editingDomain, title: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-field">
                  <label>Icon Style</label>
                  <select
                    className="admin-input"
                    value={editingDomain.icon || 'terminal'}
                    onChange={(e) => setEditingDomain({ ...editingDomain, icon: e.target.value })}
                  >
                    <option value="terminal">💻 Terminal (Default)</option>
                    <option value="crosshair">🎯 Crosshair (Pen Testing)</option>
                    <option value="flag">🚩 Flag (CTF)</option>
                    <option value="search">🔍 Search (Forensics &amp; IR)</option>
                    <option value="globe">🌐 Globe (Web App Security)</option>
                    <option value="server">🖥️ Server (Network Security)</option>
                    <option value="lock">🔒 Lock (Cryptography)</option>
                    <option value="eye">👁️ Eye (OSINT)</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={rawDomainTags}
                    onChange={(e) => setRawDomainTags(e.target.value)}
                    placeholder="e.g. Nmap, Nessus, OWASP"
                  />
                </div>
              </div>
              <div className="admin-field">
                <label>Description</label>
                <textarea
                  rows={3}
                  className="admin-input"
                  value={editingDomain.desc}
                  onChange={(e) => setEditingDomain({ ...editingDomain, desc: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setDomainModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESOURCE ADD/EDIT */}
      {resourceModalOpen && editingResource && (
        <div className="admin-modal active" onClick={(e) => e.target === e.currentTarget && setResourceModalOpen(false)}>
          <div className="admin-modal-content">
            <h3 style={{ marginBottom: 16 }}>{editingResource.title ? 'Edit Resource' : 'Add Resource'}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const existing = data.resources || [];
                const idx = existing.findIndex((r) => r.id === editingResource.id);
                let updated = [...existing];
                if (idx >= 0) {
                  updated[idx] = editingResource;
                } else {
                  updated.unshift(editingResource);
                }
                updateData({ ...data, resources: updated });
                setResourceModalOpen(false);
                showToast('Resource saved!');
              }}
            >
              <div className="admin-field">
                <label>Title *</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  value={editingResource.title}
                  onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-field">
                  <label>Category</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingResource.cat}
                    onChange={(e) => setEditingResource({ ...editingResource, cat: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label>Sub-tag</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingResource.sub}
                    onChange={(e) => setEditingResource({ ...editingResource, sub: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-field">
                <label>URL Link *</label>
                <input
                  type="url"
                  className="admin-input"
                  required
                  value={editingResource.link}
                  onChange={(e) => setEditingResource({ ...editingResource, link: e.target.value })}
                />
              </div>
              <div className="admin-field">
                <label>Description</label>
                <textarea
                  rows={3}
                  className="admin-input"
                  value={editingResource.desc}
                  onChange={(e) => setEditingResource({ ...editingResource, desc: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setResourceModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ACHIEVEMENT ADD/EDIT */}
      {achievementModalOpen && editingAchievement && (
        <div className="admin-modal active" onClick={(e) => e.target === e.currentTarget && setAchievementModalOpen(false)}>
          <div className="admin-modal-content">
            <h3 style={{ marginBottom: 16 }}>{editingAchievement.title ? 'Edit Achievement' : 'Add Achievement'}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const existing = data.achievements || [];
                const idx = existing.findIndex((a) => a.id === editingAchievement.id);
                let updated = [...existing];
                if (idx >= 0) {
                  updated[idx] = editingAchievement;
                } else {
                  updated.unshift(editingAchievement);
                }
                updateData({ ...data, achievements: updated });
                setAchievementModalOpen(false);
                showToast('Achievement saved!');
              }}
            >
              <div className="admin-field">
                <label>Title *</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  value={editingAchievement.title}
                  onChange={(e) => setEditingAchievement({ ...editingAchievement, title: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-field">
                  <label>Year / Subtitle</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editingAchievement.year}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, year: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label>Icon Style</label>
                  <select
                    className="admin-input"
                    value={editingAchievement.icon}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, icon: e.target.value })}
                  >
                    <option value="trophy">🏆 Trophy / Cup</option>
                    <option value="shield">🛡️ Shield / Security</option>
                    <option value="cert">📜 Certificate</option>
                    <option value="star">⭐ Star / Award</option>
                  </select>
                </div>
              </div>
              <div className="admin-field">
                <label>Description</label>
                <textarea
                  rows={3}
                  className="admin-input"
                  value={editingAchievement.desc}
                  onChange={(e) => setEditingAchievement({ ...editingAchievement, desc: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setAchievementModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Toast */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'rgba(5, 8, 17, 0.95)',
            border: '1px solid var(--neon-cyan)',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-sm)',
            color: '#ffffff',
            fontSize: '0.86rem',
            fontFamily: 'var(--font-mono)',
            zIndex: 99999
          }}
        >
          [+] {toastMsg}
        </div>
      )}
    </div>
  );
}
