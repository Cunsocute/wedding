const CONFIG = {
  groom: "Nguyễn Hoàng Minh",
  bride: "Hoàng Thùy Dương",
  weddingDate: "2026-11-29T14:00:00+07:00",
  musicSrc: "", // Đặt assets/wedding-music.mp3 nếu muốn dùng nhạc mặc định của website.
  supabaseUrl: "", // Dán Project URL của Supabase để lưu RSVP/lời chúc trực tuyến.
  supabaseAnonKey: "" // Chỉ dùng anon/public key, tuyệt đối không dùng service_role key ở frontend.
};
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const WISH_KEY = "qv-enduring-grace-wishes-v1";
const RSVP_KEY = "qv-enduring-grace-rsvps-v1";
const photos = [
  {src:"assets/Trang 1.jpg",alt:"Ảnh cưới Quang và Vân"},
  {src:"assets/LEO08078.jpg",alt:"Cô dâu và chú rể"},
  {src:"assets/LEO09408.jpg",alt:"Khoảnh khắc bên nhau"},
  {src:"assets/LEO09817.jpg",alt:"Ảnh chân dung đôi"},
  {src:"assets/LEO09936.jpg",alt:"Ảnh cưới"},
  {src:"assets/Trang 8.jpg",alt:"Cô dâu chú rể trong lễ phục"}
];

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => $("#preloader")?.classList.add("is-hidden"), 550);
  initScrollProgress(); initReveal(); initTilt(); initImageTransforms(); initScrollMorph(); initNavigation(); initCountdown();
  initCalendar(); initMusic(); initPetals(); initShare(); initLightbox();
  initWishBook(); initRsvp();
});

function initScrollProgress(){
  const bar=$("#progressBar");
  const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.width=`${max>0?scrollY/max*100:0}%`;};
  addEventListener("scroll",update,{passive:true});update();
}
function initReveal(){
  const nodes=$$(".reveal");
  if(!("IntersectionObserver" in window)){nodes.forEach(n=>n.classList.add("is-visible"));return;}
  const setDirection=node=>{
    const rect=node.getBoundingClientRect();
    const centerX=rect.left+rect.width/2;
    const side=centerX<innerWidth*.42?-1:centerX>innerWidth*.58?1:0;
    node.style.setProperty("--reveal-from-x",`${side*-34}px`);
    node.style.setProperty("--reveal-from-y",side?"18px":"28px");
  };
  nodes.forEach(setDirection);
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{
    e.target.classList.toggle("is-visible",e.isIntersecting);
  }),{threshold:.08,rootMargin:"-4% 0px -4% 0px"});
  nodes.forEach(n=>io.observe(n));
  addEventListener("resize",()=>nodes.forEach(setDirection),{passive:true});
}
function initTilt(){
  if(matchMedia("(hover: none)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  $$('[data-tilt]').forEach(card=>{
    const isPhoto=card.classList.contains("gallery-item");
    card.addEventListener("pointermove",e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      const strength=isPhoto?7:3.2;
      card.style.setProperty("--pointer-x",`${(x+.5)*100}%`);
      card.style.setProperty("--pointer-y",`${(y+.5)*100}%`);
      card.style.transform=`perspective(${isPhoto?1100:1000}px) rotateX(${-y*strength}deg) rotateY(${x*strength}deg) translateY(${isPhoto?-4:-2}px) translateZ(${isPhoto?8:0}px)`;
    });
    card.addEventListener("pointerleave",()=>{
      card.style.transform="perspective(1100px) rotateX(0) rotateY(0) translateY(0) translateZ(0)";
      card.style.setProperty("--pointer-x","50%");
      card.style.setProperty("--pointer-y","50%");
    });
  });
}

// Scroll morph: feature cards and photographs smoothly change shape as they pass the viewport center.
function initScrollMorph(){
  const targets=$$("[data-morph-scroll]");
  if(!targets.length)return;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const progressByTarget=new WeakMap();
  let frame=0;
  const clamp=(value,min=0,max=1)=>Math.min(max,Math.max(min,value));
  const paint=(el,progress,side)=>{
    const p=reduced?1:progress;
    const edge=1-p;
    el.style.setProperty("--morph-progress",p.toFixed(3));
    el.style.setProperty("--morph-edge",edge.toFixed(3));
    el.style.setProperty("--morph-x",`${(side*edge*42).toFixed(2)}px`);
    el.style.setProperty("--morph-y",`${(edge*24).toFixed(2)}px`);
    el.style.setProperty("--morph-scale",(0.965+p*0.035).toFixed(3));
    el.style.setProperty("--morph-radius",`${(edge*46).toFixed(2)}px`);
    el.style.setProperty("--morph-inset",`${(edge*5.5).toFixed(2)}%`);
    el.style.setProperty("--morph-blur",`${(edge*1.4).toFixed(2)}px`);
    el.style.setProperty("--morph-letter-space",`${(edge*.045).toFixed(3)}em`);
  };
  const update=()=>{
    frame=0;
    const vh=innerHeight||800;
    let isMoving=false;
    targets.forEach((el,index)=>{
      const rect=el.getBoundingClientRect();
      const centerX=rect.left+rect.width/2;
      const side=centerX<innerWidth*.42?-1:centerX>innerWidth*.58?1:(index%2?-1:1);
      if(reduced){paint(el,1,side);return;}
      let targetProgress=0;
      if(rect.bottom>=-80&&rect.top<=vh+80){
        const centerY=rect.top+rect.height/2;
        const range=vh*.68+Math.min(rect.height, vh)*.12;
        targetProgress=clamp(1-Math.abs(centerY-vh*.52)/range);
      }
      const current=progressByTarget.has(el)?progressByTarget.get(el):targetProgress;
      const difference=targetProgress-current;
      const progress=Math.abs(difference)<.004?targetProgress:current+difference*.075;
      if(progress!==targetProgress)isMoving=true;
      progressByTarget.set(el,progress);
      paint(el,progress,side);
    });
    if(isMoving)frame=requestAnimationFrame(update);
  };
  const request=()=>{if(!frame)frame=requestAnimationFrame(update);};
  if(reduced){targets.forEach((el,index)=>paint(el,1,index%2?-1:1));return;}
  addEventListener("scroll",request,{passive:true});
  addEventListener("resize",request,{passive:true});
  request();
}

// Cinematic parallax: photographs move at a different speed from the page.
function initImageTransforms(){
  const targets=$$(".save-date-image img,.dress-image img,.closing-photo");
  if(!targets.length || matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  let frame=0;
  const update=()=>{
    frame=0;
    const vh=innerHeight||800;
    targets.forEach(img=>{
      const r=img.parentElement.getBoundingClientRect();
      if(r.bottom<-100||r.top>vh+100)return;
      const center=r.top+r.height/2;
      const offset=(center-vh/2)/vh;
      const travel=Math.max(-34,Math.min(34,-offset*42));
      img.style.setProperty("--parallax-y",`${travel.toFixed(1)}px`);
    });
  };
  const requestUpdate=()=>{if(!frame)frame=requestAnimationFrame(update);};
  addEventListener("scroll",requestUpdate,{passive:true});
  addEventListener("resize",requestUpdate,{passive:true});
  requestUpdate();
}
function initNavigation(){
  const btn=$("#menuToggle"),nav=$("#mainNav");
  btn?.addEventListener("click",()=>{const open=nav.classList.toggle("open");btn.setAttribute("aria-expanded",String(open));btn.textContent=open?"×":"☰";});
  $$("#mainNav a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");btn?.setAttribute("aria-expanded","false");if(btn)btn.textContent="☰";}));
}
function initCountdown(){
  const target=new Date(CONFIG.weddingDate).getTime();
  const fields={days:$("#days"),hours:$("#hours"),minutes:$("#minutes"),seconds:$("#seconds")};
  const pad=n=>String(n).padStart(2,"0");
  const update=()=>{let t=Math.max(0,target-Date.now());const days=Math.floor(t/86400000);t%=86400000;const hours=Math.floor(t/3600000);t%=3600000;const minutes=Math.floor(t/60000);t%=60000;const seconds=Math.floor(t/1000);for(const [k,v] of Object.entries({days,hours,minutes,seconds}))if(fields[k])fields[k].textContent=pad(v);};
  update();setInterval(update,1000);
}
function initCalendar(){
  const grid=$("#calendarGrid");if(!grid)return;
  const weekdays=["MON","TUE","WED","THU","FRI","SAT","SUN"];
  weekdays.forEach(d=>{const el=document.createElement("div");el.className="calendar-cell weekday";el.textContent=d;grid.append(el);});
  const first=new Date(2026,10,1);let offset=(first.getDay()+6)%7;const total=new Date(2026,11,0).getDate();
  for(let i=0;i<offset;i++){const el=document.createElement("div");el.className="calendar-cell empty";el.textContent="";grid.append(el);}
  for(let d=1;d<=total;d++){const el=document.createElement("div");el.className=`calendar-cell${d===28||d===29?" marked":""}`;el.textContent=d;el.setAttribute("aria-label",`${d} tháng 11 năm 2026`);grid.append(el);}
}

function initMusic(){
  const btn=$("#musicToggle"),floatBtn=$("#floatingMusic"),choose=$("#chooseMusic"),fileInput=$("#musicFile");if(!btn)return;
  let audio=null,ctx=null,playing=false,timer=null,customUrl="",customSelected=false,note=0;
  const melody=[[523.25,.5],[659.25,.5],[783.99,.65],[659.25,.5],[698.46,.5],[659.25,.5],[587.33,.7],[523.25,.8],[440,.5],[523.25,.5],[659.25,.65],[587.33,.5],[523.25,.5],[493.88,.7],[523.25,.8]];
  function paint(){btn.classList.toggle("is-playing",playing);btn.title=playing?"Tắt nhạc nền":"Bật nhạc nền";btn.setAttribute("aria-label",btn.title);if(floatBtn)floatBtn.textContent=playing?"Ⅱ":"♫";}
  function synthNote(freq,duration){if(!ctx)return;const t=ctx.currentTime+.02;const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type="sine";osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.035,t+.04);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);osc.connect(gain).connect(ctx.destination);osc.start(t);osc.stop(t+duration+.05);}
  async function play(){
    try{
      if(customSelected||CONFIG.musicSrc.trim()){
        if(!audio){audio=new Audio(customSelected?customUrl:CONFIG.musicSrc);audio.loop=true;audio.volume=.45;}
        await audio.play();
      }else{
        const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw new Error("Trình duyệt không hỗ trợ nhạc nền.");
        if(!ctx)ctx=new AC();await ctx.resume();note=0;
        const tick=()=>{if(!playing)return;const [f,d]=melody[note%melody.length];synthNote(f,d);if(note%4===0)synthNote(f/2,d*1.2);note++;};tick();timer=setInterval(tick,560);
      }
      playing=true;paint();
    }catch(e){playing=false;paint();alert(e.message||"Không thể phát nhạc. Hãy thử chọn file MP3 khác.");}
  }
  function stop(){playing=false;if(timer)clearInterval(timer);timer=null;if(audio)audio.pause();paint();}
  const toggle=()=>playing?stop():play();btn.addEventListener("click",toggle);floatBtn?.addEventListener("click",toggle);
  choose?.addEventListener("click",()=>fileInput.click());
  fileInput?.addEventListener("change",()=>{const f=fileInput.files?.[0];if(!f)return;if(!f.type.startsWith("audio/")&&!/\.(mp3|m4a|wav|ogg|aac)$/i.test(f.name)){alert("Vui lòng chọn file âm thanh hợp lệ.");return;}stop();if(customUrl)URL.revokeObjectURL(customUrl);customUrl=URL.createObjectURL(f);customSelected=true;audio=new Audio(customUrl);audio.loop=true;audio.volume=.5;play();});
  addEventListener("beforeunload",()=>{if(customUrl)URL.revokeObjectURL(customUrl);});paint();
}

function initPetals(){
  const layer=$("#petalLayer"),toggle=$("#petalToggle");if(!layer)return;let active=true;
  function drop(){if(!active||document.hidden)return;const p=document.createElement("span");p.className="petal";p.style.left=`${Math.random()*100}%`;p.style.setProperty("--drift",`${Math.round((Math.random()-.5)*220)}px`);p.style.animationDuration=`${8+Math.random()*8}s`;layer.append(p);setTimeout(()=>p.remove(),17000);}
  const interval=setInterval(drop,850);toggle?.addEventListener("click",()=>{active=!active;layer.style.display=active?"block":"none";toggle.classList.toggle("is-active",active);});
  addEventListener("beforeunload",()=>clearInterval(interval));
}
function initShare(){
  $("#shareInvite")?.addEventListener("click",async()=>{const data={title:document.title,text:"Thiệp cưới Nguyễn Hoàng Minh & Hoàng Thùy Dương",url:location.href};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(location.href);alert("Đã sao chép liên kết thiệp cưới.");}}catch(e){if(e.name!=="AbortError")alert("Không thể chia sẻ liên kết trong trình duyệt này.");}});
}
function initLightbox(){
  const viewer=$("#photoViewer"),img=$("#viewerImage"),caption=$("#viewerCaption");let index=0,zoom=1,slideTimer=null,touchX=0,isTurning=false;
  const updateCaption=()=>{caption.textContent=`${String(index+1).padStart(2,"0")} / ${String(photos.length).padStart(2,"0")}`;};
  const open=i=>{index=(i+photos.length)%photos.length;zoom=1;img.className="";img.src=photos[index].src;img.alt=photos[index].alt;img.style.transform="scale(1)";$("#zoomReset").textContent="100%";updateCaption();viewer.hidden=false;document.body.classList.add("modal-open");};
  const close=()=>{viewer.hidden=true;document.body.classList.remove("modal-open");stopSlide();};
  const go=step=>{
    if(isTurning)return;
    isTurning=true;
    index=(index+step+photos.length)%photos.length;
    img.classList.remove("flip-out","next","prev");
    void img.offsetWidth;
    img.classList.add("flip-out",step>0?"next":"prev");
    setTimeout(()=>{
      img.src=photos[index].src;
      img.alt=photos[index].alt;
      zoom=1;
      img.style.transform="scale(1)";
      $("#zoomReset").textContent="100%";
      updateCaption();
      img.classList.remove("flip-out","next","prev");
      isTurning=false;
    },310);
  };
  const setZoom=v=>{zoom=Math.min(2.6,Math.max(.6,v));img.style.transform=`scale(${zoom})`;$("#zoomReset").textContent=`${Math.round(zoom*100)}%`;};
  function stopSlide(){if(slideTimer)clearInterval(slideTimer);slideTimer=null;$("#slideshow").textContent="▶ Trình chiếu";}
  $$(".gallery-item").forEach((b,i)=>b.addEventListener("click",()=>open(i)));
  $$(".js-photo").forEach(el=>{if(el.closest(".gallery-item")||el.closest(".hero-photo-wrap"))return;el.addEventListener("click",()=>{const src=el.getAttribute("src");const i=photos.findIndex(p=>p.src===src);open(i>=0?i:0);});});
  $("#viewerClose").addEventListener("click",close);$("#viewerPrev").addEventListener("click",()=>go(-1));$("#viewerNext").addEventListener("click",()=>go(1));
  $("#zoomIn").addEventListener("click",()=>setZoom(zoom+.2));$("#zoomOut").addEventListener("click",()=>setZoom(zoom-.2));$("#zoomReset").addEventListener("click",()=>setZoom(1));
  $("#slideshow").addEventListener("click",()=>{if(slideTimer){stopSlide();return;}$("#slideshow").textContent="Ⅱ Tạm dừng";slideTimer=setInterval(()=>go(1),2800);});
  viewer.addEventListener("click",e=>{if(e.target===viewer)close();});
  viewer.addEventListener("touchstart",e=>{touchX=e.changedTouches[0].screenX;},{passive:true});viewer.addEventListener("touchend",e=>{const dx=e.changedTouches[0].screenX-touchX;if(Math.abs(dx)>55)go(dx<0?1:-1);},{passive:true});
  addEventListener("keydown",e=>{if(viewer.hidden)return;if(e.key==="Escape")close();if(e.key==="ArrowRight")go(1);if(e.key==="ArrowLeft")go(-1);if(e.key==="+")setZoom(zoom+.2);if(e.key==="-")setZoom(zoom-.2);});
}

function localRead(key){try{const v=JSON.parse(localStorage.getItem(key)||"[]");return Array.isArray(v)?v:[];}catch{return [];}}
function localWrite(key,item,max=100){const all=localRead(key);all.unshift(item);localStorage.setItem(key,JSON.stringify(all.slice(0,max)));}
function supabaseReady(){return Boolean(CONFIG.supabaseUrl.trim()&&CONFIG.supabaseAnonKey.trim());}
async function supabase(table,method,body){const response=await fetch(`${CONFIG.supabaseUrl.replace(/\/$/,"")}/rest/v1/${table}`,{method,headers:{apikey:CONFIG.supabaseAnonKey,Authorization:`Bearer ${CONFIG.supabaseAnonKey}`,"Content-Type":"application/json",Prefer:method==="POST"?"return=minimal":"return=representation"},body:body?JSON.stringify(body):undefined});if(!response.ok)throw new Error(`Lưu trực tuyến thất bại (HTTP ${response.status}).`);const text=await response.text();return text?JSON.parse(text):[];}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderWishes(items){const list=$("#wishList");if(!list)return;list.innerHTML="";$("#wishCount").textContent=`${items.length} lời chúc`;if(!items.length){list.innerHTML='<p class="storage-note">Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc nhé!</p>';return;}items.slice(0,30).forEach(w=>{const el=document.createElement("article");el.className="wish-entry";const date=w.created_at?new Date(w.created_at):new Date(w.date||Date.now());el.innerHTML=`<strong>${esc(w.name||"Một người bạn")}</strong><p>${esc(w.message||"")}</p><time>${date.toLocaleDateString("vi-VN")}</time>`;list.append(el);});}
async function initWishBook(){
  renderWishes(localRead(WISH_KEY));
  if(supabaseReady()){try{const rows=await supabase("wedding_wishes?select=name,message,created_at&order=created_at.desc&limit=40","GET");renderWishes(rows);}catch(e){$("#storageNote").textContent="Chưa kết nối được sổ lời chúc trực tuyến. Lời chúc mới vẫn được lưu trên thiết bị này.";}}
  $("#wishForm")?.addEventListener("submit",async e=>{e.preventDefault();const data=new FormData(e.currentTarget);const item={name:String(data.get("name")).trim(),message:String(data.get("message")).trim(),created_at:new Date().toISOString()};if(!item.name||!item.message)return;const feedback=$("#wishFeedback");
    try{if(supabaseReady())await supabase("wedding_wishes","POST",item);else localWrite(WISH_KEY,item);feedback.textContent="Cảm ơn bạn đã gửi lời chúc!";e.currentTarget.reset();if(supabaseReady()){const rows=await supabase("wedding_wishes?select=name,message,created_at&order=created_at.desc&limit=40","GET");renderWishes(rows);}else renderWishes(localRead(WISH_KEY));}
    catch(err){localWrite(WISH_KEY,item);renderWishes(localRead(WISH_KEY));feedback.textContent="Lời chúc đã lưu tạm trên thiết bị này. "+err.message;}
  });
  const open=()=>{ $("#wishModal").hidden=false;document.body.classList.add("modal-open");};const close=()=>{$("#wishModal").hidden=true;document.body.classList.remove("modal-open");};
  ["#floatingWish","#footerWish"].forEach(s=>$(s)?.addEventListener("click",open));$("#closeWishes")?.addEventListener("click",close);$("#wishModal")?.addEventListener("click",e=>{if(e.target.id==="wishModal")close();});
}
function initRsvp(){
  $("#rsvpForm")?.addEventListener("submit",async e=>{e.preventDefault();const d=new FormData(e.currentTarget);const item={name:String(d.get("name")).trim(),attendance:String(d.get("attendance")),guests:Number(d.get("guests")),side:String(d.get("side")),message:String(d.get("message")||"").trim(),created_at:new Date().toISOString()};if(!item.name)return;const feedback=$("#rsvpFeedback");
    try{if(supabaseReady())await supabase("wedding_rsvps","POST",item);else localWrite(RSVP_KEY,item,200);feedback.textContent="Cảm ơn bạn! Xác nhận tham dự đã được ghi nhận.";e.currentTarget.reset();}
    catch(err){localWrite(RSVP_KEY,item,200);feedback.textContent="Đã lưu xác nhận trên thiết bị này. "+err.message;}
  });
}
