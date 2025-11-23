
import React, { useState, Suspense, useCallback } from 'react';
import { Page, World, Character, Story, Party, Conversation, Message, GroupMessage, Post, UserCreation, User, PartyMessage, Chapter, LoreEntry, DiceRoll, Comment, Notification, WorldMember } from '../types';
import { 
    worlds as initialWorlds, 
    characters as initialCharacters, 
    stories as initialStories, 
    parties as initialParties, 
    conversations as initialConversations, 
    posts as initialPosts, 
    comments as initialComments,
    currentUser,
    allUsers,
    initialUserCreations,
    mockNotifications
} from '../mockData';
import NavBar from '../components/NavBar';
import LoadingSpinner from '../components/LoadingSpinner';
import CommentModal from '../components/CommentModal';
import SkynetModal from '../components/SkynetModal';
import SonicJukebox from '../components/SonicJukebox';

// --- Lazy Load Pages for Mobile Performance ---
const HomePage = React.lazy(() => import('./HomePage'));
const ExplorePage = React.lazy(() => import('./ExplorePage'));
const WorkshopPage = React.lazy(() => import('./WorkshopPage'));
const MessengerPage = React.lazy(() => import('./MessengerPage'));
const ProfilePage = React.lazy(() => import('./ProfilePage'));
const WorldPage = React.lazy(() => import('./WorldPage'));
const WorldWorkshop = React.lazy(() => import('./WorldWorkshop'));
const CharacterCreationPage = React.lazy(() => import('./CharacterCreationPage'));
const CharacterPage = React.lazy(() => import('./CharacterPage'));
const StoryCreationPage = React.lazy(() => import('./StoryCreationPage'));
const StoryWorkshopPage = React.lazy(() => import('./StoryWorkshopPage'));
const StoryReaderPage = React.lazy(() => import('./StoryReaderPage'));
const WorldCreationPage = React.lazy(() => import('./WorldCreationPage'));
const PartyPage = React.lazy(() => import('./PartyPage'));
const PartyViewPage = React.lazy(() => import('./PartyViewPage'));
const PartyWorkshopPage = React.lazy(() => import('./PartyWorkshopPage'));
const ProfileEditorPage = React.lazy(() => import('./ProfileEditorPage'));
const MemeCreationPage = React.lazy(() => import('./MemeCreationPage'));
const SparkClashPage = React.lazy(() => import('./SparkClashPage'));

// --- UTILITIES ---
function parseDiceCommand(command: string): { count: number; sides: number; modifier: number } | null {
    const match = command.match(/^((\d*)d(\d+))?\s*([+-]\s*\d+)?$/i);
    if (!match) return null;

    const dicePart = match[1];
    const count = match[2] ? parseInt(match[2], 10) : (dicePart ? 1 : 0);
    const sides = match[3] ? parseInt(match[3], 10) : 0;
    const modifier = match[4] ? parseInt(match[4].replace(/\s/g, ''), 10) : 0;

    if (count === 0 && modifier === 0) return null;
    return { count, sides, modifier };
}

function executeRoll(parsed: { count: number; sides: number; modifier: number }): { rolls: number[], total: number } {
    const rolls: number[] = [];
    let sum = 0;
    for (let i = 0; i < parsed.count; i++) {
        const roll = Math.floor(Math.random() * parsed.sides) + 1;
        rolls.push(roll);
        sum += roll;
    }
    return { rolls, total: sum + parsed.modifier };
}


const MainApp: React.FC = () => {
    // --- State Management ---
    const [activePage, setActivePage] = useState<Page>(Page.Home);

    // Data State
    const [allCharacters, setAllCharacters] = useState<Character[]>(initialCharacters);
    const [allStories, setAllStories] = useState<Story[]>(initialStories);
    const [allWorlds, setAllWorlds] = useState<World[]>(initialWorlds);
    const [allParties, setAllParties] = useState<Party[]>(initialParties);
    const [allConversations, setAllConversations] = useState<Conversation[]>(initialConversations);
    const [allPosts, setAllPosts] = useState<Post[]>(initialPosts);
    const [allComments, setAllComments] = useState<Comment[]>(initialComments);
    const [userProfile, setUserProfile] = useState<User>(currentUser);
    const [allMemes, setAllMemes] = useState<UserCreation[]>(initialUserCreations.filter(c => c.type === 'Meme'));
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);


    // View/Edit State
    const [viewingWorldId, setViewingWorldId] = useState<number | null>(null);
    const [editingWorldId, setEditingWorldId] = useState<number | null>(null);
    const [isCreatingCharacter, setIsCreatingCharacter] = useState<boolean>(false);
    const [editingCharacterId, setEditingCharacterId] = useState<number | null>(null);
    const [viewingCharacterId, setViewingCharacterId] = useState<number | null>(null);
    const [isCreatingStory, setIsCreatingStory] = useState<boolean>(false);
    const [editingStoryId, setEditingStoryId] = useState<number | null>(null);
    const [viewingStoryId, setViewingStoryId] = useState<number | null>(null);
    const [isCreatingWorld, setIsCreatingWorld] = useState<boolean>(false);
    const [editingPartyId, setEditingPartyId] = useState<number | null>(null);
    const [viewingPartyId, setViewingPartyId] = useState<number | null>(null);
    const [isCreatingParty, setIsCreatingParty] = useState<boolean>(false);
    const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
    const [messengerInitialConvoId, setMessengerInitialConvoId] = useState<number | null>(null);
    const [viewingCommentsForPostId, setViewingCommentsForPostId] = useState<number | null>(null);
    const [isCreatingMeme, setIsCreatingMeme] = useState<boolean>(false);
    const [isPlayingSparkClash, setIsPlayingSparkClash] = useState(false);

    // Sonic Atmosphere State
    const [currentMusicUrl, setCurrentMusicUrl] = useState<string | null>(null);

    // Skynet State
    const [skynetWarning, setSkynetWarning] = useState<{ isOpen: boolean; violation: string }>({ isOpen: false, violation: '' });


    // --- Derived State ---
    const viewingWorld = allWorlds.find(w => w.id === viewingWorldId);
    const editingWorld = allWorlds.find(w => w.id === editingWorldId);
    const editingCharacter = allCharacters.find(c => c.id === editingCharacterId);
    const viewingCharacter = allCharacters.find(c => c.id === viewingCharacterId);
    const editingStory = allStories.find(s => s.id === editingStoryId);
    const viewingStory = allStories.find(s => s.id === viewingStoryId);
    const editingParty = allParties.find(p => p.id === editingPartyId);
    const viewingParty = allParties.find(p => p.id === viewingPartyId);
    const viewingPostForComments = allPosts.find(p => p.id === viewingCommentsForPostId);

    const userCreations: UserCreation[] = [
        ...allCharacters.filter(c => c.authorId === currentUser.id),
        ...allStories.filter(s => s.authorId === currentUser.id),
        ...allWorlds.filter(w => w.authorId === currentUser.id),
        ...allParties.filter(p => p.hostId === currentUser.id).map(p => ({
            id: p.id,
            type: 'RP Card' as 'RP Card',
            name: p.name,
            imageUrl: p.imageUrl,
            status: 'Active' as 'Active',
            authorId: p.hostId,
        })),
        ...allMemes.filter(m => m.authorId === currentUser.id)
    ];

    // --- Layout Logic ---
    const isFixedLayout = 
        (activePage === Page.Messenger) || 
        (activePage === Page.SparkClash) || 
        (activePage === Page.World && viewingWorldId !== null) ||
        (viewingPartyId !== null) || 
        (isCreatingMeme) ||
        (activePage === Page.Workshop && (editingWorldId !== null || editingStoryId !== null || editingPartyId !== null || isCreatingStory || isCreatingWorld));
        
    const isNavHidden = activePage === Page.SparkClash || viewingPartyId || viewingStoryId || isCreatingMeme;

    // --- SKYNET ---
    const checkContent = (text: string): boolean => {
        const forbidden = ['badword', 'hate', 'spam'];
        const violation = forbidden.find(w => text.toLowerCase().includes(w));
        if (violation) {
            setSkynetWarning({ isOpen: true, violation: violation.toUpperCase() });
            return false;
        }
        return true;
    };

    // --- HANDLERS ---

    // Navigation
    const handleNavigate = useCallback((page: Page) => {
        setActivePage(page);
        // Clear specific view states when navigating top-level
        if (page !== Page.Workshop) {
            setEditingWorldId(null);
            setEditingCharacterId(null);
            setEditingStoryId(null);
            setEditingPartyId(null);
        }
        if(page !== Page.SparkClash) setIsPlayingSparkClash(false);
        if(page === Page.SparkClash) setIsPlayingSparkClash(true);
    }, []);

    // Notifications
    const handleMarkAsRead = useCallback((id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    // World Handlers
    const handleSelectWorld = useCallback((worldId: number) => {
        setViewingWorldId(worldId);
        setActivePage(Page.World);
    }, []);

    const handleJoinWorld = useCallback((worldId: number) => {
        setAllWorlds(prev => prev.map(w => {
            if (w.id === worldId) {
                if (w.members.some(m => m.id === currentUser.id)) return w;
                
                const defaultRole = w.roles?.find(r => r.isDefault)?.name || 'Member';
                const newMember: WorldMember = { ...currentUser, role: defaultRole };
                return {
                    ...w,
                    members: [...w.members, newMember]
                };
            }
            return w;
        }));
    }, []);

    const handleLeaveWorld = useCallback((worldId: number) => {
        setAllWorlds(prev => prev.map(w => {
            if (w.id === worldId) {
                return {
                    ...w,
                    members: w.members.filter(m => m.id !== currentUser.id)
                };
            }
            return w;
        }));
    }, []);

    const handleCreateWorld = () => {
        setIsCreatingWorld(true);
    };

    const handleWorldCreated = (newWorldData: any) => {
        const newWorld: World = {
            ...newWorldData,
            id: Date.now(),
            authorId: currentUser.id,
            members: [{ ...currentUser, role: 'Creator' }],
            rules: '',
            lorebook: [],
            locations: [
                { category: 'General', channels: [{ id: 1, name: 'general', description: 'Chat about anything', messages: [] }] }
            ]
        };
        setAllWorlds([...allWorlds, newWorld]);
        setIsCreatingWorld(false);
        setEditingWorldId(newWorld.id);
        setActivePage(Page.Workshop); 
    };

    const handleEditWorld = (worldId: number) => {
        setEditingWorldId(worldId);
        setActivePage(Page.Workshop); 
    };

    const handleSaveWorld = (updatedWorld: World) => {
        setAllWorlds(prev => prev.map(w => w.id === updatedWorld.id ? updatedWorld : w));
        setEditingWorldId(null);
    };

    const handleSendGroupMessage = useCallback((worldId: number, locationId: number, text: string, character?: UserCreation, imageUrl?: string, audioUrl?: string) => {
        if (!checkContent(text)) return;
        setAllWorlds(prev => prev.map(w => {
            if (w.id === worldId) {
                const member = w.members.find(m => m.id === currentUser.id);
                if (!member) return w; 

                const newMessage: GroupMessage = {
                    id: Date.now(),
                    text,
                    timestamp: 'Just now',
                    sender: member,
                    character,
                    imageUrl,
                    audioUrl
                };

                return {
                    ...w,
                    locations: w.locations.map(cat => ({
                        ...cat,
                        channels: cat.channels.map(chan => 
                            chan.id === locationId 
                                ? { ...chan, messages: [...chan.messages, newMessage] }
                                : chan
                        )
                    }))
                };
            }
            return w;
        }));
    }, []);

    // Character Handlers
    const handleCreateCharacter = () => setIsCreatingCharacter(true);
    
    const handleSaveCharacter = (characterData: any) => {
        if (editingCharacterId) {
            setAllCharacters(prev => prev.map(c => c.id === editingCharacterId ? { ...c, ...characterData } : c));
            setEditingCharacterId(null);
        } else {
            const newChar: Character = { ...characterData, id: Date.now(), authorId: currentUser.id, status: 'Published' };
            setAllCharacters(prev => [...prev, newChar]);
        }
        setIsCreatingCharacter(false);
    };

    const handleEditCharacter = (charId: number) => {
        setEditingCharacterId(charId);
        setIsCreatingCharacter(true);
    };

    const handleViewCharacter = useCallback((charId: number) => {
        setViewingCharacterId(charId);
        setActivePage(Page.Explore); 
    }, []);

    // Story Handlers
    const handleCreateStory = () => setIsCreatingStory(true);

    const handleSaveStory = (newStoryData: any) => {
        const newStory: Story = {
            ...newStoryData,
            id: Date.now(),
            authorId: currentUser.id,
            status: 'Draft',
            chapters: [],
            cast: [],
            lorebook: []
        };
        setAllStories(prev => [...prev, newStory]);
        setIsCreatingStory(false);
        setEditingStoryId(newStory.id); 
        setActivePage(Page.Workshop); 
    };

    const handleEditStory = (storyId: number) => {
        setEditingStoryId(storyId);
    };

    const handleSaveStoryContent = (updatedStory: Story) => {
        setAllStories(prev => prev.map(s => s.id === updatedStory.id ? updatedStory : s));
        setEditingStoryId(null);
    };

    const handleViewStory = useCallback((storyId: number) => {
        setViewingStoryId(storyId);
    }, []);

    // Party Handlers
    const handleSelectParty = useCallback((partyId: number) => {
        setViewingPartyId(partyId);
        setActivePage(Page.Party);
    }, []);

    const handleCreateParty = () => {
        setIsCreatingParty(true);
    };

    const handleEditParty = (partyId: number) => {
        setEditingPartyId(partyId);
        setIsCreatingParty(true); 
    };

    const handleSaveParty = (party: Party) => {
        if (editingPartyId) {
            setAllParties(prev => prev.map(p => p.id === party.id ? party : p));
            setEditingPartyId(null);
        } else {
            setAllParties(prev => [...prev, party]);
        }
        setIsCreatingParty(false);
    };

    const handleSendPartyMessage = (partyId: number, text: string, character?: UserCreation, imageUrl?: string, audioUrl?: string) => {
        if (!checkContent(text)) return;
        setAllParties(prev => prev.map(p => {
            if (p.id === partyId) {
                let rollResult: DiceRoll | undefined;
                const rollMatch = text.match(/^\/roll\s+(.*)$/);
                if (rollMatch) {
                    const parsed = parseDiceCommand(rollMatch[1]);
                    if (parsed) {
                        rollResult = { command: rollMatch[1], ...executeRoll(parsed), modifier: parsed.modifier };
                    }
                }

                const newMessage: PartyMessage = {
                    id: Date.now(),
                    text,
                    timestamp: 'Just now',
                    sender: p.members.find(m => m.id === currentUser.id) || { ...currentUser, isHost: false },
                    character,
                    roll: rollResult,
                    imageUrl,
                    audioUrl
                };
                return { ...p, chat: [...p.chat, newMessage] };
            }
            return p;
        }));
    };

    // Messenger Handlers
    const handleStartConversation = useCallback((userId: number) => {
        const existing = allConversations.find(c => c.participant.id === userId);
        if (existing) {
            setMessengerInitialConvoId(existing.id);
        } else {
            setMessengerInitialConvoId(null); 
            const user = allUsers.find(u => u.id === userId);
            if (user) {
                const newConvo: Conversation = {
                    id: Date.now(),
                    participant: user,
                    messages: [],
                    unreadCount: 0
                };
                setAllConversations(prev => [...prev, newConvo]);
                setMessengerInitialConvoId(newConvo.id);
            }
        }
        setActivePage(Page.Messenger);
    }, [allConversations]);

    const handleSendMessage = (convoId: number, text: string, character?: UserCreation, imageUrl?: string, audioUrl?: string) => {
        if (!checkContent(text)) return;
        setAllConversations(prev => prev.map(c => {
            if (c.id === convoId) {
                return {
                    ...c,
                    messages: [...c.messages, {
                        id: Date.now(),
                        text,
                        timestamp: 'Just now',
                        senderId: currentUser.id,
                        character,
                        imageUrl,
                        audioUrl
                    }]
                };
            }
            return c;
        }));
    };

    const handleCreateConversation = (participantId: number) => {
        const participant = allUsers.find(u => u.id === participantId);
        if (!participant) return 0;
        
        const newConvo: Conversation = {
            id: Date.now(),
            participant,
            messages: []
        };
        setAllConversations(prev => [...prev, newConvo]);
        return newConvo.id;
    };

    // Feed Handlers
    const handleCreatePost = (content: string, character?: UserCreation, media?: { type: 'image' | 'video', url: string }) => {
        if (!checkContent(content)) return;
        const newPost: Post = {
            id: Date.now(),
            author: currentUser,
            character,
            content,
            media,
            timestamp: 'Just now',
            sparks: 0,
            sparkedBy: [],
            comments: 0
        };
        setAllPosts([newPost, ...allPosts]);
    };

    const handleSparkPost = useCallback((postId: number) => {
        setAllPosts(prev => prev.map(p => {
            if (p.id === postId) {
                const hasSparked = p.sparkedBy.includes(currentUser.id);
                return {
                    ...p,
                    sparks: hasSparked ? p.sparks - 1 : p.sparks + 1,
                    sparkedBy: hasSparked ? p.sparkedBy.filter(id => id !== currentUser.id) : [...p.sparkedBy, currentUser.id]
                };
            }
            return p;
        }));
    }, []);

    // Comment Handlers
    const handleCommentPost = useCallback((postId: number) => {
        setViewingCommentsForPostId(postId);
    }, []);

    const handleCreateComment = (postId: number, content: string, character?: UserCreation) => {
        if (!checkContent(content)) return;
        const newComment: Comment = {
            id: Date.now(),
            postId,
            author: currentUser,
            character,
            content,
            timestamp: 'Just now',
            sparks: 0,
            sparkedBy: []
        };
        setAllComments(prev => [...prev, newComment]);
        setAllPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    };

    const handleSparkComment = (commentId: number) => {
        setAllComments(prev => prev.map(c => {
            if (c.id === commentId) {
                const hasSparked = c.sparkedBy.includes(currentUser.id);
                return {
                    ...c,
                    sparks: hasSparked ? c.sparks - 1 : c.sparks + 1,
                    sparkedBy: hasSparked ? c.sparkedBy.filter(id => id !== currentUser.id) : [...c.sparkedBy, currentUser.id]
                };
            }
            return c;
        }));
    };

    // Profile Handlers
    const handleUpdateProfile = (updates: Partial<User>) => {
        setUserProfile(prev => ({ ...prev, ...updates }));
        setIsEditingProfile(false);
    };

    // Meme Handlers
    const handleSaveMeme = (memeData: { name: string, imageUrl: string }) => {
        const newMeme: UserCreation = {
            id: Date.now(),
            type: 'Meme',
            name: memeData.name,
            imageUrl: memeData.imageUrl,
            status: 'Published',
            authorId: currentUser.id,
        };
        setAllMemes(prev => [...prev, newMeme]);
        setIsCreatingMeme(false);
    };

    // Audio Handler
    const handlePlayMusic = (url: string | null) => {
        setCurrentMusicUrl(url);
    };


    // --- RENDER LOGIC ---

    const renderContent = () => {
        // Modal / Overlay States
        if (isCreatingCharacter || editingCharacterId) {
            return <Suspense fallback={<LoadingSpinner />}><CharacterCreationPage onExit={() => { setIsCreatingCharacter(false); setEditingCharacterId(null); }} onCreate={handleSaveCharacter} onSave={handleSaveCharacter} characterToEdit={editingCharacter} /></Suspense>;
        }
        if (viewingCharacterId) {
            return <Suspense fallback={<LoadingSpinner />}><CharacterPage character={viewingCharacter!} onExit={() => setViewingCharacterId(null)} onViewCharacter={handleViewCharacter} onEdit={() => { setViewingCharacterId(null); handleEditCharacter(viewingCharacterId); }} onStartConversation={handleStartConversation} currentUser={currentUser} /></Suspense>;
        }
        if (isCreatingStory) {
            return <Suspense fallback={<LoadingSpinner />}><StoryCreationPage onExit={() => setIsCreatingStory(false)} onCreate={handleSaveStory} /></Suspense>;
        }
        if (editingStoryId) {
            return <Suspense fallback={<LoadingSpinner />}><StoryWorkshopPage story={editingStory!} onExit={() => { setEditingStoryId(null); setActivePage(Page.Workshop); }} onSave={handleSaveStoryContent} /></Suspense>;
        }
        if (viewingStoryId) {
            return <Suspense fallback={<LoadingSpinner />}><StoryReaderPage story={viewingStory!} onExit={() => setViewingStoryId(null)} onViewCharacter={handleViewCharacter} onStartConversation={handleStartConversation} currentUser={currentUser} /></Suspense>;
        }
        if (isCreatingWorld) {
            return <Suspense fallback={<LoadingSpinner />}><WorldCreationPage onExit={() => setIsCreatingWorld(false)} onCreate={handleWorldCreated} /></Suspense>;
        }
        if (editingWorldId && activePage === Page.Workshop) { // Edit mode in workshop
             return <Suspense fallback={<LoadingSpinner />}><WorldWorkshop world={editingWorld!} onExit={() => setEditingWorldId(null)} onSave={handleSaveWorld} /></Suspense>;
        }
        if (isCreatingParty || editingPartyId) {
            return <Suspense fallback={<LoadingSpinner />}><PartyWorkshopPage party={editingParty} onExit={() => { setIsCreatingParty(false); setEditingPartyId(null); }} onSave={handleSaveParty} /></Suspense>;
        }
        if (viewingPartyId && activePage === Page.Party) {
            return <Suspense fallback={<LoadingSpinner />}><PartyViewPage party={viewingParty!} onExit={() => setViewingPartyId(null)} onSendMessage={handleSendPartyMessage} userCreations={userCreations} onStartConversation={handleStartConversation} currentUser={currentUser} onSaveMeme={handleSaveMeme} /></Suspense>;
        }
        if (isEditingProfile) {
            return <Suspense fallback={<LoadingSpinner />}><ProfileEditorPage currentUser={userProfile} onSave={handleUpdateProfile} onExit={() => setIsEditingProfile(false)} /></Suspense>;
        }
        if (isCreatingMeme) {
            return <Suspense fallback={<LoadingSpinner />}><MemeCreationPage onExit={() => setIsCreatingMeme(false)} onSave={handleSaveMeme} /></Suspense>;
        }
        if (activePage === Page.SparkClash) {
            return <Suspense fallback={<LoadingSpinner />}><SparkClashPage onExit={() => handleNavigate(Page.Home)} currentUser={userProfile} userCreations={userCreations} onUpdateUser={handleUpdateProfile} /></Suspense>;
        }

        // Main Page Routing
        switch (activePage) {
            case Page.Home:
                return <Suspense fallback={<LoadingSpinner />}><HomePage posts={allPosts} onCreatePost={handleCreatePost} onSparkPost={handleSparkPost} onCommentPost={handleCommentPost} userCreations={userCreations} currentUser={userProfile} onStartConversation={handleStartConversation} /></Suspense>;
            case Page.Explore:
                return <Suspense fallback={<LoadingSpinner />}><ExplorePage onSelectWorld={handleSelectWorld} onViewStory={handleViewStory} onSelectParty={handleSelectParty} onStartConversation={handleStartConversation} currentUser={userProfile} /></Suspense>;
            case Page.Workshop:
                return <Suspense fallback={<LoadingSpinner />}><WorkshopPage userCreations={userCreations} onEditWorld={handleEditWorld} onCreateCharacter={handleCreateCharacter} onEditCharacter={handleEditCharacter} onViewCharacter={handleViewCharacter} onCreateStory={handleCreateStory} onEditStory={handleEditStory} onViewStory={handleViewStory} onCreateWorld={handleCreateWorld} onCreateParty={handleCreateParty} onEditParty={handleEditParty} onCreateMeme={() => setIsCreatingMeme(true)} /></Suspense>;
            case Page.Messenger:
                return <Suspense fallback={<LoadingSpinner />}><MessengerPage conversations={allConversations} onSendMessage={handleSendMessage} onCreateConversation={handleCreateConversation} userCreations={userCreations} allUsers={allUsers} initialConversationId={messengerInitialConvoId} onClearInitialConversation={() => setMessengerInitialConvoId(null)} onSaveMeme={handleSaveMeme} /></Suspense>;
            case Page.Profile:
                return <Suspense fallback={<LoadingSpinner />}><ProfilePage currentUser={userProfile} userCreations={userCreations} onUpdateProfile={handleUpdateProfile} onEditProfile={() => setIsEditingProfile(true)} onEnterSparkClash={() => handleNavigate(Page.SparkClash)} /></Suspense>;
            case Page.Party:
                return <Suspense fallback={<LoadingSpinner />}><PartyPage parties={allParties} onSelectParty={handleSelectParty} onCreateParty={handleCreateParty} onEditParty={handleEditParty} /></Suspense>;
            case Page.World:
                if (viewingWorld) {
                    return <Suspense fallback={<LoadingSpinner />}><WorldPage world={viewingWorld} onExit={() => { setViewingWorldId(null); handleNavigate(Page.Explore); }} onSendGroupMessage={handleSendGroupMessage} userCreations={userCreations} onStartConversation={handleStartConversation} currentUser={userProfile} onSaveMeme={handleSaveMeme} onPlayMusic={handlePlayMusic} /></Suspense>;
                }
                return <Suspense fallback={<LoadingSpinner />}><ExplorePage onSelectWorld={handleSelectWorld} onViewStory={handleViewStory} onSelectParty={handleSelectParty} onStartConversation={handleStartConversation} currentUser={userProfile} /></Suspense>;
            default:
                return <Suspense fallback={<LoadingSpinner />}><HomePage posts={allPosts} onCreatePost={handleCreatePost} onSparkPost={handleSparkPost} onCommentPost={handleCommentPost} userCreations={userCreations} currentUser={userProfile} onStartConversation={handleStartConversation} /></Suspense>;
        }
    };

    return (
        <div className={`h-full w-full flex flex-col ${isFixedLayout ? 'overflow-hidden' : 'overflow-y-auto'}`}>
             <SkynetModal 
                isOpen={skynetWarning.isOpen} 
                onClose={() => setSkynetWarning({ isOpen: false, violation: '' })} 
                violationType={skynetWarning.violation}
                warningCount={userProfile.skynetStatus?.warningCount || 0}
            />

            <main className={`flex-grow relative flex flex-col ${!isNavHidden ? 'pb-16 md:pb-0 md:pt-20' : ''}`}>
                 {renderContent()}
            </main>

            {!isNavHidden && (
                <NavBar 
                    activePage={activePage} 
                    setActivePage={handleNavigate} 
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                    allUsers={allUsers}
                />
            )}

            <SonicJukebox musicUrl={currentMusicUrl} onClear={() => setCurrentMusicUrl(null)} />
            
            {viewingCommentsForPostId && viewingPostForComments && (
                <CommentModal 
                    post={viewingPostForComments} 
                    comments={allComments.filter(c => c.postId === viewingCommentsForPostId)}
                    currentUser={userProfile}
                    userCreations={userCreations}
                    allUsers={allUsers}
                    onClose={() => setViewingCommentsForPostId(null)}
                    onCreateComment={handleCreateComment}
                    onSparkComment={handleSparkComment}
                />
            )}
        </div>
    );
};

export default MainApp;
