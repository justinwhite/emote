import { Emotion } from '../types';

interface SentenceBuilderProps {
    selectedEmotions: Emotion[];
    onRemove: (index: number) => void;
}

export function SentenceBuilder({ selectedEmotions, onRemove }: SentenceBuilderProps) {
    if (selectedEmotions.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl">
            <div className="max-w-md mx-auto">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Your Statement</h3>
                <div className="text-2xl font-medium text-gray-800 leading-relaxed">
                    <span>I feel </span>
                    {selectedEmotions.map((emotion, idx) => (
                        <span key={idx}>
                            {idx > 0 && (idx === selectedEmotions.length - 1 ? ' and ' : ', ')}
                            <button
                                onClick={() => onRemove(idx)}
                                className="inline-block relative group text-indigo-600 hover:text-red-500 transition-colors border-b-2 border-indigo-100 hover:border-red-100"
                            >
                                {emotion.name}
                            </button>
                        </span>
                    ))}
                    <span>.</span>
                </div>
            </div>
        </div>
    );
}
