import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const socialProfiles = [
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/user/infosys',
    path: [
      'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z',
      'M9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    ].join(' '),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/Infosys',
    path: [
      'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
    ].join(' '),
  },
  {
    name: 'X',
    href: 'https://x.com/Infosys',
    path: [
      'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z',
    ].join(' '),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/infosys/',
    text: 'in',
  },
];

function createSocialNavigation() {
  const nav = document.createElement('nav');
  nav.className = 'footer-social';
  nav.setAttribute('aria-label', 'Social media');
  const links = document.createElement('ul');
  links.className = 'footer-social-links';

  socialProfiles.forEach((profile) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.className = `footer-social-link footer-social-${profile.name.toLowerCase()}`;
    link.href = profile.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', profile.name);

    if (profile.path) {
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('viewBox', '0 0 24 24');
      icon.setAttribute('aria-hidden', 'true');
      icon.setAttribute('focusable', 'false');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', profile.path);
      icon.append(path);
      link.append(icon);
    } else {
      const icon = document.createElement('span');
      icon.className = 'footer-social-linkedin-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = profile.text;
      link.append(icon);
    }

    item.append(link);
    links.append(item);
  });

  nav.append(links);
  return nav;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const content = footer.querySelector('.default-content-wrapper');
  if (content) {
    const children = [...content.children];
    const headings = children.filter((child) => child.matches('p') && child.querySelector('strong'));
    const lists = children.filter((child) => child.matches('ul'));
    const copyright = children.find((child) => child.matches('p') && /^copyright\b/i.test(child.textContent.trim()));
    const legal = children.find((child) => child.matches('p') && child !== copyright && !headings.includes(child));

    if (headings.length || lists.length) {
      const columns = document.createElement('div');
      columns.className = 'footer-columns';
      for (let i = 0; i < Math.max(headings.length, lists.length); i += 1) {
        const column = document.createElement('div');
        column.className = 'footer-column';
        if (headings[i]) {
          headings[i].classList.add('footer-column-title');
          column.append(headings[i]);
        }
        if (lists[i]) {
          lists[i].classList.add('footer-column-links');
          column.append(lists[i]);
        }
        columns.append(column);
      }
      content.prepend(columns);
      content.classList.add('footer-has-columns');
    }

    if (copyright) copyright.classList.add('footer-copyright');
    if (legal) legal.classList.add('footer-legal');
    content.append(createSocialNavigation());
  }

  block.append(footer);
}
