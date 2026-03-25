# Brooks App Designer Feature Brief

## Product Summary
Brooks is a mobile-first, map-based social memory app. Users leave written memories on real-world places, control who can access them, explore their own pins and friends' pins, manage relationships, and maintain a profile.

The core product loop is:

1. Authenticate
2. Land on a live map
3. Leave a memory tied to a location
4. Browse visible pins
5. Open profiles, add friends, and switch between home / mine / friends views
6. Receive notifications for activity and proximity-based reveals

This brief is for visual and interaction design. It describes the actual product features and UI requirements in the current app.

## Design Priorities
- Mobile-first
- Map-first
- Fast first-use understanding
- Clear primary action hierarchy
- Social features should feel useful, not ornamental
- Creation should be intuitive in one hand
- Profile should feel identity-first and memory-centered

## Primary User Goals
- Leave a memory on a place
- Explore memories on the map
- View only my pins
- View friends' pins
- Find people and manage relationships
- View and edit my profile
- Read notifications

## Main Information Architecture
- Auth / Entry
- Main Map Shell
- Pin Creation Sheet
- Pin Detail Sheet
- Navigation Drawer
- Social / People Sheet
- Notifications Sheet
- Profile Screen
- Lightweight personalization tools

## Global App Structure

### 1. Authentication Gate
Purpose:
- Explain the product quickly
- Offer sign in and sign up

Content:
- Product name: Brooks
- Hero statement
- Short product explanation
- One primary action: Sign in
- One secondary action: Create account
- Error state for auth failures
- Loading state while auth initializes

Design considerations:
- This should feel like the product entry, not a generic login form
- Must clearly explain that the app is about leaving memories on places

### 2. Main Map Shell
Purpose:
- Primary home screen after login
- Central exploration and creation surface

Persistent elements:
- Top bar
- Full-screen map
- Floating FAB
- Bottom action bar
- Pins visibility toggle
- Decorative global overlays

Behavior:
- Opens centered on current theme/location default
- Fetches pins for current map area
- Supports pin view scopes:
  - Home
  - My pins
  - Friends' pins
- Supports pin visibility toggle:
  - Pins visible
  - Pins hidden
- Supports map hold gesture to start pin creation
- Supports standard create flow from button tap

Empty state:
- If there are no visible pins and no modal/drawer is open, a helper card appears:
  - "Start here"
  - guidance to leave a memory, hold on map, or open People

### 3. Top Bar
Purpose:
- Minimal global command surface

Elements:
- Hamburger/menu button
- Brand title: Brooks
- Brand subtitle: leave memories on places
- People button
  - carries dot badge when incoming friend requests exist
- Notifications button
  - carries dot badge when unread notifications exist
- User avatar / initials button

User menu:
- Profile
- Sign out

States:
- avatar image present
- avatar fallback initials
- badge shown / hidden
- user menu open / closed

### 4. Floating Action Button
Purpose:
- Secondary create-entry path

Behavior:
- Opens pin creation sheet
- Reinforces "leave a memory" as the dominant action

### 5. Bottom Action Bar
Purpose:
- Mobile-first primary actions

Actions:
- Leave a memory
- People
- Explore

Hierarchy:
- "Leave a memory" is the primary CTA
- People and Explore are secondary

## Map Features

### 1. Map Providers
Current supported providers:
- Google Maps
- Leaflet

Design need:
- Shared visual system that works on top of both
- Provider toggle lives in drawer preferences

### 2. Pin Rendering
Map pins include:
- id
- ownerId
- location
- map precision
- text preview
- audience type
- reveal type
- owner flag

Pin behaviors:
- Tap a pin to open pin detail
- Pins can be hidden globally with the visibility toggle

### 3. Map Hold Interaction
Purpose:
- Creation shortcut directly from map

Behavior:
- Long hold starts a charge ring at touch point
- Completing the hold:
  - captures the held coordinates
  - sets new center
  - opens pin creation modal
- Releasing early cancels

Design requirement:
- This is a meaningful gesture flow and should feel clear, not gimmicky
- Need visual feedback for:
  - hold start
  - hold progress
  - completed state
  - canceled state

## Navigation Drawer
Purpose:
- Secondary navigation and preferences

Sections:

### Do Now
- Leave a memory

### Explore
- Home
- My pins
- Friends' pins
- People

### Preferences
- Leaflet
- Google maps

### Footer
- Sign out

States:
- Current pin view highlighted
- Current map provider highlighted
- Open / close animated drawer

Behavior:
- Selecting Home / My pins / Friends' pins changes dataset shown on the map
- Selecting People opens the Social panel

## Pin Creation Sheet
Purpose:
- Main content creation flow

This is one of the most important surfaces in the app.

### Core Structure
Order of sections:

1. Message
2. Audience
3. Recipients picker, conditionally
4. Radius
5. Time
6. Advanced
7. Location precision + coordinates
8. Submit summary
9. Actions

### 1. Message Section
Purpose:
- Primary content input

Fields:
- textarea for note text
- character count
- helper copy

Behavior:
- Required to submit
- This is the most visually dominant form block

### 2. Audience Section
Audience types:
- Private
- Friends
- Followers
- Public

Interaction:
- Icon-card grid
- Single selection

Visual icon meanings:
- Lock for private
- Two people for friends
- Person-plus for followers
- Globe for public

### 3. Recipient Picker
Shown only when audience is:
- Friends
- Followers

Purpose:
- Explicitly choose recipients from existing relationships

### 4. Radius Section
Purpose:
- Configure discovery / reveal distance

Current interaction:
- Circular meter
- Slider
- Step buttons

Radius options:
- Off / none
- 50m
- 100m
- 250m
- 500m
- 1km
- 5km

Design requirement:
- Must clearly communicate what the radius means
- Needs good central feedback and easy thumb control on mobile

### 5. Time Section
Purpose:
- Configure pin lifetime

Current interaction:
- Circular meter
- Slider
- Step buttons

Duration presets:
- 1 day
- 1 week
- 1 month
- 1 year
- 10 years
- 100 years
- Permanent

### 6. Advanced Section
Collapsible block

Contains:

#### Reveal Mode
- Visible always
- Reach to reveal

#### Media Type
- None
- Photo
- Video
- Audio
- Link

#### Vault Mode
Purpose:
- Make a time-capsule-style memory

States:
- off
- on

When on:
- choose unlock datetime
- option to keep private or send to people
- recipient UUID manual input
- external recipient input

### 7. Location Precision + Coordinates
Purpose:
- Control how exact the location appears

Precision options:
- Exact
- Blurred

Metadata shown:
- live latitude / longitude

Design requirement:
- This is secondary information
- Should be visually quieter than message, audience, radius, and time

### 8. Submit Summary
Purpose:
- Reduce uncertainty before posting

Current summary chips:
- audience
- radius
- duration
- precision
- reveal mode

### 9. Action Row
Buttons:
- Cancel
- Post

Submit states:
- disabled if message empty
- loading state while posting

## Pin Detail Sheet
Purpose:
- Show the actual memory preview and key access metadata after a pin tap

Content-first approach:
- memory preview text first
- summary chips / metadata second
- owner profile entry path available

Key data:
- text preview
- audience type
- reveal type
- ownership state

Behavior:
- open from map pin tap
- close back to map
- can route into profile screen using ownerId

Design need:
- This should feel emotionally meaningful, not like a raw data card
- Technical metadata should be secondary

## Social / People Panel
Purpose:
- Discover people
- Manage friendships and follows
- Bridge social graph into map usage

Tabs:
- Find people
- Friends
- Requests
- Following

### Find People Tab
Features:
- search input
- search results list
- open profile
- add friend
- follow / unfollow
- accept / decline if an incoming request already exists
- requested badge for sent requests

Search input placeholder:
- Search by name, handle, or email

### Friends Tab
Features:
- list of current friends
- open profile
- remove friend
- CTA to switch to Friends' pins view

Empty state:
- No friends yet. Use Find people to send requests.

### Requests Tab
Split into two blocks:

#### Incoming
- requester identity
- accept
- decline

#### Sent
- recipient identity
- pending state

### Following Tab
Split into two blocks:

#### Following
- list people you follow
- unfollow

#### Followers
- list people who follow you
- add friend if not already a friend
- friend badge if already connected

Global panel states:
- loading relationships
- empty lists
- button loading / disabled during actions

## Notifications Panel
Purpose:
- Show activity stream

Notification data:
- id
- type
- referenceId
- title
- body
- read state
- createdAt

Behaviors:
- open from top bar bell
- unread count shown in top bar
- list notifications
- mark unread notifications as read by tapping them

States:
- loading
- empty
- unread card
- read card

Design requirement:
- Notifications should feel lightweight and scannable
- Timestamp is relative, e.g. `just now`, `5m ago`, `2h ago`

## Profile Screen
Purpose:
- Identity surface
- Social action surface
- Memory portfolio surface

This is a full-screen mobile-first profile route/sheet.

### Profile Header
Elements:
- back button
- profile title / handle

### Profile Hero
Elements:
- avatar image or initials fallback
- display name
- handle
- pronouns, if present
- location label, if present
- bio
- website link

### Stats Row
Current stats:
- Friends
- Followers
- Following
- Memories

### Profile Actions
For self:
- Edit profile / Close editor

For another user:
- Add friend
- Accept friend
- Decline request
- Remove friend
- Follow
- Unfollow
- Friends' pins shortcut when relevant

### Edit Profile Mode
Editable fields:
- display name
- handle
- avatar URL
- bio
- about
- pronouns
- location
- website

Actions:
- Save profile
- Cancel

### Featured Memories
Purpose:
- Short highlighted memory strip near top

Content:
- date
- memory preview

### Profile Tabs
Tabs:
- Memories
- Map
- About

#### Memories Tab
- recent visible memories
- date
- audience label
- text preview

#### Map Tab
- mini map with visible memories from this profile
- total visible memory count

#### About Tab
- long-form about text
- secondary fact grid:
  - location
  - pronouns
  - website

States:
- loading profile
- no visible memories
- no about section
- avatar fallback

## Profile Data Model
Designer should account for optional/null values for:
- avatarUrl
- bio
- about
- pronouns
- locationLabel
- websiteUrl

Relationship summary states:
- self
- friend
- following
- incoming friend request
- outgoing friend request

## Notifications and Social Counters
Badge sources:
- incoming friend request count
- unread notification count

Badge locations:
- People button in top bar
- Notifications button in top bar

## Font / Personalization Tool
Purpose:
- lightweight personalization

Current behavior:
- floating font selector
- controls display / body / mono slots

Product importance:
- secondary
- should not compete with core tasks

Designer note:
- It exists, but should be visually subordinate to map, creation, social, and profile

## Error / Loading / Empty States To Design

### Global
- app loading
- secure session loading

### Auth
- auth error

### Map
- no visible pins
- map loading fallback

### Pin creation
- submit loading
- recipient validation error
- disabled post button

### Social
- no search results
- no friends
- no requests
- no following
- loading relationships

### Notifications
- loading notifications
- no notifications

### Profile
- loading profile
- no visible memories
- no about section

## Important Interaction Rules
- The map must remain visible and tappable as the core canvas
- The app is mobile-first; large blocking overlays should be avoided unless they are the current task surface
- "Leave a memory" is the primary action language across the app
- Friends are central to the social model
- Pins can be viewed in three scopes:
  - home
  - mine
  - friends
- Profile is identity + relationship + memory portfolio, not just settings

## Required Designer Deliverables
- Auth screen
- Main map shell
- Pin creation sheet
- Pin detail sheet
- Navigation drawer
- Social / people panel
- Notifications panel
- Profile screen
- Empty, loading, and error states for all major surfaces
- Mobile-first layouts first, then tablet/desktop adaptations

## Notes For The Designer
- Do not design this as a generic chat app, notes app, or traditional social feed
- The product is map-native and place-based
- The emotional center is the memory itself
- The practical center is fast creation and easy exploration
- Social should feel integrated into map behavior, not detached from it
