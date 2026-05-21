"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Package, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  type: "order" | "low_stock";
  message: string;
  time: string;
  href: string;
}

export default function NotificationsBell({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch(`/api/admin/${slug}/notifications`);
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [slug]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unreadCount = notifications.length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl transition-all hover:bg-white/5"
        style={{ background: open ? "var(--admin-input-bg)" : "transparent", border: "1px solid var(--admin-border)" }}
      >
        <Bell size={16} style={{ color: "var(--admin-text-muted)" }} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] font-black text-white flex items-center justify-center shadow-lg shadow-red-500/30">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute top-full mt-2 right-0 w-80 md:w-96 rounded-2xl border shadow-2xl overflow-hidden z-50"
          style={{ background: "var(--admin-sidebar-bg)", borderColor: "var(--admin-border)" }}
        >
          <div className="p-4 border-b" style={{ borderColor: "var(--admin-border)" }}>
            <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--admin-text-primary)" }}>
              Notifications
            </h3>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin" size={16} style={{ color: "var(--admin-text-muted)" }} />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell size={24} className="mx-auto mb-2 opacity-20" style={{ color: "var(--admin-text-muted)" }} />
                <p className="text-xs font-medium" style={{ color: "var(--admin-text-muted)" }}>All clear, no new notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 p-4 transition-all hover:bg-white/[0.03] border-b last:border-b-0"
                  style={{ borderColor: "var(--admin-border)" }}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    n.type === "order" ? "bg-cyan-500/10 text-cyan-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    {n.type === "order" ? <Package size={14} /> : <ShoppingBag size={14} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate" style={{ color: "var(--admin-text-primary)" }}>
                      {n.message}
                    </p>
                    <p className="text-[10px] font-medium mt-0.5" style={{ color: "var(--admin-text-muted)" }}>
                      {n.time}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>

          <Link
            href={`/store/${slug}/admin/orders`}
            onClick={() => setOpen(false)}
            className="block text-center py-3 text-[10px] font-black uppercase tracking-widest border-t transition-all hover:bg-white/[0.03]"
            style={{ borderColor: "var(--admin-border)", color: "var(--admin-text-muted)" }}
          >
            View All Orders
          </Link>
        </div>
      )}
    </div>
  );
}
