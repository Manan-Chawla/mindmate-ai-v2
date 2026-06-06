/**
 * LocalStorage Wrapper
 * Handles all interactions with LocalStorage safely with fallback and error handling.
 */

export const StorageService = {
    /**
     * Save data to local storage
     * @param {string} key 
     * @param {any} data 
     * @returns {boolean} Success status
     */
    setItem: (key, data) => {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(key, serializedData);
            return true;
        } catch (error) {
            console.error(`Error saving to localStorage key "${key}":`, error);
            // Handle quota exceeded or privacy mode blocks
            return false;
        }
    },

    /**
     * Retrieve data from local storage
     * @param {string} key 
     * @param {any} defaultValue 
     * @returns {any}
     */
    getItem: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading from localStorage key "${key}":`, error);
            return defaultValue;
        }
    },

    /**
     * Remove an item from local storage
     * @param {string} key 
     */
    removeItem: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage key "${key}":`, error);
        }
    },

    /**
     * Clear all MindMate specific data
     * (We only clear keys that start with 'mindmate_')
     */
    clearAppStorage: () => {
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('mindmate_')) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error("Error clearing app storage:", error);
            return false;
        }
    }
};
