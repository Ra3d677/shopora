"use client";

import GenericIronPeakManager from "../GenericIronPeakManager";
import MediaPicker from "../media/MediaPicker";

const DEFAULT_ITEMS = [
  { image: "", date: "Dec 8, 2025", category: "Nutrition", title: "10 Protein-Rich Foods to Fuel Your Workouts", description: "Discover the best protein sources to support muscle growth and recovery after intense training sessions." },
  { image: "", date: "Dec 5, 2025", category: "Training", title: "How to Build a Sustainable Workout Routine", description: "Learn the secrets to creating a fitness routine that fits your lifestyle and keeps you motivated long-term." },
  { image: "", date: "Dec 1, 2025", category: "Wellness", title: "The Importance of Rest Days in Your Training", description: "Why recovery is just as important as your workouts and how to optimize your rest days for maximum results." },
];

export default function IronPeakBlogManager(props: { slug: string; initialSettings: any }) {
  return (
    <GenericIronPeakManager {...props} config={{
      title: "Our Blog",
      accent: "Our",
      subtitle: "Customize the Blog section of your IronPeak template",
      dataKey: "blog",
      defaults: { enabled: true, sectionTitle: "Latest From Our Blog", sectionSubtitle: "Tips, guides, and insights for your fitness journey", items: DEFAULT_ITEMS },
      createEmptyItem: () => {
        const d = new Date();
        return { image: "", date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), category: "New", title: "New Blog Post", description: "Blog post description here" };
      },
      itemsLabel: "Blog Posts",
      itemsDescription: "Each post shows image, date, category, title, and description",
      previewCss: `
        .ip-preview-blog{background:linear-gradient(135deg,#f8f9fa,#e9ecef);padding:4rem 0;border-radius:16px;position:relative}
        .ip-preview-container{max-width:93%;margin:0 auto}
        .ip-preview-section-header{text-align:center;margin-bottom:4rem}
        .ip-preview-section-header h2{color:#222;position:relative;display:inline-block;font-size:2.5rem;font-weight:800;margin:0}
        .ip-preview-section-header h2::after{content:"";position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);width:100px;height:4px;background:linear-gradient(135deg,#ff6b35,#f7931e);border-radius:2px}
        .ip-preview-section-header p{color:#666;max-width:700px;margin:1rem auto 0;font-size:1.1rem}
        .ip-preview-blog-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:2.5rem}
        .ip-preview-blog-card{background:#fff;border-radius:20px;box-shadow:0 10px 40px rgba(0,0,0,.08);transition:.4s;overflow:hidden}
        .ip-preview-blog-card:hover{transform:translateY(-10px) rotate(-1deg);box-shadow:0 20px 60px rgba(255,107,53,.15)}
        .ip-preview-blog-image{overflow:hidden;position:relative;height:220px;background:#e9ecef}
        .ip-preview-blog-image img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
        .ip-preview-blog-card:hover .ip-preview-blog-image img{transform:scale(1.05)}
        .ip-preview-blog-content{padding:2.5rem}
        .ip-preview-blog-meta{display:flex;gap:1rem;margin-bottom:1rem;align-items:center}
        .ip-preview-blog-date{padding:.5rem 1rem;border-radius:50px;font-size:.9rem;font-weight:600;background:linear-gradient(135deg,#ff6b35,#f7931e);color:#fff}
        .ip-preview-blog-category{padding:.5rem 1rem;border-radius:50px;font-size:.9rem;font-weight:600;background:rgba(255,107,53,.1);color:#ff6b35}
        .ip-preview-blog-card:hover .ip-preview-blog-category{background:#ff6b35;color:#fff}
        .ip-preview-blog-content h3{font-size:1.4rem;margin:0 0 1rem;color:#222;line-height:1.4;font-weight:700}
        .ip-preview-blog-content p{color:#666;line-height:1.8;margin:0 0 1.5rem}
        .ip-preview-read-more{display:inline-flex;align-items:center;gap:.5rem;color:#ff6b35;text-decoration:none;font-weight:600;transition:.3s}
        .ip-preview-read-more::after{content:"\\2192";transition:transform .3s}
        .ip-preview-read-more:hover{gap:1rem;color:#f7931e}
        @media(max-width:768px){.ip-preview-blog-grid{grid-template-columns:1fr}}
      `,
      renderPreview: (content: any) => (
        <div className="ip-preview-blog">
          <div className="ip-preview-container">
            <div className="ip-preview-section-header">
              <h2>{content.sectionTitle}</h2>
              <p>{content.sectionSubtitle}</p>
            </div>
            <div className="ip-preview-blog-grid">
              {content.items.map((b: any, i: number) => (
                <div key={i} className="ip-preview-blog-card">
                  <div className="ip-preview-blog-image">
                    {b.image ? <img src={b.image} alt={b.title} /> : <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl">📝</div>}
                  </div>
                  <div className="ip-preview-blog-content">
                    <div className="ip-preview-blog-meta">
                      <span className="ip-preview-blog-date">{b.date}</span>
                      <span className="ip-preview-blog-category">{b.category}</span>
                    </div>
                    <h3>{b.title}</h3>
                    <p>{b.description}</p>
                    <a href="#" className="ip-preview-read-more">Read More</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      renderEditor: (item: any, index: number, onChange: (f: string, v: string) => void, slug: string) => (
        <BlogEditor item={item} onChange={onChange} slug={slug} />
      ),
    }} />
  );
}

function BlogEditor({ item, onChange, slug }: { item: any; onChange: (f: string, v: string) => void; slug: string }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 flex-shrink-0">
          {item.image ? (
            <img src={item.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">📷</div>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <input type="text" value={item.title}
            onChange={e => onChange('title', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all text-xs font-bold"
            placeholder="Post title" />
          <input type="text" value={item.category}
            onChange={e => onChange('category', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all text-xs"
            placeholder="Category" />
        </div>
      </div>
      <input type="text" value={item.date}
        onChange={e => onChange('date', e.target.value)}
        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all text-xs"
        placeholder="Date" />
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <MediaPicker slug={slug} value={item.image || ''}
          onChange={url => onChange('image', url)}
          className="border-0 rounded-none" />
      </div>
      <textarea rows={2} value={item.description}
        onChange={e => onChange('description', e.target.value)}
        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all text-xs leading-relaxed resize-none"
        placeholder="Post description" />
    </>
  );
}
