const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const store = await prisma.store.findFirst();
    const product = await prisma.product.findFirst();
    if (!store || !product) return console.log('No store or product');
    
    await prisma.order.create({
      data: {
        storeId: store.id,
        customerName: 'Test',
        customerEmail: 'test@example.com',
        customerPhone: '123',
        shippingAddress: '123 Test St',
        notes: 'Test notes',
        totalAmount: 100,
        status: 'pending',
        items: {
          create: [{
            productId: product.id,
            quantity: 1,
            price: 100,
            size: 'L',
            color: 'Red'
          }]
        }
      }
    });
    console.log('Order created successfully!');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();
