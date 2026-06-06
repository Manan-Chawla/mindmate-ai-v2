import { Assert } from '../runner.js';
import { ScoringEngine } from '../../src/features/analytics/scoring.js';
import { StorageService } from '../../src/core/storage.js';
import { CONSTANTS } from '../../src/config/constants.js';

export const scoringTests = {
    'should return base score of 50 when no data exists': async () => {
        const score = ScoringEngine.calculateWellnessScore();
        Assert.equals(score, 50, "Base score should be exactly 50");
    },

    'should correctly calculate burnout risk as inverse of wellness': async () => {
        const wellness = ScoringEngine.calculateWellnessScore();
        const risk = ScoringEngine.calculateBurnoutRisk();
        Assert.equals(risk, 100 - wellness, "Risk should be 100 - wellness score");
    },

    'should boost wellness score when happy moods are logged': async () => {
        // Mock happy moods
        StorageService.setItem(CONSTANTS.STORAGE_KEYS.MOOD_HISTORY, [
            { mood: CONSTANTS.MOODS.HAPPY, timestamp: new Date().toISOString() },
            { mood: CONSTANTS.MOODS.HAPPY, timestamp: new Date().toISOString() }
        ]);

        const score = ScoringEngine.calculateWellnessScore();
        Assert.isTrue(score > 50, "Score should be greater than 50 when happy");
    },

    'should identify High Risk category correctly': async () => {
        const category = ScoringEngine.getRiskCategory(85);
        Assert.equals(category.label, 'High Risk');
        Assert.equals(category.color, '#EF4444');
    }
};
