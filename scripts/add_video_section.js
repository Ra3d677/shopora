const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '..', 'src', 'components', 'templates');
const templateFiles = fs.readdirSync(templatesDir).filter(f => f.endsWith('.tsx'));

templateFiles.forEach(file => {
    const filePath = path.join(templatesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add Import
    if (!content.includes('import VideoSection')) {
        content = content.replace(
            /import {? ?[\w, ]+ ?}? from "@\/components\/ui\/SaleSection";/,
            (match) => `${match}\nimport VideoSection from "@/components/ui/VideoSection";`
        );
        // Fallback if SaleSection import not found
        if (!content.includes('import VideoSection')) {
            content = content.replace(
                /import (.*) from "@\/components\/ui\/SmartImage";/,
                (match) => `${match}\nimport VideoSection from "@/components/ui/VideoSection";`
            );
        }
    }

    // 2. Add Section Logic
    if (!content.includes("section.type === 'video'")) {
        const videoBlock = `
        if (section.type === 'video') {
          return <VideoSection key={section.id} section={section} slug={slug} />;
        }
`;
        // Insert before return null; or at the end of the map
        content = content.replace(
            /return null;\s+}\s*\)\s*}/,
            (match) => `${videoBlock}\n        ${match}`
        );
    }

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
});
