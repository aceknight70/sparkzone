
import React from 'react';
// FIX: Imported GroupMessage type from ../types as it is not exported from mockData.
import { currentUser } from '../mockData';
import { GroupMessage } from '../types';
import UserAvatar from './UserAvatar';

interface GroupMessageBubbleProps {
    message: GroupMessage;
}

const GroupMessageBubble: React.FC<GroupMessageBubbleProps> = ({ message }) => {
    const isOwnMessage = message.sender.id === currentUser.id;
    const isRP = !!message.character;
    
    const avatarSrc = isRP ? message.character?.imageUrl : message.sender.avatarUrl;
    const senderName = isRP ? message.character?.name : message.sender.name;

    const getYoutubeEmbed = (text: string) => {
        const match = text.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]*)/);
        return match ? match[1] : null;
    };

    const videoId = getYoutubeEmbed(message.text);

    return (
       <div className="flex items-start gap-3 max-w-full">
           <UserAvatar src={avatarSrc} size="10" className="flex-shrink-0" />
           <div className="flex-grow min-w-0">
                <div className="flex items-baseline gap-2">
                    <p className={`font-bold ${isOwnMessage ? 'text-cyan-400' : 'text-white'}`}>{senderName}</p>
                    <p className="text-xs text-gray-500">{message.timestamp}</p>
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
                <p className="text-gray-200 whitespace-pre-wrap break-words">{message.text}</p>
                {videoId && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-white/10 w-full max-w-md aspect-video bg-black">
                        <iframe 
                            src={`https://www.youtube.com/embed/${videoId}`} 
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                )}
           </div>
       </div>
    );
};

export default GroupMessageBubble;
