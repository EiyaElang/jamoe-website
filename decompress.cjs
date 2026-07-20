const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const buildDir = path.join(__dirname, 'public', 'game', 'Build');

const files = fs.readdirSync(buildDir);

files.forEach(file => {
  if (file.endsWith('.br')) {
    const compressedFilePath = path.join(buildDir, file);
    const uncompressedFilePath = path.join(buildDir, file.replace('.br', ''));
    
    const compressedData = fs.readFileSync(compressedFilePath);
    try {
      const uncompressedData = zlib.brotliDecompressSync(compressedData);
      fs.writeFileSync(uncompressedFilePath, uncompressedData);
      console.log(`Decompressed ${file} to ${file.replace('.br', '')}`);
      // Remove the .br file to save space
      fs.unlinkSync(compressedFilePath);
    } catch (e) {
      console.error(`Failed to decompress ${file}`, e);
    }
  }
});

const indexPath = path.join(__dirname, 'public', 'game', 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf-8');
indexContent = indexContent.replace(/\.data\.br/g, '.data');
indexContent = indexContent.replace(/\.framework\.js\.br/g, '.framework.js');
indexContent = indexContent.replace(/\.wasm\.br/g, '.wasm');
fs.writeFileSync(indexPath, indexContent);
console.log("Updated index.html to remove .br extensions");
