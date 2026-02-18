import { aiService } from './aiService';
import { Emotion } from '../types';



export class EmotionService {
    private static instance: EmotionService;

    private constructor() { }

    static getInstance(): EmotionService {
        if (!EmotionService.instance) {
            EmotionService.instance = new EmotionService();
        }
        return EmotionService.instance;
    }

    async initialize() {
        // We might be calling this after a download, so we don't want to overwrite 
        // a session if it was just created for downloading, UNLESS we need to set system prompt.
        // For now, simple re-creation is fine as long as model is downloaded.
        await aiService.createSession({
            systemPrompt: 'You are an expert empathic listener. Analyze the text and detect emotions.',
        });
    }

    async detectEmotions(text: string): Promise<Emotion[]> {
        if (!text || text.trim().length < 3) return [];

        try {
            // With structured output, the response is a valid JSON string matching the schema.
            const response = await aiService.prompt(text, {
                responseConstraint: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            category: { type: "string", enum: ["joy", "sadness", "anger", "fear", "surprise", "disgust", "neutral"] },
                            intensity: { type: "string", enum: ["low", "medium", "high"] }
                        }
                    }
                }
            });
            console.log("Raw AI response:", response);

            const emotions = JSON.parse(response);

            if (Array.isArray(emotions)) {
                return emotions.map((e: any) => ({
                    name: e.name || 'unknown',
                    category: e.category || 'neutral',
                    intensity: e.intensity || 'medium'
                }));
            }
            return [];
        } catch (error) {
            console.error('Failed to parse emotions:', error);
            return [];
        }
    }
}

export const emotionService = EmotionService.getInstance();
