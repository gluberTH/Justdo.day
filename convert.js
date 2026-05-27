const fs = require('fs');
const path = require('path');

const imagesDir = 'd:/Antigravity/justdo.day/images';
const outputFile = 'd:/Antigravity/justdo.day/images_base64.txt';

const files = fs.readdirSync(imagesDir);
let output = '';

files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    let mime = 'image/png';
    if (ext === '.gif') mime = 'image/gif';
    if (ext === '.jpg' || ext === '.jpeg') mime = 'image/jpeg';
    
    const filePath = path.join(imagesDir, file);
    const data = fs.readFileSync(filePath);
    const base64 = data.toString('base64');
    
    output += `--- ${file} ---\n`;
    output += `data:${mime};base64,${base64}\n\n`;
});

fs.writeFileSync(outputFile, output);
console.log('Done! Output written to ' + outputFile);
