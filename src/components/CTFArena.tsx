'use client';

import React, { useState } from 'react';
import { CTFConfig } from '@/lib/site-data';
import { getCyberAudio } from '@/lib/audio';

interface CTFArenaProps {
  config: CTFConfig;
}

export default function CTFArena({ config }: CTFArenaProps) {
  const [flagInput, setFlagInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const flag = flagInput.trim();
    if (!flag) return;

    const audio = getCyberAudio();
    const accepted = (config.miniChallenge.acceptedFlags || []).map((f) => f.toLowerCase());

    if (accepted.includes(flag.toLowerCase())) {
      audio.playSuccess();
      setFeedback({
        type: 'success',
        message: 'FLAG CAPTURED! +250 PTS // Authentication Token Validated. Welcome to the elite roster, Operative.'
      });
    } else {
      audio.playError();
      setFeedback({
        type: 'error',
        message: 'ACCESS DENIED // Invalid Flag Hash. Inspect the ciphertext format or view the decrypted clue.'
      });
    }
  };

  return (
    <section id="ctf" className="section" style={{ position: 'relative' }}>
      <div className="container">
        {/* CTF Banner Showcase */}
        <div className="ctf-showcase-banner">
          <div className="ctf-banner-grid">
            <div>
              <div className="section-tag green" style={{ marginBottom: 16 }}>
                WARGAMES // COMPETITIVE ARENA
              </div>
              <h2 className="ctf-headline">{config.headline}</h2>
              <p className="ctf-tagline">{config.tagline}</p>

              <div className="ctf-stats-row">
                <div className="ctf-mini-stat">
                  <span className="val">{config.stats?.challengesCount || '60+'}</span>
                  <span className="lbl">Active Labs</span>
                </div>
                <div className="ctf-mini-stat">
                  <span className="val">{config.stats?.totalSolves || '1,200+'}</span>
                  <span className="lbl">Verified Solves</span>
                </div>
                <div className="ctf-mini-stat">
                  <span className="val">{config.stats?.uptime || '24/7'}</span>
                  <span className="lbl">Sandbox Uptime</span>
                </div>
              </div>

              <a href="#mini-ctf-box" className="btn btn-primary btn-lg" onClick={() => getCyberAudio().playBlip(600, 0.04)}>
                Take Warmup Challenge
              </a>
            </div>

            {/* CTF Graphic */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-block',
                  padding: 24,
                  border: '1px solid var(--border-neon-cyan)',
                  borderRadius: 20,
                  background: 'rgba(0, 229, 255, 0.03)',
                  boxShadow: '0 0 35px rgba(0, 229, 255, 0.15)'
                }}
              >
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  style={{ color: 'var(--neon-cyan)', filter: 'drop-shadow(0 0 10px var(--neon-cyan))' }}
                >
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
                <div className="mono" style={{ marginTop: 14, fontSize: '0.84rem', color: 'var(--neon-green)', letterSpacing: '0.1em' }}>
                  FLAG CAPTURE PROTOCOL
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTF Categories */}
        <div className="ctf-categories-grid">
          {(config.categories || []).map((cat, idx) => (
            <div key={idx} className="ctf-cat-card">
              <div className="ctf-cat-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
              </div>
              <div className="ctf-cat-name">{cat.name}</div>
              <div className="ctf-cat-count">{cat.count}</div>
            </div>
          ))}
        </div>

        {/* Mini Challenge Box */}
        <div id="mini-ctf-box" className="ctf-arena-card">
          <div className="challenge-header">
            <div className="challenge-meta">
              <span className="diff-badge easy">WARMUP // 250 PTS</span>
              <span className="cat-tag">CRYPTOGRAPHY</span>
            </div>
            <h3 className="challenge-title">
              Live CTF Warmup: <span style={{ color: 'var(--neon-cyan)' }}>{config.miniChallenge.title}</span>
            </h3>
          </div>

          <p style={{ fontSize: '0.94rem', marginBottom: 14, color: 'var(--text-secondary)' }}>
            Intercepted transmission from campus perimeter router [TLS Decrypted Payload]. Extract the secret flag token:
          </p>

          <div className="payload-box">
            <div style={{ fontWeight: 'bold', fontSize: '1.05rem', letterSpacing: '0.05em', color: '#67e8f9', wordBreak: 'break-all' }}>
              {config.miniChallenge.payload}
            </div>
            {showHint && (
              <div
                id="challenge-hint"
                style={{
                  marginTop: 10,
                  paddingTop: 10,
                  borderTop: '1px dashed rgba(0, 229, 255, 0.2)',
                  fontSize: '0.8rem',
                  color: 'var(--accent-amber)'
                }}
              >
                {config.miniChallenge.hint}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                setShowHint(!showHint);
                getCyberAudio().playBlip(550, 0.03);
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>{showHint ? 'Hide Hint' : 'Reveal Decryptor Hint'}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flag-form">
            <input
              type="text"
              className="flag-input"
              value={flagInput}
              onChange={(e) => setFlagInput(e.target.value)}
              placeholder="Enter decoded flag (e.g. CUJ{...})"
              spellCheck="false"
              autoComplete="off"
            />
            <button type="submit" className="btn btn-primary">
              Verify Flag
            </button>
          </form>

          {feedback && (
            <div
              className={`challenge-feedback ${feedback.type}`}
              style={{
                display: 'block',
                marginTop: 16,
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.86rem',
                border: feedback.type === 'success' ? '1px solid var(--neon-green)' : '1px solid var(--accent-rose)',
                background: feedback.type === 'success' ? 'rgba(0, 255, 157, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                color: feedback.type === 'success' ? 'var(--neon-green)' : 'var(--accent-rose)'
              }}
            >
              {feedback.message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
