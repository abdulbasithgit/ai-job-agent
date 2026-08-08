import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { parseUserProfile, type UserProfile } from '../models/userProfile';

dotenv.config();

export interface AppConfig {
  nodeEnv: string;
  logLevel: string;
  userProfilePath: string;
  userProfile: UserProfile;
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
  };
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
