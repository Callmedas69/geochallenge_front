const fs = require('fs');
const path = require('path');

// Simple PNG generator using data URLs and canvas
async function generatePlaceholder(width, height, text, filename) {
  try {
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0052FF'); // Base blue
    gradient.addColorStop(1, '#0A0A0A'); // Dark
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add text
    ctx.fillStyle = '#FFFFFF';
    const fontSize = Math.min(width, height) / 10;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Main text
    ctx.fillText('GeoChallenge', width / 2, height / 2 - fontSize / 2);

    // Subtitle
    ctx.font = `${fontSize / 2}px Arial`;
    ctx.fillStyle = '#CCCCCC';
    ctx.fillText(text, width / 2, height / 2 + fontSize);

    // Save
    const buffer = canvas.toBuffer('image/png');
    const outputPath = path.join(__dirname, '..', 'public', filename);
    fs.writeFileSync(outputPath, buffer);
    console.log(`✓ Generated ${filename} (${width}x${height})`);
  } catch (error) {
    console.error(`✗ Failed to generate ${filename}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('Generating Farcaster Mini App placeholder images...\n');

  try {
    // Check if canvas is installed
    require.resolve('canvas');
  } catch (e) {
    console.log('Installing canvas package...');
    require('child_process').execSync('npm install canvas --save-dev', { stdio: 'inherit' });
  }

  await generatePlaceholder(1024, 1024, 'App Icon', 'icon-512.png');
  await generatePlaceholder(200, 200, 'Splash', 'splash.png');
  await generatePlaceholder(1200, 630, 'Hero Image', 'hero.png');
  await generatePlaceholder(1200, 630, 'Social Preview', 'og.png');
  await generatePlaceholder(1200, 630, 'Screenshot 1', 'screenshot-1.png');
  await generatePlaceholder(1200, 630, 'Screenshot 2', 'screenshot-2.png');
  await generatePlaceholder(1200, 630, 'Screenshot 3', 'screenshot-3.png');

  console.log('\n✓ All placeholder images generated successfully!');
  console.log('📁 Location: /public/');
  console.log('\n⚠️  Remember to replace these with your actual branded images before launch.');
}

main().catch(console.error);
