import { config } from 'dotenv';

// Load environment variables
config();

// Set dummy Stripe key for tests
process.env.STRIPE_SECRET_KEY = 'sk_test_dummy_key_for_testing';

// Global test setup
beforeAll(() => {
  // Any global setup needed
  jest.setTimeout(15000);
});

afterAll(() => {
  // Any global cleanup needed
  jest.clearAllTimers();
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
