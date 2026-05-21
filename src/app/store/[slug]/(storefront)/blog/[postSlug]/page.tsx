import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string; postSlug: string }> }) {
  const { slug, postSlug } = await params;
  const store = await prisma.store.findUnique({ where: { slug }, select: { id: true } });
  if (!store) notFound();

  const post = await prisma.blogPost.findUnique({
    where: { storeId_slug: { storeId: store.id, slug: postSlug } },
  });
  if (!post || !post.published) notFound();

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href={`/store/${slug}/blog`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <article>
          <header className="mb-12">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-6">{post.title}</h1>
            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
              <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
            </div>
          </header>

          {post.image && (
            <div className="aspect-[21/9] rounded-[2rem] overflow-hidden mb-12 shadow-2xl">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose prose-lg max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </div>
    </div>
  );
}
