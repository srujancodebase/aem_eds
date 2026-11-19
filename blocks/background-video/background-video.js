/**
 * Decorates the block with a looping, muted page-background video.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const video = document.createElement('video');
  video.className = 'background-video-video';
  video.src = '/icons/header1.mp4';
  video.autoplay = !reduceMotion;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.preload = reduceMotion ? 'none' : 'auto';
  video.setAttribute('aria-hidden', 'true');
  video.tabIndex = -1;

  block.replaceChildren(video);
  const section = block.closest('.section');
  if (section) section.classList.add('background-video-container');
  document.body.classList.add('has-background-video');
}
