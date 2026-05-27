"use client";

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#000] flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-black text-white uppercase italic mb-4">Admin Error</h1>
        <p className="text-red-400 text-sm font-bold mb-2">{error.message || "Something went wrong loading the admin panel."}</p>
        {error.digest && <p className="text-slate-600 text-[10px] font-mono mb-2">Digest: {error.digest}</p>}
        <button onClick={reset} className="px-6 py-3 bg-cyan-600 text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-cyan-700 transition-all">
          Try Again
        </button>
      </div>
    </div>
  );
}
