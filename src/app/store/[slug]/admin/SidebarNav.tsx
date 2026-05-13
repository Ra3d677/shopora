"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

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
  Settings
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
  Settings
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

  return (
    <>
      <div className="mb-1 px-4">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">Main Control</span>
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
              isActive 
                ? 'bg-gradient-to-r from-cyan-500/10 to-transparent text-white border-l-2 border-cyan-500' 
                : 'hover:bg-white/[0.02] hover:text-white border-l-2 border-transparent'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 transition-transform duration-500 group/nav:scale-110 ${isActive ? item.color : 'text-slate-500 group-hover:text-cyan-400'}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
            {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]"></div>}
          </Link>
        );
      })}

      {systemItems && systemItems.length > 0 && (
        <div className="space-y-0.5 mt-4">
          <div className="mb-1 px-4">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">System Admin</span>
          </div>
          {systemItems.map((item) => {
            const fullPath = `${adminPath}${item.path}`;
            const isActive = pathname === fullPath;
            const Icon = iconMap[item.iconName] || Globe;
            return (
              <Link
                key={item.label}
                href={fullPath}
                className={`flex items-center gap-2.5 px-4 py-1.5 rounded-xl transition-all duration-300 group/nav ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-500/10 to-transparent text-white border-l-2 border-cyan-500' 
                    : 'hover:bg-white/[0.02] hover:text-white border-l-2 border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-transform duration-500 group/nav:scale-110 ${isActive ? item.color : 'text-slate-500 group-hover:text-cyan-400'}`} />
                <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]"></div>}
              </Link>
            );
          })}
        </div>
      )}

      {customItems && customItems.length > 0 && (
        <div className="space-y-0.5 mt-4">
          <div className="mb-1 px-4">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">Customization</span>
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
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-500/10 to-transparent text-white border-l-2 border-cyan-500' 
                    : 'hover:bg-white/[0.02] hover:text-white border-l-2 border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-transform duration-500 group/nav:scale-110 ${isActive ? item.color : 'text-slate-500 group-hover:text-cyan-400'}`} />
                <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]"></div>}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
