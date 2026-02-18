export interface Emotion {
    name: string;
    category: 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust' | 'neutral';
    intensity: 'low' | 'medium' | 'high';
    color?: string; // Hex code for UI
}

export interface AIState {
    isAvailable: boolean;
    error: string | null;
    status: 'idle' | 'loading' | 'ready' | 'error' | 'downloading';
    downloadProgress?: number;
}

export interface AiSession {
    prompt: (input: string, options?: any) => Promise<string>;
    promptStreaming: (input: string) => AsyncIterable<string>;
    destroy: () => void;
}
