const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./lib');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('next/document')) {
    console.log('FOUND:', file);
  }
}
