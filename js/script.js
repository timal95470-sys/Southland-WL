document.addEventListener('DOMContentLoaded', () => {
  const cookieBanner = document.getElementById('cookieBanner');
  const acceptButton = document.getElementById('acceptCookie');
  const faqItems = document.querySelectorAll('.faq-item');
  const whitelistForm = document.getElementById('whitelistForm');

  if (acceptButton && cookieBanner) {
    acceptButton.addEventListener('click', () => {
      cookieBanner.classList.add('hidden');
    });
  }

  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question');
    if (button) {
      button.addEventListener('click', () => {
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
          }
        });
        item.classList.toggle('active');
      });
    }
  });

  if (whitelistForm) {
    whitelistForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const button = whitelistForm.querySelector('button');
      if (button) {
        button.textContent = 'Candidature envoyée';
      }
      alert('Candidature envoyée avec succès. Merci pour votre intérêt.');
    });
  }
});
