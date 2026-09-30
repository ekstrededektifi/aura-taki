// Yalnızca bu iki bağlantıyı değiştirerek iletişim bilgilerini güncelleyebilirsiniz.
const WHATSAPP_NUMBER = "905555555555";
const INSTAGRAM_URL = "https://instagram.com/aurataki";

/*
  GÖRSEL YÖNETİMİ
  Aşağıdaki boş tırnakların arasına doğrudan görsel URL'si yapıştırın.
  Alan boş bırakılırsa mevcut şık CSS placeholder'ı görünmeye devam eder.
  Önerilen oranlar: hero 4:3, kategori/ürün 1:1, hikâye ve hakkımızda 4:5.
*/
const VISUALS = {
  logoUrl: "", // Örn: "https://site-adresiniz.com/logo.svg"
  hero: "",
  story: "",
  about: "",
  categories: { "Kolye": "", "Bileklik": "", "Küpe": "", "Yüzük": "", "Setler": "" }
};

// Yeni ürün eklemek veya mevcut ürünleri düzenlemek için bu listeyi kullanın.
// Her ürünün imageUrl alanına görsel URL'si yapıştırmanız yeterlidir.
const products = [
  { id: "luna-kolye", name: "Luna İnci Kolye", category: "Kolye", price: "₺890", imageUrl: "", placeholder: "product-1", featured: true, description: "Işığı nazikçe yansıtan inci detaylarıyla, her stile uyum sağlayan zamansız bir kolye." },
  { id: "duru-bileklik", name: "Duru Zincir Bileklik", category: "Bileklik", price: "₺720", imageUrl: "", placeholder: "product-2", featured: true, description: "Minimal çizgisi ve zarif dokusuyla gün boyu size eşlik edecek bileklik." },
  { id: "soleil-kupe", name: "Soleil Halka Küpe", category: "Küpe", price: "₺640", imageUrl: "", placeholder: "product-3", featured: true, description: "Sade ama etkileyici, hafif ve parlak halka küpe tasarımı." },
  { id: "nova-yuzuk", name: "Nova Taşlı Yüzük", category: "Yüzük", price: "₺780", imageUrl: "", placeholder: "product-4", featured: true, description: "Işıltılı taş detayıyla her anınıza zarafet katan ayarlanabilir yüzük." },
  { id: "sera-set", name: "Sera Zarafet Seti", category: "Setler", price: "₺1.490", imageUrl: "", placeholder: "product-1", featured: false, description: "Birbiriyle uyumlu kolye ve küpeden oluşan, hediye için de ideal set." },
  { id: "mira-kolye", name: "Mira Zincir Kolye", category: "Kolye", price: "₺850", imageUrl: "", placeholder: "product-2", featured: false, description: "Modern zincir formunun zamansız ve rafine yorumu." },
  { id: "lina-kupe", name: "Lina Damla Küpe", category: "Küpe", price: "₺690", imageUrl: "", placeholder: "product-4", featured: false, description: "Akışkan damla formuyla hafif ve göz alıcı bir tasarım." },
  { id: "arya-yuzuk", name: "Arya İnce Yüzük", category: "Yüzük", price: "₺560", imageUrl: "", placeholder: "product-3", featured: false, description: "Tek başına zarif, diğer yüzüklerle birlikte kusursuz görünen ince form." }
];

function imageStyle(url) { return url ? ` style="background-image:url('${url.replace(/'/g, "%27")}')"` : ""; }
function productImage(product, extraClass = "") { const imageClass = product.imageUrl ? "has-image" : product.placeholder; return `<div class="product-image ${imageClass} ${extraClass}"${imageStyle(product.imageUrl)} role="img" aria-label="${product.name} görseli"></div>`; }
function productCard(product) { return `<a class="product-card" href="urun-detay.html?id=${product.id}">${productImage(product)}<div class="product-info"><small>${product.category}</small><h3>${product.name}</h3><b>${product.price}</b></div></a>`; }
function whatsappLink(product) { const msg = product ? `Merhaba, ${product.name} (${product.price}) hakkında bilgi almak istiyorum.` : "Merhaba, ürünleriniz hakkında bilgi almak istiyorum."; return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`; }
function addFooter() { const footer = document.getElementById("footer-placeholder"); if (!footer) return; footer.innerHTML = `<div class="site-footer"><div class="footer-grid"><div><a class="brand footer-brand" href="index.html">AURA <em>TAKI</em></a><p class="footer-text">Günlük anları özel kılan, zarif ve modern takılar.</p></div><div><span class="footer-title">Keşfedin</span><nav class="footer-links"><a href="urunler.html">Ürünler</a><a href="hakkimizda.html">Hakkımızda</a><a href="iletisim.html">İletişim</a></nav></div><div><span class="footer-title">Bizi takip edin</span><nav class="footer-links"><a class="instagram-link" target="_blank" rel="noopener" href="#">Instagram ↗</a><a class="wa-link" href="#">WhatsApp ile sipariş ↗</a></nav></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Aura Takı. Tüm hakları saklıdır.</span><span>Sevgiyle tasarlandı.</span></div></div>`; }
function setupLinks() { document.querySelectorAll(".wa-link").forEach(a => { a.href = whatsappLink(); a.target = "_blank"; a.rel = "noopener"; }); document.querySelectorAll(".instagram-link").forEach(a => a.href = INSTAGRAM_URL); }
function setVisual(selector, url) { if (!url) return; document.querySelectorAll(selector).forEach(element => { element.style.backgroundImage = `url('${url.replace(/'/g, "%27")}')`; element.classList.add("has-image"); }); }
function setupVisuals() { setVisual(".hero-art", VISUALS.hero); setVisual(".story-shape", VISUALS.story); setVisual(".about-art", VISUALS.about); Object.entries(VISUALS.categories).forEach(([name, url]) => setVisual(`.category-card[href*="category=${name}"]`, url)); if (VISUALS.logoUrl) document.querySelectorAll(".brand").forEach(brand => { brand.innerHTML = `<img src="${VISUALS.logoUrl}" alt="Aura Takı">`; brand.classList.add("has-logo"); }); }
function setupMenu() { const btn = document.querySelector(".menu-toggle"), nav = document.querySelector(".main-nav"); if (btn && nav) btn.addEventListener("click", () => { const open = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", open); }); }
function renderHome() { const target = document.getElementById("featured-products"); if (target) target.innerHTML = products.filter(p => p.featured).map(productCard).join(""); }
function renderProducts() { const target = document.getElementById("all-products"); if (!target) return; const params = new URLSearchParams(location.search); let category = params.get("category") || "Tümü"; const draw = () => { target.innerHTML = products.filter(p => category === "Tümü" || p.category === category).map(productCard).join("") || "<p>Bu kategoride henüz ürün bulunmuyor.</p>"; document.querySelectorAll(".filter-bar button").forEach(b => b.classList.toggle("active", b.dataset.category === category)); }; document.querySelectorAll(".filter-bar button").forEach(b => b.addEventListener("click", () => { category = b.dataset.category; draw(); })); draw(); }
function renderDetail() { const target = document.getElementById("product-detail"); if (!target) return; const product = products.find(p => p.id === new URLSearchParams(location.search).get("id")) || products[0]; document.title = `${product.name} | Aura Takı`; target.innerHTML = `${productImage(product, "detail-image")}<div class="detail-info"><p class="eyebrow">${product.category}</p><h1>${product.name}</h1><div class="price">${product.price}</div><p>${product.description}</p><ul><li>Özenle hazırlanan hediye paketi</li><li>WhatsApp üzerinden kişisel destek</li><li>Hızlı ve güvenli sipariş iletişimi</li></ul><a class="button wide-wa" target="_blank" rel="noopener" href="${whatsappLink(product)}">WhatsApp ile sipariş ver <span>→</span></a></div>`; }
addFooter(); setupLinks(); setupVisuals(); setupMenu(); renderHome(); renderProducts(); renderDetail();
