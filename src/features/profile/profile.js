import { StorageService } from '../../core/storage.js';
import { CONSTANTS } from '../../config/constants.js';

export const UserProfile = {
    /**
     * Default profile structure
     */
    getDefaultProfile() {
        return {
            name: '',
            bio: '',
            examType: 'JEE',
            targetScore: '',
            studyHours: 6,
            sleepHours: 7,
            xp: 0,
            level: 1,
            badges: []
        };
    },

    /**
     * Get the current user profile from storage
     * Handles merging legacy gamification data if present
     */
    getProfile() {
        const stored = StorageService.getItem(CONSTANTS.STORAGE_KEYS.USER_PROFILE);
        const defaultProfile = this.getDefaultProfile();
        
        if (!stored) {
            return defaultProfile;
        }

        return { ...defaultProfile, ...stored };
    },

    /**
     * Update and save the profile
     * @param {Object} updates 
     */
    updateProfile(updates) {
        const currentProfile = this.getProfile();
        const updatedProfile = { ...currentProfile, ...updates };
        StorageService.setItem(CONSTANTS.STORAGE_KEYS.USER_PROFILE, updatedProfile);
        
        // Dispatch global event so UI can update (e.g. top right avatar name)
        document.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedProfile }));
        
        return updatedProfile;
    },

    /**
     * Get user's name or a default fallback
     */
    getDisplayName() {
        const profile = this.getProfile();
        return profile.name && profile.name.trim() !== '' ? profile.name : 'Student';
    }
};
