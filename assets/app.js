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

  // tema salvato (lo scherzo "Dark" che poi diventa vero)
  try{ if(localStorage.getItem("eleTheme")==="dark") document.documentElement.setAttribute("data-theme","dark"); }catch(e){}

  // testo nei segnaposto [data-site]
  document.querySelectorAll("[data-site]").forEach(function(el){
    var k=el.getAttribute("data-site"); if(S[k]!=null) el.textContent=S[k];
  });

  /* --- toast --- */
  var toastEl,toastT;
  function toast(msg){
    if(!toastEl){ toastEl=document.createElement("div"); toastEl.className="toast";
      toastEl.setAttribute("role","status"); document.body.appendChild(toastEl); }
    toastEl.textContent=msg; void toastEl.offsetWidth; toastEl.classList.add("show");
    clearTimeout(toastT); toastT=setTimeout(function(){ toastEl.classList.remove("show"); },3400);
  }

  /* --- bottoni finti nella barra (easter egg) --- */
  var tbar=document.querySelector(".topbar-in");
  if(tbar){
    var tools=document.createElement("div"); tools.className="nav-tools";
    tools.innerHTML='<button class="navtool" id="fakeDark" type="button">Dark</button>'
      +'<button class="navtool round" id="fakeInfo" type="button" aria-label="Info">?</button>';
    tbar.appendChild(tools);
    document.getElementById("fakeInfo").addEventListener("click",function(){ toast("Ma che c'è da capì? Mica ce vole 'na laurea."); });

    var htmlEl=document.documentElement, darkBtn=document.getElementById("fakeDark");
    function isDark(){ return htmlEl.getAttribute("data-theme")==="dark"; }
    function setDark(on){
      if(on) htmlEl.setAttribute("data-theme","dark"); else htmlEl.removeAttribute("data-theme");
      try{ localStorage.setItem("eleTheme", on?"dark":"light"); }catch(e){}
      if(darkBtn) darkBtn.textContent = on?"Light":"Dark";
    }
    if(darkBtn){
      darkBtn.textContent = isDark()?"Light":"Dark";
      var armed=false;
      darkBtn.addEventListener("click",function(){
        if(isDark()){ setDark(false); toast("E rimettemo la luce, va'."); return; }
        if(!armed){
          armed=true;
          toast("Aò, er budget era quello. Che t'aspettavi?");
          setTimeout(function(){ toast("Vabbè dai, famme cercà l'interruttore…"); },3200);
          setTimeout(function(){ setDark(true); toast("Tò, te piace de più? C'avevi preso pe' pezzenti?"); confetti(null,34); },6000);
        } else { setDark(true); toast("Tò, te piace de più? C'avevi preso pe' pezzenti?"); confetti(null,34); }
      });
    }
  }

  /* --- coriandoli (co' roba de medicina e matematica) --- */
  var GLYPHS=["💉","🩺","🧬","💊","🧪","🩹","π","∫","Σ","√","λ","γ","∞","θ"];
  function confetti(colors,n){
    if(reduce) return;
    colors=colors||["#7A5AF8","#FF5CA0","#FFC42E","#18C7B6","#FF7A45"];
    n=n||36;
    for(var i=0;i<n;i++){(function(){
      var glyph=Math.random()<0.4;
      var b=document.createElement("div"); b.className="egg-bit";
      b.style.left=(Math.random()*100)+"vw";
      var dur=2.2+Math.random()*1.9; b.style.animationDuration=dur+"s";
      b.style.opacity=0.75+Math.random()*0.25;
      if(glyph){
        b.classList.add("egg-glyph");
        b.textContent=GLYPHS[Math.floor(Math.random()*GLYPHS.length)];
        b.style.fontSize=(17+Math.random()*17)+"px";
      } else {
        b.style.background=colors[Math.floor(Math.random()*colors.length)];
      }
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

  /* --- gioco: rivela il regalo --- */
  var revealBtn=document.getElementById("revealBtn");
  if(revealBtn){
    revealBtn.addEventListener("click",function(){
      var r=document.getElementById("giftReveal"); if(r) r.classList.add("show");
      if(revealBtn.parentElement) revealBtn.parentElement.style.display="none";
      confetti(null,80);
    });
  }

  /* --- bottoni-gioco pe' andà avanti --- */
  function go(href){ if(href) window.location.href=href; }
  document.querySelectorAll(".adv").forEach(function(adv){
    var type=adv.getAttribute("data-adv"),
        href=adv.getAttribute("data-href"),
        ncls=adv.getAttribute("data-next-class")||"",
        label=adv.getAttribute("data-label")||"Avanti →";
    function mk(txt,extra){ var b=document.createElement("button"); b.type="button";
      b.className="next "+ncls+(extra?(" "+extra):""); b.textContent=txt; return b; }
    // via il link statico di fallback: da qui in poi comanda il gioco
    adv.querySelectorAll(".adv-fallback").forEach(function(x){ x.remove(); });

    if(type==="dodge"){
      adv.classList.add("adv-dodge");
      var b=mk(label); adv.appendChild(b);
      var d=0, max=9, last=0,
          hints=["Eh, prima me devi pijà!","Aò, so' più veloce io.","Nun ce piji manco co' la mira.","'Nnamo, provace.","Quasi… ma no.","T'ho fregato n'artra vòta.","Ancora? Nun demorde eh.","Ammazza che testardaggine.","E vabbè, hai vinto tu."];
      // se sa dóve sta er puntatore scappa dall'artra parte, sinnò va a caso
      function jump(px,py){
        var w=adv.clientWidth||320, h=adv.clientHeight||240,
            bw=b.offsetWidth||160, bh=b.offsetHeight||58,
            mx=Math.max(30,(w-bw)/2-6), my=Math.max(28,(h-bh)/2-6),
            r=adv.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2,
            bx=0, by=0, best=-1;
        for(var i=0;i<24;i++){
          var tx=(Math.random()*2-1)*mx, ty=(Math.random()*2-1)*my,
              sc=(px==null)?Math.random():Math.hypot(cx+tx-px,cy+ty-py);
          if(sc>best){ best=sc; bx=tx; by=ty; }
        }
        b.style.transform="translate("+bx+"px,"+by+"px)";
      }
      function tease(px,py){ if(d<max){ d++; jump(px,py); toast(hints[Math.min(d-1,hints.length-1)]); if(d>=max) b.textContent="Pijame mo' →"; } }
      adv.addEventListener("mousemove",function(e){
        if(d>=max) return;
        var r=b.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2;
        if(Math.hypot(e.clientX-cx,e.clientY-cy)<130 && Date.now()-last>90){ last=Date.now(); tease(e.clientX,e.clientY); }
      });
      b.addEventListener("click",function(e){ if(d<max){ e.preventDefault(); tease(e.clientX||null,e.clientY||null); } else { confetti(null,30); go(href); } });
    }
    else if(type==="twice"){
      var b=mk(label); adv.appendChild(b); var n=0;
      b.addEventListener("click",function(){ n++;
        if(n<2){ toast("Aò, 'sto click nun ha fatto gnente. Riprova."); b.textContent="Avanti (davero stavolta) →"; }
        else go(href); });
    }
    else if(type==="mash"){
      var need=parseInt(adv.getAttribute("data-need")||"5",10), cur=0;
      var b=mk(""); adv.appendChild(b);
      var bar=document.createElement("div"); bar.className="adv-bar";
      var fill=document.createElement("span"); bar.appendChild(fill); adv.appendChild(bar);
      function upd(){ b.textContent=cur>=need?label:("Spingi forte! ("+cur+"/"+need+")");
        fill.style.width=Math.min(100,cur/need*100)+"%"; }
      upd();
      b.addEventListener("click",function(){ if(cur>=need){ go(href); return; }
        cur++; upd(); confetti(null,6);
        if(cur>=need){ toast("E mo' vola!"); confetti(null,44); } });
    }
    else if(type==="quiz"){
      var q=adv.getAttribute("data-q"),
          opts=(adv.getAttribute("data-opts")||"").split("|"),
          right=parseInt(adv.getAttribute("data-right")||"0",10),
          okmsg=adv.getAttribute("data-ok")||"Esatto. La conosci bene.",
          nomsg=adv.getAttribute("data-no")||"Ma quanno mai. Riprova.",
          done=false;
      var qEl=document.createElement("div"); qEl.className="adv-q"; qEl.textContent=q; adv.appendChild(qEl);
      var wrap=document.createElement("div"); wrap.className="adv-opts"; adv.appendChild(wrap);
      opts.forEach(function(o,i){ var b=mk(o,"opt");
        b.addEventListener("click",function(){ if(done)return;
          if(i===right){ done=true; toast(okmsg); confetti(null,34);
            wrap.querySelectorAll("button").forEach(function(x){ x.disabled=true; });
            var g=mk(label); adv.appendChild(g); g.addEventListener("click",function(){ go(href); }); }
          else { toast(nomsg); b.disabled=true; } });
        wrap.appendChild(b); });
    }
    else if(type==="pick"){
      var picks=(adv.getAttribute("data-picks")||"").split("|"),
          rp=parseInt(adv.getAttribute("data-right")||"0",10),
          pno=adv.getAttribute("data-no")||"Naa, nun è questo. Prova n'artro.";
      var wrap=document.createElement("div"); wrap.className="adv-opts"; adv.appendChild(wrap);
      picks.forEach(function(o,i){ var b=mk(o,"opt");
        b.addEventListener("click",function(){ if(i===rp){ confetti(null,44); go(href); }
          else { toast(pno); b.disabled=true; } });
        wrap.appendChild(b); });
    }
    else { var b=mk(label); b.addEventListener("click",function(){ go(href); }); adv.appendChild(b); }
  });

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

  /* --- coriandoli d'ingresso sul biglietto --- */
  if(document.querySelector(".biglietto")) setTimeout(function(){ confetti(null,70); },250);

  /* --- bottone finale del biglietto --- */
  var endBtn=document.getElementById("endBtn"), endLine=document.getElementById("endLine");
  if(endBtn){ endBtn.addEventListener("click",function(){
    if(endLine){ endLine.style.display="block"; endLine.classList.add("show"); }
    endBtn.style.display="none";
    confetti(null,90);
  }); }

  /* --- easter egg: clic su varie parti = coriandoli --- */
  var cap=document.querySelector(".logo .cap");
  if(cap){ cap.style.cursor="pointer";
    cap.addEventListener("click",function(e){ e.preventDefault(); e.stopPropagation(); confetti(null,50); }); }
  document.querySelectorAll(".eyebrow").forEach(function(el){ el.style.cursor="pointer";
    el.addEventListener("click",function(){ confetti(null,26); }); });
  document.querySelectorAll(".hero h1, .page-hero h1").forEach(function(el){ el.style.cursor="pointer";
    el.addEventListener("click",function(){ confetti(null,55); }); });
  var cdBoom=document.getElementById("countdown");
  if(cdBoom){ cdBoom.style.cursor="pointer"; cdBoom.addEventListener("click",function(){ confetti(null,40); }); }

  /* --- easter egg: scrivi "ele" = festa --- */
  var eseq="ele", epos=0;
  document.addEventListener("keydown",function(e){
    if(!e.key||e.key.length!==1) return;
    var k=e.key.toLowerCase();
    epos=(k===eseq[epos])?epos+1:(k===eseq[0]?1:0);
    if(epos===eseq.length){ epos=0; confetti(null,90); toast("E-L-E: numero uno!"); }
  });
})();
