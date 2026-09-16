/* =====================================================================
   CONFIG — modifica qui i dati principali del sito
   ===================================================================== */
window.SITE = {
  nome: "Ele",                       // nome della festeggiata
  titolo: "Fisica Medica",           // corso di laurea
  citta: "Pisa",
  dataFesta: "2026-09-23T16:30:00",  // data/ora della laurea (formato AAAA-MM-GGThh:mm:ss)
  labelData: "23 settembre 2026",    // come mostrarla in chiaro
  aperitivo: "aperitivo dalle 19:30" // quando si festeggia
};

/* =====================================================================
   Navigazione condivisa (iniettata in ogni pagina)
   ===================================================================== */
(function(){
  var S = window.SITE;
  var pages = [
    {href:"index.html",    txt:"Home"},
    {href:"papiro.html",   txt:"Il Papiro"},
    {href:"referto.html",  txt:"Le Analisi"},
    {href:"percorso.html", txt:"Anamnesi"},
    {href:"muro.html",     txt:"Il Muro"},
    {href:"galleria.html", txt:"Radiografie"},
    {href:"auguri.html",   txt:"Prognosi"}
  ];
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if(here === "") here = "index.html";

  var links = pages.map(function(p){
    var on = p.href.toLowerCase() === here ? ' class="active"' : "";
    return '<a href="'+p.href+'"'+on+'>'+p.txt+'</a>';
  }).join("");

  var nav = document.getElementById("nav-mount");
  if(nav){
    nav.outerHTML =
      '<nav class="site-nav"><div class="nav-in">'+
        '<a class="logo" href="index.html">'+
          '<span class="cross" aria-hidden="true"></span>'+
          '<span><b>Cartella Clinica di '+S.nome+'</b>'+
          '<span>U.O. '+S.titolo+' · '+S.citta+'</span></span>'+
        '</a>'+
        '<div class="nav-links" id="navLinks">'+links+'</div>'+
        '<div class="nav-tools">'+
          '<button class="theme-btn" id="themeBtn" type="button" aria-label="Cambia tema">Tema</button>'+
          '<button class="burger" id="burger" type="button" aria-label="Menu" aria-expanded="false">Menu</button>'+
        '</div>'+
      '</div></nav>'+
      '<div class="scrim" id="scrim"></div>';
  }

  var foot = document.getElementById("footer-mount");
  if(foot){
    foot.outerHTML =
      '<footer><div class="wrap foot-in">'+
        '<div>Fatto co\' affetto pe\' la laurea de '+S.nome+' · '+S.titolo+' · '+S.citta+'</div>'+
        '<div class="foot-links">'+
          '<a href="papiro.html">Il Papiro</a>'+
          '<a href="muro.html">Il Muro</a>'+
          '<a href="auguri.html">Auguri</a>'+
        '</div>'+
      '</div></footer>';
  }

  /* --- tema chiaro/scuro --- */
  var root = document.documentElement;
  try{ var saved = localStorage.getItem("tema-cc"); if(saved) root.setAttribute("data-theme",saved); }catch(e){}
  var tb = document.getElementById("themeBtn");
  if(tb){
    tb.addEventListener("click",function(){
      var cur = root.getAttribute("data-theme");
      var dark = cur ? cur==="dark" : window.matchMedia("(prefers-color-scheme:dark)").matches;
      var next = dark ? "light" : "dark";
      root.setAttribute("data-theme",next);
      try{ localStorage.setItem("tema-cc",next); }catch(e){}
    });
  }

  /* --- menu mobile --- */
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");
  var scrim = document.getElementById("scrim");
  function closeMenu(){ navLinks.classList.remove("open"); scrim.classList.remove("show");
    if(burger) burger.setAttribute("aria-expanded","false"); }
  if(burger && navLinks){
    burger.addEventListener("click",function(){
      var open = navLinks.classList.toggle("open");
      scrim.classList.toggle("show",open);
      burger.setAttribute("aria-expanded", open?"true":"false");
    });
    scrim.addEventListener("click",closeMenu);
    navLinks.querySelectorAll("a").forEach(function(a){ a.addEventListener("click",closeMenu); });
    document.addEventListener("keydown",function(e){ if(e.key==="Escape") closeMenu(); });
  }

  /* --- countdown (solo dove c'è #countdown) --- */
  var cd = document.getElementById("countdown");
  if(cd){
    var target = new Date(S.dataFesta).getTime();
    function tick(){
      var diff = target - Date.now();
      if(isNaN(target)){ cd.innerHTML = '<div class="cd-msg">Aggiungi la data della festa in assets/app.js</div>'; return; }
      if(diff <= 0){ cd.innerHTML = '<div class="cd-msg">Oggi se laurea. Dottoressa '+S.nome+', finalmente.</div>'; return; }
      var d = Math.floor(diff/86400000);
      var h = Math.floor(diff%86400000/3600000);
      var m = Math.floor(diff%3600000/60000);
      var s = Math.floor(diff%60000/1000);
      cd.innerHTML = box(d,"giorni")+box(h,"ore")+box(m,"min")+box(s,"sec");
    }
    function box(n,l){ return '<div class="cd-box"><div class="n">'+String(n).padStart(2,"0")+'</div><div class="l">'+l+'</div></div>'; }
    tick(); setInterval(tick,1000);
  }

  /* --- filtri muro --- */
  var filters = document.getElementById("filters");
  if(filters){
    var notes = Array.prototype.slice.call(document.querySelectorAll("[data-cat]"));
    filters.addEventListener("click",function(e){
      var b = e.target.closest("button[data-f]"); if(!b) return;
      filters.querySelectorAll("button").forEach(function(x){x.classList.toggle("on",x===b);});
      var f = b.getAttribute("data-f");
      notes.forEach(function(n){ n.hidden = !(f==="all" || n.getAttribute("data-cat")===f); });
    });
  }

  /* --- lightbox galleria --- */
  var lb = document.getElementById("lightbox");
  if(lb){
    var lbImg = lb.querySelector("img");
    document.querySelectorAll(".rx-frame img, .shot img").forEach(function(img){
      img.parentElement.addEventListener("click",function(){
        if(!img.getAttribute("src")) return;
        lbImg.src = img.src; lbImg.alt = img.alt; lb.classList.add("show");
      });
    });
    lb.addEventListener("click",function(){ lb.classList.remove("show"); lbImg.src=""; });
    document.addEventListener("keydown",function(e){ if(e.key==="Escape"){ lb.classList.remove("show"); lbImg.src=""; }});
  }

  /* --- inserisce nome/data nei segnaposto [data-site] --- */
  document.querySelectorAll("[data-site]").forEach(function(el){
    var k = el.getAttribute("data-site");
    if(S[k]!=null) el.textContent = S[k];
  });

  /* =====================================================================
     EASTER EGG — cliccando certe parti succedono cose
     ===================================================================== */
  var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  // stile per toast e coriandoli (iniettato una volta sola)
  var st = document.createElement("style");
  st.textContent =
    ".egg-toast{position:fixed;left:50%;bottom:calc(26px + env(safe-area-inset-bottom,0px));"+
    "transform:translateX(-50%) translateY(20px);z-index:9999;max-width:min(90vw,440px);"+
    "background:var(--ink);color:var(--bg);padding:13px 20px;border-radius:12px;"+
    "font-weight:600;font-size:15.5px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.3);"+
    "opacity:0;transition:opacity .25s,transform .25s;pointer-events:none}"+
    ".egg-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}"+
    ".egg-bit{position:fixed;top:-24px;z-index:9998;width:9px;height:14px;border-radius:2px;"+
    "pointer-events:none;will-change:transform;animation:eggfall linear forwards}"+
    "@keyframes eggfall{to{transform:translateY(106vh) rotate(600deg);opacity:.85}}";
  document.head.appendChild(st);

  var toastEl, toastT;
  function toast(msg){
    if(!toastEl){ toastEl=document.createElement("div"); toastEl.className="egg-toast";
      toastEl.setAttribute("role","status"); document.body.appendChild(toastEl); }
    toastEl.innerHTML=msg; void toastEl.offsetWidth; toastEl.classList.add("show");
    clearTimeout(toastT); toastT=setTimeout(function(){ toastEl.classList.remove("show"); },3200);
  }
  function coriandoli(colors,n){
    if(reduce) return;
    colors = colors || ["#2E8C77","#3C7EA6","#E15A4E","#B9E617","#1E6B59"];
    n = n || 28;
    for(var i=0;i<n;i++){(function(i){
      var b=document.createElement("div"); b.className="egg-bit";
      b.style.background=colors[Math.floor(Math.random()*colors.length)];
      b.style.left=(Math.random()*100)+"vw";
      var dur=(2.2+Math.random()*1.8);
      b.style.animationDuration=dur+"s";
      var sc=(0.7+Math.random()*1.1);
      b.style.transformOrigin="center";
      b.style.opacity=(0.7+Math.random()*0.3);
      b.style.transform="scale("+sc+")";
      document.body.appendChild(b);
      setTimeout(function(){ b.remove(); }, dur*1000+200);
    })(i);}
  }

  // 1) click sulla croce (logo) → auguri
  var cross=document.querySelector(".cross");
  if(cross){ cross.style.cursor="pointer";
    cross.parentElement.addEventListener("click",function(e){
      e.preventDefault(); coriandoli(); toast("Auguri registrati. Dottoressa "+S.nome+", è ufficiale.");
    });
  }

  // 2) click sul nome nell'hero → battute a rotazione
  var battute=[
    "Oggi niente sport: c'hai er ginocchio. Di novo.",
    "Stai a dormì. Ritenta tra tre ore.",
    "L'unico sport che te concedi: er padel.",
    "Se nun rispondi, sei da Branzo. O all'Alligalli.",
    "\"Cinque minuti e arivo\": lo sappiamo, arrivi tra due ore.",
    "In missione ar Lidl. O all'Action. O all'IKEA.",
    "Stai a addobbà casa: pe' te è sempre stagione.",
    "Luigi, servirebbe 'n'artra cosa. (Luigi trema.)",
    "Emanuela Perini bussa: 'abbassate 'sta musica'.",
    "Codice rosso: te perde er lavandino. Era 'na goccia."
  ];
  var bi=0, nameEl=document.querySelector(".hero .hi, .prognosi .big em");
  if(nameEl){ nameEl.style.cursor="pointer"; nameEl.title="cliccami";
    nameEl.addEventListener("click",function(){ toast(battute[bi%battute.length]); bi++; });
  }

  // 3) doppio click sull'elettrocardiogramma → battito
  document.querySelectorAll(".ecg").forEach(function(ecg){
    ecg.style.cursor="pointer";
    ecg.addEventListener("dblclick",function(){ coriandoli(["#E15A4E"],14); toast("Battito rilevato: 110 e lode. Ritmo regolare."); });
  });

  // 4) cinque click sul countdown → scusa der ginocchio
  var cdEgg=document.getElementById("countdown"), cdN=0;
  if(cdEgg){ cdEgg.addEventListener("click",function(){ cdN++;
    if(cdN===5){ cdN=0; toast("Er ginocchio conta alla rovescia pe' la prossima scusa."); } }); }

  // 5) codice Konami (freccia su su giù giù sx dx sx dx B A) → modalità festa
  var seq=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"], pos=0;
  document.addEventListener("keydown",function(e){
    var k=e.key.length===1?e.key.toLowerCase():e.key;
    pos=(k===seq[pos])?pos+1:(k===seq[0]?1:0);
    if(pos===seq.length){ pos=0; coriandoli(null,60); toast("Modalità festa attivata."); }
  });
})();
