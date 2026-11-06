# Fix Plan: Geometry Dash and Minecraft on Vercel

## Root Cause Analysis

### The Problem
Both Geometry Dash and Minecraft fail on Vercel deployment with identical errors:
```
Refused to execute script from 'https://dub5-five.vercel.app/js/ui-settings.js' because its MIME type ('text/html') is not executable
```

### Why It Happens

**Localhost (Express server):**
- Express serves static files from the entire repository root
- Files in `/js/` are served correctly with `Content-Type: application/javascript`
- Works perfectly

**Vercel deployment:**
- Vercel by default serves static files **only from the `public/` directory**
- The repository has TWO `js` directories:
  - `/js/` (root) - Contains new files (`game-shell.js`, `ui-settings.js`, `sw-register.js`)
  - `/public/js/` - Contains old DUB5 files (`app.js`, `intro.js`, `starfield.js`, etc.)
- When browser requests `/js/ui-settings.js`, Vercel doesn't find it in `public/js/`
- Vercel falls back to serving `index.html` with `Content-Type: text/html`
- Browser refuses to execute it (wrong MIME type)

### Why Previous Attempts Failed

All my previous attempts tried to fix Vercel routing configuration:
1. Added explicit `/js/(.*)` routing
2. Added Content-Type headers
3. Switched from `routes` to `rewrites`
4. Removed catch-all routes

**None of these worked because:** The files aren't in Vercel's static file serving path (`public/`). No amount of routing configuration can serve files that Vercel doesn't consider part of the static asset bundle.

## The Solution

Move the new JavaScript files from `/js/` to `/public/js/` so Vercel serves them correctly.

## Task List

### Task 1: Verify Current File Locations
**Status:** ✅ Completed
- Confirmed files exist in `/js/` directory:
  - `js/game-shell.js`
  - `js/ui-settings.js`
  - `js/sw-register.js`
- Confirmed files are in Git repository
- Confirmed `public/js/` directory exists with other JS files

### Task 2: Move Files to public/js Directory
**Status:** ⏳ Pending
**Files to move:**
- `js/game-shell.js` → `public/js/game-shell.js`
- `js/ui-settings.js` → `public/js/ui-settings.js`
- `js/sw-register.js` → `public/js/sw-register.js`

**Commands:**
```bash
cd "C:\Users\Mohammed\Documents\Projects\Side Projects\DUB5-rcd"
git mv js/game-shell.js public/js/game-shell.js
git mv js/ui-settings.js public/js/ui-settings.js
git mv js/sw-register.js public/js/sw-register.js
```

### Task 3: Find All Script References
**Status:** ⏳ Pending
**Search for all files that reference the moved scripts:**
```bash
cd "C:\Users\Mohammed\Documents\Projects\Side Projects\DUB5-rcd"
grep -r 'src="/js/game-shell.js' --include="*.html"
grep -r 'src="/js/ui-settings.js' --include="*.html"
grep -r 'src="/js/sw-register.js' --include="*.html"
```

**Expected files to update:**
- Homepage: `index.html`
- All game pages that use these scripts (approximately 30+ files)
- Original game pages (Minecraft, Geometry Dash, etc.)

### Task 4: Update Script References in index.html
**Status:** ⏳ Pending
**File:** `index.html`

**Changes needed:**
- Find: `<script src="/js/game-shell.js">`
- Replace with: `<script src="/js/game-shell.js">` (keep same path - Vercel auto-serves from public/)

Actually, since Vercel serves from `public/` at the root, the paths can stay as `/js/...`. The files just need to be in `public/js/`.

**Verification:** Check if index.html uses these scripts and update if needed.

### Task 5: Update Script References in All Game Pages
**Status:** ⏳ Pending
**Files to update (DUB5 games):**
- `games/snake/index.html`
- `games/tetris/index.html`
- `games/pong/index.html`
- `games/flappy/index.html`
- `games/breakout/index.html`
- `games/minesweeper/index.html`
- `games/2048/index.html`
- `games/blockblast/index.html`
- `games/rekenmachine/index.html`
- `games/stacktris/index.html`
- `games/blockblast-pro/index.html`
- `games/subway-surfers/index.html`

**Files to update (Original games):**
- `games/geometry-dash/index.html`
- `games/minecraft/index.html`
- `games/liquid-soccer/index.html`
- `games/skate3/index.html`
- `games/gta-vice-city/index.html`
- `games/skate-rust/index.html`
- `games/cs-surf/index.html`
- `games/halo-ce/index.html`
- `games/halo-ce-mobile/index.html`
- `games/pes6/index.html`
- `games/bo1-zombies/index.html`
- `games/moon-zombies/index.html`
- `games/kino-der-toten/index.html`
- `games/bo3-cheese-cube/index.html`
- `games/bo2/index.html`
- `games/mw2/index.html`
- `games/gta5/index.html`
- `games/nsmbw-web-port/index.html`
- `games/SM64-PC-Port-WebGL/index.html`

**Change for each file:**
No change needed in script paths - they can stay as `/js/...` because Vercel serves from `public/` at the root level.

### Task 6: Update starfield.js Location
**Status:** ⏳ Pending
**Current location:** Root `/starfield.js`
**Target location:** `public/starfield.js`

**Rationale:** For consistency, move starfield.js to public/ as well.

**Command:**
```bash
git mv starfield.js public/starfield.js
```

**Script references to check:**
- `index.html`
- All game pages
- `js/game-shell.js` (if it references starfield)

### Task 7: Update vercel.json (if needed)
**Status:** ⏳ Pending
**Current state:** Uses `rewrites` for game routes

**No changes needed:** The rewrites should work correctly once files are in `public/`. The static file serving will be handled automatically by Vercel.

**Optional cleanup:** Simplify vercel.json if the current configuration is overcomplicated.

### Task 8: Remove Empty /js Directory
**Status:** ⏳ Pending
**After moving files:**
```bash
# Check if directory is empty
ls -la js/
# If empty, remove it
git rm -r js/
```

### Task 9: Test Locally
**Status:** ⏳ Pending
**Steps:**
1. Start local server: `node server.js`
2. Test homepage: `http://localhost:5093/`
3. Check browser console for errors
4. Test Minecraft: `http://localhost:5093/minecraft`
5. Test Geometry Dash: `http://localhost:5093/geometry-dash`
6. Verify scripts load correctly:
   - Check Network tab in DevTools
   - Verify `ui-settings.js` loads with `Content-Type: application/javascript`
   - Verify `game-shell.js` loads with `Content-Type: application/javascript`

### Task 10: Commit Changes
**Status:** ⏳ Pending
**Commit message:**
```
Move JS files to public/ directory for Vercel compatibility

- Moved game-shell.js, ui-settings.js, sw-register.js from /js/ to /public/js/
- Moved starfield.js from root to /public/
- This fixes the MIME type error on Vercel deployment
- Vercel serves static files from public/ by default
- Files outside public/ were not being served, causing HTML fallback

Fixes Minecraft and Geometry Dash not loading on deployed site.
```

### Task 11: Push to GitHub
**Status:** ⏳ Pending
**Command:**
```bash
git push
```

### Task 12: Wait for Vercel Deployment
**Status:** ⏳ Pending
**Monitor:**
- Vercel dashboard for deployment status
- Check deployment logs for errors

### Task 13: Test on Deployed Site
**Status:** ⏳ Pending
**URL:** `https://dub5-five.vercel.app/`

**Test checklist:**
- [ ] Homepage loads without console errors
- [ ] `/js/ui-settings.js` loads with correct MIME type
- [ ] `/js/game-shell.js` loads with correct MIME type
- [ ] Minecraft page loads and iframe displays game
- [ ] Geometry Dash page loads and iframe displays game
- [ ] No "MIME type text/html" errors in console
- [ ] Service worker registers successfully

### Task 14: Clear Service Worker Cache (if needed)
**Status:** ⏳ Pending
**If old cached files cause issues:**
1. Open DevTools → Application → Service Workers
2. Unregister old service worker
3. Hard refresh (Ctrl+Shift+R)
4. Verify new service worker registers

### Task 15: Bump Service Worker Cache Version
**Status:** ⏳ Pending
**File:** `sw.js`
**Change:** Increment `CACHE_BUILD` from `026` to `027`

**Rationale:** Force users to get the new cache without manual clearing.

### Task 16: Final Verification
**Status:** ⏳ Pending
**After deployment:**
- Test all affected games
- Check console for any remaining errors
- Verify both Minecraft and Geometry Dash work correctly
- Test on mobile if possible

## Expected Outcome

After completing all tasks:
- ✅ Minecraft loads and displays the game in the iframe
- ✅ Geometry Dash loads and displays the game in the iframe
- ✅ No MIME type errors in browser console
- ✅ All JavaScript files load with correct Content-Type
- ✅ Service worker registers successfully
- ✅ Games work on both localhost and deployed Vercel site

## Estimated Time
- File moves: 5 minutes
- Search and verify references: 10 minutes
- Update references (if needed): 15 minutes
- Local testing: 10 minutes
- Commit and push: 5 minutes
- Wait for deployment: 5-10 minutes
- Deployed testing: 10 minutes

**Total:** ~1 hour

## Risk Assessment

**Low risk:**
- Moving files with `git mv` preserves history
- Script paths don't need to change (Vercel serves from root)
- Local testing before deployment

**Potential issues:**
- Some pages might have hardcoded absolute paths (unlikely)
- Service worker cache might need manual clearing
- Vercel deployment might have edge cases

**Mitigation:**
- Test thoroughly locally first
- Bump cache version to force refresh
- Provide instructions for cache clearing if needed
