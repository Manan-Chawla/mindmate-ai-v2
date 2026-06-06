// A minimal, custom testing framework

export class Assert {
    static isTrue(condition, message) {
        if (!condition) throw new Error(message || "Assertion failed: expected true");
    }

    static isFalse(condition, message) {
        if (condition) throw new Error(message || "Assertion failed: expected false");
    }

    static equals(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Assertion failed: expected ${expected}, got ${actual}`);
        }
    }
}

export async function runSuite(suiteName, tests) {
    const results = [];
    for (const [testName, testFn] of Object.entries(tests)) {
        try {
            await testFn();
            results.push({ name: testName, passed: true });
        } catch (error) {
            results.push({ name: testName, passed: false, error: error.message });
        }
    }
    return results;
}

// Import all test suites
import { scoringTests } from './unit/scoring.test.js';
import { storageTests } from './unit/storage.test.js';
import { validationTests } from './ui/validation.test.js';

export async function runAllTests() {
    // Save current local storage state so tests don't permanently ruin real data
    const backup = { ...localStorage };
    
    const results = {};
    
    // Clear storage for a clean test environment
    localStorage.clear();
    
    results['Unit Tests - Scoring Engine'] = await runSuite('Scoring', scoringTests);
    
    localStorage.clear();
    results['Unit Tests - Storage Service'] = await runSuite('Storage', storageTests);
    
    localStorage.clear();
    results['UI & Validation Tests'] = await runSuite('Validation', validationTests);

    // Restore local storage
    localStorage.clear();
    for (const [key, value] of Object.entries(backup)) {
        localStorage.setItem(key, value);
    }

    return results;
}
