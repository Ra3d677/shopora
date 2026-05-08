const { getStoreBySlug } = require('./src/lib/data');

async function test() {
  try {
    const store = await getStoreBySlug('mostore');
    console.log("Store found:", store.name);
    console.log("Banners count:", store.banners.length);
  } catch (e) {
    console.error("RUNTIME ERROR:", e.message);
  }
}

test();
