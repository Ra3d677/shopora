const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/layout/Navbar.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add effectiveLayout determination
if (!content.includes('const effectiveLayout =')) {
  content = content.replace(
    'const cartItemCount = items.filter(i => products?.some(p => p.id === i.product?.id)).reduce((acc, item) => acc + item.quantity, 0);',
    `const cartItemCount = items.filter(i => products?.some(p => p.id === i.product?.id)).reduce((acc, item) => acc + item.quantity, 0);

  const rawLayout = storeSettings?.headerSettings?.layout;
  const effectiveLayout = (rawLayout && rawLayout !== 'default') ? rawLayout : activeTemplate;
  const originalTemplate = activeTemplate;`
  );
}

// 2. Replace activeTemplate with effectiveLayout in early returns
content = content.replace(/if \(activeTemplate === 'signature'\)/g, "if (effectiveLayout === 'signature')");
content = content.replace(/if \(activeTemplate === 'senno'\)/g, "if (effectiveLayout === 'senno')");
content = content.replace(/if \(activeTemplate === 'minimal'\)/g, "if (effectiveLayout === 'minimal')");
content = content.replace(/if \(activeTemplate === 'apple'\)/g, "if (effectiveLayout === 'apple')");
content = content.replace(/if \(activeTemplate === 'obsidian'\)/g, "if (effectiveLayout === 'obsidian')");
content = content.replace(/if \(activeTemplate === 'zenith'\)/g, "if (effectiveLayout === 'zenith')");

// 3. Add new layout blocks BEFORE the DEFAULT (LUXURY) return
const newLayouts = `

  // === NEW LAYOUTS ===
  
  if (effectiveLayout === 'standard') {
    return (
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-slate-100 bg-white/90 text-slate-900 transition-colors">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            <Link href={\`/store/\${slug}\`} className="flex-shrink-0 text-2xl font-black tracking-tighter uppercase" style={{ color: 'var(--color-primary-accent, inherit)' }}>
              {storeSettings?.logoUrl ? <img src={storeSettings.logoUrl} alt={storeSettings.storeName} className="h-10 w-auto object-contain" /> : (storeSettings?.storeName || 'Store')}
            </Link>
            <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-600">
              {headerLinks.map((link: any) => (
                <Link key={link.id} href={link.url} className="hover:text-blue-600 transition-colors">{link.label}</Link>
              ))}
            </div>
            <div className="flex items-center gap-6">
              <LanguageSwitcher />
              <SearchBar />
              <UserMenuDropdown />
              <CartButton />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  if (effectiveLayout === 'centered') {
    return (
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-slate-100 bg-white/90 text-slate-900 transition-colors">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex h-24 items-center justify-between">
            <div className="hidden lg:flex flex-1 items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-600">
              {headerLinks.map((link: any) => (
                <Link key={link.id} href={link.url} className="hover:text-blue-600 transition-colors">{link.label}</Link>
              ))}
            </div>
            <Link href={\`/store/\${slug}\`} className="flex-1 flex justify-center text-3xl font-black tracking-tighter uppercase" style={{ color: 'var(--color-primary-accent, inherit)' }}>
              {storeSettings?.logoUrl ? <img src={storeSettings.logoUrl} alt={storeSettings.storeName} className="h-12 w-auto object-contain" /> : (storeSettings?.storeName || 'Store')}
            </Link>
            <div className="flex-1 flex items-center justify-end gap-6">
              <LanguageSwitcher />
              <SearchBar />
              <UserMenuDropdown />
              <CartButton />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  if (effectiveLayout === 'luxury') {
    return (
      <nav className="sticky top-0 z-50 w-full backdrop-blur-2xl border-b border-slate-100 bg-white/95 text-slate-900 transition-colors py-4">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center gap-6">
          <div className="w-full flex justify-between items-center relative">
             <div className="w-32 flex items-center gap-4">
               <LanguageSwitcher />
               <SearchBar />
             </div>
             <Link href={\`/store/\${slug}\`} className="text-4xl font-light tracking-[0.2em] uppercase absolute left-1/2 -translate-x-1/2" style={{ color: 'var(--color-primary-accent, inherit)' }}>
               {storeSettings?.logoUrl ? <img src={storeSettings.logoUrl} alt={storeSettings.storeName} className="h-14 w-auto object-contain mx-auto" /> : (storeSettings?.storeName || 'Store')}
             </Link>
             <div className="w-32 flex items-center justify-end gap-4">
               <UserMenuDropdown />
               <CartButton />
             </div>
          </div>
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">
             {headerLinks.map((link: any) => (
                <Link key={link.id} href={link.url} className="hover:text-slate-900 transition-colors">{link.label}</Link>
              ))}
          </div>
        </div>
      </nav>
    );
  }

  if (effectiveLayout === 'hamburger') {
    return (
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-slate-100 bg-white/90 text-slate-900 transition-colors">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            <div className="flex-1 flex items-center gap-6">
               <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Menu className="w-6 h-6" /></button>
               <div className="hidden md:block"><LanguageSwitcher /></div>
            </div>
            <Link href={\`/store/\${slug}\`} className="flex-1 flex justify-center text-2xl font-black tracking-widest uppercase" style={{ color: 'var(--color-primary-accent, inherit)' }}>
              {storeSettings?.logoUrl ? <img src={storeSettings.logoUrl} alt={storeSettings.storeName} className="h-10 w-auto object-contain" /> : (storeSettings?.storeName || 'Store')}
            </Link>
            <div className="flex-1 flex items-center justify-end gap-6">
              <SearchBar />
              <UserMenuDropdown />
              <CartButton />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // === END NEW LAYOUTS ===
`;

if (!content.includes('effectiveLayout === \'standard\'')) {
  content = content.replace('// DEFAULT (LUXURY)', newLayouts + '\n  // DEFAULT (LUXURY)');
}

fs.writeFileSync(filePath, content);
console.log('Navbar custom layouts added!');
