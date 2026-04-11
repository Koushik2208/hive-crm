const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace [var(--color-X)] with X
      const replaceRegex = /\[var\(--(?:color|shadow)-([^)]+)\)\]/g;
      
      if (replaceRegex.test(content)) {
        content = content.replace(replaceRegex, '$1');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  }
}

replaceInDir('./app');
replaceInDir('./components');
