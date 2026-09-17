import assert from 'node:assert/strict';
import { config } from '../src/config.js';

assert.equal(config.retryLimit, 3);
