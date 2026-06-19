"use client";

import { useState } from "react";
import GenericIronPeakManager from "../GenericIronPeakManager";

const DEFAULT_ITEMS = [
  { icon: "🏃", title: "Cardio Training", description: "Improve your cardiovascular health with our state-of-the-art cardio equipment including treadmills, ellipticals, and stationary bikes." },
  { icon: "💪", title: "Weight Lifting", description: "Build strength and muscle with our extensive free weights area, power racks, and resistance machines for all fitness levels." },
  { icon: "👤", title: "Personal Training", description: "Get personalized workout plans and one-on-one coaching from our certified trainers to maximize your results." },
  { icon: "🥗", title: "Nutrition Plans", description: "Our nutrition experts will create customized meal plans to complement your fitness routine and help you reach your goals faster." },
  { icon: "👥", title: "Group Classes", description: "Join our energetic group classes including yoga, HIIT, spin, and Zumba for motivation and community support." },
  { icon: "🧘", title: "Recovery Services", description: "Enhance your recovery with our sauna, massage therapy, and physiotherapy services to keep you performing at your best." },
];

const emojis = ["🏃", "💪", "👤", "🥗", "👥", "🧘", "🏋️", "👨‍🏫", "👩‍🏫", "🕐", "🎯", "🔥", "⭐", "💎", "🏆", "💊", "🧠", "❤️", "⚡", "🎵", "📊", "🚴", "🤸", "🏄"];

export default function IronPeakServicesManager(props: { slug: string; initialSettings: any }) {
  return (
    <GenericIronPeakManager {...props} config={{
      title: "Our Services",
      accent: "Our",
      subtitle: "Customize the Services section of your IronPeak template",
      dataKey: "services",
      defaults: { enabled: true, sectionTitle: "Our Services", sectionSubtitle: "Everything you need to achieve your fitness goals", items: DEFAULT_ITEMS },
      createEmptyItem: () => ({ icon: "🔥", title: "New Service", description: "Service description here" }),
      itemsLabel: "Services Items",
      itemsDescription: "Each card shows icon, title, and description",
      previewCss: `
        .ip-preview-services{background:#fff;padding:4rem 0;border-radius:16px}
        .ip-preview-container{max-width:93%;margin:0 auto}
        .ip-preview-section-header{text-align:center;margin-bottom:4rem}
        .ip-preview-section-header h2{color:#222;position:relative;display:inline-block;font-size:2.5rem;font-weight:800;margin:0}
        .ip-preview-section-header h2::after{content:"";position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);width:100px;height:4px;background:linear-gradient(135deg,#ff6b35,#f7931e);border-radius:2px}
        .ip-preview-section-header p{color:#666;max-width:700px;margin:1rem auto 0;font-size:1.1rem}
        .ip-preview-services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2rem}
        .ip-preview-service-card{padding:2rem;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,.06);transition:.3s;background:#fff}
        .ip-preview-service-card:hover{transform:translateY(-5px);box-shadow:0 15px 40px rgba(0,0,0,.1)}
        .ip-preview-service-icon{width:60px;height:60px;background:linear-gradient(135deg,#ff6b35,#f7931e);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:2rem;color:#fff;margin-bottom:1.2rem;box-shadow:0 8px 25px rgba(255,107,53,.3)}
        .ip-preview-service-card h3{font-size:1.25rem;margin:0 0 0.8rem;color:#222;font-weight:700}
        .ip-preview-service-card p{color:#666;line-height:1.7;font-size:0.95rem;margin:0 0 1rem}
        @media(max-width:768px){.ip-preview-services-grid{grid-template-columns:1fr}}
      `,
      renderPreview: (content: any) => (
        <div className="ip-preview-services">
          <div className="ip-preview-container">
            <div className="ip-preview-section-header">
              <h2>{content.sectionTitle}</h2>
              <p>{content.sectionSubtitle}</p>
            </div>
            <div className="ip-preview-services-grid">
              {content.items.map((s: any, i: number) => (
                <div key={i} className="ip-preview-service-card">
                  <div className="ip-preview-service-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      renderEditor: (item: any, index: number, onChange: (f: string, v: string) => void) => {
        return <ServiceEditor item={item} onChange={onChange} />;
      },
    }} />
  );
}

function ServiceEditor({ item, onChange }: { item: any; onChange: (field: string, val: string) => void }) {
  const [emojiOpen, setEmojiOpen] = useState(false);
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative">
          <button type="button" onClick={() => setEmojiOpen(!emojiOpen)}
            className="w-10 h-10 flex items-center justify-center text-lg bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
            {item.icon || "😀"}
          </button>
          {emojiOpen && (
            <div className="absolute top-12 left-0 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 w-72">
              <div className="grid grid-cols-5 gap-1">
                {emojis.map((e: string) => (
                  <button key={e} type="button" onClick={() => { onChange('icon', e); setEmojiOpen(false); }}
                    className={`w-10 h-10 flex items-center justify-center text-lg rounded-lg hover:bg-slate-100 transition-colors ${item.icon === e ? 'bg-orange-50 ring-2 ring-orange-400' : ''}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <input type="text" value={item.title}
          onChange={e => onChange('title', e.target.value)}
          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all text-xs font-bold"
          placeholder="Service title" />
      </div>
      <textarea rows={2} value={item.description}
        onChange={e => onChange('description', e.target.value)}
        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition-all text-xs leading-relaxed resize-none"
        placeholder="Service description" />
    </>
  );
}
