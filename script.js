const menuButton = document.querySelector('.menu-toggle');
const siteMenu = document.getElementById('site-menu');
const menuText = menuButton.querySelector('.menu-toggle-text');
const mainContent = document.querySelector('main');
const footer = document.querySelector('.site-footer');

function setMenu(open, restoreFocus = false) {
  siteMenu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  menuText.textContent = open ? 'Cerrar' : 'Menú';
  document.body.classList.toggle('menu-open', open);
  mainContent.inert = open;
  footer.inert = open;
  if (open) siteMenu.querySelector('.menu-links a').focus();
  if (!open && restoreFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => setMenu(siteMenu.hidden));
siteMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.querySelector('.site-header .brand').addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', (event) => {
  if (siteMenu.hidden) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    setMenu(false, true);
  }
  if (event.key === 'Tab') {
    const links = [...siteMenu.querySelectorAll('a')];
    const first = links[0];
    const last = links[links.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      menuButton.focus();
    } else if (event.shiftKey && document.activeElement === menuButton) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      menuButton.focus();
    } else if (!event.shiftKey && document.activeElement === menuButton) {
      event.preventDefault();
      first.focus();
    }
  }});

const priorityData = {
  emergencias: {
    label: 'Prioridad máxima',
    title: 'La ambulancia pasa primero.',
    description: 'La central puede coordinar una ola verde entre intersecciones del sector para facilitar el paso de los servicios de emergencia.',
    symbol: '✳',
  },
  transporte: {
    label: 'Prioridad alta',
    title: 'Un bus mueve a muchos.',
    description: 'El transporte público y los buses de aficionados reciben prioridad por la cantidad de personas que trasladan.',
    symbol: '▰',
  },
  peatones: {
    label: 'Prioridad peatonal',
    title: 'Más tiempo para cruzar.',
    description: 'Una pulsación prolongada solicita un cruce extendido, con prioridad alta justo después de los vehículos de emergencia.',
    symbol: '◌',
  },
  otros: {
    label: 'Flujo equilibrado',
    title: 'Cada cola cuenta.',
    description: 'Carros, taxis, motos, bicicletas y carga se consideran según el tipo de vehículo, el tamaño de la cola y el tiempo de espera.',
    symbol: '⇢',
  },
};

const tabs = [...document.querySelectorAll('.priority-tabs [role="tab"]')];
const priorityPanel = document.getElementById('panel-prioridad');

function activatePriority(tab) {
  const data = priorityData[tab.dataset.priority];
  tabs.forEach((item) => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  priorityPanel.setAttribute('aria-labelledby', tab.id);
  priorityPanel.querySelector('.mono').textContent = data.label;
  priorityPanel.querySelector('h3').textContent = data.title;
  priorityPanel.querySelector('p').textContent = data.description;
  priorityPanel.querySelector('.priority-symbol').textContent = data.symbol;
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activatePriority(tab));
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    activatePriority(tabs[next]);
    tabs[next].focus();
  });
});

const videoDialog = document.getElementById('video-dialog');
const video = videoDialog.querySelector('video');
const videoSources = {
  main: 'img/presentacion-backtrack.mp4',
  prototype: 'img/prototipo.mp4',
};

document.querySelectorAll('[data-open-video]').forEach((button) => {
  button.addEventListener('click', () => {
    video.src = videoSources[button.dataset.openVideo];
    videoDialog.showModal();
    video.play().catch(() => {});
  });
});

function closeVideo() {
  video.pause();
  video.removeAttribute('src');
  video.load();
  videoDialog.close();
}

videoDialog.querySelector('.dialog-close').addEventListener('click', closeVideo);
videoDialog.addEventListener('click', (event) => {
  if (event.target === videoDialog) closeVideo();
});
videoDialog.addEventListener('close', () => {
  video.pause();
  video.removeAttribute('src');
  video.load();
});
