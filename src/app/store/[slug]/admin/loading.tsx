export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#000] flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Loading admin panel...</p>
      </div>
    </div>
  );
}
