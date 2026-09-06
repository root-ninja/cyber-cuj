'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Branding {
  siteName: string;
  orgName: string;
  tagline: string;
  subtitle: string;
  description: string;
  defenseStatus: string;
  activeNodes: string;
  campusSubnet: string;
  contactEmail: string;
  campusAddress: string;
  whatsappJoinUrl: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    discord: string;
    whatsapp: string;
  };
}

export interface Stats {
  members: number;
  ctfChallenges: number;
  workshops: number;
  eventsConducted: number;
}

export interface SectionsVisibility {
  hero: boolean;
  about: boolean;
  domains: boolean;
  events: boolean;
  ctf: boolean;
  team: boolean;
  resources: boolean;
  achievements: boolean;
  join: boolean;
  faq: boolean;
  [key: string]: boolean;
}

export interface DomainItem {
  id: string;
  code: string;
  title: string;
  desc: string;
  tags: string[];
  icon: string;
}

export interface EventItem {
  id: string;
  title: string;
  type: string;
  status: 'Upcoming' | 'Completed' | string;
  date: string;
  venue: string;
  time: string;
  description: string;
  speakers: string;
  prerequisites: string;
  agenda: string;
}

export interface TeamMember {
  id: string;
  category: 'faculty' | 'student';
  name: string;
  role: string;
  spec: string;
  avatar?: string;
  email: string;
  linkedin: string;
  website: string;
  github: string;
  twitter: string;
}

export interface ResourceItem {
  id: string;
  cat: string;
  sub: string;
  title: string;
  desc: string;
  link: string;
}

export interface AchievementItem {
  id: string;
  year: string;
  icon: string;
  title: string;
  desc: string;
}

export interface ApplicationItem {
  id: string;
  name: string;
  email: string;
  roll: string;
  dept: string;
  domain: string;
  experience: string;
  message: string;
  submittedAt: string;
  status: 'Pending' | 'Reviewed' | 'Approved' | string;
}

export interface CTFConfig {
  headline: string;
  tagline: string;
  stats: {
    challengesCount: string;
    totalSolves: string;
    uptime: string;
  };
  categories: Array<{ name: string; count: string }>;
  miniChallenge: {
    title: string;
    payload: string;
    hint: string;
    acceptedFlags: string[];
  };
}

export interface SiteData {
  branding: Branding;
  stats: Stats;
  sectionsVisibility: SectionsVisibility;
  domains: DomainItem[];
  events: EventItem[];
  team: TeamMember[];
  ctfConfig: CTFConfig;
  resources: ResourceItem[];
  achievements: AchievementItem[];
  applications: ApplicationItem[];
  customSections?: any[];
}

export const STORAGE_KEY = 'CYBER_CUJ_SITE_DATA';
export const AUTH_KEY = 'CYBER_CUJ_ADMIN_AUTH';

export const DEFAULT_SITE_DATA: SiteData = {
  branding: {
    siteName: 'CYBER CUJ',
    orgName: 'Central University of Jammu',
    tagline: 'Learn. Hack. Defend.',
    subtitle: 'Cyber Security Club — Central University of Jammu',
    description:
      'The premier student-driven cybersecurity research and defense initiative at Central University of Jammu. We train elite ethical hackers, dominate national CTFs, conduct vulnerability research, and build resilient cyber defense systems.',
    defenseStatus: 'DEFCON 3 / ACTIVE',
    activeNodes: '450+ Operatives',
    campusSubnet: '10.32.0.0/16 CUJ',
    contactEmail: 'cyberclub@cuj.ac.in',
    campusAddress: 'Cyber Lab 3, Department of CS&IT, Central University of Jammu, Samba, J&K - 181143',
    whatsappJoinUrl: 'https://chat.whatsapp.com/DYOucc2Amn5LBPZqAg87v5?s=cl&p=a&mlu=4&ilr=4',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      discord: 'https://discord.com',
      whatsapp: 'https://chat.whatsapp.com/DYOucc2Amn5LBPZqAg87v5?s=cl&p=a&mlu=4&ilr=4'
    }
  },

  stats: {
    members: 450,
    ctfChallenges: 65,
    workshops: 40,
    eventsConducted: 20
  },

  sectionsVisibility: {
    hero: true,
    about: true,
    domains: true,
    events: true,
    ctf: true,
    team: true,
    resources: true,
    achievements: true,
    join: true,
    faq: true
  },

  domains: [
    {
      id: 'dom-1',
      code: 'DOM-01',
      title: 'Ethical Hacking',
      desc: 'Red team strategies, offensive exploit crafting, system privilege escalation, and testing security controls against advanced persistent threat (APT) tactics.',
      tags: ['Metasploit', 'Linux PrivEsc', 'Cobalt Strike', 'Shellcoding'],
      icon: 'terminal'
    },
    {
      id: 'dom-2',
      code: 'DOM-02',
      title: 'Penetration Testing',
      desc: 'Methodical vulnerability assessments, network perimeter pivoting, Active Directory exploitation, and generating professional remediation reports.',
      tags: ['Nmap', 'Nessus', 'BloodHound', 'OWASP Testing'],
      icon: 'crosshair'
    },
    {
      id: 'dom-3',
      code: 'DOM-03',
      title: 'Capture The Flag (CTF)',
      desc: 'Designing and solving complex Jeopardy-style and Attack-Defense challenges. Fostering out-of-the-box analytical thinking under timed tournament pressure.',
      tags: ['CTFd', 'Binary Pwn', 'Web Exploits', 'Speed Hacking'],
      icon: 'flag'
    },
    {
      id: 'dom-4',
      code: 'DOM-04',
      title: 'Digital Forensics & IR',
      desc: 'Extracting digital evidence, analyzing volatile memory dumps, tracing malware persistence artifacts, and reconstructing cyber crime timelines.',
      tags: ['Volatility 3', 'Autopsy', 'FTK Imager', 'Timeline Analysis'],
      icon: 'search'
    },
    {
      id: 'dom-5',
      code: 'DOM-05',
      title: 'Web Application Security',
      desc: 'Uncovering server-side and client-side flaws: SQL Injection, Cross-Site Scripting (XSS), SSRF, Broken Access Controls, and JWT exploitation.',
      tags: ['Burp Suite Pro', 'OWASP Top 10', 'SQLMap', 'API Security'],
      icon: 'globe'
    },
    {
      id: 'dom-6',
      code: 'DOM-06',
      title: 'Network Security & Sniffing',
      desc: 'Deep packet inspection, MITM analysis, firewall configuration, IDS/IPS rulesets, and securing campus communication architectures.',
      tags: ['Wireshark', 'Snort IDS', 'Zeek', 'TCP/IP Internals'],
      icon: 'server'
    },
    {
      id: 'dom-7',
      code: 'DOM-07',
      title: 'Applied Cryptography',
      desc: 'Analyzing symmetric & asymmetric ciphers, breaking flawed crypto implementations (RSA, AES, ECC), mathematical attacks, and hash cracking.',
      tags: ['Hashcat', 'SageMath', 'CyberChef', 'RSA / ECC Attacks'],
      icon: 'lock'
    },
    {
      id: 'dom-8',
      code: 'DOM-08',
      title: 'OSINT & Threat Intelligence',
      desc: 'Open-source intelligence gathering, geolocation verification, breach data analysis, dark web monitoring, and digital footprint profiling.',
      tags: ['Maltego', 'SpiderFoot', 'Shodan', 'Geo-Recon'],
      icon: 'eye'
    }
  ],

  events: [
    {
      id: 'cuj-ctf-2025',
      title: 'CUJ Cyber Sentinel CTF 2025',
      type: 'ctf',
      status: 'Upcoming',
      date: 'October 14–16, 2025',
      venue: 'Online & Campus Lab 3',
      time: '48-Hour Continuous Marathon',
      description:
        'Our flagship 48-hour Jeopardy-style Capture The Flag event featuring custom challenges in Web exploitation, Cryptography, Reverse Engineering, Forensics, and OSINT.',
      speakers: 'Organized by CYBER CUJ Red Team & Technical Leads',
      prerequisites: 'Open to all university students across India. Teams of 1–4 members.',
      agenda:
        'Kickoff & Keynote: Day 1 10:00 AM | Mid-way Hint Releases: Day 2 12:00 PM | Flag freeze & Prize distribution: Day 3 4:00 PM.'
    },
    {
      id: 'zeroday-workshop',
      title: 'Zero-Day Discovery & Binary Exploitation',
      type: 'workshop',
      status: 'Upcoming',
      date: 'November 05, 2025',
      venue: 'Seminar Hall B & Live Stream',
      time: '02:00 PM – 05:30 PM IST',
      description:
        'Deep dive into memory corruption, buffer overflows, ROP chains, and debugging binaries with GDB and Ghidra.',
      speakers: 'Dr. Faculty Advisor & External Security Researcher (CERT-In certified)',
      prerequisites: 'Basic knowledge of C/Assembly and Linux terminal.',
      agenda: 'Stack layout inspection, exploitation demos, hands-on lab sandbox challenges, live Q&A.'
    },
    {
      id: 'cyber-awareness-jk',
      title: 'Cyber Aware J&K: Campus Security Campaign',
      type: 'awareness',
      status: 'Upcoming',
      date: 'November 22, 2025',
      venue: 'CUJ Main Auditorium',
      time: '11:00 AM – 03:00 PM IST',
      description:
        'University-wide awareness initiative addressing social engineering, phishing, UPI fraud prevention, device hardening, and personal digital hygiene.',
      speakers: 'Cyber Cell Officers (J&K Police) & CYBER CUJ Mentors',
      prerequisites: 'Open to all faculties, staff, and students of Central University of Jammu.',
      agenda:
        'Live phishing demonstration, real-world case studies in Jammu & Kashmir, interactive defense quiz.'
    },
    {
      id: 'osint-masterclass',
      title: 'Digital Footprints & OSINT Investigation',
      type: 'seminar',
      status: 'Upcoming',
      date: 'December 08, 2025',
      venue: 'Virtual Room / Discord Stage',
      time: '06:00 PM – 08:00 PM IST',
      description:
        'Mastering open-source intelligence gathering, geolocation reconnaissance, metadata extraction, and footprint mitigation.',
      speakers: 'Invited Threat Intel Analyst',
      prerequisites: 'A modern web browser and OSINT toolset (SpiderFoot, Recon-ng, Maltego).',
      agenda: 'Image geolocation exercises, username pivots, breach dataset analysis, legal ethics boundaries.'
    },
    {
      id: 'national-hackathon-past',
      title: 'Inter-University Defensive Hackathon 2025',
      type: 'ctf',
      status: 'Completed',
      date: 'August 18–19, 2025',
      venue: 'Campus Cyber Lab 1',
      time: '24-Hour Hackathon',
      description:
        'Students built automated incident response scripts, SOC monitoring pipelines, and honey pots under simulated APT attack scenarios.',
      speakers: 'Mentored by Industry SOC Leads',
      prerequisites: 'Completed event with 120+ student participants.',
      agenda: 'Full attack simulations, detection engineering sprints, final prototype evaluations.'
    },
    {
      id: 'websec-bootcamp-past',
      title: 'OWASP Top 10 Hands-On Bootcamp',
      type: 'workshop',
      status: 'Completed',
      date: 'July 10, 2025',
      venue: 'Online Hands-on Lab',
      time: '04:00 PM – 07:00 PM IST',
      description:
        'Practical exploration of SQLi, SSRF, IDOR, and Broken Access Control using PortSwigger Web Security Academy labs.',
      speakers: 'CYBER CUJ Web Security Domain Leads',
      prerequisites: 'Archived session notes available in club repository.',
      agenda: 'Hands-on exploitation exercises, secure coding remediation patterns, lab solution walk-throughs.'
    }
  ],

  team: [
    {
      id: 'faculty-1',
      category: 'faculty',
      name: 'Dr. Faculty Advisor',
      role: 'Faculty Mentor & Research Advisor',
      spec: 'Assistant Professor, Department of Computer Science & IT, Central University of Jammu. Specialist in Cryptographic Protocols, Network Security, and Cloud Architecture.',
      avatar: '',
      email: 'advisor@cuj.ac.in',
      linkedin: 'https://linkedin.com',
      website: 'https://cuj.ac.in',
      github: '',
      twitter: ''
    },
    {
      id: 'lead-1',
      category: 'student',
      name: 'Club Lead Coordinator',
      role: 'President & Offensive Security Lead',
      spec: 'Final Year B.Tech / M.Tech CSE. Penetration testing enthusiast, CTF player, and infrastructure lead for CYBER CUJ lab sandboxes.',
      avatar: '',
      email: 'lead@cuj.ac.in',
      linkedin: 'https://linkedin.com',
      website: '',
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    },
    {
      id: 'lead-2',
      category: 'student',
      name: 'Vice President & CTF Lead',
      role: 'Forensics & Incident Response',
      spec: '3rd Year Computer Science. Memory forensics researcher with expertise in Volatility 3, Autopsy, and author of 20+ university CTF challenges.',
      avatar: '',
      email: 'ctf@cuj.ac.in',
      linkedin: 'https://linkedin.com',
      website: '',
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    },
    {
      id: 'lead-3',
      category: 'student',
      name: 'Web Sec & Cryptography Lead',
      role: 'Bug Bounty Hunter & Cryptanalyst',
      spec: '3rd Year IT. Active bug bounty hunter with Hall of Fame listings in major web assets, focusing on modern OAuth, JWT, and SSRF flaws.',
      avatar: '',
      email: 'websec@cuj.ac.in',
      linkedin: 'https://linkedin.com',
      website: '',
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    },
    {
      id: 'lead-4',
      category: 'student',
      name: 'Outreach & Events Lead',
      role: 'Community Manager & OSINT Lead',
      spec: '2nd Year CSE. Coordinates inter-college partnerships, state cyber awareness workshops, and spearheads open-source intelligence research.',
      avatar: '',
      email: 'outreach@cuj.ac.in',
      linkedin: 'https://linkedin.com',
      website: '',
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    }
  ],

  ctfConfig: {
    headline: 'Enter the CTF Arena',
    tagline:
      'Sharpen your offensive cyber skills in our custom-built competitive CTF platform. Solve cryptography puzzles, break web applications, inspect memory artifacts, and capture flags to climb the CUJ leaderboard.',
    stats: {
      challengesCount: '60+',
      totalSolves: '1,200+',
      uptime: '24/7'
    },
    categories: [
      { name: 'Web Exploitation', count: '18 Challenges' },
      { name: 'Cryptography', count: '14 Challenges' },
      { name: 'Digital Forensics', count: '12 Challenges' },
      { name: 'OSINT', count: '10 Challenges' },
      { name: 'Reverse Eng', count: '8 Challenges' },
      { name: 'Binary Pwn', count: '8 Challenges' }
    ],
    miniChallenge: {
      title: 'Intercepted Packet Stream [Crypto 101]',
      payload: 'Q1VKe3czbGMwbTNfdDBfY3VqX2N5YjNyXzRyM240fQ==',
      hint: '[HINT] Looks like standard Base64 encoding. You can use CyberChef, Python base64, or terminal command: echo "..." | base64 -d!',
      acceptedFlags: [
        'CUJ{w3lc0m3_t0_cuj_cyb3r_4r3n4}',
        'CUJ{learn_hack_defend}',
        'CUJ{central_uni_jammu_2025}',
        'CUJ{terminal_god_mode}'
      ]
    }
  },

  resources: [
    {
      id: 'res-1',
      cat: 'Linux & CLI',
      sub: 'Foundational',
      title: 'OverTheWire: Bandit Wargame',
      desc: 'Essential beginner wargame teaching core Linux command-line manipulation, SSH keys, file permissions, cronjobs, and basic shell navigation.',
      link: 'https://overthewire.org/wargames/bandit/'
    },
    {
      id: 'res-2',
      cat: 'Networking',
      sub: 'Packet Analysis',
      title: 'Wireshark Sample Captures & Filters',
      desc: 'Comprehensive PCAP repository and display filter cheat sheet for inspecting TCP handshakes, DNS anomalies, ARP poisoning, and TLS flows.',
      link: 'https://wiki.wireshark.org/SampleCaptures'
    },
    {
      id: 'res-3',
      cat: 'Web Security',
      sub: 'Offensive Web',
      title: 'PortSwigger Web Security Academy',
      desc: 'The industry standard free interactive training laboratory covering SQL injection, XSS, CSRF, server-side request forgery, and authentication bypasses.',
      link: 'https://portswigger.net/web-security'
    },
    {
      id: 'res-4',
      cat: 'Ethical Hacking',
      sub: 'PrivEsc & Red Team',
      title: 'PayloadsAllTheThings & GTFOBins',
      desc: 'Master cheat sheets for privilege escalation binaries on Unix systems, bypass techniques, reverse shell payloads, and penetration testing commands.',
      link: 'https://gtfobins.github.io/'
    },
    {
      id: 'res-5',
      cat: 'Cryptography',
      sub: 'Cryptanalysis',
      title: 'CryptoHack Platform & CyberChef',
      desc: 'Fun, interactive platform to break modern and classical ciphers including RSA, modular arithmetic, AES Galois modes, and Elliptic Curves.',
      link: 'https://cryptohack.org/'
    },
    {
      id: 'res-6',
      cat: 'Digital Forensics',
      sub: 'Incident Response',
      title: 'Volatility Foundation Memory Analysis',
      desc: 'Official guides and plugins for volatile RAM inspection. Extract active network connections, process injection DLLs, and dumped Windows SAM hashes.',
      link: 'https://github.com/volatilityfoundation/volatility3'
    },
    {
      id: 'res-7',
      cat: 'CTF Practice',
      sub: 'Arena Drills',
      title: 'picoCTF & CTFtime Event Calendar',
      desc: 'The beginner-friendly competitive platform picoCTF plus global rankings and upcoming tournament schedules tracked on CTFtime.',
      link: 'https://picoctf.org/'
    }
  ],

  achievements: [
    {
      id: 'ach-1',
      year: '2025 // TOURNAMENT',
      icon: 'trophy',
      title: 'Top 10 National CTF Finishes',
      desc: 'CYBER CUJ team secured Rank #7 out of 340+ university teams across India in the National Inter-University Cyber Challenge.'
    },
    {
      id: 'ach-2',
      year: '2025 // STATE RECOGNITION',
      icon: 'shield',
      title: 'Special Commendation: State Cyber Cell',
      desc: 'Recognized by Jammu & Kashmir Cyber Police for student-led digital safety outreach, educating 2,000+ citizens against phishing and UPI fraud.'
    },
    {
      id: 'ach-3',
      year: '2024–2025 // CERTIFICATIONS',
      icon: 'cert',
      title: '15+ Professional Certifications',
      desc: 'Active club members successfully certified in CompTIA Security+, Certified Ethical Hacker (CEH), eJPT, and OSCP through club mentorship cohorts.'
    },
    {
      id: 'ach-4',
      year: '2024 // HACKATHON',
      icon: 'star',
      title: '1st Place: Northern Hack-Defense 2024',
      desc: 'Designed an open-source real-time DNS exfiltration detection agent, awarded 1st place and Best Innovation Trophy at Northern Regional Tech Fest.'
    }
  ],

  applications: [
    {
      id: 'app-init-1',
      name: 'Sahil Verma',
      email: 'sahil.v@cuj.ac.in',
      roll: 'CUJ2024CSE019',
      dept: 'Computer Science & IT (2nd Year)',
      domain: 'Ethical Hacking',
      experience: 'Intermediate',
      message: 'Experienced with Linux and TryHackMe. Keen to join red team CTF group.',
      submittedAt: '2026-09-02 14:32',
      status: 'Pending'
    },
    {
      id: 'app-init-2',
      name: 'Mehak Sharma',
      email: 'mehak.s@cuj.ac.in',
      roll: 'CUJ2025IT042',
      dept: 'Computer Science & IT (1st Year)',
      domain: 'Digital Forensics',
      experience: 'Beginner',
      message: 'Passionate about cyber forensics and OSINT investigations. Want to learn Autopsy.',
      submittedAt: '2026-09-03 09:15',
      status: 'Reviewed'
    }
  ],

  customSections: []
};

export const SiteDataStorage = {
  get(): SiteData {
    if (typeof window === 'undefined') return DEFAULT_SITE_DATA;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.save(DEFAULT_SITE_DATA);
        return JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
      }
      const data: SiteData = JSON.parse(stored);

      let mutated = false;
      const collections: (keyof SiteData)[] = [
        'domains',
        'events',
        'team',
        'resources',
        'achievements',
        'applications'
      ];
      collections.forEach((col) => {
        if (!Array.isArray(data[col])) {
          (data[col] as any) = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA[col] || []));
          mutated = true;
        }
      });

      if (!data.branding || typeof data.branding !== 'object') {
        data.branding = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA.branding));
        mutated = true;
      } else {
        (Object.keys(DEFAULT_SITE_DATA.branding) as (keyof Branding)[]).forEach((k) => {
          if (data.branding[k] === undefined) {
            (data.branding as any)[k] = DEFAULT_SITE_DATA.branding[k];
            mutated = true;
          }
        });
      }

      if (!data.branding.whatsappJoinUrl) {
        data.branding.whatsappJoinUrl = DEFAULT_SITE_DATA.branding.whatsappJoinUrl;
        mutated = true;
      }

      if (!data.stats || typeof data.stats !== 'object') {
        data.stats = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA.stats));
        mutated = true;
      }

      if (!data.sectionsVisibility || typeof data.sectionsVisibility !== 'object') {
        data.sectionsVisibility = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA.sectionsVisibility));
        mutated = true;
      }

      if (!data.ctfConfig || typeof data.ctfConfig !== 'object') {
        data.ctfConfig = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA.ctfConfig));
        mutated = true;
      }

      if (mutated) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (_) {}
      }

      return data;
    } catch (e) {
      console.error('Error reading SiteData from localStorage', e);
      return JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
    }
  },

  save(data: SiteData): boolean {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('siteDataUpdated', { detail: data }));
      return true;
    } catch (e) {
      console.error('Error saving SiteData to localStorage', e);
      return false;
    }
  },

  reset(): boolean {
    return this.save(DEFAULT_SITE_DATA);
  },

  exportJSON() {
    if (typeof window === 'undefined') return;
    const data = this.get();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber_cuj_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importJSON(jsonString: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.branding && parsed.events) {
        this.save(parsed);
        return { success: true };
      }
      return { success: false, error: 'Invalid site data structure' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  addApplication(appData: Omit<ApplicationItem, 'id' | 'submittedAt' | 'status'>): ApplicationItem {
    const data = this.get();
    if (!data.applications) data.applications = [];
    const newApp: ApplicationItem = {
      ...appData,
      id: 'app-' + Date.now(),
      submittedAt: new Date().toLocaleString(),
      status: 'Pending'
    };
    data.applications.unshift(newApp);
    this.save(data);
    return newApp;
  }
};

/**
 * React Hook for consuming & reacting to SiteData updates
 */
export function useSiteData() {
  const [data, setData] = useState<SiteData>(DEFAULT_SITE_DATA);
  const [mounted, setMounted] = useState<boolean>(false);

  const refresh = useCallback(() => {
    setData(SiteDataStorage.get());
  }, []);

  useEffect(() => {
    setMounted(true);
    refresh();

    const handleUpdate = () => refresh();
    window.addEventListener('siteDataUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('siteDataUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refresh]);

  const updateData = useCallback((newData: SiteData) => {
    SiteDataStorage.save(newData);
    setData(newData);
  }, []);

  return { data, updateData, refresh, mounted };
}
