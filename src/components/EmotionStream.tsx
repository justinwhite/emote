import { Emotion } from '../types';

interface EmotionStreamProps {
    emotions: Emotion[];
    onSelect: (emotion: Emotion) => void;
}

export function EmotionStream({ emotions, onSelect }: EmotionStreamProps) {
    if (emotions.length === 0) return null;

    return (
        <div className="w-full max-w-md mx-auto p-4 flex flex-wrap gap-3 justify-center">
            {emotions.map((emotion, idx) => (
                <button
                    key={`${emotion.name}-${idx}`}
                    onClick={() => onSelect(emotion)}
                    className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 active:scale-95 shadow-sm
            ${getCategoryColor(emotion.category)}
          `}
                >
                    {emotion.name}
                </button>
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
