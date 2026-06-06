import { Assert } from '../runner.js';
import { AIJournal } from '../../src/features/journal/journal.js';

export const validationTests = {
    'Journal should reject entries less than 10 characters': async () => {
        let threwError = false;
        try {
            await AIJournal.analyzeEntry("Too short");
        } catch (error) {
            threwError = true;
            Assert.isTrue(error.message.includes("too short"), "Error message should mention length constraint");
        }
        Assert.isTrue(threwError, "analyzeEntry should throw an error for short strings");
    },

    'Journal should reject empty strings': async () => {
        let threwError = false;
        try {
            await AIJournal.analyzeEntry("   ");
        } catch (error) {
            threwError = true;
        }
        Assert.isTrue(threwError, "analyzeEntry should throw an error for whitespace strings");
    }
};
