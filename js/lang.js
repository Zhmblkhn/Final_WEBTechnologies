// js/lang.js
// Simple i18n utility using data-i18n attributes + placeholders
// Persists language in localStorage ('furni_lang')

const I18N = (function(){
  const TRANSLATIONS = {
    en: {
      title_home: "Furni — Home",
      title_products: "Furni — Products",
      title_cart: "Furni — Cart",
      title_login: "Furni — Login",
      nav_home: "Home",
      nav_products: "Products",
      nav_cart: "Cart",
      nav_login: "Login",
      hero_title: "Transform Your Space",
      hero_sub: "Discover elegant furniture that brings comfort and style to your home",
      hero_cta: "Shop Now",
      carousel_1_title: "New Arrivals",
      carousel_1_sub: "Handcrafted pieces — limited stock",
      carousel_2_title: "Comfort & Style",
      carousel_2_sub: "Ergonomic sofas designed for modern living",
      carousel_3_title: "Free Delivery",
      carousel_3_sub: "Fast and secure shipping to your doorstep",
      prev: "Previous",
      next: "Next",
      featured_title: "Featured Products",
      view_all: "View All Products",
      rights: "All rights reserved.",
      contact: "Contact",
      privacy: "Privacy",
      terms: "Terms",
      products_title: "Our Collection",
      search_placeholder: "Search furniture...",
      cat_all: "All",
      cat_sofa: "Sofa",
      cat_chair: "Chair",
      cat_table: "Table",
      cat_bed: "Bed",
      cat_lighting: "Lighting",
      cart_title: "Shopping Cart",
      cart_empty: "Your cart is empty",
      continue_shopping: "Continue Shopping",
      clear_cart: "Clear Cart",
      order_summary: "Order Summary",
      subtotal: "Subtotal",
      shipping_free: "FREE",
      proceed_checkout: "Proceed to Checkout",
      coming_soon: "Coming Soon",
      checkout_not_ready: "Sorry, we haven't set up the checkout process yet. This feature is coming soon!",
      close: "Close",
      sign_in: "Sign In",
      email_label: "Email",
      password_label: "Password",
      email_invalid: "Please enter a valid email",
      password_invalid: "Password must be at least 6 characters",
      sign_in_btn: "Sign In",
      continue_as_guest: "Continue as guest",
      toast_added: "Product added to cart",
      toast_cleared: "Cart cleared",
      confirm_clear: "Are you sure you want to clear the cart?",
      added_not_found: "Product not found",
      success_login: "Login successful — redirecting..."
    },
    ru: {
      title_home: "Furni — Главная",
      title_products: "Furni — Товары",
      title_cart: "Furni — Корзина",
      title_login: "Furni — Вход",
      nav_home: "Главная",
      nav_products: "Товары",
      nav_cart: "Корзина",
      nav_login: "Вход",
      hero_title: "Преобразите своё пространство",
      hero_sub: "Найдите элегантную мебель для уюта и стиля дома",
      hero_cta: "Купить сейчас",
      carousel_1_title: "Новые поступления",
      carousel_1_sub: "Ручная работа — ограниченный тираж",
      carousel_2_title: "Комфорт и стиль",
      carousel_2_sub: "Эргономичные диваны для современной жизни",
      carousel_3_title: "Бесплатная доставка",
      carousel_3_sub: "Быстрая и надёжная доставка до двери",
      prev: "Назад",
      next: "Вперёд",
      featured_title: "Рекомендуем",
      view_all: "Посмотреть все товары",
      rights: "Все права защищены.",
      contact: "Контакты",
      privacy: "Политика конфиденциальности",
      terms: "Условия",
      products_title: "Наша коллекция",
      search_placeholder: "Поиск мебели...",
      cat_all: "Все",
      cat_sofa: "Диван",
      cat_chair: "Стул",
      cat_table: "Стол",
      cat_bed: "Кровать",
      cat_lighting: "Освещение",
      cart_title: "Корзина",
      cart_empty: "Ваша корзина пуста",
      continue_shopping: "Продолжить покупки",
      clear_cart: "Очистить корзину",
      order_summary: "Итог заказа",
      subtotal: "Промежуточный итог",
      shipping_free: "БЕСПЛАТНО",
      proceed_checkout: "Перейти к оплате",
      coming_soon: "Скоро",
      checkout_not_ready: "Извините, мы пока не настроили процесс оформления заказа. Скоро появится!",
      close: "Закрыть",
      sign_in: "Войти",
      email_label: "Email",
      password_label: "Пароль",
      email_invalid: "Введите корректный email",
      password_invalid: "Пароль минимум 6 символов",
      sign_in_btn: "Войти",
      continue_as_guest: "Продолжить как гость",
      toast_added: "Товар добавлен в корзину",
      toast_cleared: "Корзина очищена",
      confirm_clear: "Вы уверены, что хотите очистить корзину?",
      added_not_found: "Товар не найден",
      success_login: "Вход успешен — перенаправление..."
    }
  };

  const LS_KEY = 'furni_lang';
  let lang = localStorage.getItem(LS_KEY) || (navigator.language && navigator.language.startsWith('ru') ? 'ru' : 'en');

  function t(key) {
    return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) ? TRANSLATIONS[lang][key] : key;
  }

  function apply() {
    // document title
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      const text = t(k);
      if (el.tagName.toLowerCase() === 'title') {
        document.title = text;
      } else {
        el.textContent = text;
      }
    });
    // placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const k = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', t(k));
    });
    // update any dynamic text that core.js may set via I18N.t
    if (window.onLanguageApplied) window.onLanguageApplied(lang);
  }

  function setLang(l) {
    if (!TRANSLATIONS[l]) return;
    lang = l;
    localStorage.setItem(LS_KEY, l);
    // set html lang attribute
    document.documentElement.lang = l === 'ru' ? 'ru' : 'en';
    apply();
  }

  function init() {
    // set selector if present
    document.querySelectorAll('#lang-select').forEach(sel => {
      sel.value = lang;
      sel.addEventListener('change', (e) => setLang(e.target.value));
    });
    apply();
  }

  return { init, setLang, t, current: () => lang };
})();
