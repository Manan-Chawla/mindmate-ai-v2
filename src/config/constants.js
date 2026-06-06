/**
 * MindMate AI Constants
 * Configuration and constant values used across the application.
 */

export const CONSTANTS = {
    // API Configurations
    API: {
        // Warning: In a production app, the key should NOT be hardcoded. 
        // For this static version, we can either hardcode a test key or ask user for it.
        // We will default to a local storage key, and prompt if missing.
        GEMINI_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
    },

    // Local Storage Keys
    STORAGE_KEYS: {
        THEME: 'mindmate_theme',
        MOOD_HISTORY: 'mindmate_mood_history',
        JOURNAL_ENTRIES: 'mindmate_journal',
        FOCUS_SESSIONS: 'mindmate_focus',
        USER_PROFILE: 'mindmate_user',
        API_KEY: 'mindmate_gemini_key',
        CHAT_HISTORY: 'mindmate_chat'
    },

    // Application Settings
    SETTINGS: {
        MAX_JOURNAL_LENGTH: 2000,
        MAX_CHAT_HISTORY: 50,
        FOCUS_MODES: {
            POMODORO: { work: 25, break: 5 },
            DEEP_FOCUS: { work: 50, break: 10 },
            ADVANCED: { work: 90, break: 20 }
        }
    },

    // Mood Definitions
    MOODS: {
        HAPPY: { value: 5, label: 'Happy', emoji: '😀', color: '#10B981' },
        GOOD: { value: 4, label: 'Good', emoji: '🙂', color: '#3B82F6' },
        NEUTRAL: { value: 3, label: 'Neutral', emoji: '😐', color: '#6B7280' },
        SAD: { value: 2, label: 'Sad', emoji: '😔', color: '#F59E0B' },
        STRESSED: { value: 1, label: 'Stressed', emoji: '😫', color: '#EF4444' },
        ANXIOUS: { value: 0, label: 'Anxious', emoji: '😰', color: '#8B5CF6' }
    }
};
