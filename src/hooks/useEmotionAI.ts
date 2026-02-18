import { useState, useEffect, useCallback } from 'react';
import { aiService } from '../services/aiService';
import { emotionService } from '../services/emotionService';
import { Emotion, AIState } from '../types';

export function useEmotionAI() {
    const [status, setStatus] = useState<AIState>({ isAvailable: false, status: 'idle', error: null });
    const [emotions, setEmotions] = useState<Emotion[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        async function init() {
            const availability = await aiService.checkAvailability();
            setStatus(availability);

            if (availability.isAvailable) {
                try {
                    // If we need to download, create session immediately to trigger download
                    if (availability.status === 'downloading') {
                        await aiService.createSession({}, (progress: number) => {
                            setStatus(prev => ({
                                ...prev,
                                status: 'downloading',
                                downloadProgress: progress
                            }));
                        });
                        // After download complete, status should be ready
                        setStatus(prev => ({
                            ...prev,
                            status: 'ready',
                            downloadProgress: 100
                        }));
                    }

                    // Initialize normally if ready or just finished downloading
                    await emotionService.initialize();

                    // Re-check status to confirm ready
                    if (availability.status !== 'downloading') {
                        const finalStatus = await aiService.checkAvailability();
                        setStatus(finalStatus);
                    }
                } catch (e: any) {
                    setStatus(prev => ({ ...prev, status: 'error', error: e.message }));
                }
            }
        }
        init();

        return () => {
            aiService.destroySession();
        };
    }, []);

    const analyzeText = useCallback(async (text: string) => {
        if (!status.isAvailable || status.status !== 'ready') return;

        setIsProcessing(true);
        try {
            const results = await emotionService.detectEmotions(text);
            setEmotions(results);
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    }, [status]);

    return {
        status,
        emotions,
        isProcessing,
        analyzeText
    };
}
