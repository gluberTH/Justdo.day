const fs = require('fs');
const path = require('path');

const imagesDir = 'd:/Antigravity/justdo.day/images';
const appJsPath = 'd:/Antigravity/justdo.day/app.js';
const indexHtmlPath = 'd:/Antigravity/justdo.day/index.html';

// 1. Convert all images in the directory to Base64
const files = fs.readdirSync(imagesDir);
const sprites = {};

files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    let mime = 'image/png';
    if (ext === '.gif') mime = 'image/gif';
    if (ext === '.jpg' || ext === '.jpeg') mime = 'image/jpeg';
    
    const filePath = path.join(imagesDir, file);
    const data = fs.readFileSync(filePath);
    const base64 = data.toString('base64');
    
    const key = path.basename(file, ext); // e.g. 'logo', 'yes', 'no'
    sprites[key] = `data:${mime};base64,${base64}`;
});

console.log('Successfully read and converted all images to Base64.');

// 2. Read app.js and index.html
let appJs = fs.readFileSync(appJsPath, 'utf8');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// 3. Inject SPRITES object at the top of app.js
// If it was already injected, remove the old one first to avoid duplicates
const spritesBlockStart = '/* --- SPRITES BASE64 START --- */';
const spritesBlockEnd = '/* --- SPRITES BASE64 END --- */';

const spritesCode = `${spritesBlockStart}\nconst SPRITES = ${JSON.stringify(sprites, null, 2)};\n${spritesBlockEnd}`;

const startIndex = appJs.indexOf(spritesBlockStart);
const endIndex = appJs.indexOf(spritesBlockEnd);

if (startIndex !== -1 && endIndex !== -1) {
    appJs = appJs.substring(0, startIndex) + spritesCode + appJs.substring(endIndex + spritesBlockEnd.length);
} else {
    appJs = spritesCode + '\n\n' + appJs;
}

// 4. Update image sources in app.js
appJs = appJs.replace(/src="images\/edit\.gif"/g, 'src="${SPRITES.edit}"');
appJs = appJs.replace(/src="images\/share\.gif"/g, 'src="${SPRITES.share}"');
appJs = appJs.replace(/src="images\/streak\.gif"/g, 'src="${SPRITES.streak}"');
appJs = appJs.replace(/src="images\/fire\.gif"/g, 'src="${SPRITES.fire}"');
appJs = appJs.replace(/bgImg\.src = 'images\/futureday\.gif'/g, 'bgImg.src = SPRITES.futureday');
appJs = appJs.replace(/bgImg\.src = 'images\/yes\.gif'/g, 'bgImg.src = SPRITES.yes');
appJs = appJs.replace(/bgImg\.src = 'images\/no\.gif'/g, 'bgImg.src = SPRITES.no');
appJs = appJs.replace(/bgImg\.src = `images\/empty\${imgIndex}\.gif`/g, 'bgImg.src = SPRITES[`empty${imgIndex}`]');

// 5. Update index.html
// Replace logo.gif and calendar.jpg with direct Base64
indexHtml = indexHtml.replace(/src="images\/logo\.gif"/g, `src="${sprites.logo}"`);
indexHtml = indexHtml.replace(/src="images\/calendar\.jpg"/g, `src="${sprites.calendar}"`);

// 6. Write back the updated files
fs.writeFileSync(appJsPath, appJs, 'utf8');
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');

console.log('Successfully injected base64 sprites into app.js and index.html!');
