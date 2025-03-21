(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

})();


function reservarCita(dia, horario, tipo) {
  const mensaje = `Hola, Licenciada Angie. Te contacto a través de tu página web para reservar una cita ${tipo} para el ${dia} a las ${horario}. ¿Podrías confirmarme si está disponible? ¡Muchas gracias!`;
  const whatsappUrl = `https://wa.me/5492954568514?text=${encodeURIComponent(mensaje)}`;
  window.open(whatsappUrl, '_blank');
}


//Agenda dinamica

const url = "https://script.google.com/macros/s/AKfycbx4ov5867HFk_d9Z0TRZd0HGQ7uGliAPShm_5lkM4LGs0zCJAG9QMgYGtKqssQ9gvco/exec";

async function cargarDatos() {
  const url = "https://script.google.com/macros/s/AKfycbx4ov5867HFk_d9Z0TRZd0HGQ7uGliAPShm_5lkM4LGs0zCJAG9QMgYGtKqssQ9gvco/exec";
  try {
    const response = await fetch(url);
    const data = await response.json();
    mostrarAgenda(data);
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  }
}

function mostrarAgenda(data) {
  const tbody = document.querySelector(".agenda-table tbody");
  tbody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

  data.forEach((fila) => {
    const tr = document.createElement("tr");

    // Día y Horario
    tr.innerHTML = `
      <td>${fila.Día}</td>
      <td>${fila.Horario}</td>
      <td>
        ${fila.Presencial === "Sí" ? 
          `<button class="btn btn-reservar" onclick="reservarCita('${fila.Día}', '${fila.Horario}', 'Presencial')">Reservar <i class="bi bi-whatsapp"></i></button>` : 
          `<button class="btn btn-reservar" disabled>Reservar <i class="bi bi-whatsapp"></i></button>`
        }
      </td>
      <td>
        ${fila.Virtual === "Sí" ? 
          `<button class="btn btn-reservar" onclick="reservarCita('${fila.Día}', '${fila.Horario}', 'Virtual')">Reservar <i class="bi bi-whatsapp"></i></button>` : 
          `<button class="btn btn-reservar" disabled>Reservar <i class="bi bi-whatsapp"></i></button>`
        }
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function reservarCita(dia, horario, tipo) {
  const mensaje = `Hola, Licenciada Angie 👋. Te contacto a través de tu página web para reservar una cita ${tipo} para el ${dia} a las ${horario}. ¿Podrías confirmarme si está disponible? 😊 ¡Muchas gracias!`;
  const whatsappUrl = `https://wa.me/5492954568514?text=${encodeURIComponent(mensaje)}`;
  window.open(whatsappUrl, '_blank');
}

// Cargar los datos al abrir la página
document.addEventListener("DOMContentLoaded", cargarDatos);
