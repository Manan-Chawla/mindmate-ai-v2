/**
 * Core Utilities
 * Generic helper functions used across the application.
 */

export const Utils = {
    /**
     * Formats a date into a readable string
     * @param {Date|string|number} date 
     * @returns {string} e.g. "Oct 12, 2023"
     */
    formatDate: (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },

    /**
     * Sanitizes a string to prevent XSS (Basic fallback, DOMPurify should be used for real HTML)
     * @param {string} str 
     * @returns {string}
     */
    escapeHTML: (str) => {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Generates a unique ID
     * @returns {string}
     */
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Simple debounce function
     * @param {Function} func 
     * @param {number} wait 
     * @returns {Function}
     */
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};
