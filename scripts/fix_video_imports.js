const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '..', 'src', 'components', 'templates');
const templateFiles = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx'));

templateFiles.forEach(file => {
    const filePath = path.join(templatesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add Import (Handle single and double quotes)
    if (!content.includes('import VideoSection')) {
        // Find ANY import from @/components/ui/
        const match = content.match(/import (.*) from ['"]@\/components\/ui\/.*['"];/);
        if (match) {
            content = content.replace(match[0], `${match[0]}\nimport VideoSection from "@/components/ui/VideoSection";`);
        } else {
             // Fallback: after first line
             content = content.replace('"use client";', '"use client";\nimport VideoSection from "@/components/ui/VideoSection";');
        }
        console.log(`Added import to ${file}`);
    }

    fs.writeFileSync(filePath, content);
});
