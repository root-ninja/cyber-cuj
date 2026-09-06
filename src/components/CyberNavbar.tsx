'use client';

import React, { useState, useEffect } from 'react';
import { useSiteData } from '@/lib/site-data';
import { getCyberAudio } from '@/lib/audio';

export default function CyberNavbar() {
  const { data } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [scanlinesActive, setScanlinesActive] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const audio = getCyberAudio();
    const isEnabled = audio.toggle();
    setSoundActive(isEnabled);
  };

  const toggleScanlines = () => {
    const body = document.body;
    body.classList.toggle('scanlines-disabled');
    const enabled = !body.classList.contains('scanlines-disabled');
    setScanlinesActive(enabled);
    if (soundActive) getCyberAudio().playBlip(700, 0.04);
  };

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Domains', href: '#domains' },
    { label: 'Events', href: '#events' },
    { label: 'CTF Arena', href: '#ctf' },
    { label: 'Team', href: '#team' },
    { label: 'Resources', href: '#resources' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Contact', href: '#join' },
  ];

  const handleLinkClick = () => {
    setMenuOpen(false);
    if (soundActive) getCyberAudio().playBlip(600, 0.03);
  };

  const waUrl = data.branding?.whatsappJoinUrl || 'https://chat.whatsapp.com/DYOucc2Amn5LBPZqAg87v5?s=cl&p=a&mlu=4&ilr=4';

  return (
    <header className={`cyber-navbar ${scrolled ? 'scrolled' : ''}`} role="banner">
      <div className="container nav-container">
        {/* Brand Logo */}
        <a href="#hero" className="brand-logo" aria-label="CYBER CUJ Home" onClick={() => soundActive && getCyberAudio().playBlip(500, 0.03)}>
          <div className="brand-shield">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <circle cx="12" cy="11" r="3" />
            </svg>
          </div>
          <div className="brand-text-wrap">
            <span className="brand-name">
              CYBER<span>CUJ</span>
            </span>
            <span className="brand-affil">{data.branding?.orgName || 'Central University of Jammu'}</span>
          </div>
        </a>

        {/* Navigation Menu */}
        <nav role="navigation" aria-label="Main Navigation">
          <ul className={`nav-menu ${menuOpen ? 'open' : ''}`}>
            {navLinks.map((item, idx) => (
              <li key={idx}>
                <a href={item.href} className="nav-link" onClick={handleLinkClick}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Controls */}
        <div className="nav-actions">
          <div className="status-badge" title="Network Protocol: TLS 1.3 Active">
            <span className="status-pulse"></span>
            <span>ONLINE // DEFCON 3</span>
          </div>

          <button
            id="audio-toggle"
            type="button"
            className={`audio-toggle-btn ${soundActive ? 'active' : ''}`}
            title="Toggle UI Sound FX"
            aria-label="Toggle Sound"
            onClick={toggleSound}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          </button>

          <button
            id="scanlines-toggle"
            type="button"
            className={`scanlines-toggle-btn ${scanlinesActive ? 'active' : ''}`}
            title="Toggle Scanline Filter"
            aria-label="Toggle CRT Scanlines"
            onClick={toggleScanlines}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </button>

          <a
            id="nav-join-btn"
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm join-club-link"
            onClick={() => soundActive && getCyberAudio().playSuccess()}
          >
            Join Club
          </a>

          <button
            type="button"
            className="mobile-toggle"
            aria-label="Open Navigation Menu"
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen(!menuOpen);
              if (soundActive) getCyberAudio().playBlip(600, 0.04);
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
