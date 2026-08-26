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


// Video
const videoBlocks = document.querySelectorAll('.video__container');

videoBlocks.forEach((block) => {
  const video = block.querySelector('.video__item');
  const playButton = block.querySelector('.video__play');

  playButton.addEventListener('click', (event) => {
    event.stopPropagation();

    video.play();
    playButton.style.opacity = '0';
  });

  video.addEventListener('click', () => {
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
const catalogSortItems = document.querySelectorAll('.catalog__sorting__item');
catalogSortItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    const hasArrow = item.classList.contains('catalog__sorting__item--choice');

    if (item.classList.contains('active')) {
      if (hasArrow) {
        item.classList.toggle('sort-desc');
      } else {
        item.classList.remove('active');
      }
      return;
    }

    catalogSortItems.forEach((el) => {
      el.classList.remove('active', 'sort-desc');
    });
    item.classList.add('active');
  });
});

// Accordion
const accordionItems = document.querySelectorAll('.accordion__item');
const accordion = document.querySelector('.accordion');

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


// Scroll__footer
const scrollTopButton = document.querySelector('[data-scroll-top]');

scrollTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});
