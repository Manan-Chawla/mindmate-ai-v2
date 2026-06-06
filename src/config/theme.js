import { StorageService } from '../core/storage.js';
import { CONSTANTS } from './constants.js';

/**
 * Theme Management Logic
 * Handles dark/light mode toggling and system preferences.
 */
export const ThemeManager = {
    init() {
        const savedTheme = StorageService.getItem(CONSTANTS.STORAGE_KEYS.THEME);
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark ? 'dark' : 'light');
        }

        // Listen for system changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!StorageService.getItem(CONSTANTS.STORAGE_KEYS.THEME)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        StorageService.setItem(CONSTANTS.STORAGE_KEYS.THEME, theme);
        
        // Update any charts if present
        this._updateChartThemes(theme);
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        return newTheme;
    },

    _updateChartThemes(theme) {
        // We will dispatch a custom event that analytics components can listen to
        const event = new CustomEvent('themeChanged', { detail: { theme } });
        document.dispatchEvent(event);
    }
};
