
import React, { useRef, useEffect } from 'react';
import { UserCreation } from '../types';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;

interface MemePickerProps {
    userCreations: UserCreation[];
    onSelect: (imageUrl: string) => void;
    onClose: () => void;
    onCreateNew: () => void;
}

const MemePicker: React.FC<MemePickerProps> = ({ userCreations, onSelect, onClose, onCreateNew }) => {
    const pickerRef = useRef<HTMLDivElement>(null);
    const memes = userCreations.filter(c => c.type === 'Meme');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div ref={pickerRef} className="absolute bottom-full mb-2 left-0 w-72 md:w-96 bg-gray-900/95 border border-violet-500/50 rounded-lg shadow-2xl backdrop-blur-md p-3 flex flex-col animate-fadeIn z-50">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-violet-500/30">
                <h3 className="text-sm font-bold text-cyan-400">Meme Stash</h3>
                <button onClick={onCreateNew} className="flex items-center gap-1 text-xs text-white bg-cyan-600 hover:bg-cyan-500 px-2 py-1 rounded transition-colors">
                    <PlusIcon /> Create
                </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
                {memes.map(meme => (
                    <button 
                        key={meme.id} 
                        onClick={() => onSelect(meme.imageUrl)}
                        className="aspect-square rounded-md overflow-hidden border border-transparent hover:border-cyan-400 relative group"
                    >
                        <img src={meme.imageUrl} alt={meme.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-xs text-white font-bold">Send</span>
                        </div>
                    </button>
                ))}
                {memes.length === 0 && (
                    <div className="col-span-3 text-center py-8 text-gray-500 text-xs">
                        No memes yet. Create one!
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemePicker;