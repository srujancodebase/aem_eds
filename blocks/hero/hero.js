/**
 * Decorates the hero with Digital Marketing content and its call to action.
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const content = document.createElement('div');
  content.className = 'hero-content';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'hero-eyebrow';
  eyebrow.textContent = 'Digital Marketing';

  const heading = document.createElement('h1');
  heading.textContent = 'Infosys Digital Marketing';

  const caption = document.createElement('p');
  caption.className = 'hero-caption';
  caption.textContent = 'The digital marketing landscape is evolving rapidly and these forces are shaping the future';

  const link = document.createElement('a');
  link.className = 'button hero-cta';
  link.href = 'https://www.infosys.com/services/digital-marketing/overview.html';
  link.append(document.createTextNode('Read More'));

  const arrow = document.createElement('span');
  arrow.className = 'hero-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '\u2197';
  link.append(arrow);

  content.append(eyebrow, heading, caption, link);
  block.replaceChildren(content);
}
