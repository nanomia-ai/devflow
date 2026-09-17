import { config } from './config.js';

export function acceptCallback(token) {
  return { token, attempts: config.retryLimit };
}
