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