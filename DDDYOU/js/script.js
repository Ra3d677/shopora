/* ============================================
   DDDYOU - Parfumerie de Luxe | JavaScript
   عطور الرقي والأصالة
   ============================================ */

'use strict';

// ---------- Product Data ----------
const products = [
  {
    id: 1,
    name: 'DDDYOU Noir Intense',
    category: 'oriental',
    categoryAr: 'شرقية',
    price: 890,
    oldPrice: 1090,
    badge: 'الأكثر مبيعاً',
    badgeClass: 'best-seller',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80',
    description: 'مزيج غامض من العود الأسود والمسك والعنبر، يدوم طويلاً ويثير الحواس.'
  },
  {
    id: 2,
    name: 'DDDYOU Oud Royal',
    category: 'woody',
    categoryAr: 'خشبية',
    price: 1250,
    oldPrice: null,
    badge: 'جديد',
    badgeClass: 'new',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc949011c0?w=400&q=80',
    description: 'عود ملكي نادر من كمبوديا مع لمسات من الزعفران والجلد.'
  },
  {
    id: 3,
    name: 'DDDYOU Jasmine D\'Or',
    category: 'floral',
    categoryAr: 'زهرية',
    price: 750,
    oldPrice: 950,
    badge: null,
    badgeClass: '',
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&q=80',
    description: 'ياسمين غراس الفاخر ممزوج بورود بلغاريا وزهر البرتقال.'
  },
  {
    id: 4,
    name: 'DDDYOU Aqua Breeze',
    category: 'fresh',
    categoryAr: 'منعشة',
    price: 680,
    oldPrice: null,
    badge: null,
    badgeClass: '',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80',
    description: 'نسيم البحر الأبيض المتوسط مع الحمضيات المنعشة والأعشاب البحرية.'
  },
  {
    id: 5,
    name: 'DDDYOU Amber Mystique',
    category: 'oriental',
    categoryAr: 'شرقية',
    price: 980,
    oldPrice: null,
    badge: 'الأكثر مبيعاً',
    badgeClass: 'best-seller',
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&q=80',
    description: 'عنبر دافئ مع الفانيليا والتوابل الشرقية لعطر لا يُقاوم.'
  },
  {
    id: 6,
    name: 'DDDYOU Cedar & Sage',
    category: 'woody',
    categoryAr: 'خشبية',
    price: 720,
    oldPrice: 820,
    badge: null,
    badgeClass: '',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80',
    description: 'أرز أطلسي مع مريمية برية وخشب الصندل الكريمي.'
  },
  {
    id: 7,
    name: 'DDDYOU Rose Éternelle',
    category: 'floral',
    categoryAr: 'زهرية',
    price: 850,
    oldPrice: null,
    badge: 'جديد',
    badgeClass: 'new',
    image: 'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=400&q=80',
    description: 'وردة بلغارية أبدية مع مسك أبيض وخشب الصندل.'
  },
  {
    id: 8,
    name: 'DDDYOU Citrus Splash',
    category: 'fresh',
    categoryAr: 'منعشة',
    price: 590,
    oldPrice: null,
    badge: null,
    badgeClass: '',
    image: 'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?w=400&q=80',
    description: 'مزيج منعش من البرغموت والجريب فروت والليمون الأخضر.'
  },
  {
    id: 9,
    name: 'DDDYOU Musk Al White',
    category: 'oriental',
    categoryAr: 'شرقية',
    price: 1100,
    oldPrice: 1350,
    badge: 'خصم خاص',
    badgeClass: '',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80',
    description: 'مسك أبيض نقي من جبال الهيمالايا مع العنبر الذهبي.'
  }
];

// ---------- Cart ----------
const CART_STORAGE_KEY = 'dddyou_cart';
let cart = loadCart();

function loadCart() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.warn('Failed to load cart from localStorage:', e);
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.warn('Failed to save cart to localStorage:', e);
  }
}

const cartBtn = document.getElementById('cartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const cartClose = document.getElementById('cartClose');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');

// Cart toggle
function openCart() {
  cartOverlay.classList.add('open');
  cartSidebar.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartOverlay.classList.remove('open');
  cartSidebar.classList.remove('open');
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', (e) => {
  e.preventDefault();
  openCart();
});

cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Keyboard: Escape to close cart & modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (cartSidebar.classList.contains('open')) {
      closeCart();
    }
    if (modal.classList.contains('open')) {
      closeModal();
    }
  }
});

// Add to cart
function addToCart(productId) {
  try {
    const product = products.find(p => p.id === productId);
    if (!product) {
      console.warn(`Product with id ${productId} not found`);
      return;
    }

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();

    // Animation feedback - find the visible add-to-cart button
    const allBtns = document.querySelectorAll(`.add-to-cart[data-id="${productId}"]`);
    const visibleBtn = Array.from(allBtns).find(
      btn => btn.offsetParent !== null || btn.closest('.product-card')
    );
    
    if (visibleBtn) {
      const originalHtml = visibleBtn.innerHTML;
      visibleBtn.innerHTML = '<i class="fas fa-check"></i> تمت الإضافة';
      visibleBtn.style.background = 'var(--color-gold)';
      visibleBtn.style.color = 'var(--color-dark)';
      setTimeout(() => {
        visibleBtn.innerHTML = originalHtml;
        visibleBtn.style.background = '';
        visibleBtn.style.color = '';
      }, 2000);
    }
  } catch (e) {
    console.error('Error adding to cart:', e);
  }
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

// Cart Item HTML template
function createCartItemHTML(item) {
  return `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" loading="lazy">
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.name}</h4>
        <p class="cart-item-price">${item.price.toLocaleString('ar-SA')} ر.س</p>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
}

// Update UI
function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-bag"></i>
        <p>سلتك فارغة</p>
        <span>تصفح مجموعتنا وأضف ما يعجبك</span>
      </div>
    `;
  } else {
    cartItemsContainer.innerHTML = cart.map(createCartItemHTML).join('');
  }

  cartTotal.innerHTML = `${totalPrice.toLocaleString('ar-SA')} <span class="currency">ر.س</span>`;
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity = newQuantity;
    saveCart();
    updateCartUI();
  }
}

// ---------- Render Products ----------
const productsGrid = document.getElementById('productsGrid');

function renderProducts(filter = 'all') {
  try {
    const filtered = filter === 'all'
      ? products
      : products.filter(p => p.category === filter);

    productsGrid.innerHTML = filtered.map(product => `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            loading="lazy"
            onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22 fill=%22%231a1a2e%22%3E%3Crect width=%22400%22 height=%22400%22/%3E%3Ctext x=%22200%22 y=%22200%22 text-anchor=%22middle%22 fill=%22%23c9a96e%22 font-size=%2220%22%3EDDDYOU%3C/text%3E%3C/svg%3E'"
          >
          ${product.badge ? `<span class="product-badge ${product.badgeClass}">${product.badge}</span>` : ''}
          <div class="product-actions">
            <button class="product-action-btn" onclick="quickView(${product.id})" title="معاينة سريعة" aria-label="معاينة سريعة">
              <i class="fas fa-eye"></i>
            </button>
            <button class="product-action-btn" onclick="addToCart(${product.id})" title="أضف للسلة" aria-label="أضف للسلة">
              <i class="fas fa-shopping-bag"></i>
            </button>
            <button class="product-action-btn" title="أضف للمفضلة" aria-label="أضف للمفضلة">
              <i class="fas fa-heart"></i>
            </button>
          </div>
        </div>
        <div class="product-info">
          <div class="product-category">${product.categoryAr}</div>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-footer">
            <div class="product-price">
              ${product.price.toLocaleString('ar-SA')} ر.س
              ${product.oldPrice ? `<span class="old">${product.oldPrice.toLocaleString('ar-SA')} ر.س</span>` : ''}
            </div>
            <button class="add-to-cart" data-id="${product.id}" onclick="addToCart(${product.id})">
              <i class="fas fa-shopping-bag"></i> أضف للسلة
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (e) {
    console.error('Error rendering products:', e);
    productsGrid.innerHTML = '<p style="color:var(--color-gold);text-align:center;padding:40px;">عذراً، حدث خطأ في تحميل المنتجات</p>';
  }
}

// ---------- Product Filter ----------
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.filter);
  });
});

// ---------- Quick View ----------
const modal = document.getElementById('quickViewModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function quickView(productId) {
  try {
    const product = products.find(p => p.id === productId);
    if (!product) {
      console.warn(`Product with id ${productId} not found for quick view`);
      return;
    }

    modalBody.innerHTML = `
      <img 
        src="${product.image}" 
        alt="${product.name}" 
        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22500%22 height=%22500%22 fill=%22%231a1a2e%22%3E%3Crect width=%22500%22 height=%22500%22/%3E%3Ctext x=%22250%22 y=%22250%22 text-anchor=%22middle%22 fill=%22%23c9a96e%22 font-size=%2224%22%3EDDDYOU%3C/text%3E%3C/svg%3E'"
      >
      <div>
        <div class="product-category" style="margin-bottom:8px;">${product.categoryAr}</div>
        <h3 style="color:var(--color-white);font-size:1.5rem;margin-bottom:12px;">${product.name}</h3>
        <p style="color:rgba(255,255,255,0.6);line-height:1.8;margin-bottom:16px;">${product.description}</p>
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">
          <span style="font-size:1.8rem;font-weight:800;color:var(--color-gold);">${product.price.toLocaleString('ar-SA')} ر.س</span>
          ${product.oldPrice ? `<span style="font-size:1rem;color:rgba(255,255,255,0.3);text-decoration:line-through;">${product.oldPrice.toLocaleString('ar-SA')} ر.س</span>` : ''}
        </div>
        <button class="btn btn-primary" onclick="addToCart(${product.id}); closeModal();">
          <i class="fas fa-shopping-bag"></i> أضف للسلة
        </button>
      </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  } catch (e) {
    console.error('Error in quick view:', e);
  }
}

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// ---------- Testimonials Slider ----------
const slider = document.getElementById('testimonialsSlider');
const dotsContainer = document.getElementById('sliderDots');
const cards = document.querySelectorAll('.testimonial-card');
let isDragging = false;
let startX = 0;
let scrollLeft = 0;

// Create dots
cards.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.classList.add('slider-dot');
  dot.setAttribute('aria-label', `الانتقال إلى الشهادة ${index + 1}`);
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => {
    const card = cards[index];
    slider.scrollTo({
      left: card.offsetLeft - slider.offsetLeft,
      behavior: 'smooth'
    });
  });
  dotsContainer.appendChild(dot);
});

function updateActiveDot() {
  const dots = document.querySelectorAll('.slider-dot');
  const scrollCenter = slider.scrollLeft + slider.offsetWidth / 2;

  cards.forEach((card, index) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    if (Math.abs(scrollCenter - cardCenter) < card.offsetWidth / 2) {
      dots.forEach(d => d.classList.remove('active'));
      dots[index]?.classList.add('active');
    }
  });
}

slider.addEventListener('scroll', updateActiveDot);

// Drag to scroll
slider.addEventListener('mousedown', (e) => {
  isDragging = true;
  slider.classList.add('dragging');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseup', () => {
  isDragging = false;
  slider.classList.remove('dragging');
});

slider.addEventListener('mouseleave', () => {
  isDragging = false;
  slider.classList.remove('dragging');
});

slider.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 1.5;
  slider.scrollLeft = scrollLeft - walk;
});

// Touch support
slider.addEventListener('touchstart', (e) => {
  startX = e.touches[0].pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener('touchmove', (e) => {
  const x = e.touches[0].pageX - slider.offsetLeft;
  const walk = (x - startX) * 1.5;
  slider.scrollLeft = scrollLeft - walk;
});

// ---------- Stats Counter (timestamp-based) ----------
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = progress * (2 - progress);
      const current = Math.ceil(eased * target);

      counter.textContent = current.toLocaleString('ar-SA');
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  });
}

// ---------- Scroll Animation (Intersection Observer) ----------
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');

      // Start counters when hero stats come into view
      if (entry.target.classList.contains('hero-stats')) {
        animateCounters();
      }

      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements
const elementsToObserve = document.querySelectorAll(
  '.hero-stats, .about-content, .products-grid, .features-grid, .testimonials-slider, .contact-content'
);
elementsToObserve.forEach(el => observer.observe(el));

// ---------- Sticky Header (throttled) ----------
const header = document.getElementById('header');
let ticking = false;

function handleScroll() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      handleScroll();
      updateActiveNav();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

// ---------- Mobile Menu ----------
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  nav.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
});

// Close menu on nav link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---------- Active Nav Link on Scroll ----------
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  const scrollY = window.scrollY + 150;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// ---------- Newsletter Form ----------
const newsletterForm = document.getElementById('newsletterForm');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

newsletterForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = newsletterForm.querySelector('input');
  const btn = newsletterForm.querySelector('.btn');
  const email = input.value.trim();

  if (!email) {
    showNewsletterFeedback('يرجى إدخال بريد إلكتروني', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showNewsletterFeedback('يرجى إدخال بريد إلكتروني صحيح', 'error');
    return;
  }

  // Show loading state
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الاشتراك...';

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    showNewsletterFeedback('✓ تم الاشتراك بنجاح!', 'success');
    input.value = '';
  } catch (e) {
    showNewsletterFeedback('حدث خطأ، حاول مرة أخرى', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
});

function showNewsletterFeedback(message, type) {
  const feedbackEl = document.getElementById('newsletterFeedback') || (() => {
    const el = document.createElement('p');
    el.id = 'newsletterFeedback';
    el.style.cssText = 'margin-top:12px;font-size:0.9rem;font-weight:500;';
    newsletterForm.appendChild(el);
    return el;
  })();

  feedbackEl.textContent = message;
  feedbackEl.style.color = type === 'success' ? '#28a745' : '#dc3545';
  
  setTimeout(() => {
    feedbackEl.remove();
  }, 4000);
}

// ---------- Lazy loading images with IntersectionObserver ----------
if ('loading' in HTMLImageElement.prototype) {
  // Browser supports native lazy loading - already using loading="lazy"
} else {
  // Fallback: use IntersectionObserver for older browsers
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imageObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imageObserver.observe(img));
}

// ---------- Initialize ----------
renderProducts('all');
updateCartUI();