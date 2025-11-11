// js/core.js
// Main application logic: products, cart, pages
// Uses I18N and THEME modules

// Mocked products dataset
const PRODUCTS = [
  { id: 'p1', name: 'Modern Sofa', category: 'sofa', price: 499.00, image: 'https://www.shutterstock.com/image-photo/interior-light-living-room-grey-600nw-2338829017.jpg' },
  { id: 'p2', name: 'Wooden Chair', category: 'chair', price: 89.99, image: 'https://strongoakswoodshop.com/cdn/shop/files/il_fullxfull.674227139_n7gi_grande.jpg?v=1742329697' },
  { id: 'p3', name: 'Oak Table', category: 'table', price: 249.50, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxPsxOtJnADpcFOCFZ9fSDNleKJtQVw6iTIA&s' },
  { id: 'p4', name: 'Comfort Bed', category: 'bed', price: 699.00, image: 'https://www.shutterstock.com/image-photo/comfortable-bed-lamps-light-spacious-600nw-2317690149.jpg' },
  { id: 'p5', name: 'Lamp Modern', category: 'lighting', price: 39.99, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjkEH3GI5Hq_hTBDj_XQ9sGPPTIHDRKzppQg&s' },
  { id: 'p6', name: 'Storage Cabinet', category: 'storage', price: 179.00, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQnVeVuUV3kZBvcQcSbVXE508EibCkkgH_mg&s' }
];

// Cart in localStorage under 'furni_cart'
function readCart() {
  try {
    const raw = localStorage.getItem('furni_cart');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read cart', e);
    return [];
  }
}
function writeCart(cart) { localStorage.setItem('furni_cart', JSON.stringify(cart)); updateNavCartCount(); }

function addToCart(productId) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return alert(I18N.t('added_not_found'));
  const cart = readCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) existing.qty += 1;
  else cart.push({ id: prod.id, name: prod.name, price: prod.price, qty: 1, image: prod.image });
  writeCart(cart);
  showToast(I18N.t('toast_added'));
}

function removeFromCart(productId) {
  let cart = readCart();
  cart = cart.filter(i => i.id !== productId);
  writeCart(cart);
}

function clearCart(confirmUsage = true) {
  if (confirmUsage && !confirm(I18N.t('confirm_clear'))) return;
  writeCart([]);
  showToast(I18N.t('toast_cleared'));
}

function getCartTotals() {
  const cart = readCart();
  const items = cart.reduce((s, it) => s + it.qty, 0);
  const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
  return { items, total };
}

function updateNavCartCount() {
  const { items } = getCartTotals();
  document.querySelectorAll('#nav-cart-count, #nav-cart-count-2, #nav-cart-count-3').forEach(el => el.textContent = items);
}

/* simple ephemeral toast */
function showToast(msg) {
  const $t = $(`<div class="position-fixed bottom-0 end-0 p-3" style="z-index:1050"><div class="toast align-items-center text-bg-dark border-0 show"><div class="d-flex"><div class="toast-body">${msg}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div></div></div>`);
  $('body').append($t);
  setTimeout(()=> $t.fadeOut(300, ()=> $t.remove()), 2200);
}

/* Page initializers */
function initPage(page) {
  // init i18n and theme (they will attach handlers)
  I18N.init();
  THEME.init();

  // set years
  document.querySelectorAll('#year, #year-2, #year-3, #year-4').forEach(el => el.textContent = new Date().getFullYear());
  updateNavCartCount();

  // wire language selector initial value across pages
  document.querySelectorAll('#lang-select').forEach(sel => sel.value = I18N.current());

  // page-specific
  if (page === 'home') {
    renderFeatured();
  }
  if (page === 'products') {
    renderProductsPage();
    $('#search-input').on('input', filterProductsFromInputs);
    $('#category-select').on('change', filterProductsFromInputs);
  }
  if (page === 'cart') {
    renderCartPage();
    $('#clear-cart').on('click', ()=> { clearCart(true); renderCartPage(); });
    $('#checkout-btn').on('click', ()=> { const modal = new bootstrap.Modal(document.getElementById('checkoutModal')); modal.show(); });
  }
  if (page === 'login') {
    setupLoginForm();
  }

  // hook to re-apply dynamic strings after language change
  window.onLanguageApplied = function () {
    // any dynamic recalculations necessary after language switch:
    // update placeholders, product prices remain numeric so no change
    // re-render product lists to ensure buttons with text are localized (they are rendered with i18n)
    if ($('#featured-row').length) renderFeatured();
    if ($('#products-grid').length) {
      // reuse current filter state
      filterProductsFromInputs();
    }
    if ($('#cart-area').length) renderCartPage();
  };
}

/* HOME - featured */
function renderFeatured() {
  const featured = PRODUCTS.slice(0, 3);
  const $row = $('#featured-row').empty();
  featured.forEach(p => {
    const col = `<div class="col-md-4">
      <div class="card product-card">
        <img src="${p.image}" class="card-img-top" alt="${escapeHtml(p.name)}">
        <div class="card-body">
          <h5 class="card-title">${escapeHtml(p.name)}</h5>
          <p class="card-text text-muted">$${p.price.toFixed(2)}</p>
          <div class="d-flex gap-2">
            <a href="products.html" class="btn btn-outline-secondary btn-sm">${I18N.t('view_all') === 'View All Products' ? 'View' : I18N.t('view_all')}</a>
            <button class="btn btn-warning btn-sm" onclick="addToCart('${p.id}')">${I18N.t('sign_in_btn') === 'Sign In' ? 'Add to Cart' : (I18N.t('sign_in_btn'))}</button>
          </div>
        </div>
      </div>
    </div>`;
    $row.append(col);
  });
}

/* PRODUCTS page render & filtering */
function renderProductsPage() {
  renderProducts(PRODUCTS);
}
function renderProducts(list) {
  const $grid = $('#products-grid').empty();
  if (!list.length) {
    $grid.append(`<div class="col-12 text-center py-5"><p class="lead">${I18N.t('no_products') || I18N.t('view_all')}</p></div>`);
    return;
  }
  list.forEach(p => {
    const col = `<div class="col-12 col-md-6 col-lg-4">
      <div class="card product-card h-100">
        <img src="${p.image}" class="card-img-top" alt="${escapeHtml(p.name)}" />
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${escapeHtml(p.name)}</h5>
          <p class="card-text text-muted mb-3">$${p.price.toFixed(2)}</p>
          <div class="mt-auto d-flex gap-2">
            <button class="btn btn-outline-secondary" onclick="viewProduct('${p.id}')">${I18N.t('view_all') === 'View All Products' ? 'View' : I18N.t('view_all')}</button>
            <button class="btn btn-warning" onclick="addToCart('${p.id}')">${I18N.t('sign_in_btn') === 'Sign In' ? 'Add to Cart' : I18N.t('sign_in_btn')}</button>
          </div>
        </div>
      </div>
    </div>`;
    $grid.append(col);
  });
}

function filterProductsFromInputs() {
  const query = ($('#search-input').val() || '').trim().toLowerCase();
  const category = $('#category-select').val();
  let res = PRODUCTS.filter(p => {
    if (query && !p.name.toLowerCase().includes(query)) return false;
    if (category && category !== 'all' && p.category !== category) return false;
    return true;
  });
  renderProducts(res);
}

/* CART page rendering */
function renderCartPage() {
  const cart = readCart();
  if (!cart.length) {
    $('#cart-area').addClass('d-none');
    $('#cart-empty').removeClass('d-none');
    updateNavCartCount();
    return;
  }
  $('#cart-empty').addClass('d-none');
  $('#cart-area').removeClass('d-none');

  const $items = $('#cart-items').empty();
  cart.forEach(it => {
    const el = $(`
      <div class="list-group-item d-flex gap-3 align-items-center">
        <img src="${it.image}" alt="" style="width:84px;height:64px;object-fit:cover;border-radius:6px;">
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between">
            <div>
              <div class="fw-semibold">${escapeHtml(it.name)}</div>
              <div class="text-muted small">$${it.price.toFixed(2)} each</div>
            </div>
            <div class="text-end">
              <div class="fw-bold">$${(it.price * it.qty).toFixed(2)}</div>
              <div class="small text-muted">${it.qty} pcs</div>
            </div>
          </div>
          <div class="mt-2 d-flex gap-2">
            <button class="btn btn-sm btn-outline-secondary" onclick="decrementQty('${it.id}')">−</button>
            <button class="btn btn-sm btn-outline-secondary" onclick="incrementQty('${it.id}')">+</button>
            <button class="btn btn-sm btn-outline-danger ms-auto" onclick="removeFromCartAndRerender('${it.id}')">${I18N.t('clear_cart')}</button>
          </div>
        </div>
      </div>
    `);
    $items.append(el);
  });

  const totals = getCartTotals();
  $('#cart-items-count').text(totals.items);
  $('#cart-subtotal').text('$' + totals.total.toFixed(2));
  updateNavCartCount();
}

function incrementQty(id) {
  const cart = readCart();
  const item = cart.find(i => i.id === id);
  if (item) { item.qty += 1; writeCart(cart); renderCartPage(); }
}
function decrementQty(id) {
  const cart = readCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = Math.max(1, item.qty - 1);
    writeCart(cart);
    renderCartPage();
  }
}
function removeFromCartAndRerender(id) { removeFromCart(id); renderCartPage(); }

/* Simple product view (opens products page anchored) */
function viewProduct(id) {
  // For this static demo, navigate to products page and highlight product via localStorage
  localStorage.setItem('furni_scroll_to', id);
  location.href = 'products.html';
}

/* LOGIN form handlers (simple client-side validation + mock auth) */
function setupLoginForm() {
  $('#login-form').on('submit', function (e) {
    e.preventDefault();
    const email = $('#login-email').val().trim();
    const pwd = $('#login-password').val();
    if (!validateEmail(email)) {
      showAuthMessage(I18N.t('email_invalid'), 'danger'); $('#login-email').addClass('is-invalid'); return;
    } else { $('#login-email').removeClass('is-invalid'); }
    if (pwd.length < 6) {
      showAuthMessage(I18N.t('password_invalid'), 'danger'); $('#login-password').addClass('is-invalid'); return;
    } else { $('#login-password').removeClass('is-invalid'); }

    // Mock login success
    showAuthMessage(I18N.t('success_login'), 'success');
    setTimeout(()=> { location.href = 'index.html'; }, 900);
  });
}

function showAuthMessage(txt, type) {
  const $m = $('#auth-message');
  $m.removeClass('d-none alert-success alert-danger').addClass('alert-' + (type === 'success' ? 'success' : 'danger')).text(txt).removeClass('d-none');
}

/* small utilities */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (m) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; }); }

/* Auto-run to highlight product after viewProduct() */
$(function(){
  const scrollTo = localStorage.getItem('furni_scroll_to');
  if (scrollTo && $('#products-grid').length) {
    setTimeout(()=> {
      const el = $(`[onclick="addToCart('${scrollTo}')"]`).closest('.col-12');
      if (el.length) {
        $('html,body').animate({ scrollTop: el.offset().top - 80 }, 500);
        el.addClass('border border-warning rounded-3');
        setTimeout(()=> el.removeClass('border border-warning rounded-3'), 2400);
      }
      localStorage.removeItem('furni_scroll_to');
    }, 300);
  }
});

/* initial rendering for products list on page load (if page has products-grid) */
$(function(){
  if ($('#products-grid').length && $('#products-grid').children().length === 0) {
    // first-time render
    renderProducts(PRODUCTS);
  }
});
