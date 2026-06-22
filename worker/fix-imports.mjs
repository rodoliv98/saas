import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function fixImports(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            fixImports(filePath);
        } else if (path.extname(file) === '.js') {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Fix import statements
            content = content.replace(
                /from\s+['"](\.[^'"]*?)(?<!\.js)['"]/g,
                "from '$1.js'"
            );

            content = content.replace(
                /^import\s+['"](\.[^'"]*?)(?<!\.js)['"]/gm,
                "import '$1.js'"
            );
            
            // Fix dynamic imports
            content = content.replace(
                /import\s*\(\s*['"](\.[^'"]*?)(?<!\.js)['"]\s*\)/g,
                "import('$1.js')"
            );
            
            fs.writeFileSync(filePath, content);
        }
    }
}

fixImports(path.join(__dirname, 'dist'));
console.log('✅ Imports corrigidos com extensões .js');