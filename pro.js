let counter = 1;

  // Change every 5 seconds
  setInterval(() => {
    document.getElementById('radio-' + counter).checked = true;
    counter++;
    if (counter > 3) {
      counter = 1;
    }
  }, 5000);

  const menuBtn = document.querySelector('.navbar-toggler');
  const navMenu = document.querySelector('.navbar-nav');

  menuBtn.addEventListener('click', () => {
  navMenu.classList.toggle('show');
});


// Store separate indexes for each lightbox
let slideIndexes = {};

function openLightbox(id) {
  document.getElementById(id).style.display = "block";
  slideIndexes[id] = 1; // reset index
  showSlides(slideIndexes[id], id);
}

function closeLightbox(event, id) {
  if (event.target.classList.contains("lightbox") || event.target.classList.contains("close")) {
    document.getElementById(id).style.display = "none";
  }
}

function plusSlides(n, id) {
  slideIndexes[id] += n;
  showSlides(slideIndexes[id], id);
}

function showSlides(n, id) {
  let slides = document.querySelectorAll(`#${id} .lightbox-slide`);
  if (n > slides.length) { slideIndexes[id] = 1 }
  if (n < 1) { slideIndexes[id] = slides.length }
  slides.forEach(slide => slide.style.display = "none");
  slides[slideIndexes[id] - 1].style.display = "block";
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.service-div').forEach(service => {
    const toggle = service.querySelector('.read-toggle');
    const content = service.querySelector('.hidden-content');
    if (!toggle || !content) return; // safety

    // Save original insertion point to move button back later
    const originalParent = toggle.parentNode;
    const originalNext = toggle.nextElementSibling; // normally the hidden-content

    // Ensure content has explicit max-height style for animation control
    content.style.maxHeight = '0px';

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = content.classList.contains('show');

      if (!isOpen) {
        // Open: move button inside content first so measured scrollHeight includes it
        content.appendChild(toggle);
        toggle.classList.add('moved');
        toggle.innerHTML = 'Read Less <i class="fa-solid fa-arrow-up"></i>';
        content.classList.add('show');
        content.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');

        // Use requestAnimationFrame so the browser has applied the DOM changes,
        // then set maxHeight to scrollHeight to trigger the height animation
        requestAnimationFrame(() => {
          content.style.maxHeight = content.scrollHeight + 'px';
        });

      } else {
        // Close: set maxHeight to 0 so it animates closed
        // ensure we start from the actual height, then collapse
        content.style.maxHeight = content.scrollHeight + 'px';
        requestAnimationFrame(() => {
          content.style.maxHeight = '0px';
        });

        // After transition completes, move the button back to its original place
        const onTransitionEnd = (ev) => {
          if (ev.propertyName !== 'max-height') return; // only run once for height
          content.classList.remove('show');
          content.setAttribute('aria-hidden', 'true');
          toggle.setAttribute('aria-expanded', 'false');

          // move toggle back to original location (before originalNext)
          if (originalNext) {
            originalParent.insertBefore(toggle, originalNext);
          } else {
            originalParent.appendChild(toggle);
          }

          toggle.classList.remove('moved');
          toggle.innerHTML = 'Read More <i class="fa-solid fa-arrow-down"></i>';

          content.removeEventListener('transitionend', onTransitionEnd);
        };

        content.addEventListener('transitionend', onTransitionEnd);
      }
    });
  });
});
