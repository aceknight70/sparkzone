

import React, { useState, useRef, useEffect, useMemo } from 'react';
import UserAvatar from '../components/UserAvatar';
import CreationCard from '../components/CreationCard';
import PostCard from '../components/PostCard';
import { UserCreation, User } from '../types';
import ReportModal, { ReportType } from '../components/ReportModal';

// --- Icons ---
const GearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M11.49 3.17a.75.75 0 01.75.75v1.252a2.25 2.25 0 013.75 0V6.82a.75.75 0 01-1.5 0V5.17a.75.75 0 00-1.5 0v1.65a2.25 2.25 0 01-3.75 0V3.92a.75.75 0 01.75-.75zm-3.74 0a.75.75 0 01.75.75v1.252a2.25 2.25 0 013.75 0V6.82a.75.75 0 01-1.5 0V5.17a.75.75 0 00-1.5 0v1.65a2.25 2.25 0 01-3.75 0V3.92a.75.75 0 01.75-.75zM8.51 12.83a.75.75 0 00-1.5 0v1.65a2.25 2.25 0 01-3.75 0v-1.252a.75.75 0 00-1.5 0v1.252a3.75 3.75 0 006.75 2.08V12.83z" clipRule="evenodd" /><path d="M12.25 8a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM15.5 8a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM4.5 8a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0z" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 0013.484 0 .75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 16.03A.75.75 0 018.8 15.5h2.4a.75.75 0 01.75.75 1.5 1.5 0 01-3 0z" clipRule="evenodd" /></svg>;
const WalletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M2.5 4.5A2.5 2.5 0 015 2h10a2.5 2.5 0 012.5 2.5v2.5a.75.75 0 01-1.5 0v-2.5a1 1 0 00-1-1H5a1 1 0 00-1 1v11a1 1 0 001 1h5a.75.75 0 010 1.5H5a2.5 2.5 0 01-2.5-2.5V4.5z" /><path d="M18.98 12.02a.75.75 0 01.75-.75h.001a1.5 1.5 0 011.5 1.5v.001a.75.75 0 01-1.5 0v-.001a.75.75 0 00-.75-.75h-.001a.75.75 0 01-.75.75zm-1.72-1.72a.75.75 0 00-.75.75v5.44l-1.97-1.97a.75.75 0 10-1.06 1.06l3.25 3.25a.75.75 0 001.06 0l3.25-3.25a.75.75 0 10-1.06-1.06l-1.97 1.97V11.25a.75.75 0 00-.75-.75z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const FlagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3 3.5c0-.266.102-.523.284-.716A.994.994 0 014 2.5h8.75c.426 0 .827.257.975.625l.875 2.187 1.925-.77a.75.75 0 01.89.334l.5 1.25a.75.75 0 01-.22.882l-2.153 1.615c.013.129.02.26.02.392 0 2.761-2.686 5-6 5s-6-2.239-6-5c0-.133.007-.264.02-.393L.505 6.013a.75.75 0 01-.22-.882l.5-1.25a.75.75 0 01.89-.334l1.925.77L4.5 2.125z" clipRule="evenodd" /><path d="M3 15.5v3.75a.75.75 0 001.5 0V15.5H3z" /></svg>;
const BugAntIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v2h1.5a.75.75 0 010 1.5h-1.5v2.5a.75.75 0 01-1.5 0v-2.5h-3v2.5a.75.75 0 01-1.5 0v-2.5h-1.5a.75.75 0 010-1.5h1.5v-2h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 0110 2zM8.75 6.25v2h2.5v-2h-2.5z" clipRule="evenodd" /><path d="M5 12a1 1 0 11-2 0 1 1 0 012 0zm12 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>;
const GameIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 00-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 00-.163-.505L1.71 6.745l4.052-.576a.525.525 0 00.393-.288L8 2.223l1.847 3.658a.525.525 0 00.393.288l4.052.575-2.906 2.77a.565.565 0 00-.163.506l.694 3.957-3.686-1.894a.503.503 0 00-.461 0z" /></svg>;


const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
    <div className="text-center">
        <p className="font-bold text-lg text-white">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
    </div>
);

const MenuItem: React.FC<{ icon: React.ReactElement; text: string; onClick?: () => void; className?: string }> = ({ icon, text, onClick, className }) => {
    const commonClasses = `flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-violet-500/20 hover:text-white transition-colors ${className}`;

    if (onClick) {
        return (
            <button onClick={onClick} className={commonClasses} role="menuitem">
                <div className="w-5 h-5 opacity-70">{icon}</div>
                <span>{text}</span>
            </button>
        );
    }
    
    return (
        <a href="#" className={commonClasses} role="menuitem">
            <div className="w-5 h-5 opacity-70">{icon}</div>
            <span>{text}</span>
        </a>
    );
};

type ProfileTab = 'showcase' | 'posts' | 'sparks' | 'community';
type ShowcaseFilter = 'OC Album' | 'Worlds & Stories' | 'AI Characters' | 'Meme Album' | 'Private RP Cards';
const showcaseFilters: ShowcaseFilter[] = ['OC Album', 'Worlds & Stories', 'AI Characters', 'Meme Album', 'Private RP Cards'];

type ProfileView = 'profile' | 'settings';

interface ProfilePageProps {
    currentUser: User;
    userCreations: UserCreation[];
    onUpdateProfile: (updatedData: Partial<User>) => void;
    onEditProfile: () => void;
    onEnterSparkClash?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, userCreations, onUpdateProfile, onEditProfile, onEnterSparkClash }) => {
    const [activeTab, setActiveTab] = useState<ProfileTab>('showcase');
    const [activeShowcaseFilter, setActiveShowcaseFilter] = useState<ShowcaseFilter>('OC Album');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [view, setView] = useState<ProfileView>('profile');
    
    // Reporting
    const [reportType, setReportType] = useState<ReportType | null>(null);
    
    const [pronouns, setPronouns] = useState(currentUser.pronouns || '');
    const [characterTags, setCharacterTags] = useState((currentUser.characterTags || []).join(', '));

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

    const filteredCreations = useMemo(() => {
        switch (activeShowcaseFilter) {
            case 'OC Album':
                return userCreations.filter(c => c.type === 'Character');
            case 'Worlds & Stories':
                return userCreations.filter(c => c.type === 'World' || c.type === 'Story');
            case 'AI Characters':
                return userCreations.filter(c => c.type === 'AI Character');
            case 'Meme Album':
                return userCreations.filter(c => c.type === 'Meme');
            case 'Private RP Cards':
                return userCreations.filter(c => c.type === 'RP Card');
            default:
                return [];
        }
    }, [activeShowcaseFilter, userCreations]);

    const handleSaveSettings = () => {
        onUpdateProfile({
            pronouns,
            characterTags: characterTags.split(',').map(t => t.trim()).filter(Boolean)
        });
        setView('profile');
    };

    const TabButton: React.FC<{ tabName: ProfileTab; label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`py-3 px-4 font-semibold w-full transition-colors duration-200 ${activeTab === tabName ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
            {label}
        </button>
    );
    
    const ShowcaseFilterButton: React.FC<{ filter: ShowcaseFilter }> = ({ filter }) => (
        <button
            onClick={() => setActiveShowcaseFilter(filter)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-full whitespace-nowrap transition-colors duration-200 ${activeShowcaseFilter === filter ? 'bg-cyan-500 text-white' : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700'}`}
        >
            {filter}
        </button>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'showcase':
                return (
                    <div className="animate-fadeIn">
                        <div className="p-2 flex items-center justify-start gap-2 overflow-x-auto scrollbar-hide border-b border-violet-500/30">
                            {showcaseFilters.map(filter => <ShowcaseFilterButton key={filter} filter={filter} />)}
                        </div>
                        {filteredCreations.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                                {filteredCreations.map(creation => <CreationCard key={creation.id} creation={creation} />)}
                            </div>
                        ) : (
                             <div className="p-8 text-center text-gray-400">
                                <p>Nothing to see here yet!</p>
                            </div>
                        )}
                    </div>
                );
            case 'posts':
                return <div className="p-4 animate-fadeIn"></div>;
            case 'sparks':
                return <div className="p-8 text-center text-gray-400 animate-fadeIn"><p>Content you've sparked will appear here.</p></div>;
            case 'community':
                return <div className="p-8 text-center text-gray-400 animate-fadeIn"><p>Clans and communities you're a part of will appear here.</p></div>;
            default:
                return null;
        }
    };
    
    const SettingsView = () => (
      <div className="container mx-auto max-w-4xl p-4 py-8 animate-fadeIn">
          <div className="flex items-center mb-6">
              <button onClick={() => setView('profile')} className="p-2 mr-2 rounded-full hover:bg-gray-800 transition-colors" aria-label="Back to profile">
                  <ArrowLeftIcon />
              </button>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>

          <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6 max-w-2xl mx-auto">
              <h2 className="text-xl font-bold text-cyan-400 mb-6 border-b border-violet-500/30 pb-4">Character Settings</h2>
              
              <div className="space-y-6">
                  <div>
                      <label htmlFor="pronouns" className="block text-sm font-medium text-gray-300 mb-2">Preferred Pronouns</label>
                      <input
                          type="text"
                          id="pronouns"
                          value={pronouns}
                          onChange={(e) => setPronouns(e.target.value)}
                          className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="e.g., she/her, they/them"
                      />
                  </div>

                  <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">Character Tags</label>
                      <input
                          type="text"
                          id="tags"
                          value={characterTags}
                          onChange={(e) => setCharacterTags(e.target.value)}
                          className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="e.g., Knight, Mage, Sci-Fi"
                      />
                      <p className="text-xs text-gray-500 mt-2">Comma-separated tags to help others find your character.</p>
                  </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-violet-500/30 text-right">
                  <button 
                      onClick={handleSaveSettings}
                      className="px-5 py-2.5 bg-cyan-500 text-white font-semibold rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
                      Save Changes
                  </button>
              </div>
          </div>
      </div>
    );

    if (view === 'settings') {
        return <SettingsView />;
    }

    return (
        <div className="animate-fadeIn">
            <div className="h-40 md:h-56 bg-cover bg-center" style={{ backgroundImage: `url(${currentUser.bannerUrl})` }}></div>
            
            <div className="container mx-auto max-w-4xl p-4">
                <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-20">
                    <UserAvatar src={currentUser.avatarUrl} size="24" className="border-4 border-black"/>
                    <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left flex-grow">
                        <h1 className="text-3xl font-bold text-white">{currentUser.name}</h1>
                        <p className="text-gray-400">@spark_user</p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                         <button onClick={onEditProfile} className="px-4 py-2 bg-gray-800/80 border border-violet-500/50 text-white font-semibold rounded-full hover:bg-violet-500/20 transition-colors">Edit Profile</button>
                        <div className="relative" ref={menuRef}>
                            <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-2 bg-gray-800/80 border border-violet-500/50 text-white font-semibold rounded-full hover:bg-violet-500/20 transition-colors" aria-label="More options"><GearIcon /></button>
                            <div className={`absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg bg-gray-900 border border-violet-500/50 ring-1 ring-black ring-opacity-5 z-10 transition-all duration-100 ease-out ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`} style={{ transformOrigin: 'top right' }} role="menu" aria-orientation="vertical">
                                <div className="py-1" role="none">
                                    {onEnterSparkClash && (
                                        <>
                                            <MenuItem icon={<GameIcon />} text="Spark Clash Arcade" onClick={() => { onEnterSparkClash(); setIsMenuOpen(false); }} className="text-cyan-400 font-bold hover:text-cyan-200 hover:bg-cyan-900/20" />
                                            <div className="border-t border-gray-700 my-1"></div>
                                        </>
                                    )}
                                    <MenuItem icon={<GearIcon />} text="Settings" onClick={() => { setView('settings'); setIsMenuOpen(false); }} />
                                    <MenuItem icon={<BellIcon />} text="Notifications" />
                                    <MenuItem icon={<WalletIcon />} text="Fantasy Wallet" />
                                    <MenuItem icon={<UsersIcon />} text="Friend List" />
                                    <div className="border-t border-gray-700 my-1"></div>
                                    <MenuItem icon={<BugAntIcon />} text="Send Feedback" onClick={() => { setReportType('Feedback'); setIsMenuOpen(false); }} />
                                    <MenuItem icon={<FlagIcon />} text="Report User" onClick={() => { setReportType('User'); setIsMenuOpen(false); }} className="text-red-400 hover:text-red-200" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <p className="mt-4 text-gray-300 max-w-2xl mx-auto md:mx-0 text-center md:text-left">{currentUser.bio}</p>
                
                <div className="mt-4 flex items-center justify-center md:justify-start gap-2 text-cyan-400">
                    {/* Placeholder for clan/community */}
                </div>

                <div className="flex justify-center md:justify-start gap-8 mt-6 py-4 border-y border-violet-500/30">
                    <button className="transition-transform hover:scale-105"><StatItem value="1.2k" label="Followers" /></button>
                    <button className="transition-transform hover:scale-105"><StatItem value="345" label="Following" /></button>
                    <StatItem value="25.8k" label="Sparks" />
                </div>
            </div>

            <div>
                <div className="border-b border-violet-500/30">
                    <div className="container mx-auto max-w-4xl flex">
                        <TabButton tabName="showcase" label="Showcase" />
                        <TabButton tabName="posts" label="Posts" />
                        <TabButton tabName="sparks" label="Sparks" />
                        <TabButton tabName="community" label="Community" />
                    </div>
                </div>
                
                <div className="container mx-auto max-w-4xl">
                    {renderContent()}
                </div>
            </div>
            
            {reportType && (
                <ReportModal 
                    isOpen={!!reportType} 
                    onClose={() => setReportType(null)} 
                    type={reportType} 
                    targetName={currentUser.name}
                    targetId={currentUser.id}
                />
            )}
        </div>
    );
};

export default ProfilePage;
