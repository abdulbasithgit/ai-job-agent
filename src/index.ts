import { loadConfig } from './config/config';
import { Logger, parseLogLevel } from './utils/logger';

function main(): void {
  const config = loadConfig();
  const logger = new Logger(parseLogLevel(config.logLevel));

  logger.info('AI Job Agent starting (Phase 1)');
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`Profile loaded from: ${config.userProfilePath}`);

  const profile = config.userProfile;
  logger.info(`User: ${profile.name} (${profile.experienceYears} years experience)`);
  logger.info(`Skills: ${profile.skills.join(', ')}`);
  logger.info(`Preferred locations: ${profile.preferredLocations.join(', ')}`);
  logger.info(`Preferred roles: ${profile.preferredRoles.join(', ')}`);
  logger.info('Phase 1 complete: config, profile and logging are working');
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${new Date().toISOString()} [ERROR] Startup failed: ${message}`);
  process.exitCode = 1;
}
