import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { parseUserProfile, type UserProfile } from '../models/userProfile';

dotenv.config();

export type JobProvider = 'mock';

export interface AppConfig {
  nodeEnv: string;
  logLevel: string;
  userProfilePath: string;
  userProfile: UserProfile;
  jobProvider: JobProvider;
  maxJobsPerSearch: number;
}

export function loadConfig(): AppConfig {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const logLevel = process.env.LOG_LEVEL ?? 'info';
  const userProfilePath = path.resolve(
    process.cwd(),
    process.env.USER_PROFILE_PATH ?? './config/profile.json',
  );

  return {
    nodeEnv,
    logLevel,
    userProfilePath,
    userProfile: loadUserProfile(userProfilePath),
    jobProvider: parseJobProvider(process.env.JOB_PROVIDER),
    maxJobsPerSearch: parsePositiveInt(process.env.MAX_JOBS_PER_SEARCH, 50),
  };
}

function parseJobProvider(value: string | undefined): JobProvider {
  const provider = (value ?? 'mock').trim().toLowerCase();
  if (provider === 'mock') return 'mock';
  throw new Error(`Unsupported JOB_PROVIDER "${provider}". Supported values: mock`);
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (value === undefined || value.trim() === '') return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Expected a positive integer, received "${value}"`);
  }
  return parsed;
}

function loadUserProfile(filePath: string): UserProfile {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `User profile not found at ${filePath}. Copy config/profile.json or set USER_PROFILE_PATH.`,
    );
  }
  const fileContent = fs.readFileSync(filePath, 'utf8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(fileContent);
  } catch (error) {
    throw new Error(`User profile at ${filePath} is not valid JSON: ${String(error)}`);
  }
  return parseUserProfile(parsed);
}
