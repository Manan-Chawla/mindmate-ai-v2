import { StorageService } from '../../core/storage.js';
import { CONSTANTS } from '../../config/constants.js';
import { MoodTracker } from '../mood/moodTracker.js';

export const Gamification = {
    getProfile() {
        return StorageService.getItem(CONSTANTS.STORAGE_KEYS.USER_PROFILE, {
            xp: 0,
            level: 1,
            badges: []
        });
    },

    saveProfile(profile) {
        StorageService.setItem(CONSTANTS.STORAGE_KEYS.USER_PROFILE, profile);
        this.updateUI();
    },

    addXP(amount) {
        const profile = this.getProfile();
        profile.xp += amount;
        
        // Level up logic (every 100 XP is a level)
        const newLevel = Math.floor(profile.xp / 100) + 1;
        if (newLevel > profile.level) {
            profile.level = newLevel;
            alert(`🎉 Level Up! You are now level ${profile.level}!`);
        }
        
        this.saveProfile(profile);
    },

    awardBadge(badgeId, badgeName, icon) {
        const profile = this.getProfile();
        if (!profile.badges.find(b => b.id === badgeId)) {
            profile.badges.push({ id: badgeId, name: badgeName, icon });
            this.saveProfile(profile);
            // Could show a nice toast notification here
            alert(`🏆 New Achievement Unlocked: ${badgeName}`);
        }
    },

    checkAchievements() {
        const streak = MoodTracker.getStreak();
        if (streak >= 7) {
            this.awardBadge('streak_7', '7-Day Streak', '🔥');
        }
        
        const focus = StorageService.getItem(CONSTANTS.STORAGE_KEYS.FOCUS_SESSIONS, []);
        if (focus.length >= 10) {
            this.awardBadge('focus_10', 'Focus Master', '⏱️');
        }
    },

    updateUI() {
        const profile = this.getProfile();
        const streak = MoodTracker.getStreak();
        
        // Dispatch custom event to let UI update
        const event = new CustomEvent('gamificationUpdated', { detail: { profile, streak } });
        document.dispatchEvent(event);
    }
};
