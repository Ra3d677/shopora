"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { useLanguageStore } from "@/store/language";

interface NavItem {
  label: string;
  iconName: string;
  path: string;
  color: string;
}

import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Library, 
  Tag, 
  Image as ImageIcon,
  Globe,
  LayoutTemplate,
  Blocks,
  Settings,
  Users,
  Info,
  Rocket,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Library,
  Tag,
  ImageIcon,
  Globe,
  LayoutTemplate,
  Blocks,
  Settings,
  Users,
  Info,
  Rocket,
};

export default function SidebarNav({ 
  items, 
  adminPath,
  systemItems,
  customItems
}: { 
  items: NavItem[], 
  adminPath: string,
  systemItems?: NavItem[],
  customItems?: NavItem[]
}) {
  const pathname = usePathname();
  const { t, language } = useLanguageStore();
  const isRTL = language === 'ar';

  return (
    <>
      <div className={`mb-1 px-4 ${isRTL ? 'text-right' : ''}`}>
        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isRTL ? 'font-arabic' : ''}`} style={{ color: 'var(--admin-text-muted)' }}>
          {t('mainControl')}
        </span>
      </div>

      {items.map((item) => {
        const fullPath = `${adminPath}${item.path}`;
        const isActive = pathname === fullPath;
        const Icon = iconMap[item.iconName] || ShoppingBag;
        return (
          <Link
            key={item.label}
            href={fullPath}
            className={`flex items-center gap-2.5 px-4 py-1.5 rounded-xl transition-all duration-300 group/nav ${
              isRTL 
                ? `border-r-2 ${isActive ? 'border-cyan-500' : 'border-transparent'}` 
                : `border-l-2 ${isActive ? 'border-cyan-500' : 'border-transparent'}`
            }`}
            style={isActive
              ? { background: 'var(--admin-nav-active-bg)', color: 'var(--admin-text-primary)' }
              : { color: 'var(--admin-text-muted)' }
            }
          >
            <Icon className={`w-3.5 h-3.5 transition-transform duration-500 ${isActive ? item.color : 'group-hover/nav:text-cyan-400'}`} />
            <span className={`text-[9px] font-black uppercase tracking-widest ${isRTL ? 'font-arabic' : ''}`}>{item.label}</span>
            {isActive && (
              <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]`}></div>
            )}
          </Link>
        );
      })}

      {systemItems && systemItems.length > 0 && (
        <div className="space-y-0.5 mt-4">
          <div className={`mb-1 px-4 ${isRTL ? 'text-right' : ''}`}>
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isRTL ? 'font-arabic' : ''}`} style={{ color: 'var(--admin-text-muted)' }}>
              {t('systemAdmin')}
            </span>
          </div>
          {systemItems.map((item) => {
            const isAbsolute = item.path.startsWith("http") || item.path.startsWith("/admin");
            const fullPath = isAbsolute ? item.path : `${adminPath}${item.path}`;
            const isActive = pathname === fullPath;
            const Icon = iconMap[item.iconName] || Globe;
            return (
              <Link
                key={item.label}
                href={fullPath}
                className={`flex items-center gap-2.5 px-4 py-1.5 rounded-xl transition-all duration-300 group/nav ${
                  isRTL 
                    ? `border-r-2 ${isActive ? 'border-cyan-500' : 'border-transparent'}` 
                    : `border-l-2 ${isActive ? 'border-cyan-500' : 'border-transparent'}`
                }`}
                style={isActive
                  ? { background: 'var(--admin-nav-active-bg)', color: 'var(--admin-text-primary)' }
                  : { color: 'var(--admin-text-muted)' }
                }
              >
                <Icon className={`w-3.5 h-3.5 transition-transform duration-500 ${isActive ? item.color : 'group-hover/nav:text-cyan-400'}`} />
                <span className={`text-[9px] font-black uppercase tracking-widest ${isRTL ? 'font-arabic' : ''}`}>{item.label}</span>
                {isActive && (
                  <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]`}></div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {customItems && customItems.length > 0 && (
        <div className="space-y-0.5 mt-4">
          <div className={`mb-1 px-4 ${isRTL ? 'text-right' : ''}`}>
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isRTL ? 'font-arabic' : ''}`} style={{ color: 'var(--admin-text-muted)' }}>
              {t('customization')}
            </span>
          </div>
          {customItems.map((item) => {
            const fullPath = `${adminPath}${item.path}`;
            const isActive = pathname === fullPath;
            const Icon = iconMap[item.iconName] || Settings;
            return (
              <Link
                key={item.label}
                href={fullPath}
                className={`flex items-center gap-2.5 px-4 py-1.5 rounded-xl transition-all duration-300 group/nav ${
                  isRTL 
                    ? `border-r-2 ${isActive ? 'border-cyan-500' : 'border-transparent'}` 
                    : `border-l-2 ${isActive ? 'border-cyan-500' : 'border-transparent'}`
                }`}
                style={isActive
                  ? { background: 'var(--admin-nav-active-bg)', color: 'var(--admin-text-primary)' }
                  : { color: 'var(--admin-text-muted)' }
                }
              >
                <Icon className={`w-3.5 h-3.5 transition-transform duration-500 ${isActive ? item.color : 'group-hover/nav:text-cyan-400'}`} />
                <span className={`text-[9px] font-black uppercase tracking-widest ${isRTL ? 'font-arabic' : ''}`}>{item.label}</span>
                {isActive && (
                  <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]`}></div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
