# YNWAC Timer

Empty Chrome extension template using Manifest V3.

## Requirements

- Node.js 20 or newer
- Google Chrome or another Chromium-based browser

## Develop

Run a quick template validation:

```powershell
npm run check
```

If `npm` is not available yet, use the included PowerShell helper:

```powershell
.\scripts\check.ps1
```

During development, run:

```powershell
npm run dev
```

Or without `npm`:

```powershell
.\scripts\dev.ps1
```

Then load the extension in Chrome:

1. Open `chrome://extensions`.
2. Turn on Developer mode.
3. Click Load unpacked.
4. Select this folder: `D:\workspace\YNWAC_Timer`.

## Project Layout

- `manifest.json`: Chrome extension manifest.
- `src/background.js`: extension background service worker.
- `src/content.js`: optional page script, not enabled by default.
- `popup/`: toolbar popup UI.
- `options/`: extension options page.
- `scripts/`: local Node.js helper scripts.
