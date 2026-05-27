import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  try {
    const store = await prisma.store.findUnique({ where: { slug: "moro" } });
    if (!store) { console.log("Store not found"); return; }
    console.log("Store template:", store.template);
    console.log("Store name:", store.name);
    const banners = await prisma.banner.findMany({ where: { storeId: store.id }, orderBy: { order: "asc" } });
    console.log("Total banners:", banners.length);
    banners.forEach(b => console.log("  -", b.position, b.order, b.image?.substring(0, 40), b.link));
  } catch(e) { console.error(e); }
  finally { await prisma.$disconnect(); }
}
main();
