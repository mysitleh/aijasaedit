const fs = require('fs');
const path = require('path');

const dirsToSearch = [path.join(__dirname, 'src'), path.join(__dirname, 'public')];

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (/\.(tsx|ts|json|js|jsx)$/i.test(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      if (content.includes('.png')) {
        let originalContent = content;
        
        // Ganti semua ekstensi .png -> .webp di dalam src
        content = content.replace(/\.png/g, '.webp');
        
        // Kembalikan ke .png khusus untuk favicon, og-image, logo-icon
        content = content.replace(/favicon\.webp/g, 'favicon.png');
        content = content.replace(/og-image\.webp/g, 'og-image.png');
        content = content.replace(/logo-icon\.webp/g, 'logo-icon.png');
        
        if (content !== originalContent) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Updated references in: ${filePath}`);
        }
      }
    }
  }
}

dirsToSearch.forEach(processDirectory);
console.log('Extensions updated!');
