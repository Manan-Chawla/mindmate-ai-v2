import { StorageService } from '../../core/storage.js';
import { CONSTANTS } from '../../config/constants.js';

export const MoodTracker = {
    init() {
        this.history = StorageService.getItem(CONSTANTS.STORAGE_KEYS.MOOD_HISTORY, []);
    },

    /**
     * Save a mood entry
     * @param {string} moodKey 
     * @param {string} notes Optional notes
     */
    logMood(moodKey, notes = '') {
        const mood = CONSTANTS.MOODS[moodKey.toUpperCase()];
        if (!mood) return false;

        const entry = {
            id: Date.now().toString(),
            mood: mood,
            timestamp: new Date().toISOString(),
            notes: notes
        };

        this.history.push(entry);
        StorageService.setItem(CONSTANTS.STORAGE_KEYS.MOOD_HISTORY, this.history);
        return entry;
    },

    /**
     * Get mood history for a specific number of days
     * @param {number} days 
     */
    getHistory(days = 7) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return this.history.filter(entry => new Date(entry.timestamp) >= cutoff);
    },

    /**
     * Calculate current mood streak
     */
    getStreak() {
        if (this.history.length === 0) return 0;
        
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0,0,0,0);

        // Sort descending
        const sorted = [...this.history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Very basic streak calculation (can be enhanced to check actual consecutive days)
        let lastDateChecked = null;
        for (const entry of sorted) {
            const entryDate = new Date(entry.timestamp);
            entryDate.setHours(0,0,0,0);
            
            if (!lastDateChecked) {
                // First entry checked
                const diff = (currentDate - entryDate) / (1000 * 60 * 60 * 24);
                if (diff <= 1) {
                    streak++;
                    lastDateChecked = entryDate;
                } else {
                    break;
                }
            } else {
                const diff = (lastDateChecked - entryDate) / (1000 * 60 * 60 * 24);
                if (diff === 1) {
                    streak++;
                    lastDateChecked = entryDate;
                } else if (diff === 0) {
                    // Same day multiple entries, ignore for streak
                    continue;
                } else {
                    break;
                }
            }
        }
        return streak;
    }
};
