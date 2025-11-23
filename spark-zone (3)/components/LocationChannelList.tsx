
import React from 'react';
import { WorldLocation } from '../types';

const HashtagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.05 3.547a.75.75 0 00-1.06 1.06L5.636 6.25H3.75a.75.75 0 000 1.5h1.259l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.94l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.259a.75.75 0 000-1.5H9.364l1.33-3.99a.75.75 0 10-1.42-.472L8.004 6.25H6.06l-1.01-3.033zM12.95 3.547a.75.75 0 00-1.06 1.06L13.536 6.25H11.75a.75.75 0 000 1.5h1.259l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.94l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.259a.75.75 0 000-1.5H17.364l1.33-3.99a.75.75 0 10-1.42-.472L16.004 6.25H14.06l-1.11-3.333z" clipRule="evenodd" /></svg>;

interface LocationChannelListProps {
    locations: { category: string; channels: WorldLocation[] }[];
    activeLocationId: number;
    onSelectLocation: (location: WorldLocation) => void;
}

const LocationChannelList: React.FC<LocationChannelListProps> = ({ locations, activeLocationId, onSelectLocation }) => {
    return (
        <nav className="p-2 space-y-4">
            {locations.map((category, index) => (
                <div key={index}>
                    <h2 className="px-2 pb-1 text-xs font-bold tracking-wider text-gray-400 uppercase">{category.category}</h2>
                    <ul className="space-y-1">
                        {category.channels.map(channel => (
                            <li key={channel.id}>
                                <button 
                                    onClick={() => onSelectLocation(channel)}
                                    className={`w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-md transition-colors group ${activeLocationId === channel.id ? 'bg-violet-500/20 text-white' : 'text-gray-300 hover:bg-gray-800/60'}`}
                                >
                                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-500 group-hover:text-gray-400">
                                        {channel.iconUrl ? (
                                            <img src={channel.iconUrl} alt="" className="w-5 h-5 rounded-sm object-cover" />
                                        ) : (
                                            <HashtagIcon />
                                        )}
                                    </div>
                                    <span className="truncate">{channel.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </nav>
    );
};

export default LocationChannelList;
