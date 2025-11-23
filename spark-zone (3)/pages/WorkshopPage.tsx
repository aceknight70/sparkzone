


import React, { useState, useRef, useEffect } from 'react';
import { UserCreation } from '../types';
import WorkshopItemCard from '../components/WorkshopItemCard';

// --- Icons ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>;
const CharacterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;
const WorldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9.42 2.222a.75.75 0 011.16 0l4.25 6.5a.75.75 0 01-.58 1.168h-8.5a.75.75 0 01-.58-1.168l4.25-6.5zM10 8.25a.75.75 0 01.75.75v3.19l2.22 1.48a.75.75 0 11-.74 1.11l-2.5-1.667A.75.75 0 019.25 12V9a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>;
const StoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2.5 1a.5.5 0 00-.5.5v1.886c0 .041.012.08.034.114l1.192 1.589a.5.5 0 00.316.16h3.916a.5.5 0 00.316-.16l1.192-1.589A.5.5 0 0013.5 7.386V5.5a.5.5 0 00-.5-.5h-9z" clipRule="evenodd" /></svg>;
const PartyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M12.75 1.522a1.5 1.5 0 012.058 2.058l-6 6a1.5 1.5 0 01-2.058-2.058l6-6zM8.5 7.75a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z" /><path d="M12.5 10a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /><path d="M3.66 4.01a.75.75 0 00-1.112 1.018l1.016 1.11a.75.75 0 001.112-1.018L3.66 4.01zM15.99 15.28a.75.75 0 00-1.017 1.112l1.11 1.016a.75.75 0 001.018-1.112l-1.11-1.016z" /></svg>;
const MemeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 9.22a.75.75 0 00-1.06 1.06L8.94 12l-1.72 1.72a.75.75 0 101.06 1.06L10 13.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 12l1.72-1.72a.75.75 0 00-1.06-1.06L10 10.94 8.28 9.22zM8 6.5a1 1 0 11-2 0 1 1 0 012 0zm6 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" /></svg>;

type CreationFilter = 'All' | UserCreation['type'];
const filters: CreationFilter[] = ['All', 'Character', 'World', 'Story', 'AI Character', 'Meme', 'RP Card'];

interface WorkshopPageProps {
    userCreations: UserCreation[];
    onEditWorld: (worldId: number) => void;
    onCreateCharacter: () => void;
    onEditCharacter: (characterId: number) => void;
    onViewCharacter: (characterId: number) => void;
    onCreateStory: () => void;
    onEditStory: (storyId: number) => void;
    onViewStory: (storyId: number) => void;
    onCreateWorld: () => void;
    onCreateParty: () => void;
    onEditParty: (partyId: number) => void;
    onCreateMeme: () => void;
}

const WorkshopPage: React.FC<WorkshopPageProps> = ({
    userCreations,
    onEditWorld,
    onCreateCharacter,
    onEditCharacter,
    onViewCharacter,
    onCreateStory,
    onEditStory,
    onViewStory,
    onCreateWorld,
    onCreateParty,
    onEditParty,
    onCreateMeme
}) => {
    const [filter, setFilter] = useState<CreationFilter>('All');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuRef]);

    const filteredCreations = userCreations.filter(c => filter === 'All' || c.type === filter);

    const MenuItem: React.FC<{ icon: React.ReactElement; text: string; onClick?: () => void }> = ({ icon, text, onClick }) => (
        <button onClick={onClick} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-violet-500/20 hover:text-white transition-colors" role="menuitem">
            <div className="w-5 h-5 text-gray-400">{icon}</div>
            <span>{text}</span>
        </button>
    );

    const getHandlers = (creation: UserCreation) => {
        switch (creation.type) {
            case 'Character':
            case 'AI Character':
                return { 
                    onView: () => onViewCharacter(creation.id),
                    onEdit: () => onEditCharacter(creation.id)
                };
            case 'World':
                return { onEdit: () => onEditWorld(creation.id) };
            case 'Story':
                return { onEdit: () => onEditStory(creation.id), onView: () => onViewStory(creation.id) };
            case 'Meme':
                return {};
            case 'RP Card':
                 return { onEdit: () => onEditParty(creation.id) };
            default:
                return {};
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-cyan-400">Workshop</h1>
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(prev => !prev)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 text-white font-semibold rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
                    >
                        <PlusIcon />
                        <span>Create New</span>
                        <ChevronDownIcon />
                    </button>
                    <div className={`absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg bg-gray-900 border border-violet-500/50 ring-1 ring-black ring-opacity-5 z-10 transition-all duration-100 ease-out ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                        <div className="py-1" role="menu" aria-orientation="vertical">
                            <MenuItem icon={<CharacterIcon />} text="Character" onClick={onCreateCharacter} />
                            <MenuItem icon={<WorldIcon />} text="World" onClick={onCreateWorld} />
                            <MenuItem icon={<StoryIcon />} text="Story" onClick={onCreateStory} />
                            <MenuItem icon={<PartyIcon />} text="RP Card / Party" onClick={onCreateParty} />
                            <MenuItem icon={<MemeIcon />} text="Meme" onClick={onCreateMeme} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6 flex items-center justify-start gap-2 overflow-x-auto scrollbar-hide pb-2">
                {filters.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full whitespace-nowrap transition-colors duration-200 ${filter === f ? 'bg-cyan-500 text-white' : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCreations.map(creation => (
                    <WorkshopItemCard key={creation.id} creation={creation} {...getHandlers(creation)} />
                ))}
            </div>
        </div>
    );
};

export default WorkshopPage;