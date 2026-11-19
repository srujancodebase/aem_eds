export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  const centeredCopy = [...block.querySelectorAll('code')].find((code) => (
    code.textContent.trim() === 'Enabling businesses grow in the evolving Digital Marketing landscape'
  ));
  if (centeredCopy) {
    const caption = centeredCopy.closest('pre') || centeredCopy;
    const sourceCell = caption.parentElement;
    caption.classList.add('columns-centered-copy');
    block.append(caption);
    if (sourceCell && sourceCell !== block && !sourceCell.children.length && !sourceCell.textContent.trim()) {
      sourceCell.remove();
    }
  }

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
