"use client";

import GenericIronPeakManager from "../GenericIronPeakManager";
import MediaPicker from "../media/MediaPicker";

const DEFAULT_ITEMS = [
  { image: "", name: "Alex Johnson", role: "Strength & Conditioning", bio: "10+ years experience in strength training and bodybuilding coaching." },
  { image: "", name: "Maria Rodriguez", role: "Yoga & Mobility", bio: "Certified yoga instructor with specialization in mobility and injury prevention." },
  { image: "", name: "James Wilson", role: "HIIT & Cardio", bio: "HIIT specialist with 8 years experience transforming clients through high-intensity workouts." },
  { image: "", name: "Sarah Chen", role: "Nutrition & Wellness", bio: "Registered dietitian helping clients achieve their goals through proper nutrition." },
];

export default function IronPeakTrainersManager(props: { slug: string; initialSettings: any }) {
  return (
    <GenericIronPeakManager {...props} config={{
      title: "Meet Our Trainers",
      accent: "Meet Our",
      subtitle: "Customize the Trainers section of your IronPeak template",
      dataKey: "trainers",
      defaults: { enabled: true, sectionTitle: "Meet Our Trainers", sectionSubtitle: "Expert coaches dedicated to your success", items: DEFAULT_ITEMS },
      createEmptyItem: () => ({ image: "", name: "New Trainer", role: "Role", bio: "Trainer bio here" }),
      itemsLabel: "Trainer Cards",
      itemsDescription: "Each card shows image, name, role, and bio",
      previewCss: `
        .ip-preview-trainers{background:#f8f9fa;padding:4rem 0;border-radius:16px}
        .ip-preview-container{max-width:93%;margin:0 auto}
        .ip-preview-section-header{text-align:center;margin-bottom:4rem}
        .ip-preview-section-header h2{color:#222;position:relative;display:inline-block;font-size:2.5rem;font-weight:800;margin:0}
        .ip-preview-section-header h2::after{content:"";position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);width:100px;height:4px;background:linear-gradient(135deg,#ff6b35,#f7931e);border-radius:2px}
        .ip-preview-section-header p{color:#666;max-width:700px;margin:1rem auto 0;font-size:1.1rem}
        .ip-preview-trainers-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2.5rem}
        .ip-preview-trainer-card{background:#fff;border-radius:20px;box-shadow:0 10px 40px rgba(0,0,0,.08);overflow:hidden;transition:.4s}
        .ip-preview-trainer-card:hover{transform:translateY(-10px);box-shadow:0 20px 60px rgba(0,0,0,.15)}
        .ip-preview-trainer-image{height:320px;overflow:hidden;position:relative;background:#e9ecef}
        .ip-preview-trainer-image img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
        .ip-preview-trainer-card:hover .ip-preview-trainer-image img{transform:scale(1.1)}
        .ip-preview-trainer-info{padding:2rem;text-align:center}
        .ip-preview-trainer-info h3{font-size:1.6rem;margin:0 0 .5rem;color:#222;font-weight:700}
        .ip-preview-trainer-role{color:#ff6b35;font-weight:600;margin-bottom:1rem;font-size:1.1rem}
        .ip-preview-trainer-info p{color:#666;line-height:1.6;margin:0}
        @media(max-width:768px){.ip-preview-trainers-grid{grid-template-columns:1fr}}
      `,
      renderPreview: (content: any) => (
        <div className="ip-preview-trainers">
          <div className="ip-preview-container">
            <div className="ip-preview-section-header">
              <h2>{content.sectionTitle}</h2>
              <p>{content.sectionSubtitle}</p>
            </div>
            <div className="ip-preview-trainers-grid">
              {content.items.map((t: any, i: number) => (
                <div key={i} className="ip-preview-trainer-card">
                  <div className="ip-preview-trainer-image">
                    {t.image ? (
                      <img src={t.image} alt={t.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-6xl">👤</div>
                    )}
                  </div>
                  <div className="ip-preview-trainer-info">
                    <h3>{t.name}</h3>
                    <div className="ip-preview-trainer-role">{t.role}</div>
                    <p>{t.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      renderEditor: (item: any, index: number, onChange: (f: string, v: string) => void, slug: string) => (
        <TrainerEditor item={item} onChange={onChange} slug={slug} />
      ),
    }} />
  );
}

function TrainerEditor({ item, onChange, slug }: { item: any; onChange: (f: string, v: string) => void; slug: string }) {
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
        <input type="text" value={item.name}
          onChange={e => onChange('name', e.target.value)}
          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all text-xs font-bold"
          placeholder="Trainer name" />
      </div>
      <input type="text" value={item.role}
        onChange={e => onChange('role', e.target.value)}
        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all text-xs font-bold"
        placeholder="Role / title" />
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <MediaPicker slug={slug} value={item.image || ''}
          onChange={url => onChange('image', url)}
          className="border-0 rounded-none" />
      </div>
      <textarea rows={2} value={item.bio}
        onChange={e => onChange('bio', e.target.value)}
        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all text-xs leading-relaxed resize-none"
        placeholder="Trainer bio / description" />
    </>
  );
}
