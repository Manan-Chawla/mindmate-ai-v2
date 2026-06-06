import { GeminiAPI } from '../../core/api.js';
import { StorageService } from '../../core/storage.js';
import { CONSTANTS } from '../../config/constants.js';

export const AIJournal = {
    async analyzeEntry(text) {
        if (!text || text.trim().length < 10) {
            throw new Error("Journal entry is too short for analysis.");
        }

        const prompt = `
            You are MindMate AI, a supportive student wellness companion.
            Analyze the following journal entry from a student preparing for competitive exams.
            
            Journal Entry: "${text}"

            Provide a comprehensive analysis in strict JSON format with the following keys:
            - "emotion_summary": A short 1-sentence summary of how they are feeling.
            - "stress_level": A number from 0 to 100 (100 being extreme stress).
            - "triggers": An array of strings identifying potential stress triggers mentioned.
            - "positive_reinforcement": A short encouraging paragraph.
            - "actionable_suggestions": An array of 3 specific, practical suggestions to improve their well-being.
            
            Do NOT include markdown formatting in your response. Just valid JSON.
        `;

        try {
            const result = await GeminiAPI.generateContent(prompt, true);
            this.saveEntry(text, result);
            return result;
        } catch (error) {
            throw new Error("Analysis failed: " + error.message);
        }
    },

    saveEntry(text, analysis) {
        const history = StorageService.getItem(CONSTANTS.STORAGE_KEYS.JOURNAL_ENTRIES, []);
        history.push({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            content: text,
            analysis: analysis
        });
        StorageService.setItem(CONSTANTS.STORAGE_KEYS.JOURNAL_ENTRIES, history);
    },

    getHistory() {
        return StorageService.getItem(CONSTANTS.STORAGE_KEYS.JOURNAL_ENTRIES, []);
    }
};
