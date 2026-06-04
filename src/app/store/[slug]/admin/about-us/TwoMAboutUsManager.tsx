"use client";

import { useState } from "react";
import { Save, Loader2, AlignLeft, AlignCenter, AlignRight, Rocket, Type, Image as ImageIcon, Paintbrush, Sliders } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { saveStoreSettings } from "../actions";
import MediaPicker from "../media/MediaPicker";
import FeaturesBarManager from "../features-bar/FeaturesBarManager";

const FONTS = [
  "Inter", "Roboto", "Playfair Display", "Montserrat", "Outfit", "Lexend", 
  "Bebas Neue", "Dancing Script", "Pacifico", "Cormorant Garamond", 
  "Space Grotesk", "Cairo", "inherit"
];

const LAYOUTS = [
  { id: 'image-left', name: 'الصورة على اليسار' },
  { id: 'image-right', name: 'الصورة على اليمين' },
  { id: 'centered', name: 'في المنتصف (بدون صورة)' }
];

export default function TwoMAboutUsManager({ slug, initialContent }: { slug: string; initialContent: any }) {
  const [content, setContent] = useState(() => {
    const base = initialContent || {};
    return {
      showSection: base.showSection !== undefined ? base.showSection : true,
      // About Us fields
      layout: base.layout || 'image-left',
      tagline: base.tagline || 'AKIRA ELECTRONICS',
      taglineColor: base.taglineColor || '#999999',
      taglineFontSize: base.taglineFontSize || 12,
      taglineFontFamily: base.taglineFontFamily || 'inherit',
      taglineUppercase: base.taglineUppercase !== undefined ? base.taglineUppercase : true,
      title: base.title || 'LATEST ABOUT US',
      titleColor: base.titleColor || '#333333',
      titleFontSize: base.titleFontSize || 30,
      titleFontFamily: base.titleFontFamily || 'inherit',
      titleAlign: base.titleAlign || 'center',
      desc: base.desc || 'Nullam gravida, dolor ac ultrices lobortis, mi dolor justo. We are a leading provider of premium electronics, committed to bringing the latest technology and exceptional customer service.',
      descColor: base.descColor || '#666666',
      descFontSize: base.descFontSize || 14,
      descFontFamily: base.descFontFamily || 'inherit',
      descAlign: base.descAlign || 'center',
      descLineHeight: base.descLineHeight || '1.6',
      image: base.image || 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80',
      imageBorderRadius: base.imageBorderRadius || 8,
      imageShadow: base.imageShadow || 'soft',
      bgColor: base.bgColor || '#ffffff',
      paddingTop: base.paddingTop !== undefined ? base.paddingTop : 50,
      paddingBottom: base.paddingBottom !== undefined ? base.paddingBottom : 60,
      showBtn: base.showBtn !== undefined ? base.showBtn : false,
      btnText: base.btnText || 'قراءة المزيد',
      btnLink: base.btnLink || '#',
      btnBgColor: base.btnBgColor || '#fed700',
      btnTextColor: base.btnTextColor || '#333333',
      btnFontSize: base.btnFontSize || 12,
      btnBorderRadius: base.btnBorderRadius || 4,
      // Features Bar data
      twoMFeatures: base.twoMFeatures || undefined
    };
  });

  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'content' | 'style' | 'button' | 'features') || 'content';
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'button' | 'features'>(initialTab);

  const [saving, setSaving] = useState(false);
  

  function update(field: string, val: any) {
    setContent((prev: any) => ({ ...prev, [field]: val }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Save About Us settings
      const aboutRes = await saveStoreSettings(slug, { twoMAboutUs: content });
      if (aboutRes?.success === false) {
        alert(aboutRes.error);
      }
      // Save Features Bar settings if present
      if (content.twoMFeatures) {
        const featuresRes = await saveStoreSettings(slug, { twoMFeatures: content.twoMFeatures });
        if (featuresRes?.success === false) {
          alert(featuresRes.error);
        }
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between flex-row-reverse">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">إعدادات قسم "من نحن" (About Us)</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 flex items-center gap-2 transition-all disabled:opacity-70 active:scale-95"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ التغييرات
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-start gap-2 border-b border-slate-200 pb-px">
        {[
          { id: 'content', label: 'المحتوى الأساسي', icon: Type },
          { id: 'style', label: 'التصميم والألوان', icon: Paintbrush },
          { id: 'button', label: 'إعدادات الزر', icon: Sliders },
          { id: 'features', label: 'شريط الميزات', icon: Rocket }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6">
        
        {/* Toggle Section Display */}
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div>
            <h3 className="text-xs font-bold text-slate-700">تفعيل القسم على الصفحة الرئيسية</h3>
            <p className="text-[10px] text-slate-400 mt-1">تحديد ما إذا كان سيظهر هذا القسم في أسفل الصفحة الرئيسية للتمبلت.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={content.showSection !== false}
              onChange={(e) => update('showSection', e.target.checked)}
            />
            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
          </label>
        </div>

        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Layout Style */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">طريقة العرض (التخطيط)</label>
              <div className="grid grid-cols-3 gap-3">
                {LAYOUTS.map(l => (
                  <button 
                    key={l.id} 
                    type="button" 
                    onClick={() => update('layout', l.id)}
                    className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      content.layout === l.id 
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs' 
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">العبارة الترويجية الصغيرة (Tagline)</label>
              <input 
                type="text" 
                value={content.tagline || ''}
                onChange={e => update('tagline', e.target.value)}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                placeholder="AKIRA ELECTRONICS" 
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">العنوان الرئيسي</label>
              <input 
                type="text" 
                value={content.title || ''}
                onChange={e => update('title', e.target.value)}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-bold"
                placeholder="من نحن" 
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">نص التفاصيل (الوصف)</label>
              <textarea 
                rows={5}
                value={content.desc || ''}
                onChange={e => update('desc', e.target.value)}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm leading-relaxed"
                placeholder="اكتب تفاصيل عن شركتك أو متجرك هنا..."
              />
            </div>

            {/* Section Image */}
            {content.layout !== 'centered' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">صورة القسم</label>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <MediaPicker 
                    slug={slug} 
                    value={content.image || ''}
                    onChange={url => update('image', url)}
                    className="bg-white" 
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-6">
            
            {/* Font Family Selection */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">خط العبارة الصغيرة</label>
                <select 
                  value={content.taglineFontFamily || 'inherit'}
                  onChange={e => update('taglineFontFamily', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {FONTS.map(f => <option key={f} value={f}>{f === 'inherit' ? 'الافتراضي' : f}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">خط العنوان الرئيسي</label>
                <select 
                  value={content.titleFontFamily || 'inherit'}
                  onChange={e => update('titleFontFamily', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {FONTS.map(f => <option key={f} value={f}>{f === 'inherit' ? 'الافتراضي' : f}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">خط الوصف والتفاصيل</label>
                <select 
                  value={content.descFontFamily || 'inherit'}
                  onChange={e => update('descFontFamily', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {FONTS.map(f => <option key={f} value={f}>{f === 'inherit' ? 'الافتراضي' : f}</option>)}
                </select>
              </div>
            </div>

            {/* Typography Customization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
              
              {/* Left Column: Tagline & Title styles */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-blue-600 border-b pb-1.5 uppercase">تنسيق العبارات</h3>
                
                {/* Tagline size and color */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400">حجم خط العبارة الصغيرة</label>
                    <input 
                      type="number" 
                      value={content.taglineFontSize || 12}
                      onChange={e => update('taglineFontSize', Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400">لون العبارة الصغيرة</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={content.taglineColor || '#999999'}
                        onChange={e => update('taglineColor', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200" 
                      />
                      <input 
                        type="text" 
                        value={content.taglineColor || '#999999'}
                        onChange={e => update('taglineColor', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-mono" 
                      />
                    </div>
                  </div>
                </div>

                {/* Title size, color, alignment */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400">حجم خط العنوان</label>
                    <input 
                      type="number" 
                      value={content.titleFontSize || 30}
                      onChange={e => update('titleFontSize', Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400">لون العنوان</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={content.titleColor || '#333333'}
                        onChange={e => update('titleColor', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200" 
                      />
                      <input 
                        type="text" 
                        value={content.titleColor || '#333333'}
                        onChange={e => update('titleColor', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-mono" 
                      />
                    </div>
                  </div>
                </div>

                {/* Title Alignment */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400">محاذاة العنوان</label>
                  <div className="flex gap-1">
                    {[
                      { id: 'left', icon: AlignLeft, title: 'يسار' },
                      { id: 'center', icon: AlignCenter, title: 'وسط' },
                      { id: 'right', icon: AlignRight, title: 'يمين' }
                    ].map(align => {
                      const Icon = align.icon;
                      return (
                        <button
                          key={align.id}
                          type="button"
                          onClick={() => update('titleAlign', align.id)}
                          className={`p-2 rounded-lg border text-xs flex items-center justify-center flex-1 ${
                            content.titleAlign === align.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-400'
                          }`}
                          title={align.title}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-bold text-slate-500">أحرف كابيتال للعبارة الترويجية (uppercase)</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={content.taglineUppercase !== false}
                      onChange={(e) => update('taglineUppercase', e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                  </label>
                </div>
              </div>

              {/* Right Column: Description & Background styles */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-blue-600 border-b pb-1.5 uppercase">تنسيق الوصف والخلفية</h3>

                {/* Description size and color */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400">حجم خط الوصف</label>
                    <input 
                      type="number" 
                      value={content.descFontSize || 14}
                      onChange={e => update('descFontSize', Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400">لون خط الوصف</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={content.descColor || '#666666'}
                        onChange={e => update('descColor', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200" 
                      />
                      <input 
                        type="text" 
                        value={content.descColor || '#666666'}
                        onChange={e => update('descColor', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-mono" 
                      />
                    </div>
                  </div>
                </div>

                {/* Line Height & Alignment */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400">ارتفاع السطر (lineHeight)</label>
                    <input 
                      type="text" 
                      value={content.descLineHeight || '1.6'}
                      onChange={e => update('descLineHeight', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono" 
                      placeholder="1.6"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400">محاذاة الوصف</label>
                    <div className="flex gap-1">
                      {[
                        { id: 'left', icon: AlignLeft, title: 'يسار' },
                        { id: 'center', icon: AlignCenter, title: 'وسط' },
                        { id: 'right', icon: AlignRight, title: 'يمين' }
                      ].map(align => {
                        const Icon = align.icon;
                        return (
                          <button
                            key={align.id}
                            type="button"
                            onClick={() => update('descAlign', align.id)}
                            className={`p-2 rounded-lg border text-xs flex items-center justify-center flex-1 ${
                              content.descAlign === align.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-400'
                            }`}
                            title={align.title}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Section BG Color */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400">لون خلفية القسم</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={content.bgColor || '#ffffff'}
                      onChange={e => update('bgColor', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200" 
                    />
                    <input 
                      type="text" 
                      value={content.bgColor || '#ffffff'}
                      onChange={e => update('bgColor', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-mono" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Styling Settings */}
            {content.layout !== 'centered' && (
              <div className="space-y-4 p-4 border border-slate-100 rounded-2xl">
                <h3 className="text-xs font-black text-blue-600 border-b pb-1.5 uppercase">تنسيق وتأثيرات الصورة</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-500">حواف الصورة الدائرية (Border Radius)</label>
                      <span className="text-[10px] font-bold font-mono text-blue-600">{content.imageBorderRadius || 8}px</span>
                    </div>
                    <input 
                      type="range"
                      min={0}
                      max={40}
                      value={content.imageBorderRadius || 8}
                      onChange={e => update('imageBorderRadius', Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500">تأثير ظل الصورة (Shadow)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'none', label: 'بدون ظل' },
                        { id: 'soft', label: 'ناعم خفيف' },
                        { id: 'hard', label: 'ظل داكن' }
                      ].map(sh => (
                        <button
                          key={sh.id}
                          type="button"
                          onClick={() => update('imageShadow', sh.id)}
                          className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold text-center transition-all ${
                            content.imageShadow === sh.id ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          {sh.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Container Paddings */}
            <div className="space-y-4 p-4 border border-slate-100 rounded-2xl bg-slate-50/20">
              <h3 className="text-xs font-black text-blue-600 border-b pb-1.5 uppercase">المسافات الداخلية للقسم (Padding)</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-500">مسافة الحشو العلوية (Padding Top)</label>
                    <span className="text-[10px] font-bold font-mono text-blue-600">{content.paddingTop || 50}px</span>
                  </div>
                  <input 
                    type="range"
                    min={10}
                    max={120}
                    value={content.paddingTop || 50}
                    onChange={e => update('paddingTop', Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-500">مسافة الحشو السفلية (Padding Bottom)</label>
                    <span className="text-[10px] font-bold font-mono text-blue-600">{content.paddingBottom || 60}px</span>
                  </div>
                  <input 
                    type="range"
                    min={10}
                    max={120}
                    value={content.paddingBottom || 60}
                    onChange={e => update('paddingBottom', Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'features' && (
          <FeaturesBarManager slug={slug} initialContent={content.twoMFeatures} />
        )}



        {/* Save button at bottom */}
        <div className="pt-4 border-t border-slate-200">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-700 flex items-center justify-center gap-2 transition-all disabled:opacity-70 active:scale-95"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
}
