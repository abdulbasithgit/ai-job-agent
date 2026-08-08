import type { Job } from '../models/job';

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * 20 sample postings used by MockJobSearchService.
 * Deliberately messy: 4 are duplicates of earlier entries (different URL casing,
 * trailing slash, tracking query string, or a re-post on another board) and a few
 * are poor matches, so Phase 3 has real work to do.
 */
export const MOCK_JOBS: Job[] = [
  {
    id: 'mock-001',
    title: 'Senior Frontend Engineer (Angular)',
    company: 'Nour Tech',
    location: 'Riyadh, Saudi Arabia',
    url: 'https://jobs.example.com/nour-tech/senior-frontend-angular',
    description:
      'Build and scale customer-facing Angular 17 applications. Strong TypeScript, RxJS and REST API experience required. 6+ years of frontend experience.',
    salary: 'SAR 25,000 - 32,000 / month',
    skills: ['Angular', 'TypeScript', 'RxJS', 'REST API'],
    source: 'mock',
    postedDate: daysAgo(1),
  },
  {
    id: 'mock-002',
    title: 'Full Stack Developer (React + Node.js)',
    company: 'Cloudline',
    location: 'Remote',
    url: 'https://jobs.example.com/cloudline/fullstack-react-node',
    description:
      'Own features end to end with React, Node.js and PostgreSQL. Docker-based local development. Distributed team, fully remote.',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
    source: 'mock',
    postedDate: daysAgo(2),
  },
  {
    id: 'mock-003',
    title: 'AI Full Stack Engineer',
    company: 'Vector Labs',
    location: 'Remote (MENA timezones)',
    url: 'https://jobs.example.com/vector-labs/ai-fullstack-engineer',
    description:
      'Ship LLM-powered product features. TypeScript across the stack, Node.js services, React front end, OpenAI and local models via Ollama.',
    salary: 'USD 90,000 - 120,000 / year',
    skills: ['TypeScript', 'Node.js', 'React', 'LLM', 'OpenAI'],
    source: 'mock',
    postedDate: daysAgo(1),
  },
  {
    id: 'mock-004',
    title: 'Senior Software Engineer - Platform',
    company: 'Tamara Systems',
    location: 'Jeddah, Saudi Arabia',
    url: 'https://jobs.example.com/tamara-systems/senior-software-engineer-platform',
    description:
      'Node.js microservices, REST APIs, PostgreSQL and Docker. You will mentor engineers and drive architecture decisions. 7+ years experience.',
    skills: ['Node.js', 'REST API', 'PostgreSQL', 'Docker'],
    source: 'mock',
    postedDate: daysAgo(4),
  },
  {
    id: 'mock-005',
    title: 'React Native Mobile Developer',
    company: 'Baniyas Apps',
    location: 'Dubai, United Arab Emirates',
    url: 'https://jobs.example.com/baniyas-apps/react-native-developer',
    description:
      'Cross-platform mobile development with React Native and TypeScript. On-site in Dubai, no relocation support.',
    skills: ['React Native', 'TypeScript', 'JavaScript'],
    source: 'mock',
    postedDate: daysAgo(6),
  },
  {
    id: 'mock-006',
    title: 'Frontend Developer (React)',
    company: 'Zad Commerce',
    location: 'Riyadh, Saudi Arabia (hybrid)',
    url: 'https://jobs.example.com/zad-commerce/frontend-react',
    description:
      'React, TypeScript, HTML and CSS for a high-traffic ecommerce storefront. Design-system driven development.',
    salary: 'SAR 20,000 - 26,000 / month',
    skills: ['React', 'TypeScript', 'HTML', 'CSS'],
    source: 'mock',
    postedDate: daysAgo(3),
  },
  {
    id: 'mock-007',
    title: 'Java Backend Engineer',
    company: 'Falcon Bank',
    location: 'Riyadh, Saudi Arabia',
    url: 'https://jobs.example.com/falcon-bank/java-backend-engineer',
    description:
      'Core banking services in Java 21 and Spring Boot. Oracle database. No JavaScript work in this role.',
    skills: ['Java', 'Spring Boot', 'Oracle'],
    source: 'mock',
    postedDate: daysAgo(5),
  },
  {
    id: 'mock-008',
    title: 'Lead Full Stack Engineer (AI Products)',
    company: 'Marsad AI',
    location: 'Remote',
    url: 'https://jobs.example.com/marsad-ai/lead-fullstack-ai',
    description:
      'Lead a small team building AI agents. Node.js, TypeScript, React, PostgreSQL, Docker, prompt engineering and evaluation pipelines. 8+ years experience.',
    salary: 'USD 110,000 - 140,000 / year',
    skills: ['TypeScript', 'Node.js', 'React', 'Docker', 'PostgreSQL', 'AI'],
    source: 'mock',
    postedDate: daysAgo(1),
  },
  {
    id: 'mock-009',
    title: 'Angular Developer',
    company: 'Hilal Health',
    location: 'Dammam, Saudi Arabia',
    url: 'https://jobs.example.com/hilal-health/angular-developer',
    description:
      'Maintain and extend an Angular 15 clinical portal. TypeScript, REST API integration, HTML and CSS. 4+ years experience.',
    skills: ['Angular', 'TypeScript', 'REST API', 'CSS'],
    source: 'mock',
    postedDate: daysAgo(7),
  },
  {
    id: 'mock-010',
    title: 'DevOps Engineer',
    company: 'Cloudline',
    location: 'Remote',
    url: 'https://jobs.example.com/cloudline/devops-engineer',
    description:
      'Kubernetes, Terraform and CI/CD pipelines. Some Node.js scripting. Primarily an infrastructure role.',
    skills: ['Kubernetes', 'Terraform', 'Docker'],
    source: 'mock',
    postedDate: daysAgo(3),
  },
  {
    id: 'mock-011',
    title: 'Senior Full Stack Developer',
    company: 'Rukn Digital',
    location: 'Riyadh, Saudi Arabia',
    url: 'https://jobs.example.com/rukn-digital/senior-fullstack-developer',
    description:
      'Angular and Node.js across several client products. REST APIs, PostgreSQL, Docker. Arabic and English working environment.',
    salary: 'SAR 28,000 - 35,000 / month',
    skills: ['Angular', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
    source: 'mock',
    postedDate: daysAgo(2),
  },
  {
    id: 'mock-012',
    title: 'Machine Learning Engineer',
    company: 'Vector Labs',
    location: 'Remote',
    url: 'https://jobs.example.com/vector-labs/ml-engineer',
    description:
      'Train and deploy models with Python and PyTorch. Requires an ML research background; frontend experience is not relevant.',
    skills: ['Python', 'PyTorch', 'MLOps'],
    source: 'mock',
    postedDate: daysAgo(8),
  },
  {
    id: 'mock-013',
    title: 'Software Engineer (Node.js)',
    company: 'Sahl Logistics',
    location: 'Remote (Saudi Arabia based)',
    url: 'https://jobs.example.com/sahl-logistics/software-engineer-node',
    description:
      'Build REST APIs in Node.js and TypeScript for logistics tracking. PostgreSQL, Redis, Docker Compose local setup.',
    skills: ['Node.js', 'TypeScript', 'REST API', 'PostgreSQL', 'Redis'],
    source: 'mock',
    postedDate: daysAgo(2),
  },
  {
    id: 'mock-014',
    title: 'WordPress Developer',
    company: 'Bright Media',
    location: 'Cairo, Egypt',
    url: 'https://jobs.example.com/bright-media/wordpress-developer',
    description: 'PHP and WordPress theme development for marketing sites. Some jQuery.',
    skills: ['PHP', 'WordPress', 'jQuery'],
    source: 'mock',
    postedDate: daysAgo(9),
  },
  {
    id: 'mock-015',
    title: 'Senior Frontend Developer (React, Remote)',
    company: 'Northwind Retail',
    location: 'Remote (EMEA)',
    url: 'https://jobs.example.com/northwind-retail/senior-frontend-react',
    description:
      'React, TypeScript and Node.js BFF layer. Strong CSS and accessibility focus. 6+ years experience, fully remote within EMEA.',
    salary: 'EUR 75,000 - 95,000 / year',
    skills: ['React', 'TypeScript', 'Node.js', 'CSS'],
    source: 'mock',
    postedDate: daysAgo(3),
  },
  {
    id: 'mock-016',
    title: 'AI Engineer (Agents)',
    company: 'Qimam Cloud',
    location: 'Riyadh, Saudi Arabia (remote friendly)',
    url: 'https://jobs.example.com/qimam-cloud/ai-engineer-agents',
    description:
      'Design LLM agent workflows with tool calling, evaluation and observability. TypeScript and Node.js. OpenAI and self-hosted Ollama models.',
    skills: ['TypeScript', 'Node.js', 'AI', 'LLM', 'Docker'],
    source: 'mock',
    postedDate: daysAgo(1),
  },

  // ---- Duplicates of earlier postings (4) ----
  {
    id: 'mock-017',
    title: 'Senior Frontend Engineer (Angular)',
    company: 'Nour Tech',
    location: 'Riyadh, Saudi Arabia',
    // same URL as mock-001, but with a tracking query string
    url: 'https://jobs.example.com/nour-tech/senior-frontend-angular?utm_source=newsletter',
    description: 'Build and scale customer-facing Angular 17 applications.',
    salary: 'SAR 25,000 - 32,000 / month',
    skills: ['Angular', 'TypeScript'],
    source: 'mock',
    postedDate: daysAgo(1),
  },
  {
    id: 'mock-018',
    title: 'Full Stack Developer (React + Node.js)',
    company: 'Cloudline',
    location: 'Remote',
    // same URL as mock-002, different casing in host and a trailing slash
    url: 'https://JOBS.example.com/cloudline/fullstack-react-node/',
    description: 'Own features end to end with React, Node.js and PostgreSQL.',
    skills: ['React', 'Node.js'],
    source: 'mock',
    postedDate: daysAgo(2),
  },
  {
    id: 'mock-019',
    title: 'Lead Full Stack Engineer (AI Products)',
    company: 'Marsad AI',
    location: 'Remote',
    // same URL as mock-008 with www.
    url: 'https://www.jobs.example.com/marsad-ai/lead-fullstack-ai',
    description: 'Lead a small team building AI agents.',
    skills: ['TypeScript', 'Node.js', 'AI'],
    source: 'mock',
    postedDate: daysAgo(1),
  },
  {
    id: 'mock-020',
    title: 'Senior Full Stack Developer',
    company: 'Rukn Digital',
    location: 'Riyadh, Saudi Arabia',
    // same URL as mock-011
    url: 'https://jobs.example.com/rukn-digital/senior-fullstack-developer',
    description: 'Angular and Node.js across several client products.',
    skills: ['Angular', 'Node.js'],
    source: 'mock',
    postedDate: daysAgo(2),
  },
];
