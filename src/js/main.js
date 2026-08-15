import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

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
const addToCartButton = document.querySelector('.catalog__toggle')
addToCartButton.addEventListener('click', () => {
  cartCount++;
  cartCountElement.textContent = cartCount

  if (cartCount > 0) {
    cartCountElement.classList.add('has-items')
  }
});



// Menu
const MenuBtn = document.querySelector('.header__menu__btn')
const MenuSidebar = document.querySelector('.header__menu__sidebar')

MenuBtn.addEventListener('click', (e) => {
  e.stopPropagation();

  MenuBtn.classList.toggle('active');
  MenuSidebar.classList.toggle('active');

  CatalogBurger.classList.remove('active');
  CatalogInner.classList.remove('active');

});

document.addEventListener('click', (e) => {
  if (
    !MenuBtn.contains(e.target) &&
    !MenuSidebar.contains(e.target)
  ) {
    MenuBtn.classList.remove('active');
    MenuSidebar.classList.remove('active');
  }
});



// Catalog
const CatalogBurger = document.querySelector('.catalog__toggle');
const CatalogInner = document.querySelector('.catalog__dropdown')
const CatalogMoreBtns = document.querySelectorAll('.catalog__item__btn');
const CatalogMore = document.querySelector('.catalog__content');
const items = document.querySelectorAll('.catalog__item');
const panels = document.querySelectorAll('.catalog__panel');
// Открытие каталога
CatalogBurger.addEventListener('click', () => {
  CatalogBurger.classList.toggle('active');
  CatalogInner.classList.toggle('active');

  MenuBtn.classList.remove('active');
  MenuSidebar.classList.remove('active');
});
// Закрытие каталога при нажатии вне каталога
document.addEventListener("click", (e) =>{
  if (
    !CatalogBurger.contains(e.target) &&
    !CatalogInner.contains(e.target)
  ) {
    CatalogBurger.classList.remove('active');
    CatalogInner.classList.remove('active');
    CatalogMoreBtns.forEach(btn => {
      btn.classList.remove('active');
    });
  }
});

function openMobile(item) {
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
const swiper = new Swiper('.swiper', {
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