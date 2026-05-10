const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/layout/Navbar.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Function to wrap return blocks in fragments
function wrapInFragment(layoutId) {
  const regex = new RegExp(`if \\(effectiveLayout === '${layoutId}'\\) {[\\s\\S]*?return \\(\\s*([\\s\\S]*?)\\s*\\);\\s*}`, 'g');
  content = content.replace(regex, (match, p1) => {
    if (p1.trim().startsWith('<>')) return match; // Already wrapped
    return match.replace(p1, `<>\n        ${p1.trim()}\n      </>`);
  });
}

const layouts = ['standard', 'centered', 'luxury', 'hamburger', 'minimal', 'apple', 'obsidian', 'zenith', 'senno', 'signature'];
layouts.forEach(wrapInFragment);

// Also fix the final default return at the end of the main component
content = content.replace(
  /return \(\s*(<nav[\s\S]*?<\/nav>\s*<MobileMenuDrawer \/>)\s*\);/g,
  `return (\n    <>\n      $1\n    </>\n  );`
);

fs.writeFileSync(filePath, content);
console.log('JSX fragments fixed!');
