import { registerPlugin } from '@capacitor/core';

export interface LocalAIPlugin {
    generateEmotions(options: { text: string, systemPrompt?: string }): Promise<{ result: string }>;
}

export const LocalAI = registerPlugin<LocalAIPlugin>('LocalAI');
