import { StorageService } from './storage.js';
import { CONSTANTS } from '../config/constants.js';

export const GeminiAPI = {
    getKey() {
        return StorageService.getItem(CONSTANTS.STORAGE_KEYS.API_KEY);
    },

    setKey(key) {
        return StorageService.setItem(CONSTANTS.STORAGE_KEYS.API_KEY, key);
    },

    /**
     * Send a prompt to Gemini
     * @param {string} prompt 
     * @param {boolean} isJson Expect JSON output
     * @returns {Promise<any>}
     */
    async generateContent(prompt, isJson = false) {
        const apiKey = this.getKey();
        if (!apiKey) {
            throw new Error("API Key is missing. Please set your Gemini API key in settings.");
        }

        const url = `${CONSTANTS.API.GEMINI_URL}?key=${apiKey}`;

        const payload = {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            }
        };

        if (isJson) {
            // Hint to the model to return JSON
            payload.contents[0].parts[0].text += "\n\nProvide the response strictly as valid JSON without markdown wrapping.";
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Gemini API Error:", errorData);
                throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

            if (isJson) {
                // Attempt to parse JSON safely, stripping any residual markdown code blocks
                const cleaned = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(cleaned);
            }

            return textResponse;

        } catch (error) {
            console.error("Error communicating with Gemini:", error);
            throw error;
        }
    }
};
