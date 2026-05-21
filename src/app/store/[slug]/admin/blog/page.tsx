"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, FileText, Eye, Trash2, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { useLanguageStore } from "@/store/language";

export default function BlogAdminPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { t } = useLanguageStore();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", content: "", excerpt: "", image: "", author: "Admin" });
  const [saving, setSaving] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${slug}/blog`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, [slug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/${slug}/blog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ title: "", slug: "", content: "", excerpt: "", image: "", author: "Admin" });
        fetchPosts();
      }
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      await fetch(`/api/admin/${slug}/blog`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      fetchPosts();
    } catch (e) { console.error(e); }
  };

  const handleTogglePublish = async (postId: string, published: boolean) => {
    try {
      await fetch(`/api/admin/${slug}/blog`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, published: !published }),
      });
      fetchPosts();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black italic tracking-tight uppercase">Blog Manager</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Manage your store's blog posts.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-white text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:opacity-80 transition-all shadow-xl">
            <Plus size={16} /> {showForm ? "Cancel" : "New Post"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl mb-10 space-y-6">
            <h2 className="text-xl font-black tracking-tight uppercase">Create Post</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })} className="w-full px-5 py-3 rounded-xl border border-slate-200 outline-none focus:border-black transition-all text-sm font-medium" placeholder="Post title" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Slug</label>
                <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-5 py-3 rounded-xl border border-slate-200 outline-none focus:border-black transition-all text-sm font-medium" placeholder="post-slug" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Excerpt</label>
              <input value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="w-full px-5 py-3 rounded-xl border border-slate-200 outline-none focus:border-black transition-all text-sm font-medium" placeholder="Brief description" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Content (HTML)</label>
              <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={12} className="w-full px-5 py-3 rounded-xl border border-slate-200 outline-none focus:border-black transition-all text-sm font-medium font-mono" placeholder="<p>Your post content here...</p>" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Image URL</label>
              <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full px-5 py-3 rounded-xl border border-slate-200 outline-none focus:border-black transition-all text-sm font-medium" placeholder="https://..." />
            </div>
            <button onClick={handleSave} disabled={saving || !form.title} className="bg-slate-900 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-black transition-all disabled:opacity-50 shadow-xl">
              {saving ? "Saving..." : "Publish Post"}
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-[2rem] p-20 text-center">
            <FileText size={48} className="mx-auto mb-6 text-slate-200" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No posts yet. Create your first post.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-between hover:border-slate-300 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${post.published ? 'bg-green-500' : 'bg-slate-300'}`} />
                  <div>
                    <h3 className="font-black text-sm tracking-tight">{post.title}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                      <Calendar size={12} className="inline mr-1" />{new Date(post.createdAt).toLocaleDateString()} &mdash; {post.author}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleTogglePublish(post.id, post.published)} className={`p-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-1 transition-all ${post.published ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-50'}`}>
                    {post.published ? <CheckCircle2 size={14} /> : <XCircle size={14} />} {post.published ? "Published" : "Draft"}
                  </button>
                  <a href={`/store/${slug}/blog/${post.slug}`} target="_blank" className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 transition-all">
                    <Eye size={16} />
                  </a>
                  <button onClick={() => handleDelete(post.id)} className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
