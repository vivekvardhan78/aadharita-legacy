// LocalStorage CMS Manager for AADHRITA 2026

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  rules: string[];
  date: string;
  time: string;
  posterUrl: string;
  category: string;
  logoUrl?: string;
  accentColor?: string;
  registrationUrl?: string;
  faqs?: FAQ[];
}

export interface AadhritaBranding {
  logoUrl: string;
  glowColor: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

export interface HeroContent {
  festName: string;
  tagline: string;
  date: string;
  venue: string;
  logoUrl: string;
}

export interface AboutContent {
  description: string;
  mission: string;
  vision: string;
  highlights: string[];
}

export interface CollegeBranding {
  collegeName: string;
  location: string;
  logoUrl: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  category: 'Title' | 'Gold' | 'Silver' | 'Supporter';
  websiteUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  phone: string;
  photoUrl: string;
  type: 'student' | 'faculty';
}

export interface SiteSettings {
  heroContent: HeroContent;
  aboutContent: AboutContent;
  collegeBranding: CollegeBranding;
  aadhritaBranding: AadhritaBranding;
}

const STORAGE_KEYS = {
  EVENTS: 'aadhrita_events',
  ANNOUNCEMENTS: 'aadhrita_announcements',
  GALLERY: 'aadhrita_gallery',
  SETTINGS: 'aadhrita_settings',
  SPONSORS: 'aadhrita_sponsors',
  TEAM: 'aadhrita_team',
  ADMIN_SESSION: 'aadhrita_admin_session',
};

const ADMIN_PASSWORD = 'aadhrita2026admin';

// Default data
const defaultHeroContent: HeroContent = {
  festName: 'AADHRITA – 2026',
  tagline: 'Where Innovation Meets Excellence',
  date: 'March 15-17, 2026',
  venue: 'National Institute of Technology, Delhi',
  logoUrl: '',
};

const defaultAboutContent: AboutContent = {
  description: 'AADHRITA 2026 is the flagship national-level technical fest that brings together the brightest minds from across the country. Experience three days of intense competition, learning, and networking.',
  mission: 'To foster innovation, creativity, and technical excellence among students while providing a platform for showcasing cutting-edge technologies.',
  vision: 'To become the premier technical fest in India, inspiring the next generation of engineers, scientists, and innovators.',
  highlights: [
    '50+ Technical Events',
    '100+ Colleges Participating',
    '₹10 Lakh Prize Pool',
    '3 Days of Innovation',
  ],
};

const defaultCollegeBranding: CollegeBranding = {
  collegeName: 'Maharaj Vijayaram Gajapathi Raj College of Engineering',
  location: 'Vizianagaram, Andhra Pradesh',
  logoUrl: '',
};

const defaultAadhritaBranding: AadhritaBranding = {
  logoUrl: '',
  glowColor: '#ef4444',
};

const defaultEvents: Event[] = [
  {
    id: '1',
    name: 'CodeStorm',
    description: 'An intense 24-hour hackathon where teams compete to build innovative solutions for real-world problems.',
    rules: ['Team size: 2-4 members', 'Bring your own laptops', 'No pre-written code allowed', 'Internet access provided'],
    date: 'March 15, 2026',
    time: '10:00 AM',
    posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    category: 'Coding',
    logoUrl: '',
    accentColor: '#00d4ff',
    registrationUrl: 'https://forms.google.com',
    faqs: [
      { id: '1', question: 'Can we use AI tools like GitHub Copilot?', answer: 'Yes, AI-assisted coding tools are allowed. However, the core logic must be original work.' },
      { id: '2', question: 'Is prior registration mandatory?', answer: 'Yes, teams must register at least 48 hours before the event starts.' },
      { id: '3', question: 'What happens if a team member drops out?', answer: 'Teams can continue with remaining members, but no replacements allowed after registration closes.' },
    ],
  },
  {
    id: '2',
    name: 'RoboWars',
    description: 'Battle robots clash in an arena of destruction. Design, build, and fight your way to victory.',
    rules: ['Robot weight limit: 15kg', 'No weapons causing fire', 'Remote controlled only', 'Safety gear mandatory'],
    date: 'March 16, 2026',
    time: '2:00 PM',
    posterUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    category: 'Robotics',
    logoUrl: '',
    accentColor: '#a855f7',
    registrationUrl: 'https://forms.google.com',
    faqs: [
      { id: '1', question: 'Can we bring pre-built robots?', answer: 'Yes, robots can be pre-built. On-site modifications are allowed during pit time.' },
      { id: '2', question: 'What power sources are allowed?', answer: 'Only battery-powered robots. Maximum voltage is 24V DC.' },
    ],
  },
  {
    id: '3',
    name: 'TechQuiz',
    description: 'Test your knowledge across domains - from quantum computing to ancient algorithms.',
    rules: ['Individual participation', 'Multiple elimination rounds', 'No electronic devices', 'Time-bound answers'],
    date: 'March 15, 2026',
    time: '3:00 PM',
    posterUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    category: 'Quiz',
    logoUrl: '',
    accentColor: '#22c55e',
    registrationUrl: 'https://forms.google.com',
    faqs: [
      { id: '1', question: 'What topics will be covered?', answer: 'Computer Science, Electronics, Physics, Mathematics, and General Tech Awareness.' },
      { id: '2', question: 'How many rounds are there?', answer: 'Three rounds: Prelims (written), Semi-finals (buzzer), and Finals (rapid-fire).' },
    ],
  },
  {
    id: '4',
    name: 'DesignX',
    description: 'Showcase your UI/UX skills by designing solutions that are both beautiful and functional.',
    rules: ['Solo or duo participation', 'Figma/Adobe XD allowed', 'Theme revealed on spot', '4-hour duration'],
    date: 'March 16, 2026',
    time: '10:00 AM',
    posterUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    category: 'Design',
    logoUrl: '',
    accentColor: '#f59e0b',
    registrationUrl: 'https://forms.google.com',
    faqs: [
      { id: '1', question: 'Can we use design templates?', answer: 'UI kits are allowed, but the design concept must be original.' },
      { id: '2', question: 'Will we have internet access?', answer: 'Yes, for downloading assets and references only.' },
    ],
  },
  {
    id: '5',
    name: 'CryptoHunt',
    description: 'Decode ciphers, crack puzzles, and hunt for the ultimate treasure in this cryptography challenge.',
    rules: ['Team size: 3-5 members', 'Clues given at checkpoints', 'No internet allowed', 'Physical and digital challenges'],
    date: 'March 17, 2026',
    time: '11:00 AM',
    posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    category: 'Puzzle',
    logoUrl: '',
    accentColor: '#ec4899',
    registrationUrl: 'https://forms.google.com',
    faqs: [
      { id: '1', question: 'What kind of puzzles can we expect?', answer: 'A mix of cryptographic ciphers, logic puzzles, and physical treasure hunt clues.' },
    ],
  },
  {
    id: '6',
    name: 'AI Summit',
    description: 'Present your AI/ML projects and compete for the best innovation in artificial intelligence.',
    rules: ['Working prototype required', 'Individual or team', '10-minute presentation', 'Q&A session follows'],
    date: 'March 17, 2026',
    time: '9:00 AM',
    posterUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    category: 'AI/ML',
    logoUrl: '',
    accentColor: '#06b6d4',
    registrationUrl: 'https://forms.google.com',
    faqs: [
      { id: '1', question: 'Can we use pre-trained models?', answer: 'Yes, but you must clearly mention what models you used and your contributions.' },
      { id: '2', question: 'Is there a theme for projects?', answer: 'The theme will be announced one week before the event on the announcements page.' },
    ],
  },
];

const defaultAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Early Bird Registration Open!',
    content: 'Register before February 28th and get 30% off on all events. Limited slots available!',
    date: '2026-01-15',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Workshop Series Announced',
    content: 'Join our pre-fest workshops on AI, Blockchain, and Cloud Computing starting February 1st.',
    date: '2026-01-20',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Accommodation Available',
    content: 'On-campus accommodation now available for outstation participants. Book your stay today!',
    date: '2026-01-25',
    priority: 'low',
  },
];

const defaultGallery: GalleryImage[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', caption: 'Opening Ceremony 2025' },
  { id: '2', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', caption: 'Hackathon Arena' },
  { id: '3', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800', caption: 'Tech Talks Session' },
  { id: '4', url: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800', caption: 'Robotics Workshop' },
  { id: '5', url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800', caption: 'Prize Distribution' },
  { id: '6', url: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800', caption: 'Cultural Night' },
];

const defaultSponsors: Sponsor[] = [
  { id: '1', name: 'TechCorp India', logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400', category: 'Title', websiteUrl: 'https://example.com' },
  { id: '2', name: 'InnovateLabs', logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400', category: 'Gold', websiteUrl: 'https://example.com' },
  { id: '3', name: 'FutureTech Solutions', logoUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400', category: 'Gold', websiteUrl: 'https://example.com' },
  { id: '4', name: 'ByteWise', logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', category: 'Silver', websiteUrl: 'https://example.com' },
  { id: '5', name: 'CloudNine Systems', logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400', category: 'Silver', websiteUrl: 'https://example.com' },
  { id: '6', name: 'StartupHub', logoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400', category: 'Supporter', websiteUrl: 'https://example.com' },
];

const defaultTeam: TeamMember[] = [
  { id: '1', name: 'Rahul Sharma', role: 'Chief Coordinator', phone: '+91 98765 43210', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', type: 'student' },
  { id: '2', name: 'Priya Reddy', role: 'Technical Head', phone: '+91 98765 43211', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', type: 'student' },
  { id: '3', name: 'Arun Kumar', role: 'Events Coordinator', phone: '+91 98765 43212', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', type: 'student' },
  { id: '4', name: 'Sneha Patel', role: 'Marketing Head', phone: '+91 98765 43213', photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', type: 'student' },
  { id: '5', name: 'Dr. K. Ramesh', role: 'Faculty Advisor', department: 'Computer Science', phone: '+91 98765 43214', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', type: 'faculty' },
  { id: '6', name: 'Prof. S. Lakshmi', role: 'Technical Advisor', department: 'Electronics', phone: '+91 98765 43215', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400', type: 'faculty' },
];

// Initialize storage with default data if empty
export const initializeStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(defaultEvents));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(defaultAnnouncements));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(defaultGallery));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SPONSORS)) {
    localStorage.setItem(STORAGE_KEYS.SPONSORS, JSON.stringify(defaultSponsors));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TEAM)) {
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(defaultTeam));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
      heroContent: defaultHeroContent,
      aboutContent: defaultAboutContent,
      collegeBranding: defaultCollegeBranding,
      aadhritaBranding: defaultAadhritaBranding,
    }));
  }
};

// Events CRUD
export const getEvents = (): Event[] => {
  const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
  return data ? JSON.parse(data) : defaultEvents;
};

export const saveEvents = (events: Event[]): void => {
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
};

export const addEvent = (event: Omit<Event, 'id'>): Event => {
  const events = getEvents();
  const newEvent = { ...event, id: Date.now().toString() };
  events.push(newEvent);
  saveEvents(events);
  return newEvent;
};

export const updateEvent = (id: string, updates: Partial<Event>): void => {
  const events = getEvents();
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...updates };
    saveEvents(events);
  }
};

export const deleteEvent = (id: string): void => {
  const events = getEvents().filter(e => e.id !== id);
  saveEvents(events);
};

// Announcements CRUD
export const getAnnouncements = (): Announcement[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
  return data ? JSON.parse(data) : defaultAnnouncements;
};

export const saveAnnouncements = (announcements: Announcement[]): void => {
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
};

export const addAnnouncement = (announcement: Omit<Announcement, 'id'>): Announcement => {
  const announcements = getAnnouncements();
  const newAnnouncement = { ...announcement, id: Date.now().toString() };
  announcements.unshift(newAnnouncement);
  saveAnnouncements(announcements);
  return newAnnouncement;
};

export const deleteAnnouncement = (id: string): void => {
  const announcements = getAnnouncements().filter(a => a.id !== id);
  saveAnnouncements(announcements);
};

// Gallery CRUD
export const getGallery = (): GalleryImage[] => {
  const data = localStorage.getItem(STORAGE_KEYS.GALLERY);
  return data ? JSON.parse(data) : defaultGallery;
};

export const saveGallery = (gallery: GalleryImage[]): void => {
  localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
};

export const addGalleryImage = (image: Omit<GalleryImage, 'id'>): GalleryImage => {
  const gallery = getGallery();
  const newImage = { ...image, id: Date.now().toString() };
  gallery.push(newImage);
  saveGallery(gallery);
  return newImage;
};

export const deleteGalleryImage = (id: string): void => {
  const gallery = getGallery().filter(i => i.id !== id);
  saveGallery(gallery);
};

// Sponsors CRUD
export const getSponsors = (): Sponsor[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SPONSORS);
  return data ? JSON.parse(data) : defaultSponsors;
};

export const saveSponsors = (sponsors: Sponsor[]): void => {
  localStorage.setItem(STORAGE_KEYS.SPONSORS, JSON.stringify(sponsors));
};

export const addSponsor = (sponsor: Omit<Sponsor, 'id'>): Sponsor => {
  const sponsors = getSponsors();
  const newSponsor = { ...sponsor, id: Date.now().toString() };
  sponsors.push(newSponsor);
  saveSponsors(sponsors);
  return newSponsor;
};

export const deleteSponsor = (id: string): void => {
  const sponsors = getSponsors().filter(s => s.id !== id);
  saveSponsors(sponsors);
};

// Team CRUD
export const getTeam = (): TeamMember[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TEAM);
  return data ? JSON.parse(data) : defaultTeam;
};

export const saveTeam = (team: TeamMember[]): void => {
  localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(team));
};

export const addTeamMember = (member: Omit<TeamMember, 'id'>): TeamMember => {
  const team = getTeam();
  const newMember = { ...member, id: Date.now().toString() };
  team.push(newMember);
  saveTeam(team);
  return newMember;
};

export const deleteTeamMember = (id: string): void => {
  const team = getTeam().filter(m => m.id !== id);
  saveTeam(team);
};

// Settings
export const getSettings = (): SiteSettings => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : {
    heroContent: defaultHeroContent,
    aboutContent: defaultAboutContent,
    collegeBranding: defaultCollegeBranding,
    aadhritaBranding: defaultAadhritaBranding,
  };
};

export const saveSettings = (settings: SiteSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

export const updateHeroContent = (hero: HeroContent): void => {
  const settings = getSettings();
  settings.heroContent = hero;
  saveSettings(settings);
};

export const updateAboutContent = (about: AboutContent): void => {
  const settings = getSettings();
  settings.aboutContent = about;
  saveSettings(settings);
};

export const updateCollegeBranding = (branding: CollegeBranding): void => {
  const settings = getSettings();
  settings.collegeBranding = branding;
  saveSettings(settings);
};

export const getCollegeBranding = (): CollegeBranding => {
  const settings = getSettings();
  return settings.collegeBranding || defaultCollegeBranding;
};

export const getAadhritaBranding = (): AadhritaBranding => {
  const settings = getSettings();
  return settings.aadhritaBranding || defaultAadhritaBranding;
};

export const updateAadhritaBranding = (branding: AadhritaBranding): void => {
  const settings = getSettings();
  settings.aadhritaBranding = branding;
  saveSettings(settings);
};

// Admin Authentication
export const adminLogin = (password: string): boolean => {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'authenticated');
    return true;
  }
  return false;
};

export const adminLogout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
};

export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'authenticated';
};
