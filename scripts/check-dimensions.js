const fs = require('fs');
const path = require('path');

const files = [
  'icon-512.png',
  'splash.png',
  'hero.png',
  'og.png',
  'screenshot-1.png',
  'screenshot-2.png',
  'screenshot-3.png'
];

console.log('\n📊 Image Dimensions Check:\n');

files.forEach(filename => {
  const filepath = path.join(__dirname, '..', 'public', filename);

  if (!fs.existsSync(filepath)) {
    console.log(`❌ ${filename}: NOT FOUND`);
    return;
  }

  try {
    const { createCanvas, loadImage } = require('canvas');
    loadImage(filepath).then(image => {
      const width = image.width;
      const height = image.height;
      const ratio = (width / height).toFixed(2);

      // Check against specs
      let status = '✅';
      let note = '';

      if (filename === 'icon-512.png') {
        if (width !== 1024 || height !== 1024) {
          status = '❌';
          note = ' (should be 1024x1024)';
        }
      } else if (filename === 'splash.png') {
        if (width !== 200 || height !== 200) {
          status = '⚠️';
          note = ' (recommended 200x200)';
        }
      } else if (filename.includes('screenshot')) {
        if (width !== 1284 || height !== 2778) {
          status = '⚠️';
          note = ' (recommended 1284x2778 portrait)';
        }
      } else if (filename === 'hero.png' || filename === 'og.png') {
        if (width !== 1200 || height !== 630) {
          status = '⚠️';
          note = ' (should be 1200x630, 1.91:1 ratio)';
        }
      }

      console.log(`${status} ${filename}: ${width}x${height} (${ratio}:1)${note}`);
    });
  } catch (e) {
    console.log(`⚠️  ${filename}: ${fs.statSync(filepath).size} bytes (can't read dimensions)`);
  }
});

setTimeout(() => {}, 1000); // Wait for async operations
