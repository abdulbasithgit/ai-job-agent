import type { Job } from '../models/job';

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * Sample postings used by MockJobSearchService.
 * Fake companies and example.com URLs only. A deliberate mixture of good matches
 * (Angular / React / TypeScript / Node.js / Full Stack / AI) and poor matches
 * (Java, Spring Boot, Python) so filtering and ranking have real work to do.
 */
export const MOCK_JOBS: Job[] = [
  {
    id: 'mock-001',
    title: 'Senior Angular Developer',
    company: 'Nour Technologies',
    location: 'Riyadh, Saudi Arabia',
    url: 'https://example.com/job/1',
    description:
      'Build and scale customer-facing Angular 17 applications. Strong TypeScript, RxJS and REST API experience required. 6+ years of frontend experience.',
    salary: 'SAR 22,000 - 28,000 / month',
    skills: ['Angular', 'TypeScript', 'RxJS', 'REST API'],
    source: 'mock',
    postedDate: daysAgo(1),
  },
  {
    id: 'mock-002',
    title: 'Full Stack Developer (React + Node.js)',
    company: 'Cloudline Solutions',
    location: 'Remote',
    url: 'https://example.com/job/2',
    description:
      'Own features end to end with React, Node.js and PostgreSQL. Docker-based local development. Distributed team, fully remote.',
    salary: 'USD 4,500 - 6,000 / month',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
    source: 'mock',
    postedDate: daysAgo(2),
  },
  {
    id: 'mock-003',
    title: 'AI Full Stack Engineer',
    company: 'Vector Labs',
    location: 'Remote',
    url: 'https://example.com/job/3',
    description:
      'Ship LLM-powered product features. TypeScript across the stack, Node.js services and a React front end. Experience with prompt design and evaluation is a plus.',
    salary: 'USD 90,000 - 120,000 / year',
    skills: ['TypeScript', 'Node.js', 'React', 'LLM', 'AI'],
    source: 'mock',
    postedDate: daysAgo(1),
  },
  {
    id: 'mock-004',
    title: 'Senior Software Engineer - Platform',
    company: 'Tamara Systems',
    location: 'Jeddah, Saudi Arabia',
    url: 'https://example.com/job/4',
    description:
      'Node.js microservices, REST APIs, PostgreSQL and Docker. You will mentor engineers and drive architecture decisions. 7+ years experience.',
    salary: 'SAR 25,000 - 30,000 / month',
    skills: ['Node.js', 'JavaScript', 'REST API', 'PostgreSQL', 'Docker'],
    source: 'mock',
    postedDate: daysAgo(4),
  },
  {
    id: 'mock-005',
    title: 'Frontend Developer (React)',
    company: 'Zad Commerce',
    location: 'Dammam, Saudi Arabia',
    url: 'https://example.com/job/5',
    description:
      'React, TypeScript, HTML and CSS for a high-traffic ecommerce storefront. Design-system driven development.',
    salary: 'SAR 18,000 - 24,000 / month',
    skills: ['React', 'TypeScript', 'HTML', 'CSS'],
    source: 'mock',
    postedDate: daysAgo(3),
  },
  {
    id: 'mock-006',
    title: 'Java Backend Engineer',
    company: 'Falcon Bank',
    location: 'Riyadh, Saudi Arabia',
    url: 'https://example.com/job/6',
    description:
      'Core banking services in Java 21 and Spring Boot with an Oracle database. This role does not involve frontend or JavaScript work.',
    salary: 'SAR 24,000 - 30,000 / month',
    skills: ['Java', 'Spring Boot', 'Oracle'],
    source: 'mock',
    postedDate: daysAgo(5),
  },
  {
    id: 'mock-007',
    title: 'Lead Full Stack Engineer (AI Products)',
    company: 'Marsad AI',
    location: 'Remote',
    url: 'https://example.com/job/7',
    description:
      'Lead a small team building AI agents. Node.js, TypeScript, React, PostgreSQL and Docker, plus prompt engineering and evaluation pipelines. 8+ years experience.',
    salary: 'USD 110,000 - 140,000 / year',
    skills: ['TypeScript', 'Node.js', 'React', 'Docker', 'AI', 'LLM'],
    source: 'mock',
    postedDate: daysAgo(1),
  },
  {
    id: 'mock-008',
    title: 'Angular Developer',
    company: 'Hilal Health',
    location: 'Dhahran, Saudi Arabia',
    url: 'https://example.com/job/8',
    description:
      'Maintain and extend an Angular 15 clinical portal. TypeScript, REST API integration, HTML and CSS. 4+ years experience.',
    salary: 'SAR 16,000 - 21,000 / month',
    skills: ['Angular', 'TypeScript', 'REST API', 'CSS'],
    source: 'mock',
    postedDate: daysAgo(7),
  },
  {
    id: 'mock-009',
    title: 'Senior Full Stack Developer',
    company: 'Rukn Digital',
    location: 'Riyadh, Saudi Arabia',
    url: 'https://example.com/job/9',
    description:
      'Angular and Node.js across several client products. REST APIs, PostgreSQL and Docker. Arabic and English working environment.',
    salary: 'SAR 26,000 - 33,000 / month',
    skills: ['Angular', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
    source: 'mock',
    postedDate: daysAgo(2),
  },
  {
    id: 'mock-010',
    title: 'Machine Learning Engineer',
    company: 'Vector Labs',
    location: 'Remote',
    url: 'https://example.com/job/10',
    description:
      'Train and deploy models with Python and PyTorch. Requires an ML research background; frontend experience is not relevant for this role.',
    salary: 'USD 100,000 - 130,000 / year',
    skills: ['Python', 'PyTorch', 'MLOps'],
    source: 'mock',
    postedDate: daysAgo(8),
  },
  {
    id: 'mock-011',
    title: 'Software Engineer (Node.js)',
    company: 'Sahl Logistics',
    location: 'Remote',
    url: 'https://example.com/job/11',
    description:
      'Build REST APIs in Node.js and TypeScript for logistics tracking. PostgreSQL and a Docker Compose local setup. Saudi Arabia based candidates preferred.',
    salary: 'SAR 20,000 - 26,000 / month',
    skills: ['Node.js', 'TypeScript', 'JavaScript', 'REST API', 'PostgreSQL'],
    source: 'mock',
    postedDate: daysAgo(2),
  },
  {
    id: 'mock-012',
    title: 'AI Engineer (Agents)',
    company: 'Qimam Cloud',
    location: 'Riyadh, Saudi Arabia',
    url: 'https://example.com/job/12',
    description:
      'Design LLM agent workflows with tool calling, evaluation and observability. TypeScript and Node.js, with self-hosted and hosted models.',
    salary: 'SAR 30,000 - 38,000 / month',
    skills: ['TypeScript', 'Node.js', 'AI', 'LLM', 'Docker'],
    source: 'mock',
    postedDate: daysAgo(1),
  },
];
