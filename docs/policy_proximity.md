# Policy and Proximity Algorithms

## Policy Engine (Pseudocode)
Inputs:
- pin (audienceType, revealType, availableFrom, expiresAt, futureSelf)
- viewer (relationship prefs, lists, blocks)
- context (now, distanceMeters, forNotification)

ACL semantics:
- audienceType defines base visibility.
- ACL lists and users further restrict visibility.
- If both list and user ACLs are present, either match allows access.

Pseudocode:
1) If now not in [availableFrom, expiresAt): deny TIME_WINDOW.
2) If viewer is blocked by owner: deny BLOCKED.
3) If audienceType does not allow viewer: deny AUDIENCE.
4) If pin ACL lists exist and viewer not in any required list: deny LISTS.
5) If pin ACL user list exists and viewer not in list: deny ACL_USER.
6) If viewer preference canSeePins is false: deny REL_PREF.
7) If forNotification and canReceiveProximityNotifications is false: deny NOTIFY_PREF.
8) If revealType is REACH_TO_REVEAL and distanceMeters > revealRadius: deny DISTANCE.
9) If pin is future-self and viewer is owner and distanceMeters > revealRadius: deny FUTURE_SELF.
10) Otherwise allow.

## Proximity Algorithm
Client:
1) Compute coarse location bucket (H3 or geohash).
2) Send bucket updates on a throttled schedule.

pins-service:
1) Receive bucket and find candidate pins in bucket or neighbors.
2) Call social-service and lists-service for access filters.
3) Return minimal candidate payload (pin ID + reveal zone), no exact coordinates unless allowed.

Client:
1) Register OS geofences for candidates (respect platform limits).
2) On geofence trigger, call /pins/{id}/check-reveal with precise location.

pins-service:
1) Validate ACL, time, and distance or polygon containment.
2) Enforce cooldowns and update notification state.
3) Return unlock decision and pin content if allowed.
