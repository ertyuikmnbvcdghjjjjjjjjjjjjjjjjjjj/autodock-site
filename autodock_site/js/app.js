document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();

  const serviceNames = { C:'Оформление водительского удостоверения — от 65 000 ₽', R:'Восстановление документов — от 50 000 ₽', I:'Обмен международных / прав другой страны на РФ — от 50 000 ₽' };
  const modal=document.getElementById('modal-order');
  const modalOverlay=modal?.querySelector('.modal-overlay');
  const modalClose=modal?.querySelector('.modal-close');
  const modalCatName=document.getElementById('modal-cat-name');
  const modalCatPrice=document.getElementById('modal-cat-price');
  const modalSelectedCat=document.getElementById('modal-selected-cat');

  function openOrderModal(cat,price){
    if(!modal)return;
    modalCatName.textContent=serviceNames[cat]||cat; modalCatPrice.textContent=price; modalSelectedCat.value=cat;
    modal.classList.add('open'); document.body.style.overflow='hidden';
  }
  function closeOrderModal(){ if(modal){modal.classList.remove('open');document.body.style.overflow='';} }
  modalClose?.addEventListener('click',closeOrderModal); modalOverlay?.addEventListener('click',closeOrderModal);
  document.querySelectorAll('.open-modal-btn').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();openOrderModal(btn.dataset.category,btn.dataset.price);}));

  function telegramRequest(name,method,contact,service){
    const text=`Заявка autodock%0A%0AФИО: ${encodeURIComponent(name)}%0AСпособ связи: ${encodeURIComponent(method)}%0AКонтакт: ${encodeURIComponent(contact)}%0AУслуга: ${encodeURIComponent(service)}`;
    window.open(`https://t.me/DmitriyAutoDoc?text=${text}`,'_blank','noopener');
  }

  // Hero form
  const heroForm=document.getElementById('hero-consult-form'); const tabs=heroForm?.querySelectorAll('.method-tab'); const input=document.getElementById('dynamic-input'); const label=document.getElementById('dynamic-label');
  function configure(method){
    tabs?.forEach(t=>t.classList.toggle('active',t.dataset.method===method));
    if(method==='telegram'){label.textContent='TELEGRAM USERNAME';input.placeholder='@username';input.type='text';}
    else if(method==='vk'){label.textContent='VK НОМЕР / USERNAME';input.placeholder='номер телефона или username';input.type='text';}
    else {label.textContent='НОМЕР WHATSAPP';input.placeholder='+7 ...';input.type='tel';}
    input.value='';
  }
  tabs?.forEach(t=>t.addEventListener('click',()=>configure(t.dataset.method)));
  heroForm?.addEventListener('submit',e=>{e.preventDefault(); const method=heroForm.querySelector('.method-tab.active')?.dataset.method||'telegram'; const service=document.getElementById('hero-service').value; if(method!=='telegram'){alert('Контакты VK и WhatsApp будут добавлены позже. Пока можно оставить заявку через Telegram.'); return;} telegramRequest('',method,input.value,service);});

  // Main quick form
  let mainMethod='telegram';
  document.querySelectorAll('[data-main-method]').forEach(t=>t.addEventListener('click',()=>{mainMethod=t.dataset.mainMethod;document.querySelectorAll('[data-main-method]').forEach(x=>x.classList.toggle('active',x.dataset.mainMethod===mainMethod)); const l=document.getElementById('main-contact-label'),i=document.getElementById('form-contact'); if(mainMethod==='telegram'){l.textContent='Telegram username';i.placeholder='@username';} else if(mainMethod==='vk'){l.textContent='Номер / username VK';i.placeholder='номер или username';} else {l.textContent='Номер WhatsApp';i.placeholder='+7 ...';}}));
  document.getElementById('contact-form-main')?.addEventListener('submit',e=>{e.preventDefault(); const name=document.getElementById('form-name').value.trim();const contact=document.getElementById('form-contact').value.trim();const service=document.getElementById('form-category').selectedOptions[0].textContent.trim(); if(mainMethod!=='telegram'){alert('Контакты VK и WhatsApp будут добавлены позже. Пока отправьте заявку в Telegram.'); return;} telegramRequest(name,mainMethod,contact,service);});

  // Modal form
  document.getElementById('modal-order-form')?.addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('modal-name').value.trim();const contact=document.getElementById('modal-contact').value.trim();const cat=modalSelectedCat.value;telegramRequest(name,'telegram',contact,serviceNames[cat]);closeOrderModal();});

  // Smooth anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');const el=document.querySelector(id);if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'});}}));
});
