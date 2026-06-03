import fs from 'fs';
import path from 'path';

const filesToPatch = [
  'app/api/ads/route.ts',
  'app/api/listings/verify/route.ts',
  'app/api/pages/route.ts',
  'app/api/slug-mappings/route.ts',
];

for (const f of filesToPatch) {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/verifyAdminSession\(req\)/g, 'await verifyAdminSession(req)');
  fs.writeFileSync(f, content);
}
console.log('patched');
