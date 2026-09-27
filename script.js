let cart = [];
let activeFilter = 'All';

const inventory = {
  hoodie: { total: 10, sizes: { S: 5, M: 5 } },
  pants:  { total: 10, sizes: { S: 5, M: 5 } }
};

function setFilter(f){
  activeFilter = f;
  document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b.textContent === f));
  filterProducts();
}

function filterProducts(){
  const q = (document.getElementById('search').value || '').toLowerCase();
  document.querySelectorAll('.product-card').forEach(card => {
    const okCat = activeFilter === 'All' || card.dataset.category === activeFilter;
    const okSearch = !q || card.dataset.name.includes(q);
    card.style.display = okCat && okSearch ? 'block' : 'none';
  });
}

function addProductToCart(name, price, productId){
  const color = document.getElementById('color-' + productId).value;
  const size = document.getElementById('size-' + productId).value;
  const stock = inventory[productId];

  if (!stock || stock.sizes[size] <= 0) {
    alert('Sorry, this size is out of stock.');
    return;
  }

  stock.sizes[size]--;
  stock.total--;

  const key = `${name}|${color}|${size}`;
  const found = cart.find(x => x.key === key);
  if(found) found.qty++;
  else cart.push({ key, name, price, color, size, qty: 1 });

  updateStockText(productId);
  renderCart();
  toggleCart(true);
}

function updateStockText(productId){
  const stock = inventory[productId];
  const el = document.getElementById('stock-' + productId);
  if (!el) return;
  el.textContent = stock.total > 0 ? `${stock.total} pieces available` : 'OUT OF STOCK';
}

function renderCart(){
  document.getElementById('cartCount').textContent = cart.reduce((a,x) => a + x.qty, 0);
  const box = document.getElementById('cartItems');

  if(!cart.length){
    box.innerHTML = '<p class="muted">Your cart is empty.</p>';
    document.getElementById('cartTotal').textContent = '0 OMR';
    return;
  }

  box.innerHTML = cart.map((x,i) => `
    <div class="cart-row">
      <div><b>${x.name}</b><br><small>${x.color} • Size ${x.size} • ${x.price} OMR × ${x.qty}</small></div>
      <button onclick="removeItem(${i})">×</button>
    </div>
  `).join('');

  const total = cart.reduce((a,x) => a + x.price * x.qty, 0);
  document.getElementById('cartTotal').textContent = total.toFixed(2) + ' OMR';
}

function removeItem(i){
  const item = cart[i];
  const productId = item.name.includes('Zip Hoodie') ? 'hoodie' : 'pants';

  inventory[productId].sizes[item.size] += item.qty;
  inventory[productId].total += item.qty;
  updateStockText(productId);

  cart.splice(i,1);
  renderCart();
}

function toggleCart(force){
  const c = document.getElementById('cart'), o = document.getElementById('overlay');
  const open = force === true || !c.classList.contains('open');
  c.classList.toggle('open', open);
  o.classList.toggle('open', open);
}

function checkout(){
  if(!cart.length){ alert('Your cart is empty.'); return; }
  alert('Your order is ready. Next we can connect this checkout to WhatsApp, online payment, or an order form.');
}

updateStockText('hoodie');
updateStockText('pants');
renderCart();
