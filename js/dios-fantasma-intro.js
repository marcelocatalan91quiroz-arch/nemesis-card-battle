// NÉMESIS V18.9.56 — módulo aditivo de introducción del Dios Fantasma.
// No reemplaza el motor de duelo. Llamar showDiosFantasmaIntro(...) desde el flujo
// de victoria del Rey Espectral, después de guardar progreso/recompensas.
(function () {
  const CFG = {
    bg: "assets/images/dios-fantasma/fondo-celestial.png",
    boss: "assets/images/dios-fantasma/dios-fantasma.png",
    lines: [
      ["REY ESPECTRAL","Has vencido mi trono... pero mi reino nunca fue el final."],
      ["REY ESPECTRAL","Ahora te enfrentarás al Dios de tu Alma."],
      ["NARRADOR","El cielo espectral se rompe. Las almas dejan de gritar... y comienzan a arrodillarse."],
      ["DIOS FANTASMA","Has atravesado la muerte para llegar hasta mí."],
      ["DIOS FANTASMA","Tu poder, tus victorias y las almas que has liberado... todo ha sido observado."],
      ["DIOS FANTASMA","Entra en mi reino. Aquí no lucharás contra un rey."],
      ["DIOS FANTASMA","Lucharás contra un dios."]
    ]
  };

  function ensureStyle() {
    if (document.getElementById("nf-df-style")) return;
    const s=document.createElement("style"); s.id="nf-df-style";
    s.textContent=`
    #nf-df-intro{position:fixed;inset:0;z-index:99990;overflow:hidden;background:#05000c;color:#fff;font-family:Georgia,serif}
    #nf-df-intro .bg{position:absolute;inset:0;background:center/cover no-repeat;filter:brightness(.45) saturate(1.25);transform:scale(1.04);animation:nfdfZoom 14s ease-out forwards}
    #nf-df-intro .veil{position:absolute;inset:0;background:radial-gradient(circle at 50% 42%,transparent 0 24%,rgba(10,0,24,.22) 50%,rgba(0,0,0,.82) 100%)}
    #nf-df-intro .boss{position:absolute;left:50%;bottom:-7%;height:92vh;max-width:72vw;object-fit:contain;transform:translateX(-50%) scale(.82);opacity:0;filter:drop-shadow(0 0 28px #9d46ff);transition:opacity 1.4s,transform 2s}
    #nf-df-intro.reveal .boss{opacity:1;transform:translateX(-50%) scale(1)}
    #nf-df-intro .title{position:absolute;top:7%;width:100%;text-align:center;font-size:clamp(26px,4vw,62px);letter-spacing:.09em;text-shadow:0 0 18px #8e39ff,0 0 38px #d3a8ff;opacity:0;transition:opacity 1s}
    #nf-df-intro.reveal .title{opacity:1}
    #nf-df-intro .box{position:absolute;left:7%;right:7%;bottom:5%;padding:18px 24px;background:linear-gradient(90deg,rgba(5,0,14,.92),rgba(28,5,48,.88));border:1px solid #b36cff;box-shadow:0 0 30px #5f17a8;border-radius:10px}
    #nf-df-intro .speaker{color:#d6a3ff;font-weight:800;letter-spacing:.08em;margin-bottom:8px}
    #nf-df-intro .text{font-size:clamp(17px,2vw,28px);min-height:2.4em;text-shadow:0 2px 5px #000}
    #nf-df-intro .hint{opacity:.65;text-align:right;font-size:12px}
    #nf-df-intro .actions{display:none;gap:16px;justify-content:center;margin-top:15px}
    #nf-df-intro.done .actions{display:flex}
    #nf-df-intro button{padding:12px 20px;border:1px solid #b974ff;background:#170524;color:white;border-radius:8px;cursor:pointer;box-shadow:0 0 16px #6c1ab1}
    #nf-df-intro .flash{position:absolute;inset:0;pointer-events:none;background:white;opacity:0}
    #nf-df-intro.reveal .flash{animation:nfdfFlash 1.1s ease-out}
    @keyframes nfdfFlash{0%{opacity:.85}20%{opacity:.1}45%{opacity:.42}100%{opacity:0}}
    @keyframes nfdfZoom{from{transform:scale(1.08)}to{transform:scale(1)}}
    @media(max-width:800px){#nf-df-intro .boss{height:78vh;max-width:95vw}#nf-df-intro .box{left:3%;right:3%}}
    `;
    document.head.appendChild(s);
  }

  window.showDiosFantasmaIntro=function(opts={}){
    ensureStyle();
    const root=document.createElement("div"); root.id="nf-df-intro";
    root.innerHTML=`<div class="bg"></div><div class="veil"></div><div class="flash"></div>
      <img class="boss" alt="Dios Fantasma"><div class="title">DIOS FANTASMA<br><small style="font-size:.35em;color:#e0b8ff">MODO BESTIA CELESTIAL</small></div>
      <div class="box"><div class="speaker"></div><div class="text"></div><div class="hint">clic para continuar</div>
      <div class="actions"><button data-a="world">VOLVER AL MUNDO</button><button data-a="fight">ENFRENTAR AL DIOS FANTASMA</button></div></div>`;
    root.querySelector(".bg").style.backgroundImage=`url("${CFG.bg}")`;
    root.querySelector(".boss").src=CFG.boss;
    document.body.appendChild(root);
    let i=0;
    const speaker=root.querySelector(".speaker"), text=root.querySelector(".text");
    function paint(){
      const [sp,tx]=CFG.lines[i]; speaker.textContent=sp; text.textContent=tx;
      if(i>=2) root.classList.add("reveal");
      if(i===CFG.lines.length-1) root.classList.add("done");
    }
    function next(e){
      if(e && e.target.closest("button")) return;
      if(i<CFG.lines.length-1){i++;paint();}
    }
    root.addEventListener("click",next);
    root.querySelector('[data-a="world"]').onclick=()=>{root.remove(); opts.onWorld?.();};
    root.querySelector('[data-a="fight"]').onclick=()=>{root.remove(); opts.onFight?.();};
    paint();
    return root;
  };
})();