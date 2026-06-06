import { GeminiAPI } from '../../core/api.js';

export const WellnessRoadmap = {
    async generateRoadmap(profileData) {
        const { exam, studyHours, sleepHours, stressLevel } = profileData;

        const prompt = `
            You are MindMate AI, a student wellness expert.
            Create a personalized wellness roadmap for a student with the following profile:
            - Preparing for: ${exam}
            - Current daily study hours: ${studyHours}
            - Current daily sleep hours: ${sleepHours}
            - Current stress level (0-100): ${stressLevel}

            Respond in strict JSON format with the following keys:
            - "morning_routine": Array of 3 short morning habits.
            - "study_strategy": Array of 3 practical study tips based on their hours.
            - "break_schedule": A short recommendation for taking breaks.
            - "sleep_hygiene": A short recommendation to improve sleep.
            - "exercise_plan": A simple daily physical activity suggestion.
            - "overall_advice": A short encouraging paragraph summarizing the roadmap.

            Do NOT include markdown formatting. Just valid JSON.
        `;

        try {
            return await GeminiAPI.generateContent(prompt, true);
        } catch (error) {
            throw new Error("Failed to generate roadmap: " + error.message);
        }
    }
};
