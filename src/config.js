export const site = {
  name: import.meta.env.VITE_SITE_NAME || 'ABHISHEKK',
  eyebrow: 'Digital craft is loading',
  launchDate: import.meta.env.VITE_LAUNCH_DATE || '2026-08-01T20:00:00+05:30',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'mail-hello@abhishekk.me',
  social: {
    instagram: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/pr1mebusiness1511',
    x: import.meta.env.VITE_X_URL || 'https://x.com/pr1mebusiness1511',
    github: import.meta.env.VITE_GITHUB_URL || 'https://github.com/Pr1MeOG',
    linkedin: import.meta.env.VITE_LINKEDIN_URL || 'https://linkedin.com',
  },
};

export const services = [
  {
    title: 'Full-stack builds',
    copy: 'Fast websites, creator platforms, dashboards, launch pages, and web apps that look custom instead of template-made.',
    tag: 'Dev',
  },
  {
    title: 'Creator management',
    copy: 'Brand-ready positioning, collaboration systems, Discord/community structure, sponsor flow, and creator operations.',
    tag: 'Management',
  },
  {
    title: 'Partner campaigns',
    copy: 'Clean launch concepts, conversion-focused pages, campaign assets, and creator-led growth experiments.',
    tag: 'Growth',
  },
];

export const rosterPreview = [
  'Creator portfolio hub',
  'Brand partnership pipeline',
  'Case-study wall',
  'Private creator roster',
];
