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
        Analyze the text and detect ALL distinct emotions present using ONLY the provided vocabulary list.
        
        Examples:
        - "I'm so tired but I'm really happy we finished the project." -> ["tired", "happy", "relieved"]
        - "This is frustrating, but I guess it's a good learning opportunity." -> ["frustrated", "hopeful"]
        - "I feel nothing." -> ["indifferent"]

        CRITICAL INSTRUCTION: Users often express mixed or conflicting feelings. You must identify ALL relevant emotions.
        - Map each detected feeling to the closest single-word emotion from the list.
        - Do NOT invent new words, do NOT combine words (e.g., "mixed-feelings"), and do NOT use phrases.
        - Return multiple emotions if the text conveys multiple feelings.

        Vocabulary Categories:
        - joy (needs met)
        - sadness (needs not met)
        - anger (needs not met)
        - fear (needs not met)
        - surprise
        - disgust
        - neutral

        ALLOWED VOCABULARY LIST:
        ${Object.values(NVC_EMOTIONS).flat().join(', ')}`;

        console.log('Using updated system prompt with few-shot examples.');

        await aiService.createSession({
            systemPrompt: systemPrompt,
            temperature: 0.8,
            topK: 40
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
                const allowedEmotions = new Set(Object.values(NVC_EMOTIONS).flat().map(e => e.toLowerCase()));

                return emotions
                    .map((e: any) => ({
                        name: (e.name || 'unknown').toLowerCase().trim(),
                        category: (e.category || 'neutral').toLowerCase().trim(),
                        intensity: (e.intensity || 'medium').toLowerCase()
                    }))
                    .filter(e => allowedEmotions.has(e.name)); // Strict filtering
            }
            return [];
        } catch (error) {
            console.error('Failed to parse emotions:', error);
            return [];
        }
    }
}

export const emotionService = EmotionService.getInstance();
