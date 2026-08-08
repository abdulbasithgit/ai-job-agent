import { loadConfig } from './config/config';
import { formatSalary, type JobSearchCriteria } from './models/job';
import { createJobSearchService } from './services/jobSearchServiceFactory';
import { Logger, parseLogLevel } from './utils/logger';

async function main(): Promise<void> {
  const config = loadConfig();
  const logger = new Logger(parseLogLevel(config.logLevel));

  logger.info('AI Job Agent starting (Phase 2)');
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`Profile loaded from: ${config.userProfilePath}`);

  const profile = config.userProfile;
  logger.info(`User: ${profile.name} (${profile.experienceYears} years experience)`);
  logger.info(`Skills: ${profile.skills.join(', ')}`);
  logger.info(`Preferred locations: ${profile.preferredLocations.join(', ')}`);

  const jobSearchService = createJobSearchService(config, logger);
  const criteria: JobSearchCriteria = {
    keywords: profile.keywords,
    locations: profile.preferredLocations,
    limit: config.maxJobsPerSearch,
  };

  logger.info(`Searching jobs via "${jobSearchService.name}" provider...`);
  const jobs = await jobSearchService.searchJobs(criteria);
  logger.info(`Found ${jobs.length} jobs`);

  for (const job of jobs) {
    logger.info(`- ${job.title} | ${job.company} | ${job.location} | ${formatSalary(job.salary)}`);
  }

  logger.info('Phase 2 complete: job model and job search provider are working');
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${new Date().toISOString()} [ERROR] Agent failed: ${message}`);
  process.exitCode = 1;
});
