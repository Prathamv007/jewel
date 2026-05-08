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
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

// Fixed path to look in the parent directory's src folder
const srcDir = path.resolve(__dirname, '..', 'src');
const files = walk(srcDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('_id')) {
        console.log(`Fixing ${file}`);
        content = content.replace(/_id/g, 'id');
        fs.writeFileSync(file, content, 'utf8');
    }
});
