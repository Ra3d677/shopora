import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getStoreBySlug } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { getTranslation } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { getPremiumBackgroundStyle, getThemeByPath } from "@/lib/utils";

// Import Templates
import SignatureTemplate from "@/components/templates/SignatureTemplate";
import ZenithTemplate from "@/components/templates/ZenithTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import Modern1Template from "@/components/templates/Modern1Template";
import TourismTemplate from "@/components/templates/TourismTemplate";
import FitnessTemplate from "@/components/templates/FitnessTemplate";
import DDDYOUTemplate from "@/components/templates/DDDYOUTemplate";
import MomoTemplate from "@/components/templates/MomoTemplate";
import OneMTemplate from "@/components/templates/1MTemplate";
import TwoMTemplate from "@/components/templates/TwoMTemplate";

export const revalidate = 60;

function BaseHomePage({ storeName, slug }: { storeName: string, slug: string }) {
  return (
    <div className="p-8 border-4 border-dashed border-gray-300 rounded-3xl m-8 text-center">
       <h1 className="text-4xl font-black mb-4 uppercase">{storeName}</h1>
       <p className="text-slate-500 mb-8">Welcome to our official store.</p>
       <Link 
          href={`/store/${slug}/products`}
          className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-slate-800 transition-all"
       >
         Explore Products
       </Link>
    </div>
  );
}

export default async function HomePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  const session = await getSession();
  
  if (!store) {
    notFound();
  }

  // DEBUG LOG (MANDATORY)
  console.log("STORE TEMPLATE:", store.template);

  const activeTemplate = store.template;
  const settings = { ...store.settings, storeName: store.name };
  const allBanners = store.banners || [];
  const products = store.products || [];
  const banners = allBanners
    .filter(b => b && b.isActive && (!b.targetPage || b.targetPage === 'home'))
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // Removed the "No products yet" fallback so the template always renders.

  const props = { store, banners, settings, products, slug, categories: store.categories };
  
  // FORCE TEMPLATE RENDERING (Step 4)
  const renderTemplate = () => {
    if (activeTemplate === 'fitness') return <FitnessTemplate {...props} />;
    if (store.type === 'WEBSITE') return <TourismTemplate {...props} />;
    
    if (activeTemplate === 'zenith') return <ZenithTemplate {...props} />;
    if (activeTemplate === 'modern') return <ModernTemplate {...props} />;
    if (activeTemplate === 'modern1') return <Modern1Template {...props} />;
    if (activeTemplate === 'dddyou') return <DDDYOUTemplate {...props} />;
    if (activeTemplate === 'momo') return <MomoTemplate {...props} />;
    if (activeTemplate === '1m') return <OneMTemplate {...props} />;
    if (activeTemplate === '2m') return <TwoMTemplate {...props} />;
    
    // Default fallback (Signature is now the default)
    return (
      <SignatureTemplate 
        banners={banners} 
        settings={settings} 
        products={products} 
        slug={slug} 
        categories={store.categories} 
        session={session}
      />
    );
  };

  const currentThemeId = getThemeByPath(settings.pageThemes || [], `/store/${slug}`);
  const premiumStyle = getPremiumBackgroundStyle(currentThemeId);
  const isPremiumBg = currentThemeId !== 'default';

  return (
    <div data-page="home" className="store-container w-full bg-transparent transition-all duration-700">
      {renderTemplate()}
    </div>
  );
}
