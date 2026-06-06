import { GeminiAPI } from '../../core/api.js';
import { StorageService } from '../../core/storage.js';
import { CONSTANTS } from '../../config/constants.js';

export const AICoach = {
    systemPrompt: `You are MindMate AI, a supportive student wellness companion. Help students manage exam stress, anxiety, burnout, productivity challenges, and emotional struggles. You are not a therapist and should never diagnose medical conditions. Always provide supportive, practical, positive, and actionable guidance. Keep responses concise, well-structured, and encouraging.`,

    history: [],

    init() {
        this.history = StorageService.getItem(CONSTANTS.STORAGE_KEYS.CHAT_HISTORY, []);
    },

    getHistory() {
        return this.history;
    },

    async sendMessage(userMessage) {
        if (!userMessage.trim()) return null;

        // Save user message
        this._addMessage('user', userMessage);

        // Format history for Gemini prompt
        // Gemini API normally expects an array of contents with role.
        // For simplicity in this demo, we'll construct a text prompt with context.
        // In a full production app using Gemini SDK, you'd use the `role: "user" | "model"` array format.
        
        const conversationContext = this.history
            .slice(-10) // Only send last 10 messages for context window management
            .map(msg => `${msg.role === 'user' ? 'Student' : 'MindMate'}: ${msg.content}`)
            .join('\n\n');

        const prompt = `
            ${this.systemPrompt}
            
            Conversation History:
            ${conversationContext}
            
            Student's new message: "${userMessage}"
            
            MindMate's response:
        `;

        try {
            const responseText = await GeminiAPI.generateContent(prompt, false);
            this._addMessage('assistant', responseText);
            return responseText;
        } catch (error) {
            console.error("Chat Error:", error);
            // Revert user message if failed, or handle gracefully
            throw error;
        }
    },

    _addMessage(role, content) {
        this.history.push({ role, content, timestamp: new Date().toISOString() });
        
        // Prune history if it gets too long
        if (this.history.length > CONSTANTS.SETTINGS.MAX_CHAT_HISTORY) {
            this.history = this.history.slice(-CONSTANTS.SETTINGS.MAX_CHAT_HISTORY);
        }
        
        StorageService.setItem(CONSTANTS.STORAGE_KEYS.CHAT_HISTORY, this.history);
    },

    clearHistory() {
        this.history = [];
        StorageService.removeItem(CONSTANTS.STORAGE_KEYS.CHAT_HISTORY);
    }
};
