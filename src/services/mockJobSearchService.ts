import { MOCK_JOBS } from '../data/mockJobs';
import type { Job, JobSearchCriteria } from '../models/job';
import type { JobSearchService } from './jobSearchService';

/**
 * Searches a fixed list of sample postings instead of a real job board, so the
 * whole agent can be run offline, instantly and for free.
 */
export class MockJobSearchService implements JobSearchService {
  readonly name = 'mock';

  constructor(private readonly jobs: Job[] = MOCK_JOBS) {}

  async searchJobs(criteria: JobSearchCriteria): Promise<Job[]> {
    // Simulate network latency so callers must treat job search as real I/O.
    await delay(50);

    return this.jobs
      .filter(
        (job) => matchesAnyKeyword(job, criteria.keywords) && matchesAnyLocation(job, criteria.locations),
      )
      .map(cloneJob);
  }
}

/** A job matches when at least one keyword appears in its title, description or skills. */
function matchesAnyKeyword(job: Job, keywords: string[]): boolean {
  if (keywords.length === 0) return true;
  const haystack = [job.title, job.description, ...job.skills].join(' ');
  return keywords.some((keyword) => containsWord(haystack, keyword));
}

/** A job matches when at least one requested location appears in its location text. */
function matchesAnyLocation(job: Job, locations: string[]): boolean {
  if (locations.length === 0) return true;
  const jobLocation = job.location.toLowerCase();
  return locations.some((location) => jobLocation.includes(location.trim().toLowerCase()));
}

/**
 * Case-insensitive whole-word match. Word-based (not plain `includes`) so that
 * "AI" does not match "maintain" and "Java" does not match "JavaScript".
 */
function containsWord(text: string, word: string): boolean {
  const trimmed = word.trim();
  if (trimmed === '') return false;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, 'i');
  return pattern.test(text);
}

function cloneJob(job: Job): Job {
  return {
    ...job,
    skills: [...job.skills],
    postedDate: job.postedDate === undefined ? undefined : new Date(job.postedDate),
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
