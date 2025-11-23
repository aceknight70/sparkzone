import React, { useState, useMemo } from 'react';
// FIX: Corrected import from `userCreations` to `initialUserCreations` as that is the exported member from mockData.
import { discoverableItems, initialUserCreations as userCreations } from '../mockData';
import { User } from '../types';
import DiscoveryCard from '../components/DiscoveryCard';
import WorkshopItemCard from '../components/WorkshopItemCard';

// --- Icons ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>;

// --- Reusable Components (similar to HomePage) ---
const ContentShelf: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-200 mb-3 px-4">{title}</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
            {children}
        </div>
    </div>
);

type ExploreTab = 'Discovery' | 'Library' | 'My Creations' | 'Trending';
type DiscoveryFilter = 'All' | 'Worlds' | 'Stories' | 'Characters' | 'Parties';

const discoveryFilters: DiscoveryFilter[] = ['All', 'Worlds', 'Stories', 'Characters', 'Parties'];

interface ExplorePageProps {
    onSelectWorld: (worldId: number) => void;
    onViewStory: (storyId: number) => void;
    onSelectParty: (partyId: number) => void;
    onStartConversation: (userId: number) => void;
    currentUser: User;
}

const ExplorePage: React.FC<ExplorePageProps> = ({ onSelectWorld, onViewStory, onSelectParty, onStartConversation, currentUser }) => {
    const [activeTab, setActiveTab] = useState<ExploreTab>('Discovery');
    const [activeFilter, setActiveFilter] = useState<DiscoveryFilter>('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDiscoveryItems = useMemo(() => {
        return discoverableItems
            .filter(item => {
                if (activeFilter === 'All') return true;
                if (activeFilter === 'Parties') return item.type === 'RP Card';
                return item.type === activeFilter;
            })
            .filter(item => 
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [activeFilter, searchTerm]);

    const TabButton: React.FC<{ tab: ExploreTab; label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 font-semibold transition-colors duration-200 whitespace-nowrap ${activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-cyan-300'}`}
        >
            {label}
        </button>
    );
    
    const FilterButton: React.FC<{ filter: DiscoveryFilter }> = ({ filter }) => (
         <button
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-full whitespace-nowrap transition-colors duration-200 ${activeFilter === filter ? 'bg-cyan-500 text-white' : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700'}`}
        >
            {filter}
        </button>
    );

    const getClickHandler = (item: typeof discoverableItems[0]) => {
        switch (item.type) {
            case 'World':
                return () => onSelectWorld(item.id);
            case 'Story':
                return () => onViewStory(item.id);
            case 'RP Card':
                return () => onSelectParty(item.id);
            default:
                return undefined;
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Discovery':
                return (
                    <div className="animate-fadeIn p-4">
                        <div className="relative mb-4">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for worlds, stories, characters..."
                                className="w-full bg-gray-800/60 border border-violet-500/30 rounded-full py-2.5 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <SearchIcon />
                            </div>
                        </div>
                         <div className="mb-6 flex items-center justify-start gap-2 overflow-x-auto scrollbar-hide">
                            {discoveryFilters.map(filter => <FilterButton key={filter} filter={filter} />)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                           {filteredDiscoveryItems.map(item => (
                               <DiscoveryCard 
                                    key={item.id} 
                                    item={item} 
                                    onClick={getClickHandler(item)}
                                    onStartConversation={onStartConversation}
                                    currentUserId={currentUser.id}
                                />
                            ))}
                        </div>
                    </div>
                );
            case 'Library':
                 return (
                    <div className="animate-fadeIn py-4">
                        <ContentShelf title="Joined Worlds">
                            {discoverableItems.filter(i => i.type === 'World').slice(0, 5).map(item => <DiscoveryCard key={item.id} item={item} onClick={() => onSelectWorld(item.id)} onStartConversation={onStartConversation} currentUserId={currentUser.id} />)}
                        </ContentShelf>
                        <ContentShelf title="Saved Stories">
                             {discoverableItems.filter(i => i.type === 'Story').slice(0, 5).map(item => <DiscoveryCard key={item.id} item={item} onClick={() => onViewStory(item.id)} onStartConversation={onStartConversation} currentUserId={currentUser.id} />)}
                        </ContentShelf>
                         <ContentShelf title="Active Parties">
                             {discoverableItems.filter(i => i.type === 'RP Card').slice(0, 5).map(item => <DiscoveryCard key={item.id} item={item} onClick={() => onSelectParty(item.id)} onStartConversation={onStartConversation} currentUserId={currentUser.id} />)}
                        </ContentShelf>
                    </div>
                 );
            case 'My Creations':
                return (
                    <div className="animate-fadeIn p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {userCreations.filter(c => c.status === 'Published').map(creation => (
                                <WorkshopItemCard key={creation.id} creation={creation} />
                            ))}
                        </div>
                    </div>
                );
            case 'Trending':
                const trendingParties = [...discoverableItems].sort((a,b) => (b.popularityScore || 0) - (a.popularityScore || 0)).filter(i => i.type === 'RP Card');
                const popularWorlds = [...discoverableItems].sort((a,b) => (b.popularityScore || 0) - (a.popularityScore || 0)).filter(i => i.type === 'World');
                return (
                     <div className="animate-fadeIn py-4">
                        <ContentShelf title="Trending Parties">
                            {trendingParties.slice(0, 5).map(item => <DiscoveryCard key={item.id} item={item} onClick={() => onSelectParty(item.id)} onStartConversation={onStartConversation} currentUserId={currentUser.id} />)}
                        </ContentShelf>
                        <ContentShelf title="Popular Worlds">
                             {popularWorlds.slice(0, 5).map(item => <DiscoveryCard key={item.id} item={item} onClick={() => onSelectWorld(item.id)} onStartConversation={onStartConversation} currentUserId={currentUser.id} />)}
                        </ContentShelf>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto max-w-6xl py-4 animate-fadeIn">
            <h1 className="text-4xl font-bold text-cyan-400 mb-4 px-4">Explore</h1>
            <div className="border-b border-violet-500/30 overflow-x-auto scrollbar-hide">
                <div className="flex space-x-2 px-4">
                    <TabButton tab="Discovery" label="Discovery" />
                    <TabButton tab="Library" label="Library" />
                    <TabButton tab="My Creations" label="My Creations" />
                    <TabButton tab="Trending" label="Trending" />
                </div>
            </div>
            {renderContent()}
        </div>
    );
};

export default ExplorePage;