let cart=[];
let activeFilter='All';
function setFilter(f){
  activeFilter=f;
  document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b.textContent===f));
  filterProducts();
}
function filterProducts(){
  const q=(document.getElementById('search').value||'').toLowerCase();
  document.querySelectorAll('.product-card').forEach(card=>{
    const okCat=activeFilter==='All'||card.dataset.category===activeFilter;
    const okSearch=!q||card.dataset.name.includes(q);
    card.style.display=okCat&&okSearch?'block':'none';
  });
}
function addToCart(name,price){
  const found=cart.find(x=>x.name===name);
  if(found) found.qty++; else cart.push({name,price,qty:1});
  renderCart(); toggleCart(true);
}
function priceNumber(s){return parseFloat(s.replace('OMR','').trim())||0}
function renderCart(){
  document.getElementById('cartCount').textContent=cart.reduce((a,x)=>a+x.qty,0);
  const box=document.getElementById('cartItems');
  if(!cart.length){box.innerHTML='<p class="muted">Your cart is empty.</p>';document.getElementById('cartTotal').textContent='0 OMR';return;}
  box.innerHTML=cart.map((x,i)=>`<div class="cart-row"><div><b>${x.name}</b><br><small>${x.price} × ${x.qty}</small></div><button onclick="removeItem(${i})">×</button></div>`).join('');
  const total=cart.reduce((a,x)=>a+priceNumber(x.price)*x.qty,0);
  document.getElementById('cartTotal').textContent=total.toFixed(2)+' OMR';
}
function removeItem(i){cart.splice(i,1);renderCart();}
function toggleCart(force){
  const c=document.getElementById('cart'),o=document.getElementById('overlay');
  const open=force===true||!c.classList.contains('open');
  c.classList.toggle('open',open);o.classList.toggle('open',open);
}
function checkout(){
  if(!cart.length){alert('Your cart is empty.');return;}
  alert('Demo checkout: connect your preferred payment/order method here when you are ready.');
}
renderCart();
