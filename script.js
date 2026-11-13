// Datos: 11 mundos = 11 apartados del PDF "Guía maestra de atajos de CorelDRAW"
const MUNDOS=[
["🐢","Herramientas","Ctrl + Espacio|Selección;F5|Mano alzada;F6|Rectángulo;F7|Elipse;F8|Texto;F10|Forma;F11|Relleno degradado;F12|Color de contorno;H|Mano panorámica;Z|Zoom;X|Borrador;C|Recortar"],
["🐰","Zoom","F2|Acercar el zoom;F3|Alejar el zoom;F4|Ver todos los objetos;Shift + F4|Ver la página;F9|Vista previa a pantalla completa;N|Navegador de vistas"],
["🐸","Seleccionar","Barra espaciadora|Herramienta Selección;Ctrl + A|Seleccionar todos;Esc|Quitar selección;Tab|Seleccionar el siguiente;Shift + Tab|Seleccionar el anterior;Ctrl + G|Agrupar;Ctrl + U|Desagrupar;Delete|Eliminar"],
["🐵","Ordenar","Ctrl + Inicio|Enviar al frente;Ctrl + Fin|Enviar detrás de todo;Ctrl + Page Up|Adelantar un nivel;Ctrl + Page Down|Retroceder un nivel"],
["🐼","Copiar y guardar","Ctrl + C|Copiar;Ctrl + V|Pegar;Ctrl + X|Cortar;Ctrl + Z|Deshacer;Ctrl + Shift + Z|Rehacer;Ctrl + S|Guardar;Ctrl + Shift + S|Guardar como;Ctrl + O|Abrir;Ctrl + N|Nuevo documento;Ctrl + P|Imprimir"],
["🦊","Alinear","L|Alinear a la izquierda;R|Alinear a la derecha;T|Alinear arriba;B|Alinear abajo;C|Centrar verticalmente;E|Centrar horizontalmente;P|Centrar en la página;Ctrl + Shift + A|Panel Alinear y distribuir"],
["🐧","Vectores","F10|Herramienta Forma;Ctrl + Q|Convertir a curvas;Ctrl + K|Separar curvas;Ctrl + L|Combinar;Ctrl + Shift + Q|Convertir contorno en objeto;Ctrl + F9|Silueta;Ctrl + F7|Envoltura;Alt + F3|Lente"],
["🦉","Texto","F8|Herramienta Texto;Ctrl + T|Formato de caracteres;Ctrl + Shift + T|Editar texto;Ctrl + B|Negrita;Ctrl + I|Cursiva;Ctrl + U|Subrayado;Ctrl + F8|Convertir tipo de texto;Ctrl + F11|Insertar carácter especial;Alt + F12|Alinear a la línea base"],
["🐙","Mover y duplicar","Flechas|Mover el objeto;Shift + Flechas|Movimiento mayor;Ctrl + Flechas|Movimiento menor;Ctrl + D|Duplicar;Ctrl + Shift + D|Repetir pasos;Ctrl + G|Agrupar;Ctrl + U|Desagrupar"],
["🐬","Color","Clic izquierdo en un color|Aplicar relleno;Clic derecho en un color|Aplicar contorno;F11|Abrir relleno degradado;F12|Configurar contorno;G|Relleno interactivo"],
["🦋","Importar y exportar","Ctrl + I|Importar;Ctrl + E|Exportar;Ctrl + P|Imprimir;Ctrl + S|Guardar;Ctrl + Shift + S|Guardar como;Ctrl + O|Abrir archivo"]
].map(([a,n,s],i)=>({a,n,items:s.split(";").map(x=>{const[k,v]=x.split("|");return{k,v}})}));

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const sh=a=>[...a].sort(()=>Math.random()-.5);
let save=JSON.parse(localStorage.getItem("cj")||"{}"),mute=false,W=0,L=0,rounds=[],R=0,fails=0,ac;
const done=w=>save[w]||0;
const libre=w=>w==0||done(w-1)>=3;

// Sonidos
function tone(f,t,d,type="square",v=.15){if(mute)return;ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,ac.currentTime+t);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+t+d);o.connect(g).connect(ac.destination);o.start(ac.currentTime+t);o.stop(ac.currentTime+t+d)}
const SND={
 click:()=>tone(660,0,.08,"triangle"),
 ok:()=>[523,659,784,1047].forEach((f,i)=>tone(f,i*.09,.18,"triangle",.2)),
 bad:()=>{tone(220,0,.18,"sawtooth");tone(150,.15,.3,"sawtooth")},
 win:()=>[523,523,659,784,659,784,1047].forEach((f,i)=>tone(f,i*.12,.25,"square",.18)),
 whoosh:()=>{for(let i=0;i<12;i++)tone(200+i*90,i*.05,.1,"sine",.1)}
};

// Lectura en voz alta
const hablar=k=>k.replace(/Ctrl/g,"control").replace(/\+/g," más ").replace(/Shift/g,"shift").replace(/Esc\b/,"escape").replace(/Delete/,"suprimir");
// Voz con acento latinoamericano (evita la de España) y tono más agudo
const LAT=["es-PE","es-MX","es-US","es-419","es-CO","es-AR","es-CL","es-VE"];
function voz(){const v=speechSynthesis.getVoices().filter(x=>/^es/i.test(x.lang));if(!v.length)return null;
 for(const l of LAT){const f=v.find(x=>x.lang.replace("_","-").toLowerCase()===l.toLowerCase());if(f)return f}
 return v.find(x=>!/es[-_]ES/i.test(x.lang))||v[0]}
if(window.speechSynthesis)speechSynthesis.onvoiceschanged=()=>{};
function say(t,fn){if(mute||!window.speechSynthesis)return fn&&fn();speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);const vz=voz();if(vz)u.voice=vz;u.lang=vz?vz.lang:"es-MX";u.rate=.85;u.pitch=1.5;if(fn)u.onend=fn;speechSynthesis.speak(u)}
const sayItem=it=>say(hablar(it.k)+". "+it.v);

// Jaguar
function jag(m,txt,voz=true){$("#jag").src="img/"+m+".jpeg";$("#bub").textContent=txt;if(voz)say(txt)}

function show(id){$$(".s").forEach(s=>s.classList.remove("on"));$("#"+id).classList.add("on");scrollTo(0,0)}

// Mapa de mundos
function home(){show("home");const g=$("#worlds");g.innerHTML="";
 MUNDOS.forEach((m,i)=>{const b=document.createElement("button");b.className="w"+(libre(i)?"":" lock");
  b.innerHTML=`<b>${libre(i)?m.a:"🔒"}</b>Mundo ${i+1}<br>${m.n}<br>${"⭐".repeat(done(i))||"&nbsp;"}`;
  b.onclick=()=>{SND.click();if(!libre(i)){SND.bad();return jag("senala","Primero termina el mundo anterior")}W=i;world()};g.appendChild(b)});
 jag("ok","Toca un mundo para jugar")}
function world(){show("world");const m=MUNDOS[W];$("#wTitle").textContent=`${m.a} Mundo ${W+1}: ${m.n}`;const g=$("#levels");g.innerHTML="";
 for(let l=0;l<3;l++){const b=document.createElement("button");const ok=l<=done(W);b.className="w"+(ok?"":" lock");
  b.innerHTML=`<b>${ok?(l<done(W)?"⭐":m.a):"🔒"}</b>Nivel ${l+1}`;b.onclick=()=>{SND.click();ok?start(l):(SND.bad(),jag("senala","Termina el nivel anterior"))};g.appendChild(b)}
 jag("ok",`Mundo ${W+1}. ${m.n}. Elige un nivel`)}

// Estudio: primero se miran 3 atajos, luego se pregunta
function start(l){L=l;const it=MUNDOS[W].items,n=it.length;
 let set=l<2?[0,1,2].map(j=>it[(l*3+j)%n]):sh(it).slice(0,3);
 rounds=sh(set);R=0;fails=0;show("study");const c=$("#cards");c.innerHTML="";
 set.forEach(x=>{const d=document.createElement("div");d.className="card";d.innerHTML=`<span class="an">${MUNDOS[W].a}</span><div><span class="keys">${x.k}</span></div>${x.v}<br><button class="big alt">🔊</button>`;d.querySelector("button").onclick=()=>{SND.click();sayItem(x)};c.appendChild(d)});
 jag("piensa","Mira bien y recuerda. Toca cada bocina para escuchar");}
$("#bReady").onclick=()=>{SND.click();[round,pares,simon][L]()};

function round(){show("quiz");const x=rounds[R],m=MUNDOS[W];
 $("#prog").textContent="🐾".repeat(R)+"⚪".repeat(rounds.length-R);
 $("#q").innerHTML=`<span class="an">${m.a}</span><br>¿Qué hace?<br><span class="keys">${x.k}</span>`;
 const wrong=sh(m.items.filter(i=>i.v!==x.v&&!(i.k===x.k))).slice(0,2);
 const o=sh([x,...wrong]),box=$("#opts");box.innerHTML="";
 o.forEach((it,i)=>{const b=document.createElement("button");b.textContent=["🔵","🟡","🟢"][i]+" "+it.v;b.onclick=()=>pick(b,it===x);b.dataset.ok=it===x?1:0;box.appendChild(b)});
 jag("ok","¿Qué hace "+hablar(x.k)+"?",false);readQ()}
function readQ(){const x=rounds[R];say("¿Qué hace "+hablar(x.k)+"? "+$$("#opts button").map(b=>b.textContent.slice(3)).join(". O. "))}
$("#bRead").onclick=()=>{SND.click();readQ()};
$("#bHint").onclick=()=>{SND.click();const b=$$("#opts button:not(.gone)").filter(b=>b.dataset.ok==="0");
 if(b.length>1){b[0].classList.add("gone");jag("piensa","Esa no es. Mira la otra opción")}else jag("piensa","Tu respuesta está en la tarjeta que vimos")};
function pick(b,ok){
 if(!ok){SND.bad();b.classList.add("no");fails++;return jag("senala","Casi. Inténtalo otra vez")}
 SND.ok();confeti(14);b.classList.add("si");jag("celebra","¡Muy bien!");$$("#opts button").forEach(x=>x.disabled=true);
 setTimeout(()=>{R++;R<rounds.length?round():finish()},1500)}

function finish(){show("end");const e=fails==0?3:fails<3?2:1,n=Math.max(done(W),L+1);
 const nuevo=L+1>done(W);if(nuevo){save[W]=L+1;localStorage.setItem("cj",JSON.stringify(save))}
 SND.win();confeti(60);$("#stars").innerHTML="⭐".repeat(e)+(nuevo?`<div style="font-size:1.6rem">🎁 ¡Animalito nuevo! <span style="font-size:4rem">${STK[W*3+L]}</span></div>`:"");
 const fin=done(W)>=3&&L==2;
 $("#eTitle").textContent=fin?(W==10?"¡Terminaste todos los mundos! 🏆":`¡Mundo ${W+1} completo! 🎉`):"¡Nivel completo! 🎉";
 jag("celebra",fin&&W==10?"¡Eres un experto de CorelDRAW!":"¡Lo lograste!");
 $("#bNext").onclick=()=>{SND.click();if(fin&&W<10){W++;cargar(world)}else if(fin){home();diploma()}else world()}}

// Pantalla de carga divertida
const MSG=["Cargando saltos de jaguar…","Despertando a los animalitos…","Afilando los lápices mágicos…","Persiguiendo mariposas…","Buscando el siguiente mundo…"];
function cargar(fn){SND.whoosh();$$(".s").forEach(s=>s.classList.remove("on"));$("#load").classList.add("on");
 $("#lmsg").textContent=MSG[Math.floor(Math.random()*MSG.length)];$("#lani").textContent=MUNDOS[W].a+" "+MUNDOS[Math.min(W+1,10)].a;
 const bar=$("#lbar i");bar.style.transition="none";bar.style.width="0";setTimeout(()=>{bar.style.transition="width 3s linear";bar.style.width="100%"},50);
 jag("senala","¡Viajamos al mundo "+(W+1)+"!");
 setTimeout(()=>{$("#load").classList.remove("on");fn()},3200)}

// Minijuego 2: parejas
function pares(){show("mini");const m=MUNDOS[W];let sel=[],hits=0;$("#prog2").textContent="🃏 Encuentra las parejas";
 const b=$("#board");b.innerHTML="";
 sh(rounds.flatMap((x,i)=>[{i,t:x.k,k:1},{i,t:x.v}])).forEach(c=>{const d=document.createElement("button");d.className="fc";d.textContent=m.a;
  d.onclick=()=>{if(d.classList.contains("up")||sel.length>1)return;SND.click();d.classList.add("up");d.textContent=c.t;say(hablar(c.t));sel.push([d,c]);
   if(sel.length==2){const[[d1,c1],[d2,c2]]=sel;
    if(c1.i==c2.i&&c1.k!=c2.k){SND.ok();confeti(10);d1.classList.add("si");d2.classList.add("si");sel=[];if(++hits==rounds.length)setTimeout(finish,1200)}
    else{SND.bad();fails++;setTimeout(()=>{[d1,d2].forEach(x=>{x.classList.remove("up");x.textContent=m.a});sel=[]},1100)}}};b.appendChild(d)});
 jag("piensa","Toca dos cartas. Une cada atajo con lo que hace");$("#bRep").onclick=()=>say("Une cada atajo con lo que hace")}
// Minijuego 3: repite el orden
function simon(){show("mini");const m=MUNDOS[W],seq=sh(rounds);let p=0,bloq=true;$("#prog2").textContent="🧠 Mira el orden y repítelo";
 const b=$("#board");b.innerHTML="";
 const bs=sh(seq).map(x=>{const d=document.createElement("button");d.className="fc sm";d.innerHTML=m.a+"<br>"+x.k;
  d.onclick=()=>{if(bloq)return;if(x===seq[p]){SND.ok();d.classList.add("si");if(++p==seq.length)return setTimeout(finish,900);jag("celebra","¡Sigue!")}
   else{SND.bad();fails++;p=0;bs.forEach(y=>y[0].classList.remove("si"));jag("senala","Otra vez. Mira el orden");setTimeout(mostrar,1000)}};b.appendChild(d);return[d,x]});
 function mostrar(){bloq=true;let i=0;(function s(){if(i>=seq.length){bloq=false;jag("ok","¡Ahora tú!");return}
  const[d,x]=bs.find(y=>y[1]===seq[i]);d.classList.add("glow");SND.click();say(x.v);setTimeout(()=>{d.classList.remove("glow");i++;setTimeout(s,300)},1900)})()}
 $("#bRep").onclick=()=>{p=0;bs.forEach(y=>y[0].classList.remove("si"));mostrar()};mostrar()}

// Recompensas
const STK="🐢 🦎 🐊 🐰 🐹 🐿️ 🐸 🦆 🦢 🐵 🦍 🦧 🐼 🐨 🐻 🦊 🐺 🦝 🐧 🐦 🦜 🦉 🦅 🦇 🐙 🦑 🦀 🐬 🐳 🦈 🦋 🐝 🐞".split(" ");
function confeti(n){const e=["🎉","⭐","✨","🐾","🎊"];for(let i=0;i<n;i++){const s=document.createElement("span");s.className="cf";s.textContent=e[i%5];
 s.style.cssText=`left:${Math.random()*100}vw;animation-duration:${1.5+Math.random()*2}s;font-size:${18+Math.random()*22}px`;document.body.appendChild(s);setTimeout(()=>s.remove(),3800)}}
$("#bAlb").onclick=()=>{SND.click();$("#mTitle").textContent="🎁 Mis animalitos";
 $("#manual").innerHTML='<div class="grid">'+STK.map((s,i)=>{const ok=i%3<done(Math.floor(i/3));return`<div class="w ${ok?"":"lock"}"><b>${ok?s:"❓"}</b>${ok?"":"Mundo "+(Math.floor(i/3)+1)}</div>`}).join("")+"</div>";
 $("#modal").classList.add("on");jag("ok","Completa niveles para ganar animalitos")};
function diploma(){const n=(prompt("¿Cómo te llamas?")||"Campeón").replace(/[<>&]/g,"");$("#mTitle").textContent="🎓 Diploma";
 $("#manual").innerHTML=`<div class="dip"><h1>🏆 DIPLOMA 🏆</h1><p>Ciber Jaguar felicita a</p><h2>${n}</h2><p>por completar los 11 mundos de atajos de CorelDRAW</p><div style="font-size:2.2rem">${MUNDOS.map(w=>w.a).join("")}</div><button class="big" id="pr" onclick="print()">🖨️ Imprimir</button></div>`;
 $("#modal").classList.add("on");SND.win();confeti(60)}

// Manual
$("#bMan").onclick=()=>{SND.click();$("#mTitle").textContent="📖 Manual";const m=$("#manual");m.innerHTML="";
 MUNDOS.forEach((w,i)=>{const h=document.createElement("h3");h.textContent=`${w.a} ${i+1}. ${w.n}`;m.appendChild(h);
  w.items.forEach(it=>{const b=document.createElement("button");b.innerHTML=`<b>${it.k}</b><span>${it.v} 🔊</span>`;b.onclick=()=>{SND.click();sayItem(it)};m.appendChild(b)})});
 $("#modal").classList.add("on")};
$("#bClose").onclick=()=>{SND.click();speechSynthesis.cancel();$("#modal").classList.remove("on")};
$("#bHome").onclick=()=>{SND.click();home()};
$("#bMute").onclick=e=>{mute=!mute;e.target.textContent=mute?"🔇":"🔊";if(mute)speechSynthesis.cancel();else SND.click()};
$("#jag").parentElement.style.pointerEvents="none";
// Tema claro / oscuro
function tema(o){document.documentElement.dataset.tema=o?"oscuro":"claro";$("#bTema").textContent=o?"☀️":"🌙";localStorage.setItem("cjt",o?1:0)}
$("#bTema").onclick=()=>{SND.click();tema(document.documentElement.dataset.tema!="oscuro")};
const gt=localStorage.getItem("cjt");tema(gt===null?matchMedia("(prefers-color-scheme:dark)").matches:gt==1);
home();