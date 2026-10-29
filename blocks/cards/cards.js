import { createOptimizedPicture } from '../../scripts/aem.js';

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
  block.replaceChildren(ul);
}
