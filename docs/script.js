const header=document.querySelector('[data-header]');
const menuBtn=document.querySelector('[data-menu-button]');
const menu=document.querySelector('[data-menu]');

function updateHeader(){
  header?.classList.toggle('scrolled',window.scrollY>20);
}
updateHeader();
window.addEventListener('scroll',updateHeader,{passive:true});

menuBtn?.addEventListener('click',()=>{
  const open=menu.classList.toggle('open');
  document.body.classList.toggle('menu-open',open);
  menuBtn.setAttribute('aria-expanded',String(open));
  menuBtn.textContent=open?'CLOSE':'MENU';
});

document.querySelectorAll('[data-menu] a').forEach(link=>{
  link.addEventListener('click',()=>{
    menu?.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuBtn?.setAttribute('aria-expanded','false');
    if(menuBtn) menuBtn.textContent='MENU';
  });
});

const year=document.getElementById('year');
if(year) year.textContent=new Date().getFullYear();

const items=[...document.querySelectorAll('.reveal')];
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.08,rootMargin:'0px 0px -40px'});
  items.forEach(el=>observer.observe(el));
}else{
  items.forEach(el=>el.classList.add('in-view'));
}

// Immersive interactions: scroll progress, subtle pointer depth and active navigation.
const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (!motionReduced) {
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  let scrollTicking = false;
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 0;
    document.documentElement.style.setProperty('--scroll-progress', amount.toFixed(2) + '%');
    scrollTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateProgress);
      scrollTicking = true;
    }
  }, { passive: true });
  updateProgress();

  // Stagger reveals by a few milliseconds, without delaying the page's initial content.
  document.querySelectorAll('.section-head.reveal, .work-card.reveal, .service-row.reveal, .about-grid .reveal, .social-links.reveal')
    .forEach((element, index) => {
      element.style.setProperty('--reveal-delay', (index % 4) * 65 + 'ms');
    });
}

const hero = document.querySelector('.hero');
if (hero && finePointer && !motionReduced) {
  let pointerFrame = 0;
  hero.addEventListener('pointermove', (event) => {
    if (pointerFrame) return;
    pointerFrame = window.requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty('--pointer-x', x.toFixed(1) + '%');
      hero.style.setProperty('--pointer-y', y.toFixed(1) + '%');
      pointerFrame = 0;
    });
  }, { passive: true });
  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--pointer-x', '72%');
    hero.style.setProperty('--pointer-y', '42%');
  }, { passive: true });
}

// Small 3D response on desktop cards only; no tilt on touch devices.
if (finePointer && !motionReduced) {
  document.querySelectorAll('.work-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 2.4;
      const rotateX = (0.5 - y) * 2.4;
      card.style.setProperty('--tilt-x', rotateY.toFixed(2) + 'deg');
      card.style.setProperty('--tilt-y', rotateX.toFixed(2) + 'deg');
    }, { passive: true });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    }, { passive: true });
  });
}

// Keep the navigation context visible as visitors explore the page.
if ('IntersectionObserver' in window) {
  const navLinks = [...document.querySelectorAll('[data-menu] a[href^="#"]')];
  const trackedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (trackedSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-28% 0px -58% 0px', threshold: 0 });
    trackedSections.forEach((section) => sectionObserver.observe(section));
  }
}


// Contextual WhatsApp pathways: add a gentle cursor highlight to the three project choices.
if (finePointer && !motionReduced) {
  document.querySelectorAll('.pathway-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--path-x', ((event.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
      card.style.setProperty('--path-y', ((event.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
    }, { passive: true });
  });
}

// Cinematic transition only for internal page-to-page navigation; anchors and external links stay immediate.
const transitionOverlay = document.createElement('div');
transitionOverlay.className = 'page-transition';
transitionOverlay.setAttribute('aria-hidden', 'true');
transitionOverlay.innerHTML = '<span>FELPDESIGNER</span><span>Visual systems / Independent studio</span>';
document.body.appendChild(transitionOverlay);

document.querySelectorAll('a[href]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (motionReduced || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;
    let destination;
    try { destination = new URL(link.href, window.location.href); } catch { return; }
    if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;
    if (!/\.html?$/.test(destination.pathname)) return;
    event.preventDefault();
    document.body.classList.add('is-transitioning');
    transitionOverlay.classList.add('is-active');
    window.setTimeout(() => { window.location.href = destination.href; }, 260);
  });
});
window.addEventListener('pageshow', () => {
  document.body.classList.remove('is-transitioning');
  transitionOverlay.classList.remove('is-active');
});
