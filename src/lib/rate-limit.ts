// Simple in-memory rate limiting for demo purposes
// In production, use Redis or a database for persistent storage

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();

  // Free tier limits
  private readonly DAILY_LIMIT = 5;
  private readonly HOURLY_LIMIT = 2;
  private readonly MINUTE_LIMIT = 1;
  private readonly MONTHLY_LIMIT = 50;

  private getKey(identifier: string, type: string): string {
    return `${identifier}_${type}`;
  }

  private getCurrentTime(): number {
    return Math.floor(Date.now() / 1000);
  }

  private getResetTime(type: string): number {
    const now = this.getCurrentTime();
    switch (type) {
      case 'minute':
        return now + 60;
      case 'hour':
        return now + 3600;
      case 'day':
        return now + 86400;
      case 'month':
        // Reset on the 1st of next month
        const date = new Date();
        date.setMonth(date.getMonth() + 1, 1);
        date.setHours(0, 0, 0, 0);
        return Math.floor(date.getTime() / 1000);
      default:
        return now + 60;
    }
  }

  private getLimit(type: string): number {
    switch (type) {
      case 'minute':
        return this.MINUTE_LIMIT;
      case 'hour':
        return this.HOURLY_LIMIT;
      case 'day':
        return this.DAILY_LIMIT;
      case 'month':
        return this.MONTHLY_LIMIT;
      default:
        return 1;
    }
  }

  checkLimit(identifier: string, type: string = 'minute'): { allowed: boolean; remaining: number; resetTime: number } {
    const key = this.getKey(identifier, type);
    const now = this.getCurrentTime();
    const entry = this.limits.get(key);

    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      const resetTime = this.getResetTime(type);
      this.limits.set(key, { count: 0, resetTime });
      return { allowed: true, remaining: this.getLimit(type), resetTime };
    }

    const limit = this.getLimit(type);
    const remaining = Math.max(0, limit - entry.count);

    if (entry.count >= limit) {
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    return { allowed: true, remaining: remaining - 1, resetTime: entry.resetTime };
  }

  recordUsage(identifier: string, type: string = 'minute'): void {
    const key = this.getKey(identifier, type);
    const entry = this.limits.get(key);

    if (entry) {
      entry.count += 1;
      this.limits.set(key, entry);
    }
  }

  getUsage(identifier: string): {
    daily: { used: number; limit: number; remaining: number; resetTime: number };
    hourly: { used: number; limit: number; remaining: number; resetTime: number };
    monthly: { used: number; limit: number; remaining: number; resetTime: number };
  } {
    const daily = this.checkLimit(identifier, 'day');
    const hourly = this.checkLimit(identifier, 'hour');
    const monthly = this.checkLimit(identifier, 'month');

    return {
      daily: {
        used: this.DAILY_LIMIT - daily.remaining,
        limit: this.DAILY_LIMIT,
        remaining: daily.remaining,
        resetTime: daily.resetTime,
      },
      hourly: {
        used: this.HOURLY_LIMIT - hourly.remaining,
        limit: this.HOURLY_LIMIT,
        remaining: hourly.remaining,
        resetTime: hourly.resetTime,
      },
      monthly: {
        used: this.MONTHLY_LIMIT - monthly.remaining,
        limit: this.MONTHLY_LIMIT,
        remaining: monthly.remaining,
        resetTime: monthly.resetTime,
      },
    };
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = this.getCurrentTime();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

// Clean up expired entries every 5 minutes
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);
