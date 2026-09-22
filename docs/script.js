const menuBtn=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
menuBtn?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.getElementById('year').textContent=new Date().getFullYear();

// Substitua pelos seus links reais.
const links={
  instagram:'#',
  behance:'#',
  whatsapp:'#'
};
document.querySelectorAll('[data-link]').forEach(a=>{a.href=links[a.dataset.link]||'#';});