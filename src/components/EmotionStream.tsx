import { useState } from 'react';
import { Emotion } from '../types';
import { getEmotionDefinition } from '../data/definitions';

interface EmotionStreamProps {
    emotions: Emotion[];
    onSelect: (emotion: Emotion) => void;
}

export function EmotionStream({ emotions, onSelect }: EmotionStreamProps) {
    const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null);

    if (emotions.length === 0) return null;

    return (
        <div className="w-full max-w-md mx-auto p-4 flex flex-wrap gap-3 justify-center relative">
            {emotions.map((emotion, idx) => (
                <div key={`${emotion.name}-${idx}`} className="relative group">
                    <button
                        onClick={() => onSelect(emotion)}
                        onMouseEnter={() => setHoveredEmotion(emotion.name)}
                        onMouseLeave={() => setHoveredEmotion(null)}
                        className={`
                            px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 active:scale-95 shadow-sm
                            ${getCategoryColor(emotion.category)}
                        `}
                    >
                        {emotion.name}
                    </button>

                    {/* Tooltip */}
                    <div className={`
                        absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 
                        bg-gray-800 text-white text-xs rounded-lg py-2 px-3 shadow-xl z-10
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
                        text-center
                    `}>
                        {getEmotionDefinition(emotion.name)}
                        {/* Little arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function getCategoryColor(category: string): string {
    switch (category) {
        case 'joy': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        case 'sadness': return 'bg-blue-100 text-blue-800 border border-blue-200';
        case 'anger': return 'bg-red-100 text-red-800 border border-red-200';
        case 'fear': return 'bg-purple-100 text-purple-800 border border-purple-200';
        case 'surprise': return 'bg-pink-100 text-pink-800 border border-pink-200';
        default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
}
