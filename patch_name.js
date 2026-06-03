const fs = require('fs');

const replaceInFile = (file) => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    content = content.replace(/BizEarch/g, 'Bizsearch24');
    content = content.replace(/BIZEARCH/g, 'BIZSEARCH24');
    content = content.replace(/bizearch/g, 'bizsearch24');
    content = content.replace(/biZearch/g, 'Bizsearch24');
    
    if (original !== content) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
    }
};

const filePaths = [
    'app/api/pages/route.ts',
    'app/api/auth/setup-2fa/route.ts',
    'app/page.tsx',
    'app/sitemap/page.tsx',
    'app/layout.tsx',
    'metadata.json'
];

filePaths.forEach(replaceInFile);
