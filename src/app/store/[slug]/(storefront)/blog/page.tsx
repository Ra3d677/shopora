import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import { getTranslation } from "@/lib/i18n";

export const dynamic = 'force-dynamic';

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await getTranslation();
  const store = await prisma.store.findUnique({ where: { slug }, select: { id: true, name: true } });
  if (!store) return <div className="p-20 text-center">{t('storeNotFound')}</div>;

  const posts = await prisma.blogPost.findMany({
    where: { storeId: store.id, published: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">{t('blog')}</h1>
        <p className="text-slate-500 font-medium mb-16 max-w-xl">{store.name}</p>

        {posts.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-[2rem] p-20 text-center">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t('noPostsYet')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {posts.map(post => (
              <Link key={post.id} href={`/store/${slug}/blog/${post.slug}`} className="group">
                <article className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl hover:shadow-2xl transition-all group-hover:-translate-y-1">
                  {post.image && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-8">
                    <h2 className="text-2xl font-black tracking-tight mb-3 group-hover:text-blue-600 transition-colors">{post.title}</h2>
                    {post.excerpt && <p className="text-slate-500 text-sm leading-relaxed mb-6">{post.excerpt}</p>}
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
                      <span className="ml-auto flex items-center gap-1 text-slate-900 group-hover:gap-2 transition-all">{t('readMore')} <ArrowRight size={14} /></span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
