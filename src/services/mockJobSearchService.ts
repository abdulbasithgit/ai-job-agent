import type { Job, JobSearchCriteria } from '../models/job';
import type { JobSearchService } from './jobSearchService';
import { MOCK_JOBS } from './mockJobs';
import type { Logger } from '../utils/logger';

/**
 * Returns a fixed set of sample postings, like a noisy real job board:
 * some are great matches, some are irrelevant, and four are duplicates.
 * It intentionally does NOT filter or rank — that is the agent's job (Phase 3+).
 */
export class MockJobSearchService implements JobSearchService {
  readonly name = 'mock';

  constructor(private readonly logger: Logger) {}

  async searchJobs(criteria: JobSearchCriteria): Promise<Job[]> {
    this.logger.debug('Mock provider received criteria', {
      keywords: criteria.keywords,
      locations: criteria.locations,
      limit: criteria.limit,
    });

    // Simulate network latency so callers are forced to treat this as async I/O.
    await delay(50);

    const jobs = MOCK_JOBS.map(cloneJob);
    return criteria.limit === undefined ? jobs : jobs.slice(0, criteria.limit);
  }
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
