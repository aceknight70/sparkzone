
import React, { useState, useRef, useEffect } from 'react';
// FIX: Imported UserCreation type from ../types as it is not exported from mockData.
import { UserCreation } from '../types';

const MoreOptionsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
    </svg>
);

interface WorkshopItemCardProps {
    creation: UserCreation;
    onEdit?: () => void;
    onView?: () => void;
}

const WorkshopItemCard: React.FC<WorkshopItemCardProps> = ({ creation, onEdit, onView }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuRef]);
    
    const statusColorMap: Record<UserCreation['status'], string> = {
        Draft: 'bg-yellow-500/80 text-yellow-50',
        Published: 'bg-green-500/80 text-green-50',
        Active: 'bg-rose-500/80 text-rose-50',
    };

    const statusColor = statusColorMap[creation.status] || 'bg-gray-500/80';
    
    const cardContent = (
        <>
            <div className="aspect-[4/3] overflow-hidden">
                 <img src={creation.imageUrl} alt={creation.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-white truncate">{creation.name}</p>
                        <p className="text-sm text-gray-400">{creation.type}</p>
                    </div>
                     <div className="relative" ref={menuRef}>
                         <button 
                             onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o); }} 
                             disabled={!onEdit}
                             className="p-1 -mr-1 -mt-1 rounded-full text-gray-400 hover:bg-violet-500/20 hover:text-white disabled:opacity-50 disabled:pointer-events-none z-10 relative">
                            <MoreOptionsIcon />
                        </button>
                        {menuOpen && onEdit && (
                            <div className="absolute right-0 mt-2 w-32 origin-top-right rounded-md shadow-lg bg-gray-800 border border-violet-500/50 ring-1 ring-black ring-opacity-5 z-20 animate-fadeIn">
                                <div className="py-1">
                                    <button onClick={(e) => { e.stopPropagation(); onEdit(); setMenuOpen(false); }} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-violet-500/20">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-auto pt-4">
                     <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
                        {creation.status}
                    </span>
                </div>
            </div>
        </>
    );

    if (onView) {
        return (
            <div 
                onClick={onView} 
                className="text-left bg-gray-900/50 border border-violet-500/30 rounded-lg overflow-hidden group transition-all hover:border-violet-400 hover:shadow-xl hover:shadow-violet-500/10 flex flex-col cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') onView(); }}
            >
                {cardContent}
            </div>
        );
    }

    return (
        <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg overflow-hidden group transition-all flex flex-col">
            {cardContent}
        </div>
    );
};

export default WorkshopItemCard;
