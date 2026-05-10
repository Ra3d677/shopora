const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '../src/components/templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('Template.tsx'));

files.forEach(file => {
  const filePath = path.join(templatesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let lines = content.split('\n');

  // We want to remove bg-white, bg-[#0a0a0a], bg-black, bg-[#f5f5f7], bg-[#fafafa]
  // from the main wrapper: e.g. <div className="flex flex-col w-full...
  // and from <section className="... bg-white ...
  
  const bgRegex = /bg-(white|black|\[#0a0a0a\]|\[#f5f5f7\]|\[#fafafa\]|slate-950)/g;

  for (let i = 0; i < lines.length; i++) {
    // Check if line is the main wrapper (heuristic: contains 'flex flex-col w-full' or 'min-h-screen')
    if (
      lines[i].includes('className="flex flex-col w-full') || 
      lines[i].includes('className="min-h-screen') ||
      lines[i].includes('<section')
    ) {
      // Only remove if it's the main section background, not if it's a specific inner div
      // Let's replace it with bg-transparent
      // Wait, if we replace bg-white with bg-transparent, the var(--color-bg-home) from page.tsx will show through!
      if (bgRegex.test(lines[i])) {
         lines[i] = lines[i].replace(bgRegex, 'bg-transparent');
      }
    }
  }

  fs.writeFileSync(filePath, lines.join('\n'));
  console.log(`Updated ${file}`);
});
