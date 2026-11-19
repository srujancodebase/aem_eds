import { createOptimizedPicture } from '../../scripts/aem.js';

const readMoreUrl = 'https://www.infosys.com/newsroom/press-releases/2025/strategic-collaboration-turbocharge-marketing-transformation.html';

function createCarouselButton(className, label, text) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.setAttribute('aria-label', label);
  button.textContent = text;
  return button;
}

function addReadMoreLinks(ul) {
  ul.querySelectorAll(':scope > li').forEach((card) => {
    let body = card.querySelector('.cards-card-body');
    if (!body && !card.querySelector('.cards-card-image')) return;
    if (!body) {
      body = document.createElement('div');
      body.className = 'cards-card-body';
      card.append(body);
    }

    let link = body.querySelector('.cards-card-link');
    if (!link) {
      const action = document.createElement('p');
      action.className = 'cards-card-action';
      link = document.createElement('a');
      link.className = 'cards-card-link';
      action.append(link);
      body.append(action);
    }
    link.href = readMoreUrl;
    link.textContent = 'Read More';
  });
}

function addCarousel(block, ul) {
  const cards = [...ul.children];
  if (!cards.length) {
    block.replaceChildren(ul);
    return;
  }

  ul.classList.add('cards-carousel-track');
  ul.classList.add(`cards-carousel-track-${Math.min(cards.length, 3)}`);
  const carousel = document.createElement('div');
  carousel.className = 'cards-carousel';
  const viewport = document.createElement('div');
  viewport.className = 'cards-carousel-viewport';
  const controls = document.createElement('div');
  controls.className = 'cards-carousel-controls';
  const previousButton = createCarouselButton('cards-carousel-previous', 'Previous card', '\u2039');
  const nextButton = createCarouselButton('cards-carousel-next', 'Next card', '\u203a');
  const counter = document.createElement('span');
  counter.className = 'cards-carousel-count';
  counter.setAttribute('aria-live', 'polite');

  const visibleCards = Math.min(3, cards.length);
  const maxIndex = Math.max(0, cards.length - visibleCards);
  let currentIndex = 0;
  const getStepSize = () => {
    const firstCard = cards[0].getBoundingClientRect();
    const gap = cards.length > 1
      ? cards[1].getBoundingClientRect().left - firstCard.right
      : 0;
    return firstCard.width + gap;
  };
  const updateControls = () => {
    counter.textContent = `${currentIndex + 1}/${cards.length}`;
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === maxIndex;
  };
  const goToCard = (index) => {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    updateControls();
    ul.scrollTo({
      left: currentIndex * getStepSize(),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  previousButton.addEventListener('click', () => goToCard(currentIndex - 1));
  nextButton.addEventListener('click', () => goToCard(currentIndex + 1));
  ul.addEventListener('scroll', () => {
    const index = ul.clientWidth
      ? Math.min(maxIndex, Math.round(ul.scrollLeft / getStepSize()))
      : 0;
    if (index !== currentIndex) {
      currentIndex = index;
      updateControls();
    }
  });

  controls.append(previousButton, counter, nextButton);
  viewport.append(ul);
  carousel.append(viewport, controls);
  block.replaceChildren(carousel);
  updateControls();
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    li.querySelectorAll('.cards-card-body').forEach((body) => {
      body.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach((element) => {
        if (element.textContent.trim().toLowerCase() === 'press release') {
          element.classList.add('cards-card-category');
        }
      });
      body.querySelectorAll('a').forEach((link) => {
        if (link.textContent.trim().replace(/\s+/g, ' ').toLowerCase() === 'read more') {
          link.classList.add('cards-card-link');
          if (link.parentElement.tagName === 'P') {
            link.parentElement.classList.add('cards-card-action');
          }
        }
      });
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  addReadMoreLinks(ul);
  addCarousel(block, ul);
}
