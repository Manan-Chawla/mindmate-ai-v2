import { StorageService } from '../../core/storage.js';
import { CONSTANTS } from '../../config/constants.js';

export const ScoringEngine = {
    calculateWellnessScore() {
        const moods = StorageService.getItem(CONSTANTS.STORAGE_KEYS.MOOD_HISTORY, []);
        const focus = StorageService.getItem(CONSTANTS.STORAGE_KEYS.FOCUS_SESSIONS, []);
        
        let score = 50; // Base score

        // Mood factor (last 3 days)
        if (moods.length > 0) {
            const recentMoods = moods.slice(-3);
            const moodSum = recentMoods.reduce((acc, m) => acc + m.mood.value, 0);
            const moodAvg = moodSum / recentMoods.length; // 0 to 5
            // normalize to -20 to +20
            score += ((moodAvg / 5) * 40) - 20;
        }

        // Focus factor (last 3 days)
        if (focus.length > 0) {
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - 3);
            const recentFocus = focus.filter(f => new Date(f.date) >= cutoff);
            
            if (recentFocus.length > 0) {
                // If they studied, add some points, up to 15
                const points = Math.min(recentFocus.length * 2, 15);
                score += points;
            } else {
                // Not studying might cause slight anxiety, or maybe it's fine. We'll neutral it.
            }
        }

        return Math.min(Math.max(Math.round(score), 0), 100);
    },

    calculateBurnoutRisk() {
        // Burnout risk is inverse of wellness, but factoring in extreme focus without breaks
        // For simplicity in this demo:
        const wellness = this.calculateWellnessScore();
        return 100 - wellness; 
    },

    getRiskCategory(riskScore) {
        if (riskScore < 30) return { label: 'Low Risk', color: '#10B981' }; // Green
        if (riskScore < 60) return { label: 'Medium Risk', color: '#F59E0B' }; // Yellow
        return { label: 'High Risk', color: '#EF4444' }; // Red
    }
};
