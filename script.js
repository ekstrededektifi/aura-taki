// Aura Takı — iletişim ve görseller tek merkezden yönetilir.
const WHATSAPP_NUMBER = "905555555555";
const INSTAGRAM_URL = "https://instagram.com/aurataki";

// Gerçek ürün fotoğraflarını burada değiştirin.
const VISUALS = {
  hero: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85",
  about: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1000&q=85",
  "product-1": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
  "product-2": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=85",
  "product-3": "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=900&q=85",
  "product-4": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85"
};

const products = [
  { id:"luna-kolye", name:"Luna İnci Kolye", category:"Kolye", price:"₺890", image:"product-1", featured:true, description:"Işığı nazikçe yansıtan inci detaylarıyla, her stile uyum sağlayan zamansız bir kolye." },
  { id:"duru-bileklik", name:"Duru Zincir Bileklik", category:"Bileklik", price:"₺720", image:"product-2", featured:true, description:"Minimal çizgisi ve zarif dokusuyla gün boyu size eşlik edecek bileklik." },
  { id:"soleil-kupe", name:"Soleil Halka Küpe", category:"Küpe", price:"₺640", image:"product-3", featured:true, description:"Sade ama etkileyici, hafif ve parlak halka küpe tasarımı." },
  { id:"nova-yuzuk", name:"Nova Taşlı Yüzük", category:"Yüzük", price:"₺780", image:"product-4", featured:true, description:"Işıltılı taş detayıyla her anınıza zarafet katan ayarlanabilir yüzük." },
  { id:"sera-set", name:"Sera Zarafet Seti", category:"Setler", price:"₺1.490", image:"product-1", featured:false, description:"Birbiriyle uyumlu kolye ve küpeden oluşan, hediye için de ideal set." },
  { id:"mira-kolye", name:"Mira Zincir Kolye", category:"Kolye", price:"₺850", image:"product-2", featured:false, description:"Modern zincir formunun zamansız ve rafine yorumu." },
  { id:"lina-kupe", name:"Lina Damla Küpe", category:"Küpe", price:"₺690", image:"product-4", featured:false, description:"Akışkan damla formuyla hafif ve göz alıcı bir tasarım." },
  { id:"arya-yuzuk", name:"Arya İnce Yüzük", category:"Yüzük", price:"₺560", image:"product-3", featured:false, description:"Tek başına zarif, diğer yüzüklerle birlikte kusursuz görünen ince form." }
];

const imageStyle = key => VISUALS[key] ? `background-image:url("${VISUALS[key]}")` : "";
function productCard(p) {
  return `<a class="product-card" href="urun-detay.html?id=${p.id}">
    <div class="product-image photo ${p.image}" style="${imageStyle(p.image)}" role="img" aria-label="${p.name} görseli"></div>
    <div class="product-info"><small>${p.category}</small><h3>${p.name}</h3><b>${p.price}</b></div>
  </a>`;
}
function whatsappLink(product) {
  const msg=product?`Merhaba, ${product.name} (${product.price}) hakkında bilgi almak istiyorum.`:"Merhaba, ürünleriniz hakkında bilgi almak istiyorum.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
function addFooter(){
  const f=document.getElementById("footer-placeholder"); if(!f)return;
  f.innerHTML=`<div class="site-footer"><div class="footer-grid"><div><a class="brand footer-brand" href="index.html">AURA <em>TAKI</em></a><p class="footer-text">Günlük anları özel kılan, zarif ve modern takılar.</p></div><div><span class="footer-title">Keşfedin</span><nav class="footer-links"><a href="urunler.html">Ürünler</a><a href="hakkimizda.html">Hakkımızda</a><a href="iletisim.html">İletişim</a></nav></div><div><span class="footer-title">Bizi takip edin</span><nav class="footer-links"><a class="instagram-link" target="_blank" rel="noopener" href="#">Instagram ↗</a><a class="wa-link" href="#">WhatsApp ile sipariş ↗</a></nav></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Aura Takı. Tüm hakları saklıdır.</span><span>Sevgiyle tasarlandı.</span></div></div>`;
}
function setupLinks(){
 document.querySelectorAll(".wa-link").forEach(a=>{a.href=whatsappLink();a.target="_blank";a.rel="noopener";});
 document.querySelectorAll(".instagram-link").forEach(a=>a.href=INSTAGRAM_URL);
}
function setupMenu(){
 const btn=document.querySelector(".menu-toggle"),nav=document.querySelector(".main-nav");
 if(btn&&nav)btn.addEventListener("click",()=>{const open=nav.classList.toggle("open");btn.setAttribute("aria-expanded",open);});
}
function setupVisuals(){
 const hero=document.querySelector(".hero");
 if(hero&&VISUALS.hero)hero.style.setProperty("--hero-image",`url("${VISUALS.hero}")`);
 const about=document.querySelector(".about-art");
 if(about&&VISUALS.about)about.style.backgroundImage=`url("${VISUALS.about}")`;
}
function renderHome(){const t=document.getElementById("featured-products");if(t)t.innerHTML=products.filter(p=>p.featured).map(productCard).join("");}
function renderProducts(){
 const t=document.getElementById("all-products");if(!t)return;
 const params=new URLSearchParams(location.search);let category=params.get("category")||"Tümü";
 const draw=()=>{t.innerHTML=products.filter(p=>category==="Tümü"||p.category===category).map(productCard).join("")||"<p>Bu kategoride henüz ürün bulunmuyor.</p>";document.querySelectorAll(".filter-bar button").forEach(b=>b.classList.toggle("active",b.dataset.category===category));};
 document.querySelectorAll(".filter-bar button").forEach(b=>b.addEventListener("click",()=>{category=b.dataset.category;draw();}));draw();
}
function renderDetail(){
 const t=document.getElementById("product-detail");if(!t)return;
 const p=products.find(x=>x.id===new URLSearchParams(location.search).get("id"))||products[0];
 document.title=`${p.name} | Aura Takı`;
 t.innerHTML=`<div class="detail-image product-image photo ${p.image}" style="${imageStyle(p.image)}" role="img" aria-label="${p.name} görseli"></div><div class="detail-info"><p class="eyebrow">${p.category}</p><h1>${p.name}</h1><div class="price">${p.price}</div><p>${p.description}</p><ul><li>Özenle hazırlanan hediye paketi</li><li>WhatsApp üzerinden kişisel destek</li><li>Hızlı ve güvenli sipariş iletişimi</li></ul><a class="button wide-wa" target="_blank" rel="noopener" href="${whatsappLink(p)}">WhatsApp ile sipariş ver <span>→</span></a></div>`;
}
addFooter();setupLinks();setupMenu();setupVisuals();renderHome();renderProducts();renderDetail();
