import { useState, useEffect } from 'react';

interface InputAreaProps {
    onTextChange: (text: string) => void;
    disabled?: boolean;
}

export function InputArea({ onTextChange, disabled }: InputAreaProps) {
    const [value, setValue] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            onTextChange(value);
        }, 800); // 800ms debounce

        return () => clearTimeout(timer);
    }, [value, onTextChange]);

    return (
        <div className="w-full max-w-xl mx-auto p-4">
            <textarea
                className="w-full h-64 p-4 rounded-2xl border-2 border-indigo-100 focus:border-indigo-400 focus:ring-0 resize-none text-lg bg-white/80 backdrop-blur-sm shadow-sm transition-all outline-none"
                placeholder="How are you feeling right now?"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={disabled}
            />
        </div>
    );
}
