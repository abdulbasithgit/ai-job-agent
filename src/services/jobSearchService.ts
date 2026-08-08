import type { Job, JobSearchCriteria } from '../models/job';

/**
 * A source of jobs. Phase 2 ships a mock implementation; later phases can add
 * a real provider (public job API or an official feed) without touching the agent.
 */
export interface JobSearchService {
  readonly name: string;
  searchJobs(criteria: JobSearchCriteria): Promise<Job[]>;
}
