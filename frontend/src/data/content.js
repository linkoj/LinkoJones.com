// All copy + case-study data lives here so the experience is easy to edit.
// Placeholder content for a senior UX designer — written to foreground
// storytelling and measurable outcomes (the real star of the show).

export const PROFILE = {
  name: 'Maya Chen',
  role: 'Senior UX Designer',
  tagline: 'I turn ambiguous problems into products people trust.',
  location: 'San Francisco · Remote',
  email: 'hello@mayachen.design',
  availability: 'Available for senior & lead roles',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Read CV', href: '#contact' },
    { label: 'Dribbble', href: 'https://dribbble.com/' },
  ],
};

const CASES = [
  {
    index: '01',
    name: 'Trust by Default',
    project: 'Fintech onboarding redesign',
    year: '2024',
    company: 'Northwind Bank',
    role: 'Lead designer · 0→1 research, IA, interaction',
    image:
      'https://static.prod-images.emergentagent.com/jobs/93a24390-dc14-4ba6-9cbc-17b819b59f52/images/29421798cf62186ef5a2b36a7672bea1348705ab148fc25a80a5afcdb5961c96.png',
    problem:
      'New users abandoned account opening at a 38% drop-off. Identity verification felt like an interrogation, not a welcome.',
    decision:
      'I reframed onboarding as a progressive trust exchange — asking for the least sensitive data first, explaining the “why” inline, and letting people preview the product before full KYC.',
    impact: [
      { value: '38%→12%', label: 'Drop-off' },
      { value: '+24%', label: 'Activation' },
      { value: '−41%', label: 'Support tickets' },
    ],
    tags: ['Research', 'IA', 'Compliance', 'Design system'],
  },
  {
    index: '02',
    name: 'Ninety Seconds',
    project: 'Healthcare scheduling app',
    year: '2023',
    company: 'Vita Health',
    role: 'Senior designer · service design, prototyping',
    image:
      'https://static.prod-images.emergentagent.com/jobs/93a24390-dc14-4ba6-9cbc-17b819b59f52/images/f6037567b898117675595cdd6c724961271806479561bba4eea7ba9a31241fbf.png',
    problem:
      'Booking a specialist took 6 minutes across 9 screens. Patients with chronic conditions gave up and called instead — overloading the clinic.',
    decision:
      'I mapped the real decision a patient makes (who, when, how soon) and collapsed the flow into a single adaptive view with smart defaults and same-day surfacing.',
    impact: [
      { value: '6m→90s', label: 'Time to book' },
      { value: '+31', label: 'NPS' },
      { value: '+19%', label: 'Online bookings' },
    ],
    tags: ['Service design', 'Accessibility', 'Prototyping'],
  },
  {
    index: '03',
    name: 'The Recovered Cart',
    project: 'E-commerce checkout',
    year: '2022',
    company: 'Loom & Co.',
    role: 'Senior designer · interaction, experimentation',
    image:
      'https://static.prod-images.emergentagent.com/jobs/93a24390-dc14-4ba6-9cbc-17b819b59f52/images/ccbfc96684b82eec91e51c05449c4b53d0ba262ed2a9e420fe4a09c87643b3b2.png',
    problem:
      'A four-step checkout leaked revenue at every transition, especially on mobile where address entry was punishing.',
    decision:
      'I designed a single-surface checkout with order summary always visible, express paths up top, and forgiving validation — then proved each change through a 6-week A/B program.',
    impact: [
      { value: '+18%', label: 'Conversion' },
      { value: '$4.2M', label: 'Annual revenue' },
      { value: '−2.3s', label: 'Time to pay' },
    ],
    tags: ['Interaction', 'Experimentation', 'Mobile'],
  },
];

export const EXPERIENCE = [
  { company: 'Northwind Bank', role: 'Lead UX Designer', period: '2023 — Now', note: 'Owning trust & onboarding across web and native.' },
  { company: 'Vita Health', role: 'Senior UX Designer', period: '2021 — 2023', note: 'Service design for patient-facing scheduling.' },
  { company: 'Loom & Co.', role: 'Senior Product Designer', period: '2018 — 2021', note: 'Commerce, checkout & growth experimentation.' },
  { company: 'Studio Field', role: 'Product Designer', period: '2015 — 2018', note: 'Agency work for early-stage startups.' },
];

export const PROCESS = [
  { no: '01', title: 'Discover', desc: 'Interviews, analytics and journey mapping until the real problem is undeniable.' },
  { no: '02', title: 'Define', desc: 'Sharp problem statements, success metrics and the riskiest assumptions to test.' },
  { no: '03', title: 'Design', desc: 'Flows, systems and high-fidelity prototypes — designed to be measured, not admired.' },
  { no: '04', title: 'Validate', desc: 'Usability testing and A/B experiments. Ship, learn, and prove the impact.' },
];

export const SKILLS = [
  { title: 'Research', items: ['User interviews', 'Usability testing', 'Surveys', 'Journey mapping'] },
  { title: 'Craft', items: ['Interaction design', 'Design systems', 'Prototyping', 'Information architecture'] },
  { title: 'Strategy', items: ['Product thinking', 'Experimentation', 'Metrics & outcomes', 'Workshop facilitation'] },
  { title: 'Tools', items: ['Figma', 'Framer', 'Maze', 'Mixpanel'] },
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
