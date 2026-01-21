# Auth0 For Kids: The City Passport Story

This guide explains authentication and authorization using simple stories.
Think of the app as a city, and Auth0 as the city hall that gives out passports.

## The Big Idea
You want only real, approved people to enter the city and do things.
Auth0 is the trusted city hall that checks who you are and gives you a passport
that proves it to everyone else.

## Characters in the Story
- You = the traveler
- The app (frontend) = the city gate
- Auth0 = city hall
- The API services = places inside the city (library, park, bank)
- Access token (JWT) = your passport
- Refresh token = a long term pass to get a new passport
- Redirect URL = the official road from city hall back to the city gate
- Client ID = the name tag for the app
- Audience = the name of the city you want to visit
- Issuer = the city hall that made the passport

## Authentication vs Authorization
- Authentication means: "Who are you?"
  The guard asks your name and checks your identity.
- Authorization means: "What are you allowed to do?"
  The guard checks your passport to see if you can enter the library or bank.

Auth0 handles authentication. Your APIs handle authorization by checking the passport.

## Why We Need All These Pieces

### 1) Client ID
Think of the Client ID as the app's name tag.
City hall needs to know which app is asking for a passport.
Without a name tag, city hall will not talk to the app.

### 2) Domain (Issuer)
The domain is the address of the city hall.
It tells the app where to send travelers for identity checks.
The backend also checks the issuer to be sure the passport was made by the real city hall.

### 3) Audience (API Identifier)
The audience is the city you want to visit.
If your passport says "City A" but you show it at City B, the guards refuse you.
This prevents a passport for one app from being used in another app.

### 4) Redirect URLs
After city hall checks your identity, it must send you back to the correct city gate.
The redirect URL is the only allowed road back.
If a fake road is used, a thief could intercept your passport.
So Auth0 only allows the exact roads you listed.

You usually need multiple redirect URLs because:
- localhost:3000 is the production-like local server
- localhost:5173 is the Vite dev server
Both are real roads, just different ones.

### 5) Access Token (JWT)
A JWT is a small signed passport that is hard to forge.
It contains claims, which are like stamps:
- "sub" = your unique id
- "email" = your email
- "iss" = which city hall issued it
- "aud" = which city it is for
- "exp" = when it expires

The backend checks the signature and these claims.
If they match, you are allowed in.

### 6) Refresh Token
Passports expire quickly for safety.
Instead of sending you to city hall every minute,
you keep a long term pass (refresh token) that can get you a new passport.
This keeps you signed in without being unsafe.

## The Full Workflow (Step by Step)

1) You open the app.
   The city gate sees you have no passport.

2) The app sends you to Auth0 (city hall).
   This uses the Client ID and the Redirect URL.

3) You log in or sign up at Auth0.
   Auth0 checks your identity.

4) Auth0 sends you back to the app.
   It only uses a redirect URL you allowed.

5) The app asks Auth0 for an access token (passport).
   It asks for the correct audience, so the passport is for your city.

6) The app calls the API with the token.
   The token goes in the Authorization header.

7) The API checks the token.
   It verifies:
   - Issuer: passport came from the real city hall
   - Audience: passport is for this city
   - Signature: passport was not forged
   - Expiration: passport is not expired

8) If all checks pass, the API allows the request.
   You can now drop pins and view data.

9) When the token expires, the app uses the refresh token.
   Auth0 gives a new access token without forcing a new login.

## Why JWT Is Needed
Without JWT, each API would need to call Auth0 every time.
JWT lets the API verify the passport locally and quickly.
It is fast, secure, and works across many microservices.

## Quick Summary
- Auth0 is the trusted identity checker.
- The app is the gate that sends you to Auth0.
- The API is the place you want to enter.
- The JWT is your signed passport.
- Redirect URLs keep passports safe from thieves.
- Audience and issuer stop passports from being used in the wrong place.

If you want, I can add a diagram or a short video style flow using the same story.
