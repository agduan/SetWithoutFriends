# Quick Start Guide

## Run Locally (Development)

```bash
npm install
npm start
```

The app will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The `build/` folder contains everything you need to deploy.

## Deploy to Phone (Easiest Methods)

### Method 1: GitHub Pages (Free, 2 minutes)
1. Create a new GitHub repo
2. Push this code to the repo
3. Go to Settings → Pages
4. Select "Deploy from a branch" → main → /build
5. Visit the generated URL on your phone
6. Add to home screen!

### Method 2: Netlify (Free, Drag & Drop)
1. Build the app: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `build/` folder onto the page
4. Get instant URL
5. Visit on phone and add to home screen

### Method 3: Local Network Testing
1. Run `npm start`
2. Find your computer's IP address (Settings → Network on Mac)
3. On your phone (on same WiFi), go to `http://YOUR_IP:3000`
4. Test the game before deploying

## Add to Phone Home Screen

**iOS:**
1. Open in Safari
2. Tap Share button
3. "Add to Home Screen"
4. Done! Opens like a native app

**Android:**
1. Open in Chrome
2. Menu → "Add to Home screen"
3. Done! Opens like a native app

## Game Controls

- **Tap** or **click** cards to select
- **Keyboard shortcuts** - Press keys shown on cards (QWERTY by default)
- **Space/Escape** - Clear selection
- **New Game** button - Start over
- **Mode buttons** - Switch game variants

## Settings

Click the **⚙️** button in the top-right corner to access settings:
- **Sound Effects**: Toggle on/off
- **Board Layout**: Portrait (3 columns) or Landscape (3 rows)
- **Card Orientation**: Vertical or Horizontal (rotated 90°)
- **Keyboard Layout**: QWERTY, AZERTY, QWERTZ, Dvorak, Colemak, Workman, Neo

All settings auto-save to your browser's local storage.

## Troubleshooting

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**App won't start?**
- Check Node version (requires Node 14+)
- Clear browser cache
- Try incognito/private mode

**Cards not showing?**
- Refresh the page
- Check browser console for errors

**No sound?**
- Check device volume
- Check mute switch
- Toggle sound in settings

## File Structure

```
setwithfriends/
├── public/          # Static files
│   └── index.html
├── src/
│   ├── App.js       # Main app component
│   ├── pages/
│   │   └── GamePage.js    # Game logic
│   ├── components/  # UI components
│   ├── game.js      # Game rules & logic
│   ├── hooks/       # React hooks
│   └── assets/      # Sounds
├── build/           # Production build (after npm run build)
└── package.json
```

## What's Different from Original?

This is a **single-player offline version**:
- ❌ No multiplayer
- ❌ No database/Firebase
- ❌ No chat
- ❌ No accounts
- ✅ All 15+ game modes work
- ✅ Fully offline
- ✅ Mobile-optimized
- ✅ Local storage for settings

## Need Help?

- Check `README.md` for full documentation
- Check `MOBILE_SETUP.md` for mobile-specific instructions
- Check `CHANGELOG.md` to see what was changed

---

Enjoy your offline Set game! 🎮

