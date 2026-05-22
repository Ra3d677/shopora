import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import RequestsList from "./RequestsList";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const session = await getSession();
  const isSuperAdmin = session?.role === "superadmin" || session?.email === "ksh128395@gmail.com";
  if (!isSuperAdmin) redirect("/auth/login");

  const requests = await prisma.reactivationRequest.findMany({
    where: { status: "pending" },
    include: {
      store: { select: { name: true, slug: true, ownerId: true, owner: { select: { email: true, name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const approvedRequests = await prisma.reactivationRequest.findMany({
    where: { status: "approved" },
    include: {
      store: { select: { name: true, slug: true } },
    },
    orderBy: { reviewedAt: "desc" },
    take: 20,
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">طلبات التفعيل</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">مراجعة طلبات تفعيل المتاجر</p>
        </div>
        <div className="bg-amber-500/10 text-amber-400 px-4 py-2 rounded-xl text-sm font-black">
          {requests.length} طلب pending
        </div>
      </div>

      <RequestsList requests={requests.map(r => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        reviewedAt: r.reviewedAt?.toISOString() || null,
      }))} />

      {approvedRequests.length > 0 && (
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight mb-4">آخر الطلبات المقبولة</h2>
          <div className="space-y-2">
            {approvedRequests.map(r => (
              <div key={r.id} className="bg-white/[0.02] border border-white/10 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-white font-black">{r.store.name}</p>
                  <p className="text-slate-500 text-xs">تم القبول في {new Date(r.reviewedAt!).toLocaleDateString("ar-EG")}</p>
                </div>
                <span className="text-green-400 text-[10px] font-black uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-lg">
                  ✓ مقبول
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
