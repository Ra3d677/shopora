import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const isSuperAdmin = session?.role === "superadmin" || session?.email === "ksh128395@gmail.com";
  if (!isSuperAdmin) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto p-6">
        {children}
      </div>
    </div>
  );
}
