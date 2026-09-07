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
    defenseStatus: 'ACTIVE',
    activeNodes: '100+ Operatives',
    campusSubnet: '10.32.0.0/16 CUJ',
    contactEmail: 'cyberclub@cuj.ac.in',
    campusAddress: 'Department of CS&IT, Central University of Jammu, Samba, J&K - 181143',
    whatsappJoinUrl: 'https://chat.whatsapp.com/DYOucc2Amn5LBPZqAg87v5?s=cl&p=a&mlu=4&ilr=4',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://www.linkedin.com/company/cybercuj/posts/?feedView=all',
      twitter: 'https://twitter.com',
      discord: 'https://discord.com',
      whatsapp: 'https://chat.whatsapp.com/DYOucc2Amn5LBPZqAg87v5?s=cl&p=a&mlu=4&ilr=4'
    }
  },

  stats: {
    members: 250,
    ctfChallenges: 70,
    workshops: 1,
    eventsConducted: 4
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
      id: 'hackcyros-4',
      title: 'Hackcyros 4.0',
      type: 'ctf',
      status: 'Upcoming',
      date: 'September 2026',
      venue: 'Online & Campus Lab 3, CUJ',
      time: '12-Hour Continuous Marathon',
      description: 'The flagship 4th edition of Hackcyros. National Jeopardy & Attack-Defense CTF featuring custom-crafted challenges across Web, Cryptography, Reverse Engineering, Forensics, and OSINT.',
      speakers: 'CYBER CUJ Red Team & Faculty Mentors',
      prerequisites: 'Open to all university students across India. Teams of 1–4 members.',
      agenda: 'Kickoff & Keynote: Day 1 10:00 AM | Challenge Releases & Hint Drops | Live Leaderboard Freeze | Prize Distribution & Valedictory.'
    },
    {
      id: 'hackcyros-1',
      title: 'Hackcyros 1.0',
      type: 'ctf',
      status: 'Closed',
      date: 'September 2025',
      venue: 'Online & Campus Lab 3',
      time: '12-Hour Marathon',
      description: 'The inaugural chapter of CYBER CUJ flagship CTF competition. Featured foundational challenges in Web Exploitation, Cryptography, Linux internals, and Network Forensics.',
      speakers: 'Organized by CYBER CUJ Technical Committee',
      prerequisites: 'Open to university students across India.',
      agenda: 'Kickoff & Keynote | Challenge Release | Flag Validation | Valedictory & Award Felicitations.'
    },
    {
      id: 'hackcyros-2',
      title: 'Hackcyros 2.0',
      type: 'ctf',
      status: 'Closed',
      date: 'April 2026',
      venue: 'Online',
      time: '12-Hour Continuous Marathon',
      description: 'The second edition of Hackcyros featuring expanded challenge categories: Binary Exploitation, Reverse Engineering, Steganography, and Volatile Memory Forensics.',
      speakers: 'CYBER CUJ Core Technical Leads',
      prerequisites: 'Open to undergraduate and postgraduate students.',
      agenda: 'Inaugural Keynote | CTFd Platform Activation | Live Hint Broadcasts | Final Score Freeze & Prize Distribution.'
    },
    {
      id: 'hackcyros-3',
      title: 'Hackcyros 3.0',
      type: 'ctf',
      status: 'Closed',
      date: 'November 2026',
      venue: 'Online & Campus Lab 3',
      time: '12-Hour CTF',
      description: 'The third edition of Hackcyros featuring advanced dual-track operations: Network Pivoting, Active Directory Exploitation, and Applied Cryptography puzzles.',
      speakers: 'Faculty Mentors & Senior Student Operatives',
      prerequisites: 'Teams of 1–4 members from colleges across India.',
      agenda: 'Opening Ceremony | 12-Hour Continuous CTF | Defense Solution Demonstrations | Closing & Winners Felicitations.'
    }
  ],

  team: [
    {
      id: 'faculty-maan',
      category: 'faculty',
      name: 'Prof. Palvinder Singh Maan',
      role: 'Professor',
      spec: 'Department of Computer Engineering, Central University of Jammu',
      avatar: '',
      email: '',
      linkedin: '',
      website: 'https://cujammu.ac.in',
      github: '',
      twitter: ''
    },
    {
      id: 'faculty-jasvinder',
      category: 'faculty',
      name: 'Dr. Jasvinder Pal Singh',
      role: 'Assistant Professor',
      spec: 'Department of Computer Engineering, Central University of Jammu',
      avatar: '',
      email: '',
      linkedin: 'https://www.linkedin.com/in/dr-jasvinder-pal-singh-b8028938/',
      website: 'https://cujammu.ac.in',
      github: '',
      twitter: ''
    },
    {
      id: 'faculty-pankaj',
      category: 'faculty',
      name: 'Pankaj Choudhary',
      role: 'Assistant Professor',
      spec: 'Department of Computer Engineering, Central University of Jammu',
      avatar: '',
      email: '',
      linkedin: 'https://www.linkedin.com/in/cyberpankaj96/',
      website: 'https://cujammu.ac.in',
      github: '',
      twitter: ''
    },
    {
      id: 'faculty-zakir',
      category: 'faculty',
      name: 'Zakir Ahmad Sheikh',
      role: 'Assistant Professor',
      spec: 'Department of Computer Engineering, Central University of Jammu',
      avatar: '',
      email: '',
      linkedin: 'https://www.linkedin.com/in/zakirahmadsheikh/',
      website: 'https://cujammu.ac.in',
      github: '',
      twitter: ''
    },
    {
      id: 'lead-1',
      category: 'student',
      name: 'Sukhvinder Singh',
      role: 'President',
      spec: '3rd Year B.Tech CSE(Cyber Security). Penetration testing enthusiast, CTF player, and infrastructure lead for CYBER CUJ lab sandboxes.',
      avatar: '',
      email: 'sukhvinderdhiman@gmail.com',
      linkedin: 'https://www.linkedin.com/in/sukhvinder-singh-179bbb330/',
      website: '',
      github: 'https://github.com/root-ninja',
      twitter: 'https://twitter.com'
    },
    {
      id: 'lead-2',
      category: 'student',
      name: 'Vice President',
      role: 'Vice President',
      spec: '3rd Year Computer Science. Memory forensics researcher with expertise in Volatility 3, Autopsy, and author of 20+ university CTF challenges.',
      avatar: '',
      email: 'ctf@cuj.ac.in',
      linkedin: 'https://linkedin.com',
      website: '',
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    },

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

  achievements: [],

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
    if (typeof window !== 'undefined') {
      try {
        // Clear any old admin cache so edits in site-data.ts always take immediate effect
        localStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
    }
    return DEFAULT_SITE_DATA;
  },

  save(data: SiteData): boolean {
    return true;
  },

  reset(): boolean {
    return true;
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
    return { success: true };
  },

  addApplication(appData: Omit<ApplicationItem, 'id' | 'submittedAt' | 'status'>): ApplicationItem {
    const newApp: ApplicationItem = {
      ...appData,
      id: 'app-' + Date.now(),
      submittedAt: new Date().toLocaleString(),
      status: 'Pending'
    };
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('CYBER_CUJ_APPLICATIONS');
        const apps = stored ? JSON.parse(stored) : [];
        apps.unshift(newApp);
        localStorage.setItem('CYBER_CUJ_APPLICATIONS', JSON.stringify(apps));
      } catch (_) {}
    }
    return newApp;
  }
};

/**
 * React Hook for consuming SiteData
 */
export function useSiteData() {
  const [data, setData] = useState<SiteData>(DEFAULT_SITE_DATA);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
    }
  }, []);

  const refresh = useCallback(() => {
    setData(DEFAULT_SITE_DATA);
  }, []);

  const updateData = useCallback((newData: SiteData) => {
    setData(newData);
  }, []);

  return { data, updateData, refresh, mounted };
}
