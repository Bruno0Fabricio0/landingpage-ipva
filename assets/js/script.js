const animated = document.querySelectorAll('.fade-up');
const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress');

function initObserver() {
  if (!animated.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  }, { threshold: 0.1 });
  animated.forEach((el) => io.observe(el));
}

function smoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const hash = this.getAttribute('href');
      if (hash && hash.startsWith('#')) {
        const target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
          history.pushState(null, null, hash);
        }
      }
    });
  });
}

function initHeader() {
  window.addEventListener('scroll', () => {
    const top = window.scrollY;
    
    if (progress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (top / docHeight) * 100 : 0;
      progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    }
  }, { passive: true });
}

function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const honeypot = form.querySelector('.hp');
    // Removendo a verificação de visibility:hidden que estava bloqueando o envio
    if (honeypot && honeypot.value.trim() !== '') {
      return;
    }

    const nome = form.nome.value.trim();
    const telefone = form.telefone.value.trim();
    const status = form.querySelector('.form-status');

    if (!nome || !telefone) {
      if (status) {
        status.textContent = 'Por favor, preencha seu nome e WhatsApp.';
        status.style.color = '#ef4444';
      }
      return;
    }

    // Criando a mensagem e redirecionando para WhatsApp
    const message = encodeURIComponent(`Olá, meu nome é ${nome} (${telefone}). Gostaria de uma análise gratuita para isenção de IPVA.`);
    const whatsappUrl = `https://wa.me/5591987425239?text=${message}`;
    
    if (status) {
      status.textContent = 'Redirecionando para o WhatsApp...';
      status.style.color = '#1e40af';
    }

    setTimeout(() => {
      form.reset();
      if (status) status.textContent = '';
      window.location.href = whatsappUrl; // Usando location.href para garantir o redirecionamento
    }, 800);
  });
}

function init() {
  initObserver();
  smoothScroll();
  initHeader();
  initForm();
}

document.addEventListener('DOMContentLoaded', init);
