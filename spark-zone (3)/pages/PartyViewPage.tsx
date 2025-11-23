
import React, { useRef, useEffect, useState } from 'react';
import { Party, PartyMessage, DiceRoll, PartyMember, UserCreation, User } from '../types';
import { currentUser, characters as allCharacters } from '../mockData';
import UserAvatar from '../components/UserAvatar';
import CharacterSelectorModal from '../components/CharacterSelectorModal';
import MemePicker from '../components/MemePicker';
import MemeCreationPage from './MemeCreationPage';

// --- ICONS ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const PaperAirplaneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;
const DiceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M14.5 3.5a.5.5 0 01.5.5v12a.5.5 0 01-.5.5h-9a.5.5 0 01-.5-.5v-12a.5.5 0 01.5-.5h9zM10 6a1 1 0 100-2 1 1 0 000 2zm-3 3a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2zm-3 3a1 1 0 100-2 1 1 0 000 2z" /></svg>;
const MessageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 2c-4.418 0-8 3.134-8 7 0 2.444 1.206 4.634 3.09 5.982.257.185.334.502.213.766l-1.06 1.768a.75.75 0 001.28.766l1.23-2.05a.75.75 0 01.62-.358 10.42 10.42 0 002.83 0 .75.75 0 01.62.358l1.23 2.05a.75.75 0 001.28-.766l-1.06-1.768a.75.75 0 01.213-.766A7.96 7.96 0 0018 9c0-3.866-3.582-7-8-7z" clipRule="evenodd" /></svg>;
const FaceSmileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z" clipRule="evenodd" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;
const MicrophoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" /><path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" /></svg>;
const StopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" /></svg>;
const CloudArrowUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-cyan-400 animate-bounce"><path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>;

// --- Stage Components ---
const SocialStage: React.FC<{ party: Party }> = ({ party }) => (
    <div className="w-full h-full bg-gray-900/50 flex items-center justify-center p-4">
        <div className="grid grid-cols-2 gap-4 max-w-lg w-full">
            {(party.stage.social?.sharedImages || []).map((img, i) => (
                <div key={i} className="aspect-video rounded-lg overflow-hidden border border-violet-500/30">
                    <img src={img} className="w-full h-full object-cover" />
                </div>
            ))}
        </div>
    </div>
);

const TheatreStage: React.FC<{ party: Party }> = ({ party }) => (
    <div className="w-full h-full bg-black flex items-center justify-center">
        {/* In a real app, this would be a synchronized video player */}
        <div className="aspect-video w-full max-w-4xl bg-gray-900 border border-violet-500/30 rounded-lg flex flex-col items-center justify-center text-gray-400">
            <p>Video Player Placeholder</p>
            <p className="text-sm">{party.stage.theatre?.videoUrl}</p>
        </div>
    </div>
);

const TabletopStage: React.FC<{ party: Party }> = ({ party }) => (
    <div 
        className="w-full h-full bg-cover bg-center bg-gray-800"
        style={{ backgroundImage: `url(${party.stage.tabletop?.mapUrl})` }}
    >
        {!party.stage.tabletop?.mapUrl && (
            <div className="w-full h-full bg-gray-900/50 flex items-center justify-center text-gray-400">
                <p>The Game Master hasn't set a map yet.</p>
            </div>
        )}
    </div>
);

const LiveStage: React.FC<{ party: Party }> = ({ party }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLive, setIsLive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isHost = party.hostId === currentUser.id;

    const startBroadcast = async () => {
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsLive(true);
        } catch (err) {
            console.error("Error accessing media devices.", err);
            setError("Could not access camera and microphone. Please check your browser permissions.");
        }
    };
    
    if (isHost) {
        return (
            <div className="w-full h-full bg-black flex flex-col items-center justify-center text-center p-4">
                {isLive ? (
                    <>
                        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full max-h-[80%] rounded-lg border border-violet-500/30" />
                        <p className="mt-4 text-green-400 font-semibold">You are live!</p>
                    </>
                ) : (
                    <>
                        <h3 className="text-2xl font-bold text-white">You are the Host</h3>
                        <p className="text-gray-400 my-4 max-w-md">When you're ready, start the broadcast to stream your camera and microphone to the party.</p>
                        <button onClick={startBroadcast} className="px-6 py-3 bg-cyan-500 text-white font-semibold rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transform hover:-translate-y-1 transition-all">
                            Go Live
                        </button>
                        {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
                    </>
                )}
            </div>
        );
    }

    // Viewer's perspective
    return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center text-center p-4">
            <div className="w-full max-w-xl aspect-video bg-gray-900 rounded-lg border border-violet-500/30 flex items-center justify-center">
                <p className="text-gray-400">Waiting for the host to go live...</p>
            </div>
            <h3 className="text-xl font-bold text-white mt-4">Live Broadcast</h3>
            <p className="text-gray-500">The host's stream will appear here automatically when they start.</p>
        </div>
    );
};

// --- Chat Components ---
const DiceRollResult: React.FC<{ roll: DiceRoll }> = ({ roll }) => (
    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-md p-2 mt-1">
        <div className="flex items-center gap-2 text-sm text-cyan-300 font-semibold">
            <DiceIcon />
            <span>{roll.command}</span>
            <span className="text-gray-400">→</span>
            <span>[{roll.rolls.join(', ')}] {roll.modifier >= 0 ? '+' : '-'} {Math.abs(roll.modifier)}</span>
        </div>
        <div className="text-center font-bold text-lg text-white mt-1">
            Total: {roll.total}
        </div>
    </div>
);

const ChatMessage: React.FC<{ message: PartyMessage }> = ({ message }) => (
    <div className="flex items-start gap-3">
        <UserAvatar src={message.character?.imageUrl || message.sender.avatarUrl} size="10" />
        <div className="flex-grow min-w-0">
            <div className="flex items-baseline gap-2">
                <p className="font-bold text-white truncate">{message.character?.name || message.sender.name}</p>
                <p className="text-xs text-gray-500 flex-shrink-0">{message.timestamp}</p>
            </div>
            {message.imageUrl && (
                <div className="mt-1 mb-1 rounded-lg overflow-hidden border border-white/10 max-w-sm">
                    <img src={message.imageUrl} alt="Attachment" className="w-full h-auto block" />
                </div>
            )}
            {message.audioUrl && (
                <div className="mt-1 mb-1">
                    <audio controls src={message.audioUrl} className="h-8 max-w-xs" />
                </div>
            )}
            <p className="text-gray-300 whitespace-pre-wrap">{message.text}</p>
            {message.roll && <DiceRollResult roll={message.roll} />}
        </div>
    </div>
);

const PinnedCharacters: React.FC<{ party: Party }> = ({ party }) => {
    const pinnedChars = (party.stage.tabletop?.pinnedCharacterIds || [])
        .map(id => allCharacters.find(c => c.id === id))
        .filter(Boolean);

    if (pinnedChars.length === 0) return null;

    return (
        <div className="p-3 border-b border-violet-500/30">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Pinned Characters</h3>
            <div className="space-y-2">
                {pinnedChars.map(char => (
                    <div key={char!.id} className="flex items-center gap-2">
                        <UserAvatar src={char!.imageUrl} size="8" />
                        <span className="text-sm font-semibold text-white">{char!.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


interface PartyViewPageProps {
    party: Party;
    onExit: () => void;
    onSendMessage: (partyId: number, text: string, character?: UserCreation, imageUrl?: string, audioUrl?: string) => void;
    userCreations: UserCreation[];
    onStartConversation: (userId: number) => void;
    currentUser: User;
    onSaveMeme?: (meme: { name: string, imageUrl: string }) => void;
}

const PartyViewPage: React.FC<PartyViewPageProps> = ({ party, onExit, onSendMessage, userCreations, onStartConversation, currentUser, onSaveMeme }) => {
    const [message, setMessage] = useState('');
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [selectedVoiceId, setSelectedVoiceId] = useState<number>(currentUser.id);
    const [showMembers, setShowMembers] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Media State
    const [showMemePicker, setShowMemePicker] = useState(false);
    const [selectedMeme, setSelectedMeme] = useState<string | null>(null);
    const [isCreatingMeme, setIsCreatingMeme] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Voice Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [party.chat]);
    
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`; // Limit initial auto-growth before scroll
        }
    }, [message]);
    
    const userCharacters = userCreations.filter(c => c.type === 'Character' || c.type === 'AI Character') as UserCreation[];
    
    const selectedVoice = selectedVoiceId === currentUser.id
        ? { ...currentUser, name: 'You', epithet: 'Yourself', imageUrl: currentUser.avatarUrl }
        : userCharacters.find(c => c.id === selectedVoiceId);

    const handleSendMessage = () => {
        if (!message.trim() && !selectedMeme) return;
        const character = selectedVoiceId === currentUser.id ? undefined : userCharacters.find(c => c.id === selectedVoiceId);
        onSendMessage(party.id, message, character, selectedMeme || undefined);
        setMessage('');
        setSelectedMeme(null);
    };

    const handleMemeCreated = (meme: { name: string, imageUrl: string }) => {
        if (onSaveMeme) {
            onSaveMeme(meme);
            setSelectedMeme(meme.imageUrl);
        }
        setIsCreatingMeme(false);
    };

    // --- Drag & Drop Handlers ---
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    setSelectedMeme(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Voice Recording Handlers ---
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks: BlobPart[] = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(blob);
                const character = selectedVoiceId === currentUser.id ? undefined : userCharacters.find(c => c.id === selectedVoiceId);
                onSendMessage(party.id, '', character, undefined, audioUrl);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerIntervalRef.current = window.setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };
    
    const renderStage = () => {
        switch (party.stage.mode) {
            case 'social': return <SocialStage party={party} />;
            case 'theatre': return <TheatreStage party={party} />;
            case 'tabletop': return <TabletopStage party={party} />;
            case 'live': return <LiveStage party={party} />;
            default: return <div className="w-full h-full bg-gray-900 flex items-center justify-center"><p>Loading Stage...</p></div>;
        }
    };

    return (
        <div className="flex h-screen w-full bg-black text-gray-100 font-sans">
            <main className="flex-1 flex flex-col min-w-0 h-full">
                {renderStage()}
            </main>

            <aside 
                className="w-full md:w-96 flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border-l border-violet-500/30 flex flex-col h-full relative"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {/* Drag Overlay */}
                {isDragging && (
                    <div className="absolute inset-0 z-50 bg-cyan-900/80 backdrop-blur-sm flex flex-col items-center justify-center border-4 border-cyan-400 border-dashed m-4 rounded-2xl animate-pulse">
                        <CloudArrowUpIcon />
                        <h2 className="text-2xl font-bold text-white mt-4">Drop to Upload</h2>
                    </div>
                )}

                <header className="p-3 border-b border-violet-500/30 flex justify-between items-center flex-shrink-0 bg-gray-900/50 backdrop-blur-md">
                    <div className="flex items-center gap-2 min-w-0">
                        <button onClick={onExit} className="p-1 rounded-md text-gray-400 hover:text-white" title="Exit Party"><ArrowLeftIcon /></button>
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold text-white truncate">{party.name}</h2>
                            <button onClick={() => setShowMembers(s => !s)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-cyan-400">
                                <UsersIcon className="w-3 h-3" /> 
                                {party.members.length} members
                            </button>
                        </div>
                    </div>
                </header>
                
                {showMembers && (
                    <div className="p-3 border-b border-violet-500/30 flex-shrink-0 bg-black/20">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Party Members</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {party.members.map(member => (
                                <div key={member.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <UserAvatar src={member.avatarUrl} size="8" />
                                        <span className={`text-sm font-semibold ${member.isHost ? 'text-cyan-400' : 'text-white'}`}>{member.name}</span>
                                    </div>
                                    {member.id !== currentUser.id && (
                                        <button onClick={() => onStartConversation(member.id)} className="p-1 rounded-full text-gray-400 hover:bg-violet-500/20 hover:text-cyan-400" aria-label={`Message ${member.name}`}>
                                            <MessageIcon />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {party.stage.mode === 'tabletop' && <PinnedCharacters party={party} />}
                
                <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-6">
                    {party.chat.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Glass Capsule Style */}
                <div className="p-4 border-t border-violet-500/30 flex-shrink-0 bg-gray-900/80 backdrop-blur-md">
                    {/* Staging Area for Meme */}
                    {selectedMeme && (
                        <div className="mb-3 relative inline-block animate-fadeIn">
                            <div className="relative rounded-lg overflow-hidden border-2 border-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.3)] max-w-[150px]">
                                <img src={selectedMeme} alt="Selected meme" className="w-full h-auto" />
                                <button 
                                    onClick={() => setSelectedMeme(null)}
                                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                                >
                                    <XMarkIcon />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex items-end gap-2 bg-gray-800/60 border border-violet-500/40 rounded-2xl p-2 shadow-inner relative focus-within:border-violet-400/80 focus-within:ring-1 focus-within:ring-violet-500/30 transition-all">
                        <button onClick={() => setIsSelectorOpen(true)} className="flex-shrink-0 self-center rounded-full ring-2 ring-transparent hover:ring-cyan-400 transition-all" title="Select Character">
                            <UserAvatar src={selectedVoice?.imageUrl} size="10" />
                        </button>
                        
                        {isRecording ? (
                            <div className="flex-grow flex items-center justify-between px-4 bg-red-900/20 rounded-lg h-10 animate-pulse">
                                <div className="flex items-center gap-2 text-red-400 font-mono font-bold">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    {formatTime(recordingTime)}
                                </div>
                                <button onClick={stopRecording} className="text-red-400 hover:text-white p-1">
                                    <StopIcon />
                                </button>
                            </div>
                        ) : (
                            <textarea 
                                ref={textareaRef} 
                                value={message} 
                                onChange={(e) => setMessage(e.target.value)} 
                                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                                placeholder="Type a message or /roll..." 
                                className="w-full bg-transparent text-gray-200 focus:outline-none resize-none max-h-[50vh] overflow-y-auto py-2 leading-relaxed" 
                                rows={1}
                            />
                        )}

                        {/* Meme Button */}
                        <div className="relative self-center">
                            <button 
                                onClick={() => setShowMemePicker(!showMemePicker)} 
                                className={`p-2 transition-colors rounded-full ${showMemePicker ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-400 hover:text-yellow-400'}`}
                                title="Add Meme"
                            >
                                <FaceSmileIcon />
                            </button>
                            {showMemePicker && (
                                <MemePicker 
                                    userCreations={userCreations} 
                                    onSelect={(url) => { setSelectedMeme(url); setShowMemePicker(false); }} 
                                    onClose={() => setShowMemePicker(false)}
                                    onCreateNew={() => { setShowMemePicker(false); setIsCreatingMeme(true); }}
                                />
                            )}
                        </div>

                        {/* Send/Record Button */}
                        {message.trim() || selectedMeme ? (
                            <button onClick={handleSendMessage} className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors self-end pb-2"><PaperAirplaneIcon /></button>
                        ) : (
                            !isRecording && (
                                <button onClick={startRecording} className="p-2 text-gray-400 hover:text-red-400 transition-colors self-center" title="Record Voice Note">
                                    <MicrophoneIcon />
                                </button>
                            )
                        )}
                    </div>
                </div>
            </aside>
            
            {isSelectorOpen && (
                <CharacterSelectorModal
                    isOpen={isSelectorOpen}
                    onClose={() => setIsSelectorOpen(false)}
                    characters={userCharacters}
                    currentUser={currentUser}
                    selectedId={selectedVoiceId}
                    onSelect={(id) => {
                        setSelectedVoiceId(id);
                        setIsSelectorOpen(false);
                    }}
                />
            )}

            {isCreatingMeme && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
                    <div className="w-full h-full md:h-[90vh] md:w-[90vw] md:rounded-xl overflow-hidden relative">
                        <MemeCreationPage 
                            onExit={() => setIsCreatingMeme(false)} 
                            onSave={handleMemeCreated}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartyViewPage;
