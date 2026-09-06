'use client';

import React, { useEffect } from 'react';
import { EventItem } from '@/lib/site-data';

interface EventModalProps {
  event: EventItem | null;
  onClose: () => void;
  whatsappUrl?: string;
}

export default function EventModal({ event, onClose, whatsappUrl }: EventModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (event) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div
      id="event-modal"
      className="cyber-modal active"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <button className="modal-close-btn" aria-label="Close details modal" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div style={{ marginBottom: 16 }}>
          <span className="section-tag" style={{ marginBottom: 8 }}>
            OPERATION BRIEFING // {event.status.toUpperCase()}
          </span>
          <h3 id="modal-title" style={{ fontSize: '1.45rem', color: '#ffffff', marginTop: 8 }}>
            {event.title}
          </h3>
        </div>

        <div className="event-modal-meta-grid">
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>DATE &amp; TIME</span>
            <span style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>{event.date}</span>
            <br />
            <span style={{ color: 'var(--text-secondary)' }}>{event.time}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>LOCATION / PLATFORM</span>
            <span style={{ color: 'var(--neon-green)', fontWeight: 600 }}>{event.venue}</span>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
            // DESCRIPTION
          </h4>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{event.description}</p>
        </div>

        <div style={{ marginBottom: 18 }}>
          <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
            // SPEAKERS &amp; FACULTY
          </h4>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{event.speakers}</p>
        </div>

        <div style={{ marginBottom: 18 }}>
          <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
            // PREREQUISITES
          </h4>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{event.prerequisites}</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
            // OPERATION TIMELINE &amp; AGENDA
          </h4>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{event.agenda}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
            Close Briefing
          </button>
          <a
            href={whatsappUrl || '#join'}
            target={whatsappUrl ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
            onClick={onClose}
          >
            Register / Join
          </a>
        </div>
      </div>
    </div>
  );
}
