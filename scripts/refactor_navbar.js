const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/layout/Navbar.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Define the headerLinks variable at the top level of the main Navbar component.
if (!content.includes('const headerLinks =')) {
  content = content.replace(
    'const items = useCartStore((state) => state.items);',
    `const headerLinks = storeSettings?.headerSettings?.links || [
    { id: 'home', label: t('home') || 'Home', url: \`/store/\${slug}\` },
    { id: 'shop', label: t('shop') || 'Shop', url: \`/store/\${slug}/categories\` }
  ];\n  const items = useCartStore((state) => state.items);`
  );
}

// 1. Minimal Navbar
content = content.replace(
  /<div className="hidden lg:flex items-center space-x-12 text-\[10px\] font-black uppercase tracking-\[0\.3em\]">[\s\S]*?<\/div>/,
  `<div className="hidden lg:flex items-center space-x-12 text-[10px] font-black uppercase tracking-[0.3em]">
              {headerLinks.map((link: any) => (
                <Link key={link.id} href={link.url} className="hover:opacity-50 transition-opacity">{link.label}</Link>
              ))}
            </div>`
);

// 2. Apple Navbar
content = content.replace(
  /<div className="hidden md:flex items-center space-x-8 font-normal tracking-wide">[\s\S]*?<\/div>/,
  `<div className="hidden md:flex items-center space-x-8 font-normal tracking-wide">
              {headerLinks.map((link: any) => (
                <Link key={link.id} href={link.url} className="hover:opacity-70 transition-opacity">{link.label}</Link>
              ))}
            </div>`
);

// 3. Default (Luxury) Navbar
content = content.replace(
  /<div className="hidden lg:flex flex-1 items-center gap-10 text-\[11px\] uppercase tracking-\[0\.3em\] font-sans font-bold">[\s\S]*?<\/div>/,
  `<div className="hidden lg:flex flex-1 items-center gap-10 text-[11px] uppercase tracking-[0.3em] font-sans font-bold">
            {headerLinks.map((link: any) => (
              <Link key={link.id} href={link.url} className="hover:opacity-40 transition-opacity">{link.label}</Link>
            ))}
          </div>`
);

// Zenith Navbar
// Need to pass storeSettings to ZenithNavbar
content = content.replace('function ZenithNavbar({ storeName, logoUrl, slug, cartItemCount }: any)', 'function ZenithNavbar({ storeName, logoUrl, slug, cartItemCount, storeSettings }: any)');
content = content.replace('<ZenithNavbar \n        storeName=', '<ZenithNavbar \n        storeSettings={storeSettings}\n        storeName=');

if (!content.includes('const headerLinks = storeSettings?.headerSettings?.links ||')) {
  // It's already in the main Navbar, but we need it in Zenith
  content = content.replace(
    'const [scrolled, setScrolled] = useState(false);',
    `const [scrolled, setScrolled] = useState(false);\n  const headerLinks = storeSettings?.headerSettings?.links || [{ id: 'home', label: 'Home', url: \`/store/\${slug}\` }, { id: 'shop', label: 'Shop', url: \`/store/\${slug}/categories\` }];`
  );
}

content = content.replace(
  /<div className="flex-1 hidden md:flex gap-12 text-\[10px\] uppercase tracking-\[0\.4em\] font-sans font-bold">[\s\S]*?<\/div>/,
  `<div className="flex-1 hidden md:flex gap-12 text-[10px] uppercase tracking-[0.4em] font-sans font-bold">
          {headerLinks.map((link: any) => (
            <Link key={link.id} href={link.url} className="hover:text-[#c5a368] transition-colors">{link.label}</Link>
          ))}
        </div>`
);

// Obsidian Navbar
content = content.replace('function ObsidianNavbar({ storeName, logoUrl, slug, cartItemCount }: any)', 'function ObsidianNavbar({ storeName, logoUrl, slug, cartItemCount, storeSettings }: any)');
content = content.replace('<ObsidianNavbar \n        storeName=', '<ObsidianNavbar \n        storeSettings={storeSettings}\n        storeName=');

content = content.replace(
  'function ObsidianNavbar({ storeName, logoUrl, slug, cartItemCount, storeSettings }: any) {',
  `function ObsidianNavbar({ storeName, logoUrl, slug, cartItemCount, storeSettings }: any) {\n  const headerLinks = storeSettings?.headerSettings?.links || [{ id: 'home', label: 'Home', url: \`/store/\${slug}\` }, { id: 'shop', label: 'Shop', url: \`/store/\${slug}/categories\` }];`
);

content = content.replace(
  /<div className="flex-1 hidden md:flex gap-10 text-\[10px\] font-black uppercase tracking-\[0\.5em\]">[\s\S]*?<\/div>/,
  `<div className="flex-1 hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.5em]">
          {headerLinks.map((link: any) => (
            <Link key={link.id} href={link.url} className="hover:text-white/50 transition-colors">{link.label}</Link>
          ))}
        </div>`
);

// Senno Navbar
content = content.replace(
  'const isHome = pathname === `/store/${slug}`;',
  `const isHome = pathname === \`/store/\${slug}\`;\n  const headerLinks = storeSettings?.headerSettings?.links || [\n    { id: '1', label: 'HOME', url: \`/store/\${slug}\` },\n    { id: '2', label: 'SHOP', url: \`/store/\${slug}/categories\` },\n    { id: '3', label: 'PRODUCTS', url: \`/store/\${slug}/products\` }\n  ];`
);

content = content.replace(
  /<div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-900">[\s\S]*?<\/div>/,
  `<div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-900">
               {headerLinks.map((link: any) => (
                 <Link key={link.id} href={link.url} className={\`\${pathname === link.url ? 'text-[#f06292]' : 'hover:text-[#f06292]'} transition-colors\`}>
                   {link.label}
                 </Link>
               ))}
            </div>`
);

fs.writeFileSync(filePath, content);
console.log('Navbar updated');
