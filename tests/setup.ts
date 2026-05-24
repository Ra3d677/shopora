// Test setup file for Vitest
// This file runs before each test file

// Set test environment variables (NODE_ENV is read-only in TS, skip it)
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
