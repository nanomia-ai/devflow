import { config } from './config.js';

export const probeWindow = 1;
export const shouldRetry = (attempt) => attempt < config.retryLimit;
