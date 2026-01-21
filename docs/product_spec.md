# Product Specification

## Overview
Brooks is a map-based social notes platform where users create location-anchored "Pins" that are discoverable only by proximity. The product is privacy-first: no live location sharing, no passive broadcast, and all discovery is gated by explicit permissions and proximity rules.

## Core Principles
- Privacy by default: relationships and notifications are opt-in.
- Proximity-only discovery: no remote visibility to exact locations.
- Ephemeral content: pins expire and disappear globally after expiration.
- Safety-first public discovery: strict rate limits and abuse controls.

## Primary Use Cases
1) Private future-self notes (hidden until the owner is near).
2) Friends-only proximity notes.
3) Creator treasure hunts for followers.
4) Public proximity discovery with safety constraints.

## Key Concepts
### Users and Relationships
- Friends are mutual.
- Followers are one-way.
- Blocks hide content in both directions.
- Per-relationship preferences (viewer -> subject):
  - can_see_pins (default false)
  - can_receive_proximity_notifications (default false)

### Lists
- Friend lists and follower lists are created by users.
- Lists are used for per-pin access control.

### Pins
Each pin contains:
- Content: text (required), optional media (image/audio/video), optional link.
- Location: exact lat/lng stored server-side; optional altitude.
- Reveal policy:
  - VISIBLE_ALWAYS
  - REACH_TO_REVEAL with a reveal radius
  - map_precision: EXACT or BLURRED
  - optional mystery polygon (server-side)
- Access:
  - audience_type: PRIVATE | FRIENDS | FOLLOWERS | PUBLIC
  - ACL entries: lists and/or specific users
- Time:
  - available_from (now or scheduled)
  - expires_at (required)
- Notifications:
  - notify_radius_meters
  - cooldown duration
  - one-time or repeatable

### Visibility and Discovery Rules
A pin is discoverable or unlockable only if all conditions pass:
1) Current time is within [available_from, expires_at).
2) Viewer is not blocked by pin owner.
3) Audience type allows the viewer.
4) Viewer belongs to any required lists.
5) Viewer has can_see_pins enabled for pin owner.
6) For notifications: can_receive_proximity_notifications enabled.
7) For reach-to-reveal: viewer is within the reveal radius or mystery polygon.

Expired pins:
- Disappear everywhere after expires_at.
- Content is removed from user access.
- Minimal metadata retained only for audit, with no content.

## Non-Functional Requirements
- Latency: pin reveal checks under 300 ms P95.
- Availability: 99.9% for core APIs.
- Scalability: support large city density with location bucketing.
- Data minimization: do not store continuous user location; retain buckets only for short windows (default 15 minutes).
- Cost controls: geofence candidate limits; cache hot lists.

## Safety and Abuse Prevention
- Rate limits on map queries, proximity checks, and follows.
- Abuse reporting, block tools, and admin review.
- Anti-scraping measures for public pins.

## Out of Scope (MVP)
- Live location sharing.
- Real-time chat or messaging.
- Cross-app social graph.
