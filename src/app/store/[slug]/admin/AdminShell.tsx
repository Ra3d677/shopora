"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function AdminShell({
  sidebar,
  header,
  children,
  isRTL,
}: {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
  isRTL?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen font-sans selection:bg-cyan-500/30 overflow-hidden transition-colors duration-500">
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`w-80 backdrop-blur-3xl flex flex-col fixed inset-y-0 z-40 overflow-hidden transition-all duration-300 ease-in-out ${
          isRTL ? "right-0" : "left-0"
        } ${
          open
            ? "translate-x-0"
            : isRTL
            ? "translate-x-full"
            : "-translate-x-full"
        } md:translate-x-0`}
      >
        {sidebar}
      </div>

      {/* Header + Main Content */}
      <div className={`flex-1 flex flex-col relative min-h-screen transition-all duration-300 ${isRTL ? "md:mr-80" : "md:ml-80"}`}>
        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden fixed top-4 z-50 p-2.5 rounded-xl border shadow-xl backdrop-blur-md"
          style={{
            background: "var(--admin-sidebar-bg)",
            borderColor: "var(--admin-border)",
            color: "var(--admin-text-primary)",
            [isRTL ? "left" : "right"]: "16px",
          }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        {header}

        <div
          className="flex-1 relative overflow-hidden transition-colors duration-500"
          style={{ backgroundColor: "var(--admin-bg)" }}
        >
          <div
            className="absolute top-0 right-0 w-[800px] h-[800px] blur-[150px] -z-10 rounded-full pointer-events-none"
            style={{ background: "var(--admin-glow-cyan)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-[600px] h-[600px] blur-[150px] -z-10 rounded-full pointer-events-none"
            style={{ background: "var(--admin-glow-pink)" }}
          />
          <div
            className="absolute top-1/3 left-1/3 w-[400px] h-[400px] blur-[120px] -z-10 rounded-full pointer-events-none"
            style={{ background: "var(--admin-glow-purple)" }}
          />

          <div className="p-4 md:p-12">{children}</div>
        </div>
      </div>
    </div>
  );
}
