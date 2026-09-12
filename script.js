
const menuBtn=document.querySelector('.menu-btn'),nav=document.querySelector('.nav');
if(menuBtn&&nav){menuBtn.onclick=()=>{const o=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(o));};}

const searchPanel=document.getElementById('searchPanel');
document.getElementById('searchBtn')?.addEventListener('click',()=>searchPanel?.classList.add('open'));
document.getElementById('closeSearch')?.addEventListener('click',()=>searchPanel?.classList.remove('open'));

let bag=JSON.parse(localStorage.getItem('tuffedk_bag')||'[]');
let wishlist=JSON.parse(localStorage.getItem('tuffedk_wishlist')||'[]');
const bagCount=document.getElementById('bagCount'),bagPanel=document.getElementById('bagPanel'),bagItems=document.getElementById('bagItems'),bagTotal=document.getElementById('bagTotal'),overlay=document.getElementById('overlay');

function save(){localStorage.setItem('tuffedk_bag',JSON.stringify(bag));localStorage.setItem('tuffedk_wishlist',JSON.stringify(wishlist));}
function renderBag(){
  if(bagCount)bagCount.textContent=bag.reduce((s,i)=>s+(i.qty||1),0);
  document.querySelectorAll('[data-wish]').forEach(b=>{b.classList.toggle('active',wishlist.includes(b.dataset.wish));b.textContent=wishlist.includes(b.dataset.wish)?'♥':'♡';});
  if(!bagItems||!bagTotal)return;
  if(!bag.length){bagItems.innerHTML='<p>Your bag is empty.</p>';bagTotal.textContent='€0';return;}
  bagItems.innerHTML=bag.map((i,n)=>`<div class="cart-item"><div><strong>${i.name}</strong><br><span>€${i.price} each</span><div class="cart-controls"><button data-dec="${n}">−</button><b>${i.qty||1}</b><button data-inc="${n}">+</button><button class="remove" data-remove="${n}">Remove</button></div></div><strong>€${i.price*(i.qty||1)}</strong></div>`).join('');
  bagTotal.textContent='€'+bag.reduce((s,i)=>s+i.price*(i.qty||1),0);
  bagItems.querySelectorAll('[data-inc]').forEach(b=>b.onclick=()=>{bag[+b.dataset.inc].qty=(bag[+b.dataset.inc].qty||1)+1;save();renderBag();renderCheckout();});
  bagItems.querySelectorAll('[data-dec]').forEach(b=>b.onclick=()=>{let i=+b.dataset.dec;bag[i].qty=Math.max(1,(bag[i].qty||1)-1);save();renderBag();renderCheckout();});
  bagItems.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{bag.splice(+b.dataset.remove,1);save();renderBag();renderCheckout();});
}
function openBag(){bagPanel?.classList.add('open');overlay?.classList.add('show');}
function closeBag(){bagPanel?.classList.remove('open');overlay?.classList.remove('show');}
document.getElementById('bagBtn')?.addEventListener('click',openBag);
document.getElementById('closeBag')?.addEventListener('click',closeBag);
overlay?.addEventListener('click',closeBag);

document.querySelectorAll('.add-cart').forEach(b=>b.onclick=()=>{let x=bag.find(i=>i.id===b.dataset.id);if(x)x.qty=(x.qty||1)+1;else bag.push({id:b.dataset.id,name:b.dataset.name,price:+b.dataset.price,qty:1});save();renderBag();openBag();});
document.querySelectorAll('[data-wish]').forEach(b=>b.onclick=()=>{let id=b.dataset.wish;wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];save();renderBag();});

const filters=document.querySelectorAll('.filter'),shopSearch=document.getElementById('shopSearch');
function applyShop(){
  const f=document.querySelector('.filter.active')?.dataset.filter||'all',q=(shopSearch?.value||'').toLowerCase();
  document.querySelectorAll('#productGrid .product-card').forEach(c=>{let okCat=f==='all'||c.dataset.category===f,okQ=!q||c.dataset.name.includes(q)||c.dataset.category.includes(q);c.style.display=okCat&&okQ?'':'none';});
}
filters.forEach(b=>b.onclick=()=>{filters.forEach(x=>x.classList.remove('active'));b.classList.add('active');applyShop();});
shopSearch?.addEventListener('input',applyShop);
document.getElementById('sortProducts')?.addEventListener('change',e=>{let g=document.getElementById('productGrid'),items=[...g.querySelectorAll('.product-card')],v=e.target.value;if(v==='low')items.sort((a,b)=>+a.dataset.price-+b.dataset.price);if(v==='high')items.sort((a,b)=>+b.dataset.price-+a.dataset.price);if(v==='az')items.sort((a,b)=>a.dataset.name.localeCompare(b.dataset.name));items.forEach(i=>g.appendChild(i));});

function renderCheckout(){let x=document.getElementById('checkoutItems'),t=document.getElementById('checkoutTotal');if(!x||!t)return;if(!bag.length){x.innerHTML='<p>Your bag is empty.</p>';t.textContent='€0';return;}x.innerHTML=bag.map(i=>`<div class="checkout-item"><span>${i.name} × ${i.qty||1}</span><strong>€${i.price*(i.qty||1)}</strong></div>`).join('');t.textContent='€'+bag.reduce((s,i)=>s+i.price*(i.qty||1),0);}
renderBag();renderCheckout();
