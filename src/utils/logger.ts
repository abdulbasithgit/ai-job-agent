type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function isLogLevel(value: string): value is LogLevel {
  return value in LEVEL_ORDER;
}

export function parseLogLevel(value: string | undefined, fallback: LogLevel = 'info'): LogLevel {
  if (value === undefined) return fallback;
  const normalized = value.trim().toLowerCase();
  return isLogLevel(normalized) ? normalized : fallback;
}

export class Logger {
  constructor(private readonly minLevel: LogLevel = 'info') {}

  debug(message: string, meta?: unknown): void {
    this.write('debug', message, meta);
  }

  info(message: string, meta?: unknown): void {
    this.write('info', message, meta);
  }

  warn(message: string, meta?: unknown): void {
    this.write('warn', message, meta);
  }

  error(message: string, meta?: unknown): void {
    this.write('error', message, meta);
  }

  private write(level: LogLevel, message: string, meta?: unknown): void {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[this.minLevel]) return;
    const timestamp = new Date().toISOString();
    const line = `${timestamp} [${level.toUpperCase()}] ${message}`;
    const output = meta === undefined ? line : `${line} ${safeStringify(meta)}`;
    if (level === 'error' || level === 'warn') {
      console.error(output);
    } else {
      console.log(output);
    }
  }
}

function safeStringify(meta: unknown): string {
  if (meta instanceof Error) {
    return JSON.stringify({ name: meta.name, message: meta.message });
  }
  try {
    return JSON.stringify(meta);
  } catch {
    return String(meta);
  }
}

export const logger = new Logger(parseLogLevel(process.env.LOG_LEVEL));
