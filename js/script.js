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
      const button = whitelistForm.querySelector('button');
      if (button) {
        button.textContent = 'Envoi en cours...';
        button.disabled = true;
      }

      const formData = new FormData(whitelistForm);
      const application = {
        discordId: formData.get('discord_id') || '',
        hrpFirst: formData.get('hrp_first') || '',
        hrpLast: formData.get('hrp_last') || '',
        rpFirst: formData.get('rp_first') || '',
        rpLast: formData.get('rp_last') || '',
        story: formData.get('story') || '',
        motivation: formData.get('motivation') || '',
        availability: formData.get('availability') || '',
        submittedAt: new Date().toLocaleString('fr-FR'),
      };

      const stored = localStorage.getItem('southland_candidatures');
      const candidatures = stored ? JSON.parse(stored) : [];
      candidatures.push(application);
      localStorage.setItem('southland_candidatures', JSON.stringify(candidatures));

      // allow the form to submit normally so Netlify Forms can capture it
    });
  }

  const staffPage = document.getElementById('staffPage');
  if (staffPage) {
    const loginSection = document.getElementById('staffLogin');
    const contentSection = document.getElementById('staffContent');
    const loginButton = document.getElementById('staffLoginButton');
    const logoutButton = document.getElementById('staffLogoutButton');
    const passwordInput = document.getElementById('staffPassword');
    const applicationsTableBody = document.getElementById('applicationsTableBody');
    const staffAlert = document.getElementById('staffAlert');
    const staffSecret = 'southlandstaff';

    function renderApplications() {
      const storedData = localStorage.getItem('southland_candidatures');
      const applications = storedData ? JSON.parse(storedData) : [];
      applicationsTableBody.innerHTML = '';

      if (applications.length === 0) {
        applicationsTableBody.innerHTML = '<tr><td colspan="6">Aucune candidature enregistrÃ©e pour le moment.</td></tr>';
        return;
      }

      applications.reverse().forEach((application, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${application.discordId}</td>
          <td>${application.hrpFirst} ${application.hrpLast}</td>
          <td>${application.rpFirst} ${application.rpLast}</td>
          <td>${application.availability}</td>
          <td>${application.submittedAt}</td>
        `;
        applicationsTableBody.appendChild(row);
      });
    }

    function showStaffContent() {
      loginSection.classList.add('hidden');
      contentSection.classList.remove('hidden');
      renderApplications();
    }

    function showLogin() {
      loginSection.classList.remove('hidden');
      contentSection.classList.add('hidden');
    }

    if (sessionStorage.getItem('southland_staff_auth') === 'true') {
      showStaffContent();
    } else {
      showLogin();
    }

    loginButton.addEventListener('click', () => {
      if (passwordInput.value === staffSecret) {
        sessionStorage.setItem('southland_staff_auth', 'true');
        staffAlert.textContent = '';
        showStaffContent();
      } else {
        staffAlert.textContent = 'Code d\'accÃ¨s incorrect.';
        passwordInput.value = '';
      }
    });

    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('southland_staff_auth');
        passwordInput.value = '';
        staffAlert.textContent = '';
        showLogin();
      });
    }

    passwordInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        loginButton.click();
      }
    });
  }
});
      } else {
        staffAlert.textContent = 'Code incorrect. Veuillez rÃ©essayer.';
        staffAlert.classList.add('visible');
      }
    });

    logoutButton.addEventListener('click', () => {
      sessionStorage.removeItem('southland_staff_auth');
      passwordInput.value = '';
      staffAlert.textContent = '';
      staffAlert.classList.remove('visible');
      showLogin();
    });
  }
});
