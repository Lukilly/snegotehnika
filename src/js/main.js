import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, Scrollbar } from 'swiper/modules';

import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

import 'swiper/css';

Fancybox.bind("[data-fancybox]", {
  dragToClose: false,
});


// side-navigation
const sideNavigationBtn = document.querySelector('.side__navigation__close')
const sideNavigationContent = document.querySelector('.side__navigation')
sideNavigationBtn.addEventListener('click', () => {
  sideNavigationContent.classList.toggle('hide')
})



// Cart
let cartCount = 0;
const cartCountElement = document.querySelector('.cart-count')
const addToCartButton = document.querySelector('.header__catalog__toggle')
addToCartButton.addEventListener('click', () => {
  cartCount++;
  cartCountElement.textContent = cartCount

  if (cartCount > 0) {
    cartCountElement.classList.add('has-items')
  }
});


// Header search placeholder
const searchInput = document.querySelector('.header-search-form input');
const defaultPlaceholder = 'Введите фразу для поиска';
const mobilePlaceholder = 'Поиск';

const updateSearchPlaceholder = () => {
  searchInput.placeholder = window.innerWidth <= 430 ? mobilePlaceholder : defaultPlaceholder;
};

updateSearchPlaceholder();
window.addEventListener('resize', updateSearchPlaceholder);



// Scroll lock
const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
};

const unlockBodyScroll = () => {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
};

const syncScrollLock = () => {
  if (
    MenuSidebar.classList.contains('active') ||
    CatalogInner.classList.contains('active')
  ) {
    lockBodyScroll();
  } else {
    unlockBodyScroll();
  }
};

// Menu
const MenuBtn = document.querySelector('.header__menu__btn')
const MenuSidebar = document.querySelector('.header__menu__sidebar')

MenuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  MenuBtn.classList.toggle('active');
  MenuSidebar.classList.toggle('active');

  CatalogBurger.classList.remove('active');
  CatalogInner.classList.remove('active');
  syncScrollLock();
});

document.addEventListener('click', (e) => {
  if (
    !MenuBtn.contains(e.target) &&
    !MenuSidebar.contains(e.target)
  ) {
    MenuBtn.classList.remove('active');
    MenuSidebar.classList.remove('active');
    syncScrollLock();
  }
});



// Catalog
const CatalogBurger = document.querySelector('.header__catalog__toggle');
const CatalogInner = document.querySelector('.header__catalog__dropdown')
const CatalogMore = document.querySelector('.header__catalog__content');
const items = document.querySelectorAll('.header__catalog__item');
const panels = document.querySelectorAll('.header__catalog__panel');
// Открытие каталога
CatalogBurger.addEventListener('click', () => {
  CatalogBurger.classList.toggle('active');
  CatalogInner.classList.toggle('active');

  MenuBtn.classList.remove('active');
  MenuSidebar.classList.remove('active');
  syncScrollLock();
});
// Закрытие каталога при нажатии вне каталога
document.addEventListener("click", (e) =>{
  if (
    !CatalogBurger.contains(e.target) &&
    !CatalogInner.contains(e.target)
  ) {
    CatalogBurger.classList.remove('active');
    CatalogInner.classList.remove('active');
    syncScrollLock();
  }
});

function openMobile(item) {
  syncScrollLock();
  const id = item.dataset.category;
  const panel = document.getElementById(id);
  if (item.classList.contains("active")) {
      item.classList.remove("active");
      panel.classList.remove("active");
      CatalogMore.append(panel);
      items.forEach(el => {
          el.classList.remove("hidden");
      });
      return;
  }
  items.forEach(el => {
      el.classList.remove("active");
      el.classList.remove("hidden");
  });
  panels.forEach(el => {
      el.classList.remove("active");
  });
  item.classList.add("active");
  panel.classList.add("active");
  item.after(panel);
  items.forEach(el => {
      if (el !== item) {
          el.classList.add("hidden");
      }
  });

}

function openDesktop(item) {
  const id = item.dataset.category;
  const panel = document.getElementById(id);
  items.forEach(el => el.classList.remove("active"));
  panels.forEach(el => el.classList.remove("active"));
  item.classList.add("active");
  CatalogMore.classList.add("active");
  panel.classList.add("active");
}

items.forEach(item => {
  item.addEventListener("mouseenter", () => {
    if (window.innerWidth > 992) {
      openDesktop(item);
    }
  })

  item.addEventListener("click", (e) => {
    e.stopPropagation();
    if (window.innerWidth > 992) {
      openDesktop(item);
    } else {
      openMobile(item);
    }
  })
})

// Offers__swiper
const dartContainerRef =
  document.querySelector(".dart_footer .dart-container") ||
  document.querySelector(".dart-container");

const getSliderOffset = () => {
  if (!dartContainerRef) return 0;
  const rect = dartContainerRef.getBoundingClientRect();
  const paddingLeft = parseFloat(getComputedStyle(dartContainerRef).paddingLeft) || 0;
  return rect.left + paddingLeft;
};

const onResize = (fn) => {
  let raf = null;
  return () => {
    if (raf !== null) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      fn();
    });
  };
};

const swiperEl = document.querySelector('.swiper');
if (swiperEl) {
  const applySwiperOffset = () => {
    swiperEl.style.setProperty("--slides-offset", `${getSliderOffset()}px`);
  };

  applySwiperOffset();

  const swiper = new Swiper(swiperEl, {
    direction: 'horizontal',
    spaceBetween: 22,
    loop: true,
    slidesPerView: 'auto',
    modules:[Navigation],
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  window.addEventListener("resize", onResize(applySwiperOffset));
}

// slider catalog
const sliderCards = document.querySelectorAll(".swiper__catalog");
if (sliderCards.length > 0) {
  sliderCards.forEach((sliderCard) => {
    const applySliderOffset = (swiperCard) => {
      const offset = getSliderOffset();
      sliderCard.style.setProperty("--slides-offset", `${offset}px`);
      if (!swiperCard) return;
      swiperCard.params.slidesOffsetBefore = offset;
      swiperCard.update();
    };

    applySliderOffset();

    const swiperCard = new Swiper(sliderCard, {
      slidesOffsetBefore: getSliderOffset(),
      slidesPerView: 'auto',
      modules: [Scrollbar],
      scrollbar: {
        el: sliderCard.parentElement.querySelector(".swiper__catalog-scrollbar"),
        draggable: true,
        hide: false,
      },
      breakpoints: {
        1800: { spaceBetween: 20, allowTouchMove: false, scrollbar: false },
        1200: { spaceBetween: 18, allowTouchMove: true, scrollbar: false },
        991: { spaceBetween: 14 },
        768: { spaceBetween: 12 },
        0: { spaceBetween: 10 },
      },
    });

    window.addEventListener("resize", onResize(() => applySliderOffset(swiperCard)));
  });
}

// swiper__new__blokcs
const newBlocksSwipers = document.querySelectorAll(".swiper__new__blocks");
newBlocksSwipers.forEach((slider) => {
  new Swiper(slider, {
    spaceBetween: 22,
    breakpoints: {
      1800: { slidesPerView: 4 },
      1200: { slidesPerView: 3 },
      991: { slidesPerView: 2.4 },
      768: { slidesPerView: 2, spaceBetween: 20 },
      0: { slidesPerView: 1.2, spaceBetween: 14 },
    },
  });
});

// swipers__product-card__features
const sliders = document.querySelectorAll('[data-slider]')
sliders.forEach((slider) => {
  const sliderName = slider.dataset.slider;
  let scope = slider.closest('.product-card__features__item') || slider.parentElement;
  if (slider.closest('.wholesale')) {
    while (
      scope &&
      scope.tagName !== 'BODY' &&
      !scope.querySelector(`[data-slider-prev="${sliderName}"]`) &&
      !scope.querySelector(`[data-slider-next="${sliderName}"]`)
    ) {
      scope = scope.parentElement;
    }
  }
  const next = scope.querySelector(`[data-slider-next="${sliderName}"]`)
  const prev = scope.querySelector(`[data-slider-prev="${sliderName}"]`)
  const panel = slider.closest('[data-tab__content]');
  const scrollbarScope = (panel && slider.closest('.wholesale')) ? panel : scope;
  const scrollbar = scrollbarScope.querySelector(`[data-scrollbar="${sliderName}"]`)
  const slidesCount = slider.querySelectorAll('.swiper-slide').length;

  const isTabs = slider.closest('.product-card__tabs');

  const updateTabsArrows = () => {
    if (!isTabs || !next || !prev) return;
    const fitsAll = slidesCount <= 4 && window.innerWidth >= 1800;
    next.style.display = fitsAll ? 'none' : '';
    prev.style.display = fitsAll ? 'none' : '';
  };

  const isProductsSlider = slider.classList.contains('swiper__product-card__products');

  updateTabsArrows();
  window.addEventListener('resize', onResize(updateTabsArrows));

  new Swiper(slider, {
    spaceBetween: 22,
    modules: [Navigation, Scrollbar],
    navigation: {
      nextEl: next,
      prevEl: prev,
    },
    scrollbar: {
      el: scrollbar,
      draggable: true,
    },
    breakpoints: {
      1800: {slidesPerView: slider.classList.contains('swiper__images__intro') ? 3 : 4,},
      1200: {slidesPerView: 3},
      991: {slidesPerView: 2.4},
      768: {slidesPerView: 'auto', spaceBetween: 22},
      0: {slidesPerView: 'auto', spaceBetween: 14}
    }
  });
});

// wholesale shared photo-gallery buttons: advance only the active panel's swiper
const wholesaleBtns = document.querySelectorAll('.wholesale__photo-gallery [data-slider-next="photo-gallery"], .wholesale__photo-gallery [data-slider-prev="photo-gallery"]');
wholesaleBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopImmediatePropagation();
    const key = btn.dataset.sliderNext ? 'next' : 'prev';
    const activePanel = document.querySelector('.wholesale__photo-gallery__swiper[data-tab__content]:not([style*="display: none"])');
    if (!activePanel) return;
    const sl = activePanel.querySelector('[data-slider="photo-gallery"]');
    if (sl && sl.swiper) key === 'next' ? sl.swiper.slideNext() : sl.swiper.slidePrev();
  }, true);
});

// Product-card__set__list

// чтобы не переходило на fancybox при клике на ссылку
const featuresLinks = document.querySelectorAll('.swiper__product-card__features .video__container a');
featuresLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.stopPropagation();
  });
});

// Video
const videoBlocks = document.querySelectorAll('.video__container');

videoBlocks.forEach((block) => {
  const video = block.querySelector('.video__item');
  const playButton = block.querySelector('.video__play');
  const isFancybox = block.hasAttribute('data-fancybox');

  playButton.addEventListener('click', (event) => {
    if (isFancybox) return;
    event.stopPropagation();

    video.play();
    playButton.style.opacity = '0';
  });

  video.addEventListener('click', () => {
    if (isFancybox) return;
    if (video.paused) {
      video.play();
      playButton.style.opacity = '0';
    } else {
      video.pause();
      playButton.style.opacity = '1';
    }
  });
});

// Catalog__sort
const catalogSortSelect = document.querySelector('.catalog__sort__select');
const catalogSortItems = document.querySelectorAll('.catalog__sorting__item');
let catalogSortToggled = false;

const closeCatalogSort = () => {
  catalogSortSelect?.classList.remove('catalog__sort__select--open');
  catalogSortToggled = false;
};

catalogSortItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    const hasArrow = item.classList.contains('catalog__sorting__item--choice');
    const isActive = item.classList.contains('active');

    if (isActive) {
      if (catalogSortSelect?.classList.contains('catalog__sort__select--open')) {
        closeCatalogSort();
        return;
      }
      if (hasArrow && !catalogSortToggled) {
        catalogSortToggled = true;
        item.classList.toggle('sort-desc');
        return;
      }
      catalogSortSelect?.classList.add('catalog__sort__select--open');
      return;
    }

    catalogSortItems.forEach((el) => {
      el.classList.remove('active', 'sort-desc');
    });
    item.classList.add('active');
    closeCatalogSort();
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.catalog__sort__select')) {
    closeCatalogSort();
  }
});

// Accordion
const accordionItems = document.querySelectorAll('.accordion__item');
const accordion = document.querySelector('.accordion');

if (accordion && accordionItems.length > 0) {
  const setActiveAccordion = (index) => {
    accordionItems.forEach((el, i) => el.classList.toggle('active', i === index));
  };

  setActiveAccordion(0);

  accordionItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth > 991) {
        setActiveAccordion(index);
      }
    });

    item.querySelector('.accordion__button').addEventListener('click', () => {
      accordionItems.forEach((el) => el.classList.remove('active'));
      item.classList.add('active');
    });
  });

  accordion.addEventListener('mouseleave', () => {
    if (window.innerWidth > 991) {
      setActiveAccordion(0);
    }
  });
}

// product-card__questions / reviews expand-collapse
const facAnswers = document.querySelectorAll('.product-card__fac__answer, .product-card__reviews__item');
facAnswers.forEach(answer => {
  const text = answer.querySelector('.product-card__fac__answer__container p, .product-card__reviews__item > p');
  const expand = answer.querySelector('.faq__expand:not(.faq__expand--collapse)');
  if (text && expand && text.scrollHeight <= text.clientHeight) {
    expand.style.display = 'none';
  }
});
const expandButtons = document.querySelectorAll('.faq__expand:not(.faq__expand--collapse)');
expandButtons.forEach(button =>{
  button.addEventListener('click', () => {
    const item = button.closest('.product-card__fac__answer, .product-card__reviews__item');
    item.classList.add('active');
  });
});
const collapseButtons = document.querySelectorAll('.faq__expand--collapse');
collapseButtons.forEach(button =>{
  button.addEventListener('click', () => {
    const item = button.closest('.product-card__fac__answer, .product-card__reviews__item');
    item.classList.remove('active');
  });
});

// cart__buttons
const deliveryButtons = document.querySelectorAll('.delivery-choice__button');
deliveryButtons.forEach(button => {
    button.addEventListener('click', () => {
        deliveryButtons.forEach(item => {
            item.classList.remove('active');
        });
        button.classList.add('active');
    });
});

const paymentButtons = document.querySelectorAll('.payment-choice__button');
paymentButtons.forEach(button => {
    button.addEventListener('click', () => {
        paymentButtons.forEach(item => {
            item.classList.remove('active');
        });
        button.classList.add('active');
    });
});

// cart__payment__promocode button active state
const promocodeInput = document.querySelector('.cart__payment__promocode input');
const promocodeButton = document.querySelector('.cart__payment__promocode button');
if (promocodeInput && promocodeButton) {
  promocodeInput.addEventListener('input', () => {
    promocodeButton.classList.toggle('active', promocodeInput.value.trim().length > 0);
  });
}

// Cart__total__price
const formatCartPrice = (value) => value.toLocaleString('ru-RU').replace(/\s/g, '\u00A0');

const parseCartPrice = (text) => Number(text.replace(/[^0-9]/g, ''));

const recalcCartTotal = () => {
  let productsTotal = 0;
  document.querySelectorAll('.cart__product').forEach((product) => {
    const qty = Number(product.querySelector('.quantity-value').textContent) || 0;
    const price = parseCartPrice(product.querySelector('.cart__product__right__price span').textContent);
    productsTotal += qty * price;
  });

  const delivery = parseCartPrice(deliverySumEl ? deliverySumEl.textContent : '0');
  productsSumEl.textContent = formatCartPrice(productsTotal);
  totalSumEl.textContent = formatCartPrice(productsTotal + delivery);
};

const cartProducts = document.querySelectorAll('.cart__product');
const productsSumEl = document.querySelector('[data-cart-products-sum]');
const deliverySumEl = document.querySelector('[data-cart-delivery-sum]');
const totalSumEl = document.querySelector('[data-cart-total-sum]');

if (cartProducts.length > 0 && productsSumEl && totalSumEl) {
  cartProducts.forEach((product) => {
    const qtyEl = product.querySelector('.quantity-value');
    const minusBtn = product.querySelector('.quantity-minus');
    const plusBtn = product.querySelector('.quantity-plus');

    const changeQty = (delta) => {
      qtyEl.textContent = Math.max(1, (Number(qtyEl.textContent) || 1) + delta);
      recalcCartTotal();
    };

    minusBtn.addEventListener('click', () => changeQty(-1));
    plusBtn.addEventListener('click', () => changeQty(1));

    product.querySelector('.cart__product__right__container button').addEventListener('click', () => {
      product.remove();
      recalcCartTotal();
    });
  });

  recalcCartTotal();
}

const clearCartBtn = document.querySelector('.cart__top__button');
if (clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    document.querySelectorAll('.cart__product').forEach((product) => product.remove());
    recalcCartTotal();
  });
}


// Scroll__footer
const scrollTopButton = document.querySelector('[data-scroll-top]');

scrollTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

// tabs mobile dropdown + tab switching
const initTabsNav = (navSelector, itemSelector, openClass) => {
  const nav = document.querySelector(navSelector);
  if (!nav) return;
  const items = Array.from(nav.querySelectorAll(itemSelector));
  let scope = nav.parentElement;
  while (scope && !scope.querySelector('[data-tab__content]')) {
    scope = scope.parentElement;
  }
  const panels = scope ? Array.from(scope.querySelectorAll('[data-tab__content]')) : [];

  const selectTab = (target) => {
    items.forEach((it) => it.classList.toggle('active', it === target));
    nav.classList.remove(openClass);
    const key = target.getAttribute('data-tab');
    let shownPanel = null;
    panels.forEach((panel) => {
      const show = panel.getAttribute('data-tab__content') === key;
      panel.style.display = show ? '' : 'none';
      if (show) shownPanel = panel;
      if (!show) {
        panel.querySelectorAll('[data-slider]').forEach((sl) => {
          if (sl.swiper) sl.swiper.slideTo(0, 0);
        });
      }
    });
    if (shownPanel) {
      requestAnimationFrame(() => {
        shownPanel.querySelectorAll('[data-slider]').forEach((sl) => {
          if (sl.swiper) sl.swiper.update();
        });
      });
    }
  };

  nav.addEventListener('click', (e) => {
    const btn = e.target.closest(itemSelector);
    if (!btn) return;
    if (btn.classList.contains('active') && !nav.classList.contains(openClass)) {
      nav.classList.add(openClass);
      return;
    }
    selectTab(btn);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest(navSelector)) {
      nav.classList.remove(openClass);
    }
  });

  const initialTab = items.find((it) => it.classList.contains('active')) || items[0];
  if (initialTab) selectTab(initialTab);
};

initTabsNav('.product-card__tabs__nav', '.product-card__tabs__nav__item', 'product-card__tabs__nav--open');
initTabsNav('.delivery__tabs__nav', '.delivery__tabs__nav__item', 'delivery__tabs__nav--open');
initTabsNav('.wholesale__photo-gallery__tabs__nav', '.wholesale__photo-gallery__tabs__nav__item', 'wholesale__photo-gallery__tabs__nav--open');
initTabsNav('.contacts__tabs__nav', '.contacts__tabs__nav__item', 'contacts__tabs__nav--open');

// авто-высота textarea (растёт при вводе)
const autoResizeTextareas = (root) => {
  if (!root) return;
  const TAs = Array.from(root.querySelectorAll('textarea'));
  const APPLY_ROWS = () => {
    const rows = window.innerWidth <= 768 ? 3 : 5;
    TAs.forEach((ta) => {
      ta.rows = rows;
    });
  };
  const autoResize = (ta) => {
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  };
  APPLY_ROWS();
  TAs.forEach((ta) => {
    autoResize(ta);
    ta.addEventListener('input', () => autoResize(ta));
  });
  window.addEventListener('resize', () => {
    APPLY_ROWS();
    TAs.forEach((ta) => autoResize(ta));
  });
};
autoResizeTextareas(document.querySelector('.contacts__support__inputs'));

// подсветка активного пункта меню в шапке под текущую страницу
const highlightActiveNavLink = () => {
  const currentHref = new URL(location.href).pathname.replace(/\/+$/, '');
  document.querySelectorAll('.navigation .nav__link').forEach((link) => {
    const linkHref = new URL(link.href, location.href).pathname.replace(/\/+$/, '');
    link.classList.toggle('active', linkHref === currentHref);
  });
};
highlightActiveNavLink();

// синхронизация кастомной полосы прокрутки списка «Рассчитайте цену за комплект»
const setScrollbars = document.querySelectorAll('[data-set-scrollbar]');
setScrollbars.forEach((scrollbar) => {
  const wrapper = scrollbar.closest('.product-card__set__list-wrapper');
  const list = wrapper && wrapper.querySelector('.product-card__set__list');
  const drag = scrollbar.querySelector('.product-card__set__list__scrollbar__drag');
  if (!list || !drag) return;

  const updateScrollbar = () => {
    const maxScroll = list.scrollWidth - list.clientWidth;
    if (maxScroll <= 0) {
      drag.style.width = '0%';
      return;
    }
    const trackWidth = scrollbar.clientWidth;
    const dragWidth = Math.max((list.clientWidth / list.scrollWidth) * trackWidth, 40);
    drag.style.width = `${dragWidth}px`;
    const progress = list.scrollLeft / maxScroll;
    drag.style.transform = `translateX(${(trackWidth - dragWidth) * progress}px)`;
  };

  list.addEventListener('scroll', updateScrollbar, {passive: true});
  window.addEventListener('resize', updateScrollbar);
  requestAnimationFrame(updateScrollbar);

  scrollbar.addEventListener('click', (event) => {
    if (event.target === drag) return;
    const rect = scrollbar.getBoundingClientRect();
    const trackWidth = scrollbar.clientWidth;
    const dragWidth = parseFloat(drag.style.width) || 40;
    const pos = (event.clientX - rect.left);
    const progress = (pos - dragWidth / 2) / (trackWidth - dragWidth);
    list.scrollLeft = Math.max(0, Math.min(1, progress)) * (list.scrollWidth - list.clientWidth);
  });
});
