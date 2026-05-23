import prisma from "./prisma";

type StoreIdResolver = string | { slug: string };

async function resolveStore(store: StoreIdResolver) {
  if (typeof store === "string" && store.startsWith("id:")) return { id: store.slice(3) };
  const slug = typeof store === "string" ? store : store.slug;
  const s = await prisma.store.findUnique({ where: { slug }, select: { id: true } });
  if (!s) throw new Error(`Store not found: ${slug}`);
  return s;
}

// ===== Hero =====
export async function getHero(slug: string) {
  const store = await resolveStore(slug);
  return prisma.heroSection.findUnique({ where: { storeId: store.id } });
}

export async function upsertHero(slug: string, data: any) {
  const store = await resolveStore(slug);
  return prisma.heroSection.upsert({
    where: { storeId: store.id },
    update: {
      badge: data.badge, title: data.title, subtitle: data.subtitle,
      backgroundImage: data.backgroundImage, runnerImage: data.runnerImage, lightningImage: data.lightningImage,
      avatars: data.avatars || [],
      primaryCtaText: data.primaryCtaText, primaryCtaLink: data.primaryCtaLink,
      secondaryCtaText: data.secondaryCtaText, secondaryCtaLink: data.secondaryCtaLink,
      statValue: data.statValue, statSuffix: data.statSuffix, statLabel: data.statLabel,
    },
    create: {
      storeId: store.id, badge: data.badge, title: data.title, subtitle: data.subtitle,
      backgroundImage: data.backgroundImage, runnerImage: data.runnerImage, lightningImage: data.lightningImage,
      avatars: data.avatars || [],
      primaryCtaText: data.primaryCtaText, primaryCtaLink: data.primaryCtaLink,
      secondaryCtaText: data.secondaryCtaText, secondaryCtaLink: data.secondaryCtaLink,
      statValue: data.statValue, statSuffix: data.statSuffix, statLabel: data.statLabel,
    },
  });
}

// ===== Services =====
export async function getServices(slug: string) {
  const store = await resolveStore(slug);
  return prisma.service.findMany({ where: { storeId: store.id }, orderBy: { sortOrder: "asc" } });
}

export async function createService(slug: string, data: any) {
  const store = await resolveStore(slug);
  const max = await prisma.service.findFirst({ where: { storeId: store.id }, orderBy: { sortOrder: "desc" } });
  return prisma.service.create({
    data: { storeId: store.id, ...data, sortOrder: (max?.sortOrder ?? -1) + 1 },
  });
}

export async function updateService(id: string, data: any) {
  return prisma.service.update({ where: { id }, data });
}

export async function deleteService(id: string) {
  return prisma.service.delete({ where: { id } });
}

export async function reorderServices(slug: string, ids: string[]) {
  const store = await resolveStore(slug);
  const tx = ids.map((id, i) => prisma.service.updateMany({ where: { id, storeId: store.id }, data: { sortOrder: i } }));
  await prisma.$transaction(tx);
}

// ===== Transformations =====
export async function getTransformations(slug: string) {
  const store = await resolveStore(slug);
  return prisma.transformation.findMany({ where: { storeId: store.id }, orderBy: { sortOrder: "asc" } });
}

export async function createTransformation(slug: string, data: any) {
  const store = await resolveStore(slug);
  const max = await prisma.transformation.findFirst({ where: { storeId: store.id }, orderBy: { sortOrder: "desc" } });
  return prisma.transformation.create({
    data: { storeId: store.id, ...data, sortOrder: (max?.sortOrder ?? -1) + 1 },
  });
}

export async function updateTransformation(id: string, data: any) {
  return prisma.transformation.update({ where: { id }, data });
}

export async function deleteTransformation(id: string) {
  return prisma.transformation.delete({ where: { id } });
}

export async function reorderTransformations(slug: string, ids: string[]) {
  const store = await resolveStore(slug);
  const tx = ids.map((id, i) => prisma.transformation.updateMany({ where: { id, storeId: store.id }, data: { sortOrder: i } }));
  await prisma.$transaction(tx);
}

// ===== Pricing Plans =====
export async function getPlans(slug: string) {
  const store = await resolveStore(slug);
  return prisma.pricingPlan.findMany({ where: { storeId: store.id }, orderBy: { sortOrder: "asc" } });
}

export async function createPlan(slug: string, data: any) {
  const store = await resolveStore(slug);
  const max = await prisma.pricingPlan.findFirst({ where: { storeId: store.id }, orderBy: { sortOrder: "desc" } });
  return prisma.pricingPlan.create({
    data: { storeId: store.id, ...data, sortOrder: (max?.sortOrder ?? -1) + 1 },
  });
}

export async function updatePlan(id: string, data: any) {
  return prisma.pricingPlan.update({ where: { id }, data });
}

export async function deletePlan(id: string) {
  return prisma.pricingPlan.delete({ where: { id } });
}

export async function reorderPlans(slug: string, ids: string[]) {
  const store = await resolveStore(slug);
  const tx = ids.map((id, i) => prisma.pricingPlan.updateMany({ where: { id, storeId: store.id }, data: { sortOrder: i } }));
  await prisma.$transaction(tx);
}

// ===== Testimonials =====
export async function getTestimonials(slug: string) {
  const store = await resolveStore(slug);
  return prisma.testimonial.findMany({ where: { storeId: store.id }, orderBy: { sortOrder: "asc" } });
}

export async function createTestimonial(slug: string, data: any) {
  const store = await resolveStore(slug);
  const max = await prisma.testimonial.findFirst({ where: { storeId: store.id }, orderBy: { sortOrder: "desc" } });
  return prisma.testimonial.create({
    data: { storeId: store.id, ...data, sortOrder: (max?.sortOrder ?? -1) + 1 },
  });
}

export async function updateTestimonial(id: string, data: any) {
  return prisma.testimonial.update({ where: { id }, data });
}

export async function deleteTestimonial(id: string) {
  return prisma.testimonial.delete({ where: { id } });
}

export async function reorderTestimonials(slug: string, ids: string[]) {
  const store = await resolveStore(slug);
  const tx = ids.map((id, i) => prisma.testimonial.updateMany({ where: { id, storeId: store.id }, data: { sortOrder: i } }));
  await prisma.$transaction(tx);
}

// ===== Footer =====
export async function getFooter(slug: string) {
  const store = await resolveStore(slug);
  return prisma.footerConfig.findUnique({ where: { storeId: store.id } });
}

export async function upsertFooter(slug: string, data: any) {
  const store = await resolveStore(slug);
  return prisma.footerConfig.upsert({
    where: { storeId: store.id },
    update: {
      logo: data.logo, description: data.description,
      address: data.address, email: data.email, phone: data.phone,
      socialLinks: data.socialLinks || [], footerLinks: data.footerLinks || [],
      iosAppUrl: data.iosAppUrl, androidAppUrl: data.androidAppUrl,
    },
    create: {
      storeId: store.id, logo: data.logo, description: data.description,
      address: data.address, email: data.email, phone: data.phone,
      socialLinks: data.socialLinks || [], footerLinks: data.footerLinks || [],
      iosAppUrl: data.iosAppUrl, androidAppUrl: data.androidAppUrl,
    },
  });
}

// ===== Sync from settings blob =====
export async function syncFromSettings(slug: string) {
  const store = await prisma.store.findUnique({
    where: { slug },
    select: { id: true, settings: true },
  });
  if (!store) throw new Error("Store not found");

  const fs = JSON.parse(store.settings || "{}").fitnessSettings || {};

  // Hero
  if (fs.hero) await upsertHero(slug, {
    badge: fs.hero.badge, title: fs.hero.title, subtitle: fs.hero.subtitle,
    backgroundImage: fs.hero.backgroundImage, runnerImage: fs.hero.runnerImage, lightningImage: fs.hero.lightningImage,
    avatars: fs.hero.avatars,
    primaryCtaText: fs.hero.primaryCta?.text, primaryCtaLink: fs.hero.primaryCta?.link,
    secondaryCtaText: fs.hero.secondaryCta?.text, secondaryCtaLink: fs.hero.secondaryCta?.link,
    statValue: fs.hero.statValue, statSuffix: fs.hero.statSuffix, statLabel: fs.hero.statLabel,
  });

  // Services
  if (fs.services?.items?.length) {
    await prisma.service.deleteMany({ where: { storeId: store.id } });
    for (let i = 0; i < fs.services.items.length; i++) {
      await prisma.service.create({
        data: { storeId: store.id, ...fs.services.items[i], sortOrder: i },
      });
    }
  }

  // Transformations
  if (fs.transformations?.items?.length) {
    await prisma.transformation.deleteMany({ where: { storeId: store.id } });
    for (let i = 0; i < fs.transformations.items.length; i++) {
      await prisma.transformation.create({
        data: { storeId: store.id, name: fs.transformations.items[i].name, beforeImage: fs.transformations.items[i].before, afterImage: fs.transformations.items[i].after, sortOrder: i },
      });
    }
  }

  // Plans
  if (fs.pricing?.plans?.length) {
    await prisma.pricingPlan.deleteMany({ where: { storeId: store.id } });
    for (let i = 0; i < fs.pricing.plans.length; i++) {
      const p = fs.pricing.plans[i];
      await prisma.pricingPlan.create({
        data: {
          storeId: store.id, name: p.name, subtitle: p.subtitle, price: p.price,
          currency: p.currency, duration: p.duration, popular: p.popular, badge: p.badge,
          features: p.features || [], ctaText: p.ctaText, sortOrder: i,
        },
      });
    }
  }

  // Testimonials
  if (fs.testimonials?.items?.length) {
    await prisma.testimonial.deleteMany({ where: { storeId: store.id } });
    for (let i = 0; i < fs.testimonials.items.length; i++) {
      const t = fs.testimonials.items[i];
      await prisma.testimonial.create({
        data: { storeId: store.id, name: t.name, role: t.role, content: t.content, rating: parseInt(t.rating) || 5, sortOrder: i },
      });
    }
  }

  // Footer
  if (fs.footer) {
    const f = fs.footer;
    await upsertFooter(slug, {
      logo: f.logo, description: f.description,
      address: f.contact?.address, email: f.contact?.email, phone: f.contact?.phone,
      socialLinks: f.socialLinks, footerLinks: f.links,
      iosAppUrl: f.appStore?.ios, androidAppUrl: f.appStore?.android,
    });
  }

  return { success: true };
}

// ===== Get all data =====
export async function getAllData(slug: string) {
  const store = await prisma.store.findUnique({
    where: { slug },
    select: { id: true, settings: true },
  });
  if (!store) throw new Error("Store not found");

  const [hero, services, transformations, plans, testimonials, footer] = await Promise.all([
    getHero(slug),
    getServices(slug),
    getTransformations(slug),
    getPlans(slug),
    getTestimonials(slug),
    getFooter(slug),
  ]);

  const fs = JSON.parse(store.settings || "{}").fitnessSettings || {};

  return {
    hero,
    services,
    transformations,
    plans,
    testimonials,
    footer,
    marquee: fs.marquee || {},
    about: fs.about || {},
    pricing: {
      title: fs.pricing?.title,
      badge: fs.pricing?.badge,
      subtitle: fs.pricing?.subtitle,
      promoTopItems: fs.pricing?.promoTopItems,
      promoBottomItems: fs.pricing?.promoBottomItems,
      periods: fs.pricing?.periods,
    },
    servicesSection: {
      title: fs.services?.title,
      badge: fs.services?.badge,
      subtitle: fs.services?.subtitle,
    },
    transformationsSection: {
      title: fs.transformations?.title,
      badge: fs.transformations?.badge,
      subtitle: fs.transformations?.subtitle,
    },
    testimonialsSection: {
      title: fs.testimonials?.title,
      badge: fs.testimonials?.badge,
    },
  };
}
