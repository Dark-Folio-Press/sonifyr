# Sonifyr - Astrological Music Curation

Sonifyr creates personalized Spotify playlists based on the weekly planetary transits across your birth chart, combining celestial insights with music recommendations.

## Authentication

### Spotify OAuth Only
Sonifyr uses **Spotify-only authentication**. 

**Important Limitations:**
- **Spotify Premium Required**: Due to Spotify's Development Mode restrictions, only Premium accounts can use this app
- **Whitelist Limited**: Access is restricted to 5 users maximum in Development Mode
- **Email Whitelisting**: Your Spotify email must be whitelisted by the administrator

### How Authentication Works
1. Visit the home page and enter your birth information
2. When generating or exporting playlists, you'll be redirected to Spotify OAuth
3. After successful authentication, you'll return to the app with full playlist access

## Local Development

1. Clone the repository
2. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

3. Fill in your Spotify credentials in `.env`:
   - `SPOTIFY_CLIENT_ID` - Your Spotify app client ID
   - `SPOTIFY_CLIENT_SECRET` - Your Spotify app client secret
   - `DATABASE_URL` - PostgreSQL connection string
   - `SESSION_SECRET` - Secret key for session management

4. Install dependencies and run:

   ```bash
   npm install
   npm run dev
   ```

## Features

- Personalized astrological playlists based on birth chart
- Spotify integration for playlist creation and export
- Guest mode for trying without Spotify Premium (limited features)
- Birth chart visualization and insights
- Cosmic music recommendations

## Environment Variables

Required environment variables:
- `SPOTIFY_CLIENT_ID` - Spotify OAuth client ID
- `SPOTIFY_CLIENT_SECRET` - Spotify OAuth client secret
- `DATABASE_URL` - PostgreSQL database connection
- `SESSION_SECRET` - Session encryption key
- `OPENAI_API_KEY` - For AI-powered playlist descriptions (optional)

Note: Google OAuth and Discord OAuth variables are no longer used.
