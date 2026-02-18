import { aiService } from './aiService';
import { Emotion } from '../types';
import { NVC_EMOTIONS } from '../data/emotions';



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

        const systemPrompt = `You are an expert empathic listener trained in Non-Violent Communication (NVC). 
        Analyze the text and detect emotions using sophisticated, precise vocabulary.
        
        Use the following categories:
        - joy (needs met)
        - sadness (needs not met)
        - anger (needs not met)
        - fear (needs not met)
        - surprise
        - disgust
        - neutral

        When selecting the 'name' of the emotion, PREFER words from this list:
        ${Object.values(NVC_EMOTIONS).flat().join(', ')}
        
        If the exact feeling isn't in the list, choose the closest sophisticated synonym.`;

        await aiService.createSession({
            systemPrompt: systemPrompt
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
