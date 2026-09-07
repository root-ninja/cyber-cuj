'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getCyberAudio } from '@/lib/audio';

interface TerminalEntry {
  type: 'prompt' | 'output' | 'success' | 'highlight' | 'error';
  content: string;
}

export default function CyberTerminal() {
  const [history, setHistory] = useState<TerminalEntry[]>([
    { type: 'prompt', content: 'system:~$ Initializing CYBER CUJ Security Matrix v4.2...' },
    { type: 'prompt', content: 'system:~$ Connected to Central University of Jammu Secured Gateway [TLS 1.3].' },
    { type: 'success', content: '[OK] Host: cuj.ac.in | Subnet: 10.32.0.0/16 | Status: SECURED (DEFCON 3)' },
    {
      type: 'output',
      content: 'Welcome Operative. Type help to view accessible command modules or execute commands below.'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const terminalBodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = inputVal.trim();
    if (!rawCmd) return;

    const cmd = rawCmd.toLowerCase();
    setInputVal('');

    const newEntries: TerminalEntry[] = [{ type: 'prompt', content: `cuj-sec@mainframe:~$ ${rawCmd}` }];
    const audio = getCyberAudio();

    switch (cmd) {
      case 'help':
        audio.playBlip(650, 0.05);
        newEntries.push({
          type: 'highlight',
          content: 'AVAILABLE SYSTEM MODULES:\n  about     - Dossier on CYBER CUJ\n  events    - Upcoming operations & CTFs\n  domains   - Technical specialization tracks\n  ctf       - Jump to CTF mini-challenge\n  team      - Faculty advisory & student operatives\n  join      - Recruitment protocol\n  clear     - Wipe display buffer\n  whoami    - Display session privileges'
        });
        break;

      case 'about':
        audio.playBlip(600, 0.05);
        newEntries.push({
          type: 'output',
          content: 'CYBER CUJ: Premier student-driven cybersecurity research and defense initiative at Central University of Jammu. Specializing in ethical hacking, CTFs, digital forensics, and zero-day threat analysis.'
        });
        break;

      case 'events':
        audio.playBlip(600, 0.05);
        newEntries.push({
          type: 'output',
          content: 'Active Operations: CUJ Cyber Sentinel CTF 2025, Zero-Day Discovery Workshop, Cyber Aware J&K Campaign.'
        });
        break;

      case 'domains':
        audio.playBlip(600, 0.05);
        newEntries.push({
          type: 'output',
          content: 'Domains: Ethical Hacking, Pen Testing, CTFs, Digital Forensics, Web Sec, Network Sec, Cryptography, OSINT.'
        });
        break;

      case 'ctf':
        audio.playSuccess();
        newEntries.push({
          type: 'success',
          content: 'Engaging CTF Arena... Inspect the warmup challenge below or visit the CTF section.'
        });
        const ctfSection = document.getElementById('ctf');
        if (ctfSection) ctfSection.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'team':
        audio.playBlip(600, 0.05);
        newEntries.push({
          type: 'output',
          content: 'Advisory: Dr. Faculty Advisor (CS&IT) | Lead Coordinator | Vice President (Forensics) | WebSec Lead | Outreach Lead.'
        });
        break;

      case 'join':
        audio.playSuccess();
        newEntries.push({
          type: 'success',
          content: 'Navigating to registration matrix...'
        });
        const joinSection = document.getElementById('join');
        if (joinSection) joinSection.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'whoami':
        newEntries.push({
          type: 'output',
          content: 'guest@cuj-subnet-10.32.14.88 (UNAUTHENTICATED OPERATIVE)'
        });
        break;

      case 'sudo':
        audio.playError();
        newEntries.push({
          type: 'error',
          content: 'Permission denied: User is not in sudoers file. Incident reported to Dr. Faculty Advisor.'
        });
        break;

      case 'date':
        newEntries.push({
          type: 'output',
          content: new Date().toUTCString()
        });
        break;

      case 'ping':
      case 'ping cuj.ac.in':
        audio.playBlip(700, 0.04);
        newEntries.push({
          type: 'success',
          content: '64 bytes from 10.32.0.1: icmp_seq=1 ttl=64 time=1.24 ms [DEFENSE ONLINE]'
        });
        break;

      default:
        audio.playError();
        newEntries.push({
          type: 'error',
          content: `zsh: command not found: ${rawCmd}. Type 'help' for command syntax.`
        });
        break;
    }

    setHistory((prev) => [...prev, ...newEntries]);
  };

  return (
    <div className="hero-terminal">
      <div className="terminal-wrapper">
        {/* Terminal Titlebar */}
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="t-dot red"></span>
            <span className="t-dot yellow"></span>
            <span className="t-dot green"></span>
          </div>
          <div className="terminal-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            <span>cuj-sec@mainframe:~ (zsh)</span>
          </div>
          <span className="terminal-badge">LIVE RECON</span>
        </div>

        {/* Terminal Output Stream */}
        <div ref={terminalBodyRef} className="terminal-body">
          {history.map((entry, idx) => (
            <div
              key={idx}
              className={
                entry.type === 'prompt'
                  ? 'terminal-line'
                  : `terminal-output ${entry.type === 'success' ? 'success' : entry.type === 'highlight' ? 'highlight' : entry.type === 'error' ? 'error' : ''}`
              }
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {entry.content}
            </div>
          ))}

          {/* Interactive Command Input Form */}
          <form onSubmit={handleCommand} className="terminal-input-row" style={{ padding: '4px 0' }}>
            <span className="terminal-prompt">cuj-sec:~$</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="type command (e.g. help, ctf, events)..."
              autoComplete="off"
              spellCheck="false"
              aria-label="Terminal command line"
            />
            <span className="terminal-cursor"></span>
          </form>
        </div>
      </div>
    </div>
  );
}
