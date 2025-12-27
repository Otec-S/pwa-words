const fs = require('fs');
const path = require('path');

// Create a simple PNG data URL for placeholder icons
function createPNGDataURL(size) {
  // This is a minimal 1x1 transparent PNG
  const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  return `data:image/png;base64,${base64}`;
}

// For now, let's just create the manifest.json that references the SVG files
const manifest = {
  "name": "PWA слова",
  "short_name": "Слова",
  "description": "Приложение для изучения слов с таймером",
  "theme_color": "#667eea",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait",
  "start_url": "/",
  "scope": "/",
  "icons": [
    {
      "src": "/icons/icon-192x192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
};

fs.writeFileSync(
  path.join(__dirname, 'public', 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log('Manifest created successfully!');
