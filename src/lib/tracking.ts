/**
 * Utility functions for tracking ecommerce events across different platforms.
 */

export const trackViewContent = (product: any, store: any) => {
  if (typeof window === "undefined") return;

  const { facebookPixelId, tiktokPixelId, snapchatPixelId, googleAnalyticsId } = store;

  // Facebook
  if (facebookPixelId && (window as any).fbq) {
    (window as any).fbq('track', 'ViewContent', {
      content_name: product.name,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'EGP' // Default currency, could be dynamic later
    });
  }

  // TikTok
  if (tiktokPixelId && (window as any).ttq) {
    (window as any).ttq.track('ViewContent', {
      contents: [{
        content_id: product.id,
        content_name: product.name,
        content_type: 'product',
        quantity: 1,
        price: product.price
      }],
      value: product.price,
      currency: 'EGP'
    });
  }

  // Snapchat
  if (snapchatPixelId && (window as any).snaptr) {
    (window as any).snaptr('track', 'VIEW_CONTENT', {
      item_ids: [product.id],
      price: product.price,
      currency: 'EGP'
    });
  }

  // Google Analytics
  if (googleAnalyticsId && (window as any).gtag) {
    (window as any).gtag('event', 'view_item', {
      currency: 'EGP',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: 1
      }]
    });
  }
};

export const trackAddToCart = (product: any, quantity: number, store: any) => {
  if (typeof window === "undefined") return;

  const { facebookPixelId, tiktokPixelId, snapchatPixelId, googleAnalyticsId } = store;

  // Facebook
  if (facebookPixelId && (window as any).fbq) {
    (window as any).fbq('track', 'AddToCart', {
      content_name: product.name,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price * quantity,
      currency: 'EGP'
    });
  }

  // TikTok
  if (tiktokPixelId && (window as any).ttq) {
    (window as any).ttq.track('AddToCart', {
      contents: [{
        content_id: product.id,
        content_name: product.name,
        content_type: 'product',
        quantity: quantity,
        price: product.price
      }],
      value: product.price * quantity,
      currency: 'EGP'
    });
  }

  // Snapchat
  if (snapchatPixelId && (window as any).snaptr) {
    (window as any).snaptr('track', 'ADD_CART', {
      item_ids: [product.id],
      price: product.price * quantity,
      currency: 'EGP'
    });
  }

  // Google Analytics
  if (googleAnalyticsId && (window as any).gtag) {
    (window as any).gtag('event', 'add_to_cart', {
      currency: 'EGP',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: quantity
      }]
    });
  }
};

export const trackPurchase = (order: any, store: any) => {
  if (typeof window === "undefined") return;

  const { facebookPixelId, tiktokPixelId, snapchatPixelId, googleAnalyticsId } = store;

  // Facebook
  if (facebookPixelId && (window as any).fbq) {
    (window as any).fbq('track', 'Purchase', {
      content_ids: order.items.map((item: any) => item.productId),
      content_type: 'product',
      value: order.totalAmount,
      currency: 'EGP'
    });
  }

  // TikTok
  if (tiktokPixelId && (window as any).ttq) {
    (window as any).ttq.track('CompletePayment', {
      contents: order.items.map((item: any) => ({
        content_id: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      value: order.totalAmount,
      currency: 'EGP'
    });
  }

  // Snapchat
  if (snapchatPixelId && (window as any).snaptr) {
    (window as any).snaptr('track', 'PURCHASE', {
      item_ids: order.items.map((item: any) => item.productId),
      price: order.totalAmount,
      currency: 'EGP',
      transaction_id: order.id
    });
  }

  // Google Analytics
  if (googleAnalyticsId && (window as any).gtag) {
    (window as any).gtag('event', 'purchase', {
      transaction_id: order.id,
      value: order.totalAmount,
      currency: 'EGP',
      items: order.items.map((item: any) => ({
        item_id: item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    });
  }
};

export const trackInitiateCheckout = (items: any[], total: number, store: any) => {
  if (typeof window === "undefined") return;

  const { facebookPixelId, tiktokPixelId, snapchatPixelId, googleAnalyticsId } = store;

  // Facebook
  if (facebookPixelId && (window as any).fbq) {
    (window as any).fbq('track', 'InitiateCheckout', {
      content_ids: items.map((item: any) => item.product.id),
      content_type: 'product',
      value: total,
      currency: 'EGP'
    });
  }

  // TikTok
  if (tiktokPixelId && (window as any).ttq) {
    (window as any).ttq.track('InitiateCheckout', {
      contents: items.map((item: any) => ({
        content_id: item.product.id,
        quantity: item.quantity,
        price: item.product.discount_price || item.product.price
      })),
      value: total,
      currency: 'EGP'
    });
  }

  // Snapchat
  if (snapchatPixelId && (window as any).snaptr) {
    (window as any).snaptr('track', 'START_CHECKOUT', {
      item_ids: items.map((item: any) => item.product.id),
      price: total,
      currency: 'EGP'
    });
  }

  // Google Analytics
  if (googleAnalyticsId && (window as any).gtag) {
    (window as any).gtag('event', 'begin_checkout', {
      currency: 'EGP',
      value: total,
      items: items.map((item: any) => ({
        item_id: item.product.id,
        item_name: item.product.name,
        price: item.product.discount_price || item.product.price,
        quantity: item.quantity
      }))
    });
  }
};

