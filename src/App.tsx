import { useState } from 'react';
import { InputArea } from './components/InputArea';
import { EmotionStream } from './components/EmotionStream';
import { SentenceBuilder } from './components/SentenceBuilder';
import { useEmotionAI } from './hooks/useEmotionAI';
import { Emotion } from './types';

function App() {
    const { status, emotions, isProcessing, analyzeText } = useEmotionAI();
    const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([]);


    const handleEmotionSelect = (emotion: Emotion) => {
        if (!selectedEmotions.find(e => e.name === emotion.name)) {
            setSelectedEmotions(prev => [...prev, emotion]);
        }
    };

    const handleRemoveEmotion = (index: number) => {
        setSelectedEmotions(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col pt-12 pb-32">
            <div className="text-center mb-8 px-6">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">Emote</h1>
                <p className="text-gray-500 font-medium tracking-wide">Express yourself with clarity</p>
            </div>

            <div className="flex-1 flex flex-col items-center w-full max-w-lg mx-auto px-4">
                {(status.status === 'error' || (status.status === 'ready' && status.error)) && (
                    <div className={`w-full mb-6 p-4 rounded-xl text-sm border ${status.error?.includes('Mock')
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-100'
                        : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                        {status.error}
                    </div>
                )}

                {status.status === 'loading' && (
                    <div className="w-full mb-6 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm border border-blue-100 animate-pulse">
                        Initializing Gemini Nano...
                    </div>
                )}

                {status.status === 'downloading' && (
                    <div className="w-full mb-6 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm border border-blue-100">
                        <div className="flex justify-between mb-2 font-medium">
                            <span>Downloading AI Model...</span>
                            <span>{Math.round(status.downloadProgress || 0)}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${status.downloadProgress || 0}%` }}
                            ></div>
                        </div>
                        <p className="mt-2 text-xs opacity-75">This happens only once. Please keep this page open.</p>
                    </div>
                )}

                <InputArea
                    onTextChange={analyzeText}
                    disabled={status.status !== 'ready'}
                />

                <div className="w-full mt-6 min-h-[100px]">
                    {isProcessing ? (
                        <div className="flex justify-center space-x-2 py-8">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    ) : (
                        <EmotionStream emotions={emotions} onSelect={handleEmotionSelect} />
                    )}
                </div>
            </div>

            <SentenceBuilder
                selectedEmotions={selectedEmotions}
                onRemove={handleRemoveEmotion}
            />

        </div>
    );
}

export default App;
