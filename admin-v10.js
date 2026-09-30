const cfg=window.AURA_CONFIG||{url:"https://bqzpwyormeqiymvndwtm.supabase.co",publishableKey:"sb_publishable_F1Q0gqxSjlBc_3xbo3NO_w_ZYPn4Gty"};
const ready=!!(cfg.url&&cfg.publishableKey&&!cfg.url.includes("YOUR_")&&!cfg.publishableKey.includes("YOUR_"));
let db=null,currentProducts=[];
const $=id=>document.getElementById(id);
function msg(id,t){const el=$(id);if(el)el.textContent=t||"";}
if(ready&&window.supabase)db=window.supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true}});

async function isAdmin(user){
  if(!db)throw new Error("Supabase bağlantısı hazır değil.");
  if(!user)return false;
  const q=db.from("site_admins").select("user_id").eq("user_id",user.id).maybeSingle();
  const timeout=new Promise((_,reject)=>setTimeout(()=>reject(new Error("Yönetici kontrolü zaman aşımına uğradı.")),10000));
  const {data,error}=await Promise.race([q,timeout]);
  if(error)throw error;
  return !!data;
}
async function boot(user){
  if(!ready||!db){msg("login-msg","Supabase bağlantısı bulunamadı.");return;}
  msg("login-msg","Kontrol ediliyor...");
  try{
    if(!user){const s=await db.auth.getSession();user=s.data.session?.user||null;}
    const ok=await isAdmin(user);
    $("login").hidden=ok;$("app").hidden=!ok;
    if(ok)await loadAll();
    else msg("login-msg","Bu hesap Aura Takı yöneticisi olarak tanımlı değil.");
  }catch(e){console.error(e);msg("login-msg","Hata: "+(e.message||e));}
}
$("login-form").addEventListener("submit",async e=>{
  e.preventDefault();
  msg("login-msg","Giriş yapılıyor...");
  try{
    const {data,error}=await db.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});
    if(error){msg("login-msg","Giriş hatası: "+error.message);return;}
    await boot(data.user);
  }catch(e){console.error(e);msg("login-msg","Bağlantı hatası: "+(e.message||e));}
});
$("logout").addEventListener("click",async()=>{await db.auth.signOut();location.reload();});
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tabs button").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(b.dataset.tab).classList.add("active");});
async function loadAll(){await loadProducts();await loadSettings();}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
async function loadProducts(){const{data,error}=await db.from("products").select("*").order("sort_order").order("created_at");if(error){alert(error.message);return}currentProducts=data||[];$("product-list").innerHTML=currentProducts.map(p=>`<article class="product-row"><div class="thumb" style="background-image:url('${p.image_url||""}')"></div><div><h3>${esc(p.name)}</h3><small>${esc(p.category)} · ${esc(p.price)} ${p.active?'<span class="badge">Yayında</span>':'<span class="badge">Gizli</span>'} ${p.featured?'<span class="badge">Öne çıkan</span>':''}</small></div><div class="actions"><button onclick="editProduct('${p.id}')">Düzenle</button><button class="danger" onclick="deleteProduct('${p.id}')">Sil</button></div></article>`).join("")||"<p>Henüz ürün yok.</p>";$("product-count").textContent=currentProducts.length;$("active-count").textContent=currentProducts.filter(p=>p.active).length;$("featured-count").textContent=currentProducts.filter(p=>p.featured).length}
function openProduct(p={}){$("modal").hidden=false;$("modal-title").textContent=p.id?"Ürünü düzenle":"Yeni ürün";$("product-id").value=p.id||"";$("p-name").value=p.name||"";$("p-category").value=p.category||"Kolye";$("p-price").value=p.price||"";$("p-description").value=p.description||"";$("p-featured").checked=!!p.featured;$("p-active").checked=p.id?p.active!==false:true;$("current-image").textContent=p.image_url?"Mevcut fotoğraf yüklü. Yeni fotoğraf seçerseniz değişir.":""}
window.editProduct=id=>openProduct(currentProducts.find(p=>p.id===id)||{});$("new-product").onclick=()=>openProduct();$("close-modal").onclick=()=>{$("modal").hidden=true};
async function uploadImage(file,folder="images"){if(!file)return"";if(file.size>6*1024*1024)throw new Error("Fotoğraf 6 MB'dan küçük olmalı.");const ext=(file.name.split(".").pop()||"jpg").toLowerCase();const path=folder+"/"+crypto.randomUUID()+"."+ext;const{error}=await db.storage.from("site-images").upload(path,file,{cacheControl:"31536000",contentType:file.type});if(error)throw error;return db.storage.from("site-images").getPublicUrl(path).data.publicUrl}
$("product-form").addEventListener("submit",async e=>{e.preventDefault();msg("product-msg","Kaydediliyor...");try{const id=$("product-id").value;const old=currentProducts.find(p=>p.id===id);const file=$("p-image").files[0];const image=file?await uploadImage(file,"products"):(old?.image_url||"");const row={name:$("p-name").value.trim(),category:$("p-category").value,price:$("p-price").value.trim(),description:$("p-description").value.trim(),image_url:image,featured:$("p-featured").checked,active:$("p-active").checked,updated_at:new Date().toISOString()};let error;if(id){({error}=await db.from("products").update(row).eq("id",id))}else{row.sort_order=currentProducts.length;({error}=await db.from("products").insert(row))}if(error)throw error;$("modal").hidden=true;await loadProducts()}catch(e){msg("product-msg",e.message)}});
window.deleteProduct=async id=>{if(!confirm("Bu ürünü silmek istediğinize emin misiniz?"))return;const{error}=await db.from("products").delete().eq("id",id);if(error)alert(error.message);else await loadProducts()};
async function loadSettings(){const{data,error}=await db.from("site_settings").select("*").limit(1).maybeSingle();if(error){alert(error.message);return}const s=data||{};window.__siteSettingsId=s.id||null;$("settings-form").innerHTML=`<h3>İletişim bilgileri</h3><label>WhatsApp numarası<input name="whatsapp" value="${esc(s.whatsapp)}" placeholder="905xxxxxxxxx"></label><label>Telefon<input name="phone" value="${esc(s.phone)}"></label><label>E-posta<input name="email" value="${esc(s.email)}"></label><label>Instagram<input name="instagram" value="${esc(s.instagram)}" placeholder="https://instagram.com/..."></label><label>TikTok<input name="tiktok" value="${esc(s.tiktok)}" placeholder="https://tiktok.com/@..."></label><label>Facebook<input name="facebook" value="${esc(s.facebook)}" placeholder="https://facebook.com/..."></label><label class="full">Adres<input name="address" value="${esc(s.address)}"></label><h3>Görseller</h3><label>Logo URL<input name="logo_url" value="${esc(s.logo_url)}" placeholder="İsterseniz URL"></label><label>Logo yükle<input id="logo-file" type="file" accept="image/*"></label><label>Kapak görseli URL<input name="hero_image" value="${esc(s.hero_image)}"></label><label>Kapak görseli yükle<input id="hero-file" type="file" accept="image/*"></label><label>Hakkımızda görseli URL<input name="about_image" value="${esc(s.about_image)}"></label><label>Hakkımızda görseli yükle<input id="about-file" type="file" accept="image/*"></label><h3 class="full">Ana sayfa metinleri</h3><label>Marka adı<input name="brand" value="${esc(s.brand)}"></label><label>SEO açıklaması<input name="seo_description" value="${esc(s.seo_description)}"></label><label>Hikâye başlığı<input name="story_title" value="${esc(s.story_title)}"></label><label class="full">Hikâye metni<textarea name="story_text" rows="4">${esc(s.story_text)}</textarea></label><button>Site ayarlarını kaydet</button><p id="settings-msg" class="msg full"></p>`}
$("settings-form").onsubmit=async e=>{e.preventDefault();msg("settings-msg","Kaydediliyor...");try{const f=new FormData(e.target),row=Object.fromEntries(f.entries());row.updated_at=new Date().toISOString();for(const [input,field] of [["logo-file","logo_url"],["hero-file","hero_image"],["about-file","about_image"]]){const file=$(input).files[0];if(file)row[field]=await uploadImage(file,"site")}let error;if(window.__siteSettingsId){({error}=await db.from("site_settings").update(row).eq("id",window.__siteSettingsId));}else{({error}=await db.from("site_settings").insert(row));}if(error)throw error;msg("settings-msg","Kaydedildi ✓")}catch(e){msg("settings-msg",e.message)}};
boot();