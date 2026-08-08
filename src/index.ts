import { loadConfig } from './config/config';
import type { JobSearchCriteria } from './models/job';
import { createJobSearchService } from './services/jobSearchServiceFactory';
import { formatJobList } from './utils/jobFormatter';
import { Logger, parseLogLevel } from './utils/logger';

async function main(): Promise<void> {
  const config = loadConfig();
  const logger = new Logger(parseLogLevel(config.logLevel));
  const profile = config.userProfile;

  logger.info('🤖 AI Job Agent starting...');
  logger.info(`👤 Profile: ${profile.name} (${profile.experienceYears} years experience)`);

  const criteria: JobSearchCriteria = {
    keywords: profile.keywords,
    locations: profile.preferredLocations,
  };

  logger.info(`🔎 Searching mock jobs via "${config.jobProvider}" provider...`);
  logger.info(`🔍 Keywords: ${criteria.keywords.join(', ')}`);
  logger.info(`📍 Locations: ${criteria.locations.join(', ')}`);

  const jobSearchService = createJobSearchService(config);
  const jobs = await jobSearchService.searchJobs(criteria);
  logger.info(`✅ Found ${jobs.length} jobs`);

  if (jobs.length > 0) {
    logger.info(`📋 Jobs found:\n\n${formatJobList(jobs)}`);
  } else {
    logger.warn('No jobs matched the search criteria. Try widening keywords or locations.');
  }

  logger.info('Phase 2 complete: job model, mock data and job search service are working');
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${new Date().toISOString()} [ERROR] Agent failed: ${message}`);
  process.exitCode = 1;
});
