/* =====================================================================
   CONFIG — dati principali (modifica qui)
   ===================================================================== */
window.SITE = {
  nome: "Ele",
  dataFesta: "2026-09-23T16:30:00",   // data/ora della laurea
  labelData: "23 settembre 2026",
  citta: "Pisa"
};

(function(){
  var S = window.SITE, reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

  // testo nei segnaposto [data-site]
  document.querySelectorAll("[data-site]").forEach(function(el){
    var k=el.getAttribute("data-site"); if(S[k]!=null) el.textContent=S[k];
  });

  /* --- coriandoli --- */
  function confetti(colors,n){
    if(reduce) return;
    colors=colors||["#7A5AF8","#FF5CA0","#FFC42E","#18C7B6","#FF7A45"];
    n=n||36;
    for(var i=0;i<n;i++){(function(){
      var b=document.createElement("div"); b.className="egg-bit";
      b.style.background=colors[Math.floor(Math.random()*colors.length)];
      b.style.left=(Math.random()*100)+"vw";
      var dur=2.2+Math.random()*1.9; b.style.animationDuration=dur+"s";
      b.style.opacity=0.7+Math.random()*0.3;
      b.style.transform="scale("+(0.6+Math.random()*1.1)+")";
      document.body.appendChild(b);
      setTimeout(function(){ b.remove(); },dur*1000+200);
    })();}
  }

  /* --- menu mobile --- */
  var burger=document.getElementById("burger"),
      navLinks=document.getElementById("navLinks"),
      scrim=document.getElementById("scrim");
  function closeMenu(){ if(!navLinks)return; navLinks.classList.remove("open"); scrim.classList.remove("show");
    if(burger) burger.setAttribute("aria-expanded","false"); }
  if(burger&&navLinks){
    burger.addEventListener("click",function(){
      var open=navLinks.classList.toggle("open"); scrim.classList.toggle("show",open);
      burger.setAttribute("aria-expanded",open?"true":"false");
    });
    scrim.addEventListener("click",closeMenu);
    navLinks.querySelectorAll("a").forEach(function(a){a.addEventListener("click",closeMenu);});
    document.addEventListener("keydown",function(e){ if(e.key==="Escape") closeMenu(); });
  }

  /* --- countdown --- */
  var cd=document.getElementById("countdown");
  if(cd){
    var target=new Date(S.dataFesta).getTime();
    function box(n,l){return '<div class="cd-box"><div class="n">'+String(n).padStart(2,"0")+'</div><div class="l">'+l+'</div></div>';}
    function tick(){
      var diff=target-Date.now();
      if(isNaN(target)){ cd.innerHTML='<div class="cd-msg">Aggiungi la data in assets/app.js</div>'; return; }
      if(diff<=0){ cd.innerHTML='<div class="cd-msg">Dottoressa '+S.nome+'. Ce l\'hai fatta.</div>'; return; }
      var d=Math.floor(diff/864e5),h=Math.floor(diff%864e5/36e5),m=Math.floor(diff%36e5/6e4),s=Math.floor(diff%6e4/1e3);
      cd.innerHTML=box(d,"giorni")+box(h,"ore")+box(m,"min")+box(s,"sec");
    }
    tick(); setInterval(tick,1000);
  }

  /* --- gioco: indovina il regalo --- */
  var guesses=document.getElementById("guesses");
  if(guesses){
    var fb=document.getElementById("giftFb"), reveal=document.getElementById("giftReveal"), done=false;
    guesses.addEventListener("click",function(e){
      var b=e.target.closest("button"); if(!b||done) return;
      if(b.dataset.correct==="1"){
        done=true; b.classList.add("right");
        guesses.querySelectorAll("button").forEach(function(x){ if(x!==b) x.classList.add("wrong"); });
        if(fb) fb.textContent="Esatto!";
        if(reveal) reveal.classList.add("show");
        confetti(null,70);
      } else {
        b.classList.add("wrong");
        if(fb) fb.textContent="Nooo. Indizio: fa vento e costa un rene. Riprova.";
      }
    });
  }

  /* --- lightbox --- */
  var lb=document.getElementById("lightbox");
  if(lb){
    var lbImg=lb.querySelector("img");
    document.querySelectorAll(".shot img").forEach(function(img){
      img.parentElement.addEventListener("click",function(){
        if(!img.getAttribute("src"))return; lbImg.src=img.src; lbImg.alt=img.alt; lb.classList.add("show");
      });
    });
    lb.addEventListener("click",function(){ lb.classList.remove("show"); lbImg.src=""; });
    document.addEventListener("keydown",function(e){ if(e.key==="Escape"){ lb.classList.remove("show"); lbImg.src=""; }});
  }

  /* --- filtri messaggi --- */
  var filters=document.getElementById("filters");
  if(filters){
    var items=[].slice.call(document.querySelectorAll("[data-cat]"));
    filters.addEventListener("click",function(e){
      var b=e.target.closest("button[data-f]"); if(!b)return;
      filters.querySelectorAll("button").forEach(function(x){x.classList.toggle("on",x===b);});
      var f=b.getAttribute("data-f");
      items.forEach(function(n){ n.hidden=!(f==="all"||n.getAttribute("data-cat")===f); });
    });
  }

  /* --- easter egg: click sul pallino del logo --- */
  var dot=document.querySelector(".logo .dot");
  if(dot){ dot.style.cursor="pointer";
    dot.parentElement.addEventListener("click",function(e){ e.preventDefault(); confetti(null,50); }); }

  /* --- coriandoli d'ingresso sul biglietto --- */
  if(document.querySelector(".biglietto")) setTimeout(function(){ confetti(null,70); },250);
})();
