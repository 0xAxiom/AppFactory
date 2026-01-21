// Development-only logging utilities
export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (__DEV__) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },

  info: (message: string, ...args: any[]) => {
    if (__DEV__) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },

  warn: (message: string, ...args: any[]) => {
    if (__DEV__) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },

  error: (message: string, ...args: any[]) => {
    if (__DEV__) {
      console.error(`[ERROR] ${message}`, ...args);
    }
    // In production, you might want to send to crash reporting service
  },
};

// Error handling utilities
export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  fallbackValue?: T
): Promise<T | undefined> => {
  try {
    return await asyncFn();
  } catch (error) {
    logger.error('Async operation failed:', error);
    return fallbackValue;
  }
};

export const safeAsync = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      logger.error('Safe async operation failed:', error);
      return null;
    }
  };
};
