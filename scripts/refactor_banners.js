const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '../src/components/templates');

const regex = /\{banner\.buttonText\s*&&\s*\(\s*<Link\s*href=\{banner\.buttonLink\s*\|\|.*?\}\s*className=".*?"\s*>\s*\{banner\.buttonText\}\s*<\/Link>\s*\)\s*\}/g;

const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('Template.tsx'));

files.forEach(file => {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (regex.test(content)) {
    // Add import if not present
    if (!content.includes('import BannerButton')) {
      content = content.replace(/(import .*?;)/, `$1\nimport BannerButton from "@/components/ui/BannerButton";`);
    }
    
    // Replace all instances of the old button logic
    content = content.replace(regex, `<BannerButton banner={banner} slug={slug} />`);
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
