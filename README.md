Spark Zone is a "Creative Social Operating System." It blends the features of a social network (like Twitter/X), a creative writing tool (like Wattpad), a tabletop virtual tabletop (like Roll20), and a trading card game (like Hearthstone), all wrapped in a gamified, neon-cyberpunk aesthetic.
Here is the deep-dive explanation of every feature and page:
1. Global Features & Architecture
These features persist across the entire application.
The "Spark" Economy:
Currency: "Sparks" are the central currency. Users earn them by daily logins, winning card battles, or receiving "Gifts" on their posts.
Usage: Sparks are used to buy Card Packs for the TCG, cosmetic items for Party rooms, or to unlock premium story features.
Sonic Jukebox (Persistent Audio):
A floating widget (bottom-right) that plays music continuously while the user navigates different pages.
Functionality: Users can input YouTube URLs to stream audio. It features a visualizer animation and volume controls.
Skynet (AI Safety & Moderation):
An integrated AI moderation layer using Google Gemini.
Defense System: When users create Worlds or Characters, they can configure a "Defense Level" (Everyone, Teen, Mature). Skynet scans content and flags inappropriate tags (Violence, Horror, etc.).
Intervention: If a user posts banned content, a "Skynet Intervention" modal appears, warning the user or locking them out if they are repeat offenders.
Glassmorphism UI:
The visual language uses semi-transparent dark layers ("glass"), neon accents (Cyan/Violet), and animated background grids to create a futuristic feel.
2. The Hub (Social Layer)
Home Page (/home)
The landing stream for the user.
The Feed: A scrollable list of posts. Uniquely, users can post As Themselves or As a Character (Persona Switching).
Daily Spark: A prominent widget at the top that uses AI to generate a daily writing prompt (e.g., "A cyberpunk courier discovers a package that ticks..."). Users can click "Post" to answer it or "Story" to start a full novel based on it.
Spark & Comment: The "Like" button is replaced by "Spark". Sparking a post creates a particle effect and gives currency to the creator.
Explore Page (/explore)
The discovery engine.
Discovery Cards: Creations (Worlds, Stories, Characters) are displayed as trading-card-style assets with visual covers and age ratings.
Filters: Users can filter by "Library" (things they joined), "Communities" (Guilds), or specific creative types.
Search: A global search bar that indexes users, worlds, and lore.
Messenger (/chat)
A rich-text chat system.
Persona Switching: In any DM, the user can switch their "Voice" to speak as one of their created Characters. The avatar and name in the chat bubble change accordingly.
AI Imagery: Users can type /imagine [prompt] to instantly generate an AI image into the chat stream using Gemini.
Actions: Special message types allow users to send "Challenges" (start a card battle), "Gifts" (send Sparks), or "Invites" (to a World/Party).
3. The Workshop (Creation Suite)
This is where users build content. It features a specific "Editor" for each content type.
Character Creator
The Spark: Defines the character's archetype (Hero, Rogue) and personality quirks.
Blueprint: Detailed stats (Height, Age) and backstory text.
AI Generator: A modal where the user types a vague idea (e.g., "Grumpy dwarf baker"), and Gemini fills out the entire character sheet.
Portrait Generator: Users can generate a visual avatar for their character using AI directly within the editor.
World Builder (CMS)
A massive tool for Dungeon Masters and Worldbuilders.
Landing: Configures the "Entrance," including a banner, synopsis, and entry policy (Open vs. Application).
Lorebook: A wiki-style database. Users create entries for Factions, Items, or History. It includes an AI tool to "Generate Description" or "Generate Image" for the lore entry.
Atlas: An interactive map editor. Users upload a map image and drop "Pins". Pins can link to a Chat Channel (location) or a Lore Entry (wiki).
Chronicle: A timeline editor to plot the history of the world (Year 2050: The Fall, Year 2051: The Rebirth).
Channels: Users create chat rooms (e.g., #tavern, #general) and can assign specific background images and theme songs to each channel.
Story Editor
A writing tool for novels and visual novels.
Scene Sequencer: Writers break text into "Blocks". Each block can have a specific visual background assigned to it.
AI Co-Author: A toolbar offering:
Continue: AI writes the next paragraph.
Describe: User highlights text (e.g., "a sword"), and AI writes a vivid description of it.
Brainstorm: AI reads the story so far and suggests 3 plot twists.
Context Drawer: A sidebar that lists Cast members and Lore. Users can click them to auto-insert their names into the text.
Meme Forge
A canvas-based image editor.
Templates: Users can select from classic meme templates or use AI to generate a new background image.
Editing: Users can drag, drop, rotate, and colorize text captions on top of the image.
4. The Playground (Interactive Layer)
Party System (/party)
Real-time lobbies for hanging out or gaming.
The Stage: The central view changes based on the mode:
Social: A moodboard where users drag and drop images to share vibes.
Theatre: A synchronized video player (YouTube wrapper) for movie nights.
Tabletop (VTT): A grid-based map. Users place "Tokens" representing their characters. Tokens have HP bars and can be dragged around. Includes a 3D dice roller tray.
Live: Video/Audio streaming for a "Just Chatting" experience.
Shop: A Party-specific shop to buy room themes or "stickers" using Sparks.
World Viewer
Immersion: When a user enters a World, the UI transforms. The background becomes the world's banner.
Sidebar Navigation: Users navigate via the "Atlas" (clicking map pins) or a list of Channels.
Contextual Chat: Chatting in a world channel allows access to the "Lorebook" sidebar to look up information without leaving the chat.
Story Reader
Visual Novel Mode: As the reader scrolls, the background image fades and changes to match the scene defined by the author.
Interactive Codex: Keywords in the text (e.g., character names) are underlined. Hovering over them pops up a "Codex Card" showing that character's face and bio.
5. Spark Clash (The Minigame)
A fully-featured Trading Card Game (TCG) embedded in the app.
Battle System:
Entities: Player vs. AI (Cyber-Construct).
Resources: Mana (regenerates per turn), HP, Shield.
Elements: Cards have elements (Solar, Lunar, Void) which determine visual style.
Mechanics: Users draw cards, spend mana to play them. Cards deal damage, heal, or add shields.
The Forge:
Fusion: Users can combine duplicate cards to level them up (Level 1 -> Level 2), increasing their stats.
Recycle: Unwanted cards can be destroyed to reclaim Sparks.
Deck Builder: Users can build custom decks of 10 cards from their inventory.
Shop: Users buy "Booster Packs" (Basic, Elemental, Ultra) with Sparks. Opening a pack triggers a reveal animation.
6. Profile & Community
Profile Page
Identity: Displays Avatar, Banner, and "Badges" (e.g., Premium).
Wallet: Shows Spark balance and transaction history.
Showcase: A grid of the user's published Characters, Stories, and Worlds.
Friends: A list of followers and following.
Communities (Guilds)
Roster: Management of Leaders, Officers, and Members.
Feed: A private social feed exclusive to members.
Leveling: Communities earn XP as members are active, unlocking new features (like custom banners).
lightbulb_tips
