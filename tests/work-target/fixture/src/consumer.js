import { config } from './config.js';

export function consume(job) {
  return { ...job, remaining: config.retryLimit };
}
