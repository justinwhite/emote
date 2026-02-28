import { AIState, AiSession } from '../types';
import { Capacitor } from '@capacitor/core';
import { LocalAI } from './localAIPlugin';

// Augment window interface for Chrome AI
declare global {
    interface Window {
        ai: {
            languageModel: {
                capabilities: () => Promise<{ available: 'no' | 'readily' | 'after-download' }>;
                create: (options?: { systemPrompt?: string }) => Promise<AiSession>;
            };
        };
        LanguageModel: {
            availability: (options?: {
                expectedInputs?: Array<{ type: 'text', languages: string[] }>;
                expectedOutputs?: Array<{ type: 'text', languages: string[] }>;
            }) => Promise<'readily' | 'after-download' | 'no' | 'unavailable'>;
            create: (options?: any) => Promise<AiSession>;
            capabilities: () => Promise<any>;
        };
    }
}

export class AIService {
    private session: AiSession | null = null;
    private nativeSystemPrompt: string = '';
    private static instance: AIService;

    private constructor() { }

    static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    private useMock: boolean = false;

    async checkAvailability(): Promise<AIState> {
        if (Capacitor.isNativePlatform()) {
            return {
                isAvailable: true,
                status: 'ready',
                error: null
            };
        }

        // Prioritize the newer LanguageModel API
        if (window.LanguageModel) {
            try {
                const status = await window.LanguageModel.availability({
                    expectedInputs: [{ type: 'text', languages: ['en'] }],
                    expectedOutputs: [{ type: 'text', languages: ['en'] }],
                });

                if (status === 'no' || status === 'unavailable') {
                    console.warn('Gemini Nano not available (LanguageModel). Falling back to Mock Mode.');
                    this.useMock = true;
                    return {
                        isAvailable: true,
                        status: 'ready',
                        error: 'Using Mock AI (Gemini Nano not available)'
                    };
                }

                if (status === 'after-download') {
                    return {
                        isAvailable: true,
                        status: 'downloading',
                        downloadProgress: 0,
                        error: null
                    };
                }

                // Chrome 144+ might return 'readily' or 'available'
                if (status === 'readily' || (status as any) === 'available') {
                    this.useMock = false;
                    return {
                        isAvailable: true,
                        status: 'ready',
                        error: null
                    };
                }

                // Fallback for unknown status
                return {
                    isAvailable: true,
                    status: 'loading',
                    error: null
                };

            } catch (e: any) {
                console.error('Error checking LanguageModel availability:', e);
                // proceed to try legacy window.ai if this fails, or fallback
            }
        }

        // Legacy/Alternative fallback
        if (window.ai?.languageModel) {
            try {
                const cap = await window.ai.languageModel.capabilities();
                if (cap.available === 'no') {
                    this.useMock = true;
                    return {
                        isAvailable: true,
                        status: 'ready',
                        error: 'Using Mock AI (Gemini Nano not available)'
                    };
                }
                this.useMock = false;
                return {
                    isAvailable: true,
                    status: cap.available === 'readily' ? 'ready' : 'loading',
                    error: null
                };
            } catch (e) {
                console.error("Window.ai capabilities check failed", e);
            }
        }

        // If neither worked
        console.warn('Chrome Prompt API not found. Falling back to Mock Mode.');
        this.useMock = true;
        return {
            isAvailable: true,
            status: 'ready',
            error: 'Using Mock AI (Prompt API not detected)'
        };
    }

    async createSession(options?: any, onProgress?: (progress: number) => void): Promise<void> {
        if (this.useMock) {
            this.session = {
                prompt: async (input: string) => this.mockPrompt(input),
                promptStreaming: (input: string) => {
                    return (async function* (ctx) {
                        yield await ctx.mockPrompt(input);
                    })(this);
                },
                destroy: () => { }
            };
            return;
        }

        // Destroy existing session to free resources
        if (this.session) {
            this.session.destroy();
        }

        if (Capacitor.isNativePlatform()) {
            if (options?.systemPrompt) {
                this.nativeSystemPrompt = options.systemPrompt;
            }
            return;
        }

        try {
            if (window.LanguageModel) {
                // Map systemPrompt to initialPrompts if present
                // Ensure expectedInputs/Outputs are present as required by Chrome 144+
                const createOptions: any = {
                    expectedInputs: [{ type: 'text', languages: ['en'] }],
                    expectedOutputs: [{ type: 'text', languages: ['en'] }],
                    ...options
                };

                if (options?.systemPrompt) {
                    createOptions.initialPrompts = [
                        { role: 'system', content: options.systemPrompt }
                    ];
                    // Clean up non-standard property
                    delete createOptions.systemPrompt;
                }

                if (onProgress) {
                    createOptions.monitor = (m: any) => {
                        m.addEventListener('downloadprogress', (e: any) => {
                            onProgress(e.loaded * 100);
                        });
                    };
                }
                this.session = await window.LanguageModel.create(createOptions);
            } else if (window.ai?.languageModel) {
                this.session = await window.ai.languageModel.create(options);
            } else {
                throw new Error('AI not supported');
            }
        } catch (e) {
            console.error("Failed to create session", e);
            throw e;
        }
    }

    async prompt(input: string, options?: any): Promise<string> {
        if (Capacitor.isNativePlatform()) {
            const response = await LocalAI.generateEmotions({
                text: input,
                systemPrompt: this.nativeSystemPrompt
            });
            return response.result;
        }

        if (!this.session) {
            await this.createSession();
        }
        if (!this.session) throw new Error('Failed to create AI session');

        return await this.session.prompt(input, options);
    }

    async destroySession() {
        if (this.session) {
            this.session.destroy();
            this.session = null;
        }
    }

    private async mockPrompt(input: string): Promise<string> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));

        // Simple keyword matching mock
        const emotions = [];
        const lowerInput = input.toLowerCase();

        if (lowerInput.includes('hate') || lowerInput.includes('angry') || lowerInput.includes('mad')) {
            emotions.push({ name: 'angry', category: 'anger', intensity: 'high' });
            emotions.push({ name: 'frustrated', category: 'anger', intensity: 'medium' });
        }
        if (lowerInput.includes('sad') || lowerInput.includes('cry') || lowerInput.includes('miss')) {
            emotions.push({ name: 'sad', category: 'sadness', intensity: 'medium' });
            emotions.push({ name: 'lonely', category: 'sadness', intensity: 'medium' });
        }
        if (lowerInput.includes('happy') || lowerInput.includes('joy') || lowerInput.includes('great')) {
            emotions.push({ name: 'happy', category: 'joy', intensity: 'high' });
            emotions.push({ name: 'excited', category: 'joy', intensity: 'medium' });
        }
        if (lowerInput.includes('scared') || lowerInput.includes('afraid')) {
            emotions.push({ name: 'scared', category: 'fear', intensity: 'high' });
        }

        // Default if no keywords
        if (emotions.length === 0 && input.length > 5) {
            emotions.push({ name: 'calm', category: 'neutral', intensity: 'low' });
            emotions.push({ name: 'thoughtful', category: 'neutral', intensity: 'medium' });
        }

        return JSON.stringify(emotions);
    }

}

export const aiService = AIService.getInstance();
