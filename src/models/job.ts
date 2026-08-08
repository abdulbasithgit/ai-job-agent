export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
  salary?: string;
  skills: string[];
  source: string;
  postedDate?: Date;
}

export interface JobSearchCriteria {
  keywords: string[];
  locations: string[];
}

/**
 * Normalizes a job URL so the same posting is recognized across runs and providers:
 * lowercased host, no protocol, no "www.", no query string, no trailing slash.
 * Used later as the unique key that stops a job being emailed twice.
 */
export function normalizeJobUrl(url: string): string {
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    const host = parsed.host.toLowerCase().replace(/^www\./, '');
    const path = parsed.pathname.replace(/\/+$/, '');
    return `${host}${path}`;
  } catch {
    return trimmed.toLowerCase().replace(/\/+$/, '');
  }
}

export function formatSalary(salary: string | undefined): string {
  return salary === undefined || salary.trim() === '' ? 'Salary information unavailable' : salary;
}
