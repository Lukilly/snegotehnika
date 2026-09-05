import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, Scrollbar, Mousewheel } from 'swiper/modules';

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

  window.addEventListener("resize", applySwiperOffset);
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

    window.addEventListener("resize", () => applySliderOffset(swiperCard));
  });
}

// swipers__product-card__features
const sliders = document.querySelectorAll('[data-slider]')
sliders.forEach((slider) => {
  const sliderName = slider.dataset.slider;
  const scope = slider.closest('.product-card__features__item') || slider.parentElement;
  const next = scope.querySelector(`[data-slider-next="${sliderName}"]`)
  const prev = scope.querySelector(`[data-slider-prev="${sliderName}"]`)
  const scrollbar = scope.querySelector(`[data-scrollbar="${sliderName}"]`)
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
  window.addEventListener('resize', updateTabsArrows);

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
      1800: {slidesPerView: sliderName === 'product__intro' ? 3 : 4,},
      1200: {slidesPerView: 3},
      991: {slidesPerView: 2.4},
      768: {slidesPerView: 'auto', spaceBetween: 22},
      0: {slidesPerView: 'auto', spaceBetween: 14}
    }
  });
});

// Product-card__set__Swiper
const setSwiperEl = document.querySelector('.product-card__set__swiper');

if (setSwiperEl) {
  const swiper = new Swiper(setSwiperEl, {
  loop: false,
  modules: [Mousewheel],
  breakpoints: {
    991: {
      direction: "vertical",
      slidesPerView: 'auto',
      spaceBetween: 0,
      watchOverflow: true,
      freeMode: { enabled: true, momentum: true, sticky: false },
      mousewheel: { enabled: true },
      allowTouchMove: true,
    },
    768: {
      direction: "horizontal",
      slidesPerView: 'auto',
      spaceBetween: 20,
      watchOverflow: true,
      freeMode: false,
      mousewheel: false,
      allowTouchMove: true,
    },
    0: {
      direction: "horizontal",
      slidesPerView: 'auto',
      spaceBetween: 18,
      watchOverflow: true,
      freeMode: false,
      mousewheel: false,
      allowTouchMove: true,
    }
  }
});

// не давать листать за последний ряд (карточки не должны уходить за wrapper)
  const setWrapperEl = setSwiperEl.querySelector('.swiper-wrapper');
const setScrollbarEl = setSwiperEl.querySelector('.swiper-scrollbar');
const setScrollbarDragEl = setSwiperEl.querySelector('.swiper-scrollbar-drag');

const isHorizontalSetSwiper = () => window.innerWidth < 991;

const getSetMaxScroll = () => {
  if (!setWrapperEl) return 0;
  if (isHorizontalSetSwiper()) {
    return Math.max(0, setWrapperEl.scrollWidth - setSwiperEl.clientWidth);
  }
  return Math.max(0, setWrapperEl.scrollHeight - setSwiperEl.clientHeight);
};

const updateSetScrollbar = () => {
  if (!setScrollbarEl || !setScrollbarDragEl) return;
  const max = getSetMaxScroll();
  const progress = max > 0 ? Math.min(1, Math.max(0, -swiper.translate / max)) : 0;

  if (isHorizontalSetSwiper()) {
    const trackW = setScrollbarEl.clientWidth;
    const thumbW = Math.max(20, trackW * (setSwiperEl.clientWidth / setWrapperEl.scrollWidth));
    setScrollbarDragEl.style.height = '';
    setScrollbarDragEl.style.width = `${thumbW}px`;
    setScrollbarDragEl.style.transform = `translateX(${Math.round((trackW - thumbW) * progress)}px)`;
    return;
  }

  const trackH = setScrollbarEl.clientHeight;
  const thumbH = Math.max(20, trackH * (setSwiperEl.clientHeight / setWrapperEl.scrollHeight));
  setScrollbarDragEl.style.width = '';
  setScrollbarDragEl.style.height = `${thumbH}px`;
  setScrollbarDragEl.style.transform = `translateY(${Math.round((trackH - thumbH) * progress)}px)`;
};

const clampSetSwiper = () => {
  if (isHorizontalSetSwiper()) return;
  const maxTranslate = getSetMaxScroll() + 70;
  if (swiper.translate > 0) {
    swiper.setTranslate(0);
  }
  if (swiper.translate < -maxTranslate) {
    swiper.setTranslate(-maxTranslate);
  }
  updateSetScrollbar();
};
swiper.on('setTranslate', clampSetSwiper);
swiper.on('init', updateSetScrollbar);
swiper.on('progress', updateSetScrollbar);
window.addEventListener('resize', () => {
  swiper.update();
  updateSetScrollbar();
});
window.addEventListener('load', updateSetScrollbar);
requestAnimationFrame(updateSetScrollbar);

// перетаскивание кастомного скроллбара
if (setScrollbarDragEl && setSwiperEl && setScrollbarEl) {
  const dragSet = (clientX, clientY) => {
    const isH = isHorizontalSetSwiper();
    const track = isH ? setScrollbarEl.clientWidth : setScrollbarEl.clientHeight;
    const thumb = isH ? setScrollbarDragEl.clientWidth : setScrollbarDragEl.clientHeight;
    const rect = setScrollbarEl.getBoundingClientRect();
    const pos = isH ? (clientX - rect.left) : (clientY - rect.top);
    const max = getSetMaxScroll();
    const ratio = max > 0 ? max / (track - thumb) : 0;
    const progress = Math.min(1, Math.max(0, (pos - thumb / 2) / (track - thumb)));
    swiper.setTranslate(-progress * max);
    updateSetScrollbar();
  };

  setScrollbarDragEl.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const onMove = (ev) => dragSet(ev.clientX, ev.clientY);
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  });

  setScrollbarEl.addEventListener('mousedown', (e) => {
    if (e.target === setScrollbarDragEl) return;
    dragSet(e.clientX, e.clientY);
  });
}
}

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

// product-card__set list scroll
const setListWrapper = document.querySelector('.product-card__set__list-wrapper');
if (setListWrapper) {
  setListWrapper.addEventListener('scroll', () => {
    setListWrapper.classList.toggle('is-scrolled', setListWrapper.scrollTop > 0);
  });
}

// product-card__set add/remove item
const setItems = document.querySelectorAll('.product-card__set__list__item');
setItems.forEach((item) => {
  const btn = item.querySelector('.product-card__set__list__item__icon__container');
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    item.classList.toggle('active');
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

// product-card__tabs mobile dropdown + tab switching
const tabsNav = document.querySelector('.product-card__tabs__nav');
if (tabsNav) {
  const tabsSection = tabsNav.closest('.product-card__tabs');
  const tabsItems = Array.from(tabsNav.querySelectorAll('.product-card__tabs__nav__item'));
  const tabsPanels = tabsSection ? Array.from(tabsSection.querySelectorAll('[data-tab__content]')) : [];

  const selectTab = (target) => {
    tabsItems.forEach((it) => it.classList.toggle('active', it === target));
    tabsNav.classList.remove('product-card__tabs__nav--open');
    const key = target.getAttribute('data-tab');
    let shownPanel = null;
    tabsPanels.forEach((panel) => {
      const show = panel.getAttribute('data-tab__content') === key;
      panel.style.display = show ? '' : 'none';
      if (show) shownPanel = panel;
    });
    if (shownPanel) {
      requestAnimationFrame(() => {
        shownPanel.querySelectorAll('[data-slider]').forEach((sl) => {
          if (sl.swiper) sl.swiper.update();
        });
      });
    }
  };

  tabsNav.addEventListener('click', (e) => {
    const btn = e.target.closest('.product-card__tabs__nav__item');
    if (!btn) return;
    if (btn.classList.contains('active') && !tabsNav.classList.contains('product-card__tabs__nav--open')) {
      tabsNav.classList.add('product-card__tabs__nav--open');
      return;
    }
    selectTab(btn);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.product-card__tabs__nav')) {
      tabsNav.classList.remove('product-card__tabs__nav--open');
    }
  });

  const initialTab = tabsItems.find((it) => it.classList.contains('active')) || tabsItems[0];
  if (initialTab) selectTab(initialTab);
}
