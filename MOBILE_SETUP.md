# Mobile Setup Guide for Set Solitaire

## Quick Start

This is now a single-player, offline version of Set that can run on your phone!

### Option 1: Run Locally on Your Phone

If you want to test the app on your phone while connected to your computer:

1. Make sure your phone and computer are on the same WiFi network
2. Start the development server:
   ```bash
   npm start
   ```
3. Find your computer's local IP address:
   - Mac: System Preferences > Network
   - Windows: `ipconfig` in command prompt
4. On your phone's browser, go to: `http://YOUR_IP_ADDRESS:3000`

### Option 2: Build and Deploy (Recommended for Offline Use)

For a true offline experience on your phone:

1. Build the production version:
   ```bash
   npm run build
   ```

2. The `build` folder contains a complete static website. You can:
   
   **Option A: Use GitHub Pages (Free)**
   - Create a GitHub repository
   - Push your code
   - Enable GitHub Pages in repository settings
   - Visit the URL on your phone and "Add to Home Screen"
   
   **Option B: Use Netlify/Vercel (Free)**
   - Drag and drop the `build` folder to netlify.com or vercel.com
   - Get a URL instantly
   - Visit on your phone and "Add to Home Screen"
   
   **Option C: Local File System**
   - Copy the `build` folder to a cloud service (Dropbox, Google Drive)
   - Download to your phone
   - Open `index.html` in your mobile browser (limited features)

### Installing as a PWA (Progressive Web App)

Once you have the app running on a URL:

**iOS (Safari):**
1. Open the URL in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Name it "Set Solitaire" and tap Add
5. The app icon will appear on your home screen

**Android (Chrome):**
1. Open the URL in Chrome
2. Tap the three dots menu
3. Tap "Add to Home screen"
4. Confirm the name and tap Add
5. The app icon will appear on your home screen

## Features Optimized for Mobile

- ✅ Touch-friendly card selection
- ✅ Responsive layout for portrait/landscape
- ✅ No internet required after installation
- ✅ Saves your settings locally
- ✅ Full screen support
- ✅ Works offline completely

## Game Controls

- **Tap** cards to select them
- **Three correct cards** auto-submit as a set
- **Swipe/scroll** to see all cards if needed
- Settings saved automatically in your browser

## Troubleshooting

**Cards too small?**
- Rotate your phone to landscape mode
- Zoom in using pinch gesture
- Open **Settings (⚙️ button)** and change Board Layout or Card Orientation

**Sound not working?**
- Check your phone's volume
- Make sure mute switch is off (iOS)
- Open **Settings (⚙️ button)** and toggle Sound Effects on

**App not working offline?**
- Make sure you've built the production version
- Check that service workers are enabled
- Try clearing cache and reinstalling

## Storage

All game settings are stored in your browser's local storage:
- Theme preferences (light/dark)
- Keyboard layout
- Card orientation
- Volume settings

No data is sent to any server - everything stays on your device!

---

Enjoy your offline Set Solitaire game! 🎮

