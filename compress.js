const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, 'public');

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else if (filePath.toLowerCase().endsWith('.png')) {
      if (file === 'favicon.png' || file === 'og-image.png' || file === 'logo-icon.png') {
        console.log(`Skipping special asset: ${file}`);
        continue;
      }
      
      const webpPath = filePath.substring(0, filePath.length - 4) + '.webp';
      try {
        await sharp(filePath)
          .webp({ quality: 80, effort: 6 }) // 80% quality, max effort compression
          .toFile(webpPath);
        
        const oldSize = (fs.statSync(filePath).size / 1024 / 1024).toFixed(2);
        const newSize = (fs.statSync(webpPath).size / 1024 / 1024).toFixed(2);
        
        console.log(`✅ Compressed: ${file} | ${oldSize}MB -> ${newSize}MB`);
        
        // Delete original png
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`❌ Error processing ${filePath}:`, err);
      }
    }
  }
}

console.log('🔄 Starting Image Compression...');
processDirectory(publicDir).then(() => {
  console.log('🎉 Compression complete!');
});
