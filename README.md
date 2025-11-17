# Greenhouse Auto Chrome Extension

A minimal Chrome browser extension built with Manifest V3.

## Files Structure

- `manifest.json` - Extension configuration (Manifest V3)
- `popup.html` - Popup UI HTML
- `popup.css` - Popup styling
- `popup.js` - Popup logic
- `content.js` - Content script that runs on web pages
- `background.js` - Background service worker
- `icons/` - Extension icons (you need to add these)

## Installation

1. Create an `icons` folder and add icon images (16x16, 48x48, 128x128 px)
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `greenhouse_auto` folder

## Features

- Popup interface with a button
- Content script that runs on all web pages
- Background service worker
- Chrome storage API integration
- Message passing between components

## Usage

Click the extension icon in Chrome toolbar to open the popup and interact with the extension.
