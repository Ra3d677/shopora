// Test setup file for Vitest
// This file runs before each test file

// Set test environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.NODE_ENV = 'test' as string;