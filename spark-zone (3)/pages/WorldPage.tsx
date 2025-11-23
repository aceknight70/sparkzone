
import React, { useState, useEffect } from 'react';
import { World, WorldLocation, UserCreation, User } from '../types';
import GroupChatView from '../components/GroupChatView';
import WorldSidebar from '../components/WorldSidebar';
import WorldMapView from '../components/WorldMapView';
import WorldTimelineView from '../components/WorldTimelineView';

interface WorldPageProps {
    world: World;
    onExit: () => void;
    onSendGroupMessage: (worldId: number, locationId: number, text: string, character?: UserCreation, imageUrl?: string) => void;
    userCreations: UserCreation[];
    onStartConversation: (userId: number) => void;
    currentUser: User;
    onSaveMeme?: (meme: { name: string, imageUrl: string }) => void;
    onPlayMusic?: (url: string | null) => void;
}

const EmptyChatView: React.FC = () => (
    <div className="flex-grow flex items-center justify-center text-gray-400 h-full bg-black/20">
        <p>Select a channel to start role-playing.</p>
    </div>
);

const WorldPage: React.FC<WorldPageProps> = ({ world, onExit, onSendGroupMessage, userCreations, onStartConversation, currentUser, onSaveMeme, onPlayMusic }) => {
    const initialLocationId = world.locations?.[0]?.channels?.[0]?.id ?? null;
    const [activeLocationId, setActiveLocationId] = useState<number | null>(initialLocationId);
    const [showMap, setShowMap] = useState(false);
    const [showTimeline, setShowTimeline] = useState(false);

    // This ensures that if the world prop changes (e.g., messages updated), we get the fresh location object.
    const activeLocation = activeLocationId != null
        ? world.locations.flatMap(cat => cat.channels).find(chan => chan.id === activeLocationId)
        : null;

    // For mobile view, determines if chat/map is open or sidebar.
    const [isContentVisible, setIsContentVisible] = useState(!!initialLocationId);

    const handleSelectLocation = (location: WorldLocation) => {
        setActiveLocationId(location.id);
        setShowMap(false);
        setShowTimeline(false);
        setIsContentVisible(true); // Switch to chat view on mobile
        
        // Play theme song if available
        if (onPlayMusic && location.themeSongUrl) {
            onPlayMusic(location.themeSongUrl);
        }
    };
    
    const handleShowAtlas = () => {
        setShowMap(true);
        setShowTimeline(false);
        setIsContentVisible(true);
    };

    const handleShowTimeline = () => {
        setShowTimeline(true);
        setShowMap(false);
        setIsContentVisible(true);
    };
    
    // When the world data changes, if the active location no longer exists (e.g., was deleted), reset it.
    useEffect(() => {
        if (activeLocationId !== null) {
            const locationExists = world.locations.some(cat => cat.channels.some(chan => chan.id === activeLocationId));
            if (!locationExists) {
                setActiveLocationId(null);
                setIsContentVisible(false);
            }
        }
    }, [world, activeLocationId]);
    
    // Initial Music Trigger on Load
    useEffect(() => {
        if (activeLocation && activeLocation.themeSongUrl && onPlayMusic) {
            onPlayMusic(activeLocation.themeSongUrl);
        }
    }, []); // Run once on mount if initial location exists


    return (
        <div className="flex h-screen w-full bg-black bg-gradient-to-tr from-black via-[#010619] to-blue-900/20 text-gray-100 font-sans">
            {/* Mobile View Logic: Show either chat/map or sidebar */}
            <div className="md:hidden w-full h-full">
                {isContentVisible ? (
                    showMap ? (
                        <div className="h-full relative">
                            <button onClick={() => setIsContentVisible(false)} className="absolute top-4 left-4 z-50 p-2 bg-black/50 rounded-full text-white">Back</button>
                            <WorldMapView world={world} onSelectLocation={handleSelectLocation} />
                        </div>
                    ) : showTimeline ? (
                        <div className="h-full relative">
                            <button onClick={() => setIsContentVisible(false)} className="absolute top-4 left-4 z-50 p-2 bg-black/50 rounded-full text-white">Back</button>
                            <WorldTimelineView world={world} />
                        </div>
                    ) : activeLocation ? (
                         <GroupChatView 
                            key={activeLocation.id} 
                            location={activeLocation} 
                            world={world}
                            onBack={() => setIsContentVisible(false)}
                            onSendMessage={onSendGroupMessage}
                            userCreations={userCreations}
                            onSaveMeme={onSaveMeme}
                        />
                    ) : <EmptyChatView />
                ) : (
                    <WorldSidebar
                        world={world}
                        activeLocationId={activeLocationId ?? -1}
                        onSelectLocation={handleSelectLocation}
                        onExit={onExit}
                        onStartConversation={onStartConversation}
                        currentUser={currentUser}
                        onShowAtlas={handleShowAtlas}
                        onShowTimeline={handleShowTimeline}
                    />
                )}
            </div>

            {/* Desktop View Logic: Show both side-by-side */}
            <div className="hidden md:flex flex-1 min-w-0 h-full">
                <WorldSidebar
                    world={world}
                    activeLocationId={activeLocationId ?? -1}
                    onSelectLocation={handleSelectLocation}
                    onExit={onExit}
                    onStartConversation={onStartConversation}
                    currentUser={currentUser}
                    onShowAtlas={handleShowAtlas}
                    onShowTimeline={handleShowTimeline}
                />
                <div className="flex-1 flex flex-col min-w-0">
                     {showMap ? (
                        <WorldMapView world={world} onSelectLocation={handleSelectLocation} />
                     ) : showTimeline ? (
                        <WorldTimelineView world={world} />
                     ) : activeLocation ? (
                        <GroupChatView 
                            key={activeLocation.id} 
                            location={activeLocation} 
                            world={world}
                            onSendMessage={onSendGroupMessage}
                            userCreations={userCreations}
                            onSaveMeme={onSaveMeme}
                        />
                    ) : (
                        <EmptyChatView />
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorldPage;
