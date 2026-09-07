/**
 * CYBER CUJ — Central Site Data & CMS State Management
 * Provides shared persistence between the public website and the Administrator CMS.
 */

const STORAGE_KEY = 'CYBER_CUJ_SITE_DATA';
const AUTH_KEY = 'CYBER_CUJ_ADMIN_AUTH';

const DEFAULT_SITE_DATA = {
  branding: {
    siteName: 'CYBER CUJ',
    orgName: 'Central University of Jammu',
    tagline: 'Learn. Hack. Defend.',
    subtitle: 'Cyber Security Club — Central University of Jammu',
    description: 'The premier student-driven cybersecurity research and defense initiative at Central University of Jammu. We train elite ethical hackers, dominate national CTFs, conduct vulnerability research, and build resilient cyber defense systems.',
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
      id: 'HackCyros 4.0',
      title: 'CUJ Cyber Sentinel CTF 2026',
      type: 'ctf',
      status: 'Upcoming',
      date: 'September 15–16',
      venue: 'Online & Campus Lab 3',
      time: '48-Hour Continuous Marathon',
      description: 'Our flagship 48-hour Jeopardy-style Capture The Flag event featuring custom challenges in Web exploitation, Cryptography, Reverse Engineering, Forensics, and OSINT.',
      speakers: 'Organized by CYBER CUJ Red Team & Technical Leads',
      prerequisites: 'Open to all university students across India. Teams of 1–4 members.',
      agenda: 'Kickoff & Keynote: Day 1 10:00 AM | Mid-way Hint Releases: Day 2 12:00 PM | Flag freeze & Prize distribution: Day 3 4:00 PM.'
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
    }

  ],

  ctfConfig: {
    headline: 'Enter the CTF Arena',
    tagline: 'Sharpen your offensive cyber skills in our custom-built competitive CTF platform. Solve cryptography puzzles, break web applications, inspect memory artifacts, and capture flags to climb the CUJ leaderboard.',
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

// Global Store Helper
window.SiteData = {
  get: function() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.save(DEFAULT_SITE_DATA);
        return JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
      }
      const data = JSON.parse(stored);

      // Auto-reconcile & migrate any missing collections or settings
      let mutated = false;

      const collections = ['domains', 'events', 'team', 'resources', 'achievements', 'applications'];
      collections.forEach(col => {
        if (!Array.isArray(data[col])) {
          data[col] = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA[col] || []));
          mutated = true;
        }
      });

      if (Array.isArray(data.achievements)) {
        const hasMockAchievements = data.achievements.some(a =>
          ['ach-1', 'ach-2', 'ach-3', 'ach-4'].includes(a.id)
        );
        if (hasMockAchievements) {
          data.achievements = data.achievements.filter(a =>
            !['ach-1', 'ach-2', 'ach-3', 'ach-4'].includes(a.id)
          );
          mutated = true;
        }
      }

      if (!data.branding || typeof data.branding !== 'object') {
        data.branding = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA.branding));
        mutated = true;
      } else {
        Object.keys(DEFAULT_SITE_DATA.branding).forEach(k => {
          if (data.branding[k] === undefined) {
            data.branding[k] = DEFAULT_SITE_DATA.branding[k];
            mutated = true;
          }
        });
      }

      if (!data.branding.whatsappJoinUrl) {
        data.branding.whatsappJoinUrl = DEFAULT_SITE_DATA.branding.whatsappJoinUrl;
        mutated = true;
      }
      if (!data.branding.socials) {
        data.branding.socials = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA.branding.socials));
        mutated = true;
      } else if (!data.branding.socials.whatsapp) {
        data.branding.socials.whatsapp = DEFAULT_SITE_DATA.branding.socials.whatsapp;
        mutated = true;
      }

      if (!data.stats || typeof data.stats !== 'object') {
        data.stats = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA.stats));
        mutated = true;
      }

      if (!data.sectionsVisibility || typeof data.sectionsVisibility !== 'object') {
        data.sectionsVisibility = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA.sectionsVisibility));
        mutated = true;
      } else {
        Object.keys(DEFAULT_SITE_DATA.sectionsVisibility).forEach(k => {
          if (data.sectionsVisibility[k] === undefined) {
            data.sectionsVisibility[k] = DEFAULT_SITE_DATA.sectionsVisibility[k];
            mutated = true;
          }
        });
      }

      if (!data.ctfConfig || typeof data.ctfConfig !== 'object') {
        data.ctfConfig = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA.ctfConfig));
        mutated = true;
      }

      if (mutated) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (err) {}
      }

      return data;
    } catch (e) {
      console.error('Error reading SiteData from localStorage', e);
      return JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
    }
  },

  save: function(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('siteDataUpdated', { detail: data }));
      return true;
    } catch (e) {
      console.error('Error saving SiteData to localStorage', e);
      return false;
    }
  },

  reset: function() {
    return this.save(DEFAULT_SITE_DATA);
  },

  exportJSON: function() {
    const data = this.get();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber_cuj_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importJSON: function(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.branding && parsed.events) {
        this.save(parsed);
        return { success: true };
      }
      return { success: false, error: 'Invalid site data structure' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  addApplication: function(appData) {
    const data = this.get();
    if (!data.applications) data.applications = [];
    appData.id = 'app-' + Date.now();
    appData.submittedAt = new Date().toLocaleString();
    appData.status = 'Pending';
    data.applications.unshift(appData);
    this.save(data);
    return appData;
  }
};
