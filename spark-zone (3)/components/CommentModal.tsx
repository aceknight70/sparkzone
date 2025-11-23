
import React, { useState, useRef, useEffect } from 'react';
import { Post, Comment, User, UserCreation, Character } from '../types';
import CommentComponent from './Comment';
import UserAvatar from './UserAvatar';
import CharacterSelectorModal from './CharacterSelectorModal';
import { GoogleGenAI, Type } from '@google/genai';
import LightningBoltIcon from './icons/LightningBoltIcon';

const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;
const PaperAirplaneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>;

interface CommentModalProps {
    post: Post;
    comments: Comment[];
    currentUser: User;
    userCreations: UserCreation[];
    allUsers: User[];
    onClose: () => void;
    onCreateComment: (postId: number, content: string, character?: UserCreation) => void;
    onSparkComment: (commentId: number) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ post, comments, currentUser, userCreations, allUsers, onClose, onCreateComment, onSparkComment }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const commentListRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [commentText, setCommentText] = useState('');
    const [isIC, setIsIC] = useState(false);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [selectedVoiceId, setSelectedVoiceId] = useState(currentUser.id);
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [error, setError] = useState('');
    
    const userCharacters = userCreations.filter(c => c.type === 'Character' || c.type === 'AI Character') as Character[];

    const selectedVoice = selectedVoiceId === currentUser.id
        ? { id: currentUser.id, name: 'You', epithet: 'Yourself', imageUrl: currentUser.avatarUrl }
        : userCharacters.find(c => c.id === selectedVoiceId);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    
    useEffect(() => {
        commentListRef.current?.scrollTo({ top: commentListRef.current.scrollHeight, behavior: 'smooth' });
    }, [comments]);
    
    useEffect(() => {
        if (!isIC) setSelectedVoiceId(currentUser.id);
    }, [isIC]);

    // Auto-expand Textarea Logic
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(scrollHeight, 150)}px`;
        }
    }, [commentText]);


    const handleCreate = () => {
        if (!commentText.trim()) return;
        const character = isIC && selectedVoiceId !== currentUser.id ? userCharacters.find(c => c.id === selectedVoiceId) : undefined;
        onCreateComment(post.id, commentText, character);
        setCommentText('');
        setAiSuggestions([]);
    };
    
    const handleGenerateSuggestions = async () => {
        setIsAiLoading(true);
        setAiSuggestions([]);
        setError('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const lastComments = comments.slice(-3).map(c => `${c.character?.name || c.author.name}: ${c.content}`).join('\n');
            
            let promptContext = `You are a creative role-playing assistant.
            Given the original post: "${post.content}"
            And the last few comments:\n${lastComments}\n
            Suggest three distinct, short, and creative replies.`;

            if (isIC && selectedVoiceId !== currentUser.id) {
                const character = userCharacters.find(c => c.id === selectedVoiceId);
                if (character) {
                    promptContext += ` The reply should be from the perspective of the character "${character.name}", who is described as: "${character.tagline}". Archetype tags: ${character.archetypeTags.join(', ')}.`;
                }
            } else {
                 promptContext += ` The reply should be from the perspective of an interested user commenting on a social media post.`;
            }

            const responseSchema = {
                type: Type.OBJECT,
                properties: { suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of three short, creative reply suggestions." } },
                required: ['suggestions']
            };
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: promptContext,
                config: { responseMimeType: "application/json", responseSchema },
            });

            const result = JSON.parse(response.text);
            setAiSuggestions(result.suggestions || []);

        } catch (err) {
            console.error("AI Suggestion Error:", err);
            setError("Could not generate suggestions right now.");
        } finally {
            setIsAiLoading(false);
        }
    };


    return (
        <>
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={onClose} aria-hidden="true"></div>
        <div ref={modalRef} role="dialog" aria-modal="true" className="fixed inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto z-50 w-full h-[90vh] md:h-auto md:w-full md:max-w-lg bg-gray-900 border-l border-violet-500/30 shadow-2xl flex flex-col animate-slideIn">
            <header className="flex-shrink-0 p-4 flex justify-between items-center border-b border-violet-500/30">
                <h2 className="text-xl font-bold text-cyan-400">Discussion</h2>
                <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white"><XMarkIcon /></button>
            </header>

            <div ref={commentListRef} className="flex-grow p-4 overflow-y-auto">
                <div className="mb-6 p-4 bg-gray-900/50 border border-violet-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                        <UserAvatar src={post.character?.imageUrl || post.author.avatarUrl} size="10" />
                        <div className="flex-grow">
                            <div className="flex items-baseline gap-2">
                                <p className="font-bold text-white text-sm">{post.character?.name || post.author.name}</p>
                                <span className="text-xs text-gray-500">·</span>
                                <p className="text-xs text-gray-500">{post.timestamp}</p>
                            </div>
                            {post.character && <p className="text-xs text-cyan-400 -mt-1">as {post.author.name}</p>}
                            <p className="mt-2 text-gray-300 text-sm whitespace-pre-wrap">{post.content}</p>
                        </div>
                    </div>
                </div>
                
                <div className="divide-y divide-violet-500/20">
                    {comments.map(comment => (
                        <CommentComponent key={comment.id} comment={comment} currentUser={currentUser} onSpark={onSparkComment} />
                    ))}
                </div>
            </div>

            <footer className="flex-shrink-0 p-4 border-t border-violet-500/30 bg-gray-900/50 backdrop-blur-sm">
                 {(isAiLoading || aiSuggestions.length > 0 || error) && (
                    <div className="mb-3 animate-fadeIn">
                        {isAiLoading && <p className="text-sm text-cyan-400 animate-pulse mb-2">Sparking ideas...</p>}
                        {error && <p className="text-sm text-red-400 mb-2">{error}</p>}
                        <div className="flex flex-wrap gap-2">
                            {aiSuggestions.map((s, i) => (
                                <button key={i} onClick={() => setCommentText(s)} className="px-3 py-1 text-sm bg-gray-800 text-cyan-300 rounded-full border border-violet-500/30 hover:bg-violet-500/20 transition-colors text-left">
                                    "{s}"
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Glass Capsule Input for Comments */}
                <div className="flex items-end gap-2 bg-gray-800/60 border border-violet-500/40 rounded-2xl p-2 shadow-inner focus-within:border-violet-400/80 focus-within:ring-1 focus-within:ring-violet-500/30 transition-all">
                    <button onClick={() => isIC ? setIsSelectorOpen(true) : {}} disabled={!isIC} className="flex-shrink-0 self-center rounded-full ring-2 ring-transparent hover:ring-cyan-400 transition-all disabled:opacity-70 disabled:hover:ring-transparent">
                        <UserAvatar src={selectedVoice?.imageUrl} size="10" />
                    </button>
                    <textarea 
                        ref={textareaRef}
                        value={commentText} 
                        onChange={e => setCommentText(e.target.value)} 
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCreate(); }}}
                        placeholder={isIC ? `Replying as ${selectedVoice?.name}...` : "Add a comment..."} 
                        className="w-full bg-transparent text-gray-200 focus:outline-none resize-none max-h-32 overflow-y-auto py-2 leading-relaxed"
                        rows={1}
                    />
                    <button onClick={handleCreate} disabled={!commentText.trim()} className="p-2 text-cyan-400 hover:text-cyan-300 disabled:opacity-50 self-end pb-2"><PaperAirplaneIcon /></button>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                         <label htmlFor="ic-toggle" className="flex items-center cursor-pointer group">
                            <div className="relative">
                                <input type="checkbox" id="ic-toggle" className="sr-only" checked={isIC} onChange={e => setIsIC(e.target.checked)} />
                                <div className={`block w-9 h-5 rounded-full transition-colors ${isIC ? 'bg-cyan-600' : 'bg-gray-700'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${isIC ? 'translate-x-full' : ''}`}></div>
                            </div>
                            <div className={`ml-2 text-xs font-medium transition-colors ${isIC ? 'text-cyan-400' : 'text-gray-400 group-hover:text-gray-300'}`}>In-Character</div>
                        </label>
                    </div>
                    <button onClick={handleGenerateSuggestions} disabled={isAiLoading} className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/30 hover:bg-cyan-500/20 disabled:opacity-50 transition-colors">
                        <LightningBoltIcon className="w-3 h-3" />
                        AI Assist
                    </button>
                </div>
            </footer>
        </div>
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
        </>
    );
};

export default CommentModal;
