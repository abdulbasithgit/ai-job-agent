export interface UserProfile {
  name: string;
  skills: string[];
  preferredLocations: string[];
  experienceYears: number;
  preferredRoles: string[];
  keywords: string[];
}

export function parseUserProfile(raw: unknown): UserProfile {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('User profile must be a JSON object');
  }
  const data = raw as Record<string, unknown>;
  return {
    name: requireString(data, 'name'),
    skills: requireStringArray(data, 'skills'),
    preferredLocations: requireStringArray(data, 'preferredLocations'),
    experienceYears: requireNumber(data, 'experienceYears'),
    preferredRoles: requireStringArray(data, 'preferredRoles'),
    keywords: requireStringArray(data, 'keywords'),
  };
}

function requireString(data: Record<string, unknown>, key: string): string {
  const value = data[key];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`User profile field "${key}" must be a non-empty string`);
  }
  return value;
}

function requireNumber(data: Record<string, unknown>, key: string): number {
  const value = data[key];
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`User profile field "${key}" must be a number`);
  }
  return value;
}

function requireStringArray(data: Record<string, unknown>, key: string): string[] {
  const value = data[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error(`User profile field "${key}" must be an array of strings`);
  }
  if (value.length === 0) {
    throw new Error(`User profile field "${key}" must not be empty`);
  }
  return value as string[];
}
