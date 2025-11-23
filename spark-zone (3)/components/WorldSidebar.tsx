
import React, { useState } from 'react';
import { World, WorldLocation, User } from '../types';
import LocationChannelList from './LocationChannelList';
import WorldCodexPanel from './WorldCodexPanel';

const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>;
const HashtagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.05 3.547a.75.75 0 00-1.06 1.06L5.636 6.25H3.75a.75.75 0 000 1.5h1.259l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.94l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.259a.75.75 0 000-1.5H9.364l1.33-3.99a.75.75 0 10-1.42-.472L8.004 6.25H6.06l-1.01-3.033zM12.95 3.547a.75.75 0 00-1.06 1.06L13.536 6.25H11.75a.75.75 0 000 1.5h1.259l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.94l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.259a.75.75 0 000-1.5H17.364l1.33-3.99a.75.75 0 10-1.42-.472L16.004 6.25H14.06l-1.11-3.333z" clipRule="evenodd" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;
const ArrowLeftOnRectangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12.75 1a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V3.31L6.72 8.53a.75.75 0 01-1.06-1.06l6.25-6.25H10.5a.75.75 0 010-1.5h3.75c.414 0 .75.336.75.75zM3.25 4.5a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zM3.25 8a.75.75 0 01.75-.75h5.5a.75.75 0 010 1.5h-5.5a.75.75 0 01-.75-.75zM3.25 11.5a.75.75 0 01.75-.75h5.5a.75.75 0 010 1.5h-5.5a.75.75 0 01-.75-.75zM3.25 15a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>;
const GlobeAltIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-1.5 0a6.5 6.5 0 11-11-4.69v.447a3.5 3.5 0 001.025 2.475L8.293 10 8 10.293a1 1 0 000 1.414l1.06 1.06a1.5 1.5 0 01.44 1.061v.363a1 1 0 00.553.894l.276.139a1 1 0 001.342-.448l1.06-1.06a1.5 1.5 0 01.883-.422l.805-.161a3 3 0 002.08-2.08l.161-.805a1.5 1.5 0 01.422-.883l.883-.883z" clipRule="evenodd" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg>;

type SidebarTab = 'channels' | 'lore' | 'members' | 'map' | 'timeline';

interface TabButtonProps {
    icon: React.ReactElement;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 transition-colors duration-200 hover:bg-violet-500/10 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`}
    >
        <div className="w-6 h-6">{icon}</div>
        <span className="text-xs font-bold">{label}</span>
    </button>
);

interface WorldSidebarProps {
    world: World;
    activeLocationId: number;
    onSelectLocation: (location: WorldLocation) => void;
    onExit: () => void;
    onStartConversation: (userId: number) => void;
    currentUser: User;
    onShowAtlas: () => void;
    onShowTimeline: () => void;
}

const WorldSidebar: React.FC<WorldSidebarProps> = ({ world, activeLocationId, onSelectLocation, onExit, onStartConversation, currentUser, onShowAtlas, onShowTimeline }) => {
    const [activeTab, setActiveTab] = useState<SidebarTab>('channels');

    const handleTabClick = (tab: SidebarTab) => {
        setActiveTab(tab);
        if (tab === 'map') {
            onShowAtlas();
        } else if (tab === 'timeline') {
            onShowTimeline();
        }
    };

    return (
        <aside className="w-full md:w-80 flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border-r border-violet-500/30 flex flex-col h-full">
            {/* Header */}
            <header className="p-4 border-b border-violet-500/30 flex justify-between items-center flex-shrink-0">
                <h1 className="text-xl font-bold text-white truncate">{world.name}</h1>
                <button onClick={onExit} className="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white" title="Exit World">
                    <ArrowLeftOnRectangleIcon />
                </button>
            </header>

            {/* Banner */}
            <div className="h-24 bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${world.bannerUrl})` }}></div>

            {/* Tabs */}
            <div className="flex border-b border-violet-500/30 flex-shrink-0 overflow-x-auto scrollbar-hide">
                <TabButton icon={<HashtagIcon />} label="Channels" isActive={activeTab === 'channels'} onClick={() => handleTabClick('channels')} />
                <TabButton icon={<BookOpenIcon />} label="Lore" isActive={activeTab === 'lore'} onClick={() => handleTabClick('lore')} />
                <TabButton icon={<UsersIcon />} label="Members" isActive={activeTab === 'members'} onClick={() => handleTabClick('members')} />
                <TabButton icon={<ClockIcon />} label="Chronicle" isActive={activeTab === 'timeline'} onClick={() => handleTabClick('timeline')} />
                <TabButton icon={<GlobeAltIcon />} label="Atlas" isActive={activeTab === 'map'} onClick={() => handleTabClick('map')} />
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto">
                {activeTab === 'channels' && (
                    <LocationChannelList
                        locations={world.locations}
                        activeLocationId={activeLocationId}
                        onSelectLocation={onSelectLocation}
                    />
                )}
                {activeTab === 'lore' && (
                    <WorldCodexPanel world={world} activeTab="Lore" onStartConversation={onStartConversation} currentUser={currentUser} />
                )}
                {activeTab === 'members' && (
                    <WorldCodexPanel world={world} activeTab="Inhabitants" onStartConversation={onStartConversation} currentUser={currentUser} />
                )}
                {activeTab === 'map' && (
                    <div className="p-4 text-center text-gray-400">
                        <p>Viewing Map...</p>
                        <p className="text-xs mt-2">Use the main view to explore the interactive atlas.</p>
                    </div>
                )}
                {activeTab === 'timeline' && (
                    <div className="p-4 text-center text-gray-400">
                        <p>Viewing Chronicle...</p>
                        <p className="text-xs mt-2">Use the main view to scroll through history.</p>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default WorldSidebar;
