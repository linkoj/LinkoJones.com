// All copy + case-study data for Linko Jones (Samuel Olutola).
// Sourced from his 2025 CV / UX portfolio. Edit here to update the site.

export const PROFILE = {
  name: 'Linko Jones',
  role: 'Senior UX Designer · UX Consultant',
  tagline: 'Creative thinking meets technical craft — for products people actually find usable.',
  location: 'Kingswood, Surrey · London',
  email: 'info@linkojones.com',
  availability: 'Available for senior & lead UX roles',
  links: [
    { label: 'LinkedIn', href: 'https://uk.linkedin.com/in/linkojones' },
    { label: 'linkojones.com', href: 'https://linkojones.com' },
    { label: 'Email', href: 'mailto:info@linkojones.com' },
  ],
};

const CASES = [
  {
    index: '01',
    name: 'Banking, Humanised',
    project: 'Bank of Ireland — mobile banking',
    year: '2022',
    company: 'Bank of Ireland',
    role: 'Senior UX Designer · research, IA, interaction',
    image:
      'https://static.prod-images.emergentagent.com/jobs/93a24390-dc14-4ba6-9cbc-17b819b59f52/images/29421798cf62186ef5a2b36a7672bea1348705ab148fc25a80a5afcdb5961c96.png',
    problem:
      'The mobile banking app needed to feel like a service, not a screen — helping customers stay ahead of financial delinquency with timely, tailored guidance.',
    decision:
      'I rebuilt the experience from research, personas and user journeys, introduced a chatbot-led service model for proactive support, and realigned the whole app to the bank’s new design framework across tablet and mobile.',
    impact: [
      { value: 'Chatbot', label: 'Service model' },
      { value: 'Tablet + Mobile', label: 'Platforms' },
      { value: 'New framework', label: 'Visual system' },
    ],
    tags: ['User research', 'Personas', 'Prototyping', 'Service design'],
  },
  {
    index: '02',
    name: 'Underwriting, Unblocked',
    project: 'QBE — underwriting platform',
    year: '2022',
    company: 'QBE',
    role: 'Senior UX Designer · interaction, usability',
    image:
      'https://static.prod-images.emergentagent.com/jobs/93a24390-dc14-4ba6-9cbc-17b819b59f52/images/f6037567b898117675595cdd6c724961271806479561bba4eea7ba9a31241fbf.png',
    problem:
      'A Pega-driven underwriting platform was complex and manual. Underwriters needed an intuitive workflow that let automation do the heavy lifting.',
    decision:
      'I explored new navigation models and screen flows, evolved the strongest wireframes into a full design solution on the QBE NorthStar system, and validated it through usability testing backed by interviews with the day-to-day operations team.',
    impact: [
      { value: 'NorthStar', label: 'Platform' },
      { value: 'Automation', label: 'Workflow' },
      { value: 'Usability-tested', label: 'Validation' },
    ],
    tags: ['Underwriting', 'Pega', 'Automation', 'Usability testing'],
  },
  {
    index: '03',
    name: 'A Portal Professionals Trust',
    project: 'Vanguard — financial professionals portal',
    year: '2023',
    company: 'Vanguard',
    role: 'Senior UX Designer · research, IA, design systems',
    image:
      'https://static.prod-images.emergentagent.com/jobs/93a24390-dc14-4ba6-9cbc-17b819b59f52/images/ccbfc96684b82eec91e51c05449c4b53d0ba262ed2a9e420fe4a09c87643b3b2.png',
    problem:
      'Vanguard was migrating from legacy software into Dynamics 365, and needed a secure portal for financial professionals plus a CPD learning experience.',
    decision:
      'I led user research and built personas and scenarios in sync with the brand, then designed a secure B2B portal and a CPD learning portal that surfaces signals and insights for the sales teams.',
    impact: [
      { value: 'Dynamics 365', label: 'Platform' },
      { value: 'Secure portal', label: 'Delivered' },
      { value: 'CPD learning', label: 'New product' },
    ],
    tags: ['B2B', 'Design system', 'Research', 'Dynamics 365'],
  },
];

export const EXPERIENCE = [
  { company: 'LJ Tech', role: 'UX Consultant', period: '2023 — Now', note: 'Advising SMEs on ROI through user-centred and deliberate service design; weekly UX audits.' },
  { company: 'Vanguard', role: 'Senior UX Designer', period: '2023', note: 'CRM-embedded pages, services portal, dashboards and the B2B institutional client portal.' },
  { company: 'Bank of Ireland', role: 'Senior UX Designer', period: '2022', note: 'Chatbot-led service experience and a mobile app aligned to the new design framework.' },
  { company: 'Generali', role: 'Senior UX Designer', period: '2022', note: 'Digital transformation — discovery with underwriters, then designing out their pain points.' },
  { company: 'QBE', role: 'Senior UX Designer', period: '2021 — 2022', note: 'New intuitive underwriting experience on the QBE NorthStar system.' },
  { company: 'Incepteo', role: 'UI/UX Designer · Developer', period: '2019 — 2020', note: 'Redesigned an IT outsourcing company’s workplace collaboration platform.' },
];

export const PROCESS = [
  { no: '01', title: 'Learn', desc: 'Understand users, context and technology — user data, competitive research, interviews and field studies.' },
  { no: '02', title: 'Explore', desc: 'Build profiles and structure: sitemaps, content inventories, screen flows, navigation models and journeys.' },
  { no: '03', title: 'Sketch', desc: 'Evaluate, test and select wireframe concepts ready for prototype development.' },
  { no: '04', title: 'Design', desc: 'Write specifications and evolve concepts and wireframes into a full design solution.' },
  { no: '05', title: 'Build', desc: 'Plan for developers, review with stakeholders for feedback and run usability testing.' },
  { no: '06', title: 'Evaluate', desc: 'Ship the deliverables, track goals and integration, then analyse and iterate.' },
];

export const SKILLS = [
  { title: 'Research', items: ['Interviews', 'Contextual inquiry', 'Usability testing', 'Comparative analysis', 'Surveys'] },
  { title: 'Design', items: ['Interaction design', 'Wireframing', 'Prototyping', 'UI & visual design', 'Storyboarding'] },
  { title: 'Tools', items: ['Figma', 'Adobe XD', 'Miro', 'Principle', 'Photoshop · Illustrator'] },
  { title: 'Development', items: ['HTML5 · CSS3', 'JavaScript', 'React', 'PHP'] },
];

// SECTIONS drive both the overlay copy and the 3D stations (index-aligned).
export const SECTIONS = [
  { id: 'intro', type: 'intro', label: 'Enter' },
  { id: 'about', type: 'about', label: 'About' },
  { id: 'experience', type: 'experience', label: 'Experience' },
  { id: 'case-1', type: 'case', label: 'Case 01', data: CASES[0] },
  { id: 'case-2', type: 'case', label: 'Case 02', data: CASES[1] },
  { id: 'case-3', type: 'case', label: 'Case 03', data: CASES[2] },
  { id: 'process', type: 'process', label: 'Process' },
  { id: 'skills', type: 'skills', label: 'Skills' },
  { id: 'contact', type: 'contact', label: 'Contact' },
];
