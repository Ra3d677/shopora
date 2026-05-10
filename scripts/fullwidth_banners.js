const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '../src/components/templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('Template.tsx'));

files.forEach(file => {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. We need to find the blocks for `bannersToShow` and `bottomBanners` and replace classes.
  // A safer approach is to do a string replacement on the lines that contain these specific map functions.
  
  // We can do this by splitting the file into lines and processing.
  let lines = content.split('\n');
  let inBannersBlock = false;
  let inBottomBannersBlock = false;

  for (let i = 0; i < lines.length; i++) {
    // Detect start of banners section
    if (lines[i].includes(`section.type === 'banners'`)) {
      inBannersBlock = true;
    }
    if (lines[i].includes(`bottomBanners.length > 0`) && !lines[i].includes(`const`)) {
      inBottomBannersBlock = true;
    }

    // Detect end of sections (heuristically when we return to the map level or see next section)
    if (inBannersBlock && (lines[i].includes(`if (section.type ===`) || lines[i].includes(`return null;`))) {
      if (!lines[i].includes(`section.type === 'banners'`)) {
        inBannersBlock = false;
      }
    }
    if (inBottomBannersBlock && lines[i].includes(`</div>`) && lines[i+1]?.includes(`);`)) {
      // rough end
    }

    if (inBannersBlock || inBottomBannersBlock) {
      // Remove container, padding, and max-width from section/div wrappers
      if (lines[i].includes('<section') || lines[i].includes('<div className="container') || lines[i].includes('<div className="max-w-')) {
        lines[i] = lines[i]
          .replace(/container mx-auto/g, 'w-full')
          .replace(/max-w-7xl mx-auto/g, 'w-full')
          .replace(/max-w-\[[^\]]+\] mx-auto/g, 'w-full')
          .replace(/px-[0-9]+/g, '')
          .replace(/py-[0-9]+/g, 'py-1')
          .replace(/space-y-[0-9]+/g, 'space-y-1')
          .replace(/grid grid-cols-[0-9]+ gap-[0-9]+/g, 'flex flex-col space-y-1') // AppleTemplate uses grid
      }

      // Remove rounded corners from the banner div
      if (lines[i].includes('key={banner.id}')) {
        lines[i] = lines[i]
          .replace(/rounded-\[[^\]]+\]/g, '')
          .replace(/rounded-[a-z0-9]+/g, '')
          .replace(/aspect-auto/g, 'aspect-[21/9]') // Force aspect ratio if missing
          .replace(/md:h-\[[^\]]+\]/g, 'md:aspect-[21/9]') // AppleTemplate uses md:h-[500px]
          .replace(/h-\[[^\]]+\]/g, 'aspect-[4/5]');
      }
    }
  }

  fs.writeFileSync(filePath, lines.join('\n'));
  console.log(`Updated ${file}`);
});
