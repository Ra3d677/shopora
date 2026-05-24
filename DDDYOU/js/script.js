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
let cart = [];
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

// Add to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();

  // Animation feedback
  const btn = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
  if (btn) {
    btn.innerHTML = '<i class="fas fa-check"></i> تمت الإضافة';
    btn.style.background = 'var(--color-gold)';
    btn.style.color = 'var(--color-dark)';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-shopping-bag"></i> أضف للسلة';
      btn.style.background = '';
      btn.style.color = '';
    }, 2000);
  }
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
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
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item" style="display:flex;align-items:center;gap:16px;margin-bottom:20px;padding:16px;background:var(--color-dark-3);border-radius:var(--radius-sm);">
        <img src="${item.image}" alt="${item.name}" style="width:70px;height:70px;border-radius:8px;object-fit:cover;">
        <div style="flex:1;">
          <h4 style="color:var(--color-white);font-size:0.95rem;margin-bottom:4px;">${item.name}</h4>
          <p style="color:var(--color-gold);font-weight:700;">${item.price.toLocaleString('ar-SA')} ر.س</p>
          <div style="display:flex;align-items:center;gap:8px;margin-top:8px;">
            <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" style="width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,0.1);background:transparent;color:var(--color-white);cursor:pointer;">−</button>
            <span style="color:var(--color-white);font-weight:600;">${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" style="width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,0.1);background:transparent;color:var(--color-white);cursor:pointer;">+</button>
          </div>
        </div>
        <button onclick="removeFromCart(${item.id})" style="background:none;border:none;color:rgba(255,255,255,0.3);cursor:pointer;font-size:1.1rem;">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `).join('');
  }

  cartTotal.textContent = `${totalPrice.toLocaleString('ar-SA')} ر.س`;
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity = newQuantity;
    updateCartUI();
  }
}

// ---------- Render Products ----------
const productsGrid = document.getElementById('productsGrid');

function renderProducts(filter = 'all') {
  const filtered = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  productsGrid.innerHTML = filtered.map(product => `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.badge ? `<span class="product-badge ${product.badgeClass}">${product.badge}</span>` : ''}
        <div class="product-actions">
          <button class="product-action-btn" onclick="quickView(${product.id})" title="معاينة سريعة">
            <i class="fas fa-eye"></i>
          </button>
          <button class="product-action-btn" onclick="addToCart(${product.id})" title="أضف للسلة">
            <i class="fas fa-shopping-bag"></i>
          </button>
          <button class="product-action-btn" title="أضف للمفضلة">
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

function quickView(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  modalBody.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <div>
      <div class="product-category" style="margin-bottom:8px;">${product.categoryAr}</div>
      <h3 style="color:var(--color-white);font-size:1.5rem;margin-bottom:12px;">${product.name}</h3>
      <p style="color:rgba(255,255,255,0.6);line-height:1.8;margin-bottom:16px;">${product.description}</p>
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">
        <span style="font-size:1.8rem;font-weight:800;color:var(--color-gold);">${product.price.toLocaleString('ar-SA')} ر.س</span>
        ${product.oldPrice ? `<span style="font-size:1rem;color:rgba(255,255,255,0.3);text-decoration:line-through;">${product.oldPrice.toLocaleString('ar-SA')} ر.س</span>` : ''}
      </div>
      <button class="btn btn-primary" onclick="addToCart(${product.id}); modal.classList.remove('open');">
        <i class="fas fa-shopping-bag"></i> أضف للسلة
      </button>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

modalClose.addEventListener('click', () => {
  modal.classList.remove('open');
  document.body.style.overflow = '';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
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

// ---------- Stats Counter ----------
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const increment = target / 60;
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString('ar-SA');
      }
    };

    updateCounter();
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
document.querySelectorAll('.hero-stats, .about-content, .products-grid, .features-grid, .testimonials-slider, .contact-content')
  .forEach(el => observer.observe(el));

// ---------- Sticky Header ----------
const header = document.getElementById('header');

function handleScroll() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleScroll);

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

window.addEventListener('scroll', updateActiveNav);

// ---------- Newsletter Form ----------
const newsletterForm = document.getElementById('newsletterForm');
newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = newsletterForm.querySelector('input');
  if (input.value.trim()) {
    // Simulate subscription
    const btn = newsletterForm.querySelector('.btn');
    const originalText = btn.textContent;
    btn.textContent = '✓ تم الاشتراك';
    btn.style.background = '#28a745';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 3000);
    input.value = '';
  }
});

// ---------- Initialize ----------
renderProducts();