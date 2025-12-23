const menu = document.querySelector('[data-menu]');
const openMenu = document.querySelector('[data-menu-open]');
const closeMenu = document.querySelector('[data-menu-close]');
const backToTop = document.querySelector('[data-back-to-top]');
const carouselTrack = document.querySelector('[data-carousel-track]');
const carouselPrev = document.querySelector('[data-carousel-prev]');
const carouselNext = document.querySelector('[data-carousel-next]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');

const nextEvent = new Date();
nextEvent.setDate(nextEvent.getDate() + 13);
nextEvent.setHours(18, 0, 0, 0);

const updateCountdown = () => {
  const now = new Date();
  const diff = Math.max(0, nextEvent - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
};

updateCountdown();
setInterval(updateCountdown, 60000);

const toggleMenu = (isOpen) => {
  menu.classList.toggle('is-open', isOpen);
  menu.setAttribute('aria-hidden', String(!isOpen));
  if (isOpen) {
    closeMenu.focus();
  } else {
    openMenu.focus();
  }
};

openMenu.addEventListener('click', () => toggleMenu(true));
closeMenu.addEventListener('click', () => toggleMenu(false));
menu.addEventListener('click', (event) => {
  if (event.target === menu) {
    toggleMenu(false);
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

carouselPrev.addEventListener('click', () => {
  carouselTrack.scrollBy({ left: -320, behavior: 'smooth' });
});

carouselNext.addEventListener('click', () => {
  carouselTrack.scrollBy({ left: 320, behavior: 'smooth' });
});

const newsletterForm = document.querySelector('.footer__newsletter');
newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const emailInput = newsletterForm.querySelector('input');
  if (emailInput.value.trim()) {
    emailInput.value = '';
    alert('Thanks for subscribing!');
  }
});
