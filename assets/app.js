/* =====================================================================
   CONFIG — modifica qui i dati principali del sito
   ===================================================================== */
window.SITE = {
  nome: "Ele",                       // nome della festeggiata
  titolo: "Fisica Medica",           // corso di laurea
  citta: "Roma",
  dataFesta: "2026-10-15T18:00:00",  // data/ora della festa (formato AAAA-MM-GGThh:mm:ss)
  labelData: "15 ottobre 2026"       // come mostrarla in chiaro
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
          '<button class="theme-btn" id="themeBtn" type="button" aria-label="Cambia tema">◐</button>'+
          '<button class="burger" id="burger" type="button" aria-label="Menu" aria-expanded="false">☰</button>'+
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
      if(diff <= 0){ cd.innerHTML = '<div class="cd-msg">🎓 È IL GIORNO! Daje Dottoressa '+S.nome+'!</div>'; return; }
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
    document.querySelectorAll(".rx-frame img").forEach(function(img){
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
})();
