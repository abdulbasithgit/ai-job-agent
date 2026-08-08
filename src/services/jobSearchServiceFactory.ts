import type { AppConfig } from '../config/config';
import type { JobSearchService } from './jobSearchService';
import { MockJobSearchService } from './mockJobSearchService';
import type { Logger } from '../utils/logger';

/**
 * Chooses the job provider from configuration. Adding a real provider later means
 * adding one case here — no other file changes.
 */
export function createJobSearchService(config: AppConfig, logger: Logger): JobSearchService {
  switch (config.jobProvider) {
    case 'mock':
      return new MockJobSearchService(logger);
    default: {
      const exhaustiveCheck: never = config.jobProvider;
      throw new Error(`Unsupported JOB_PROVIDER: ${String(exhaustiveCheck)}`);
    }
  }
}
