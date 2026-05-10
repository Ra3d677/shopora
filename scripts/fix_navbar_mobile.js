const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/layout/Navbar.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add framer-motion import if missing
if (!content.includes('from "framer-motion"')) {
  content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { motion, AnimatePresence } from "framer-motion";');
}

// 2. Add isMobileMenuOpen state
if (!content.includes('const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);')) {
  content = content.replace('const [mounted, setMounted] = useState(false);', 'const [mounted, setMounted] = useState(false);\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);');
}

// 3. Define MobileMenuDrawer inside the main component before the first return
const mobileDrawerCode = `
  const MobileMenuDrawer = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-y-0 left-0 w-[80%] max-w-[320px] z-[9999] bg-white shadow-2xl p-8 flex flex-col font-sans text-slate-900"
        >
          <div className="flex justify-between items-center mb-12">
            <Link href={\`/store/\${slug}\`} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-black uppercase tracking-tighter" style={{ color: 'var(--color-primary-accent, inherit)' }}>
              {storeSettings?.logoUrl ? <img src={storeSettings.logoUrl} alt={storeSettings.storeName} className="h-8 w-auto object-contain" /> : (storeSettings?.storeName || 'Store')}
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex flex-col gap-6 text-lg font-bold tracking-widest uppercase">
            {headerLinks.map((link: any) => (
              <Link key={link.id} href={link.url} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors flex items-center border-b border-slate-100 pb-4">
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="mt-auto pt-8 border-t border-slate-100">
             <LanguageSwitcher />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
`;

if (!content.includes('const MobileMenuDrawer = () =>')) {
  content = content.replace('if (effectiveLayout === \'signature\') {', mobileDrawerCode + '\n  if (effectiveLayout === \'signature\') {');
}

// 4. Inject into new layouts (Standard, Centered, Luxury, Hamburger)
const mobileButton = `<button className="lg:hidden p-2 hover:bg-slate-100 rounded-full transition-colors" onClick={() => setIsMobileMenuOpen(true)}><Menu className="w-6 h-6" /></button>`;

// Fix Standard Layout
if (content.includes('if (effectiveLayout === \'standard\') {')) {
  content = content.replace(
    /<CartButton \/>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/nav>/,
    `<CartButton />\n              ${mobileButton}\n            </div>\n          </div>\n        </div>\n      </nav>\n      <MobileMenuDrawer />\n`
  );
}

// Fix Centered Layout
if (content.includes('if (effectiveLayout === \'centered\') {')) {
  content = content.replace(
    /<CartButton \/>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/nav>/,
    `<CartButton />\n              ${mobileButton}\n            </div>\n          </div>\n        </div>\n      </nav>\n      <MobileMenuDrawer />\n`
  );
}

// Fix Luxury Layout
if (content.includes('if (effectiveLayout === \'luxury\') {')) {
  content = content.replace(
    /<CartButton \/>\s*<\/div>\s*<\/div>\s*<div className="hidden lg:flex/,
    `<CartButton />\n               ${mobileButton}\n             </div>\n          </div>\n          <div className="hidden lg:flex`
  );
  content = content.replace(
    /<\/div>\s*<\/div>\s*<\/nav>\s*}/,
    `</div>\n        </div>\n      </nav>\n      <MobileMenuDrawer />\n    );\n  }`
  );
}

// Fix Hamburger Layout
if (content.includes('if (effectiveLayout === \'hamburger\') {')) {
  // Replace the empty onClick with our drawer handler
  content = content.replace(
    /<button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Menu className="w-6 h-6" \/><\/button>/,
    `<button onClick={() => setIsMobileMenuOpen(true)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Menu className="w-6 h-6" /></button>`
  );
  content = content.replace(
    /<CartButton \/>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/nav>/,
    `<CartButton />\n            </div>\n          </div>\n        </div>\n      </nav>\n      <MobileMenuDrawer />\n`
  );
}

// Add to Minimal Layout (Original)
if (content.includes('if (effectiveLayout === \'minimal\') {')) {
  content = content.replace(
    /<CartButton \/>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/nav>/,
    `<CartButton />\n              ${mobileButton}\n            </div>\n          </div>\n        </div>\n      </nav>\n      <MobileMenuDrawer />\n`
  );
}

// Add to Apple Layout (Original)
if (content.includes('if (effectiveLayout === \'apple\') {')) {
  content = content.replace(
    /<CartButton \/>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/nav>/,
    `<CartButton />\n              <button className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors" onClick={() => setIsMobileMenuOpen(true)}><Menu className="w-6 h-6" /></button>\n            </div>\n          </div>\n        </div>\n      </nav>\n      <MobileMenuDrawer />\n`
  );
}

// Add to Default (Luxury original)
content = content.replace(
  /<CartButton \/>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/nav>/,
  `<CartButton />\n            ${mobileButton}\n          </div>\n        </div>\n      </div>\n    </nav>\n    <MobileMenuDrawer />\n`
);

fs.writeFileSync(filePath, content);
console.log('Mobile navigation drawer added successfully!');
