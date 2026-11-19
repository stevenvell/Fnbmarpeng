const products = [
      {id:1,name:"Chicken Rice Bowl",category:"Makanan",price:28000,rating:"4.9",desc:"Ayam berbumbu dengan nasi hangat dan sayuran.",image:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80"},
      {id:2,name:"Classic Beef Burger",category:"Makanan",price:32000,rating:"4.8",desc:"Burger daging sapi, selada, dan saus spesial.",image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"},
      {id:3,name:"Creamy Pasta",category:"Makanan",price:30000,rating:"4.8",desc:"Pasta lembut dengan saus creamy yang gurih.",image:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=80"},
      {id:4,name:"Fresh Salad Bowl",category:"Makanan",price:25000,rating:"4.7",desc:"Sayuran segar dengan dressing pilihan.",image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80"},
      {id:5,name:"Iced Matcha Latte",category:"Minuman",price:22000,rating:"4.9",desc:"Matcha dengan susu creamy dan es dingin.",image:"https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=700&q=80"},
      {id:6,name:"Iced Coffee",category:"Minuman",price:18000,rating:"4.8",desc:"Kopi dingin dengan rasa seimbang.",image:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80"}
    ];
    let cart = [];
    let activeCategory = "Semua";
    const rupiah = value => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(value);

    function renderProducts(){
      const term = document.getElementById("searchInput").value.toLowerCase().trim();
      const filtered = products.filter(p => (activeCategory==="Semua" || p.category===activeCategory) && (p.name.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term)));
      const grid = document.getElementById("menuGrid");
      if(!filtered.length){grid.innerHTML='<div class="empty">Menu tidak ditemukan. Coba kata kunci lain.</div>';return;}
      grid.innerHTML = filtered.map(p => `
        <article class="product">
          <img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy">
          <div class="product-body">
            <div class="product-top"><h3>${p.name}</h3><span class="rating">★ ${p.rating}</span></div>
            <p>${p.desc}</p>
            <div class="product-bottom"><span class="price">${rupiah(p.price)}</span><button class="add-btn" onclick="addToCart(${p.id})" aria-label="Tambah ${p.name}">+</button></div>
          </div>
        </article>`).join("");
    }
    function addToCart(id){
      const item=cart.find(x=>x.id===id);
      if(item)item.qty++;else cart.push({id,qty:1});
      renderCart();showToast("Menu ditambahkan ke keranjang");
    }
    function changeQty(id,delta){
      const item=cart.find(x=>x.id===id);if(!item)return;
      item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
      renderCart();
    }
    function removeItem(id){cart=cart.filter(x=>x.id!==id);renderCart();}
    function renderCart(){
      const count=cart.reduce((sum,x)=>sum+x.qty,0);
      const total=cart.reduce((sum,x)=>sum+products.find(p=>p.id===x.id).price*x.qty,0);
      document.getElementById("cartCount").textContent=count;
      document.getElementById("cartTotal").textContent=rupiah(total);
      const area=document.getElementById("cartItems");
      if(!cart.length){area.innerHTML='<p style="color:var(--muted);padding:25px 0">Keranjangmu masih kosong.</p>';return;}
      area.innerHTML=cart.map(x=>{
        const p=products.find(item=>item.id===x.id);
        return `<div class="cart-item"><div><b>${p.name}</b><small>${rupiah(p.price)} / item</small><div class="qty"><button onclick="changeQty(${p.id},-1)" aria-label="Kurangi">−</button><b>${x.qty}</b><button onclick="changeQty(${p.id},1)" aria-label="Tambah">+</button></div></div><div style="text-align:right"><b>${rupiah(p.price*x.qty)}</b><br><button class="remove" onclick="removeItem(${p.id})">Hapus</button></div></div>`;
      }).join("");
    }
    function openCart(){document.getElementById("cartPanel").classList.add("show");document.getElementById("overlay").classList.add("show");}
    function closeCart(){document.getElementById("cartPanel").classList.remove("show");document.getElementById("overlay").classList.remove("show");}
    let toastTimer;
    function showToast(message){const toast=document.getElementById("toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);}
    document.getElementById("filters").addEventListener("click",e=>{
      const btn=e.target.closest(".filter");if(!btn)return;
      activeCategory=btn.dataset.category;
      document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===btn));
      renderProducts();
    });
    document.getElementById("searchInput").addEventListener("input",renderProducts);
    document.getElementById("openCart").addEventListener("click",openCart);
    document.getElementById("closeCart").addEventListener("click",closeCart);
    document.getElementById("overlay").addEventListener("click",closeCart);
    document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("navLinks").classList.toggle("open"));
    document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>document.getElementById("navLinks").classList.remove("open")));
    document.getElementById("checkoutBtn").addEventListener("click",()=>{
      if(!cart.length){showToast("Keranjang masih kosong");return;}
      const summary=cart.map(x=>{const p=products.find(item=>item.id===x.id);return `${p.name} x${x.qty}`;}).join(", ");
      showToast("Pesanan demo dibuat: "+summary);
      cart=[];renderCart();closeCart();
    });
    document.getElementById("year").textContent=new Date().getFullYear();
    renderProducts();renderCart();
