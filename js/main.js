/* ===== Ambient stars ===== */
function initStars(count=50){
  const wrap = document.getElementById('star-layer');
  if(!wrap) return;
  for(let i=0;i<count;i++){
    const s = document.createElement('div');
    s.className='star';
    s.style.left = Math.random()*100+'%';
    s.style.top = Math.random()*70+'%';
    s.style.animationDelay = (Math.random()*3)+'s';
    wrap.appendChild(s);
  }
}

/* ===== Moving flowers (bunga bergerak) ===== */
const flowerSVG = (color, accent) => `
  <svg width="26" height="26" viewBox="0 0 26 26">
    <g>
      <ellipse cx="13" cy="6" rx="4.2" ry="6" fill="${color}"/>
      <ellipse cx="13" cy="20" rx="4.2" ry="6" fill="${color}"/>
      <ellipse cx="6" cy="13" rx="6" ry="4.2" fill="${color}"/>
      <ellipse cx="20" cy="13" rx="6" ry="4.2" fill="${color}"/>
      <circle cx="13" cy="13" r="3.4" fill="${accent}"/>
    </g>
  </svg>`;
const flowerPalette = [
  ['#e8637e','#f0c68a'],
  ['#ffb199','#fff3ec'],
  ['#f0c68a','#e8637e'],
  ['#f6a3b4','#f0c68a']
];
function spawnFlower(){
  const wrap = document.getElementById('petal-layer');
  if(!wrap) return;
  const el = document.createElement('div');
  el.className='flower';
  const [c,a] = flowerPalette[Math.floor(Math.random()*flowerPalette.length)];
  el.innerHTML = flowerSVG(c,a);
  const startX = Math.random()*100;
  const size = 14 + Math.random()*16;
  const duration = 10 + Math.random()*9;
  const drift = (Math.random()*2-1)*140;
  el.style.left = startX+'vw';
  el.style.width = size+'px';
  wrap.appendChild(el);
  const anim = el.animate([
    { transform:`translate(0,0) rotate(0deg)`, opacity:.9 },
    { transform:`translate(${drift*0.4}px, 40vh) rotate(120deg)`, opacity:.85, offset:.5 },
    { transform:`translate(${drift}px, 105vh) rotate(320deg)`, opacity:0 }
  ], { duration: duration*1000, easing:'ease-in-out' });
  anim.onfinish = ()=> el.remove();
}
function startFlowerField(intervalMs=750, burst=5){
  for(let i=0;i<burst;i++) setTimeout(spawnFlower, i*260);
  return setInterval(spawnFlower, intervalMs);
}

/* ===== Confetti burst (rectangles) ===== */
let confettiParticles = [];
let confettiAnimating = false;
function getCanvas(id){
  const c = document.getElementById(id);
  if(!c) return null;
  const resize = ()=>{ c.width = innerWidth; c.height = innerHeight; };
  resize();
  window.addEventListener('resize', resize);
  return c;
}
const confettiColors = ['#e8637e','#f0c68a','#ffb199','#fff3ec'];
function burstConfetti(x,y,count=70){
  const canvas = document.getElementById('confetti-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  for(let i=0;i<count;i++){
    const angle = Math.random()*Math.PI*2;
    const speed = 3 + Math.random()*7;
    confettiParticles.push({
      x, y, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed-3,
      size:4+Math.random()*5, color:confettiColors[Math.floor(Math.random()*confettiColors.length)],
      rot:Math.random()*360, vr:(Math.random()*2-1)*8, life:0, maxLife:90+Math.random()*40
    });
  }
  if(!confettiAnimating){ confettiAnimating=true; requestAnimationFrame(()=>tickConfetti(ctx,canvas)); }
}
function tickConfetti(ctx,canvas){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  confettiParticles.forEach(p=>{
    p.vy += 0.12; p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr; p.life++;
    ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
    ctx.globalAlpha = Math.max(0, 1-p.life/p.maxLife);
    ctx.fillStyle = p.color; ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.6);
    ctx.restore();
  });
  confettiParticles = confettiParticles.filter(p=>p.life<p.maxLife);
  if(confettiParticles.length>0){ requestAnimationFrame(()=>tickConfetti(ctx,canvas)); } else { confettiAnimating=false; }
}

/* ===== Fireworks (for success page) ===== */
let fireworkParticles = [];
let fireworkAnimating = false;
function launchFirework(canvas){
  const ctx = canvas.getContext('2d');
  const x = 80 + Math.random()*(canvas.width-160);
  const y = 100 + Math.random()*(canvas.height*0.4);
  const color = confettiColors[Math.floor(Math.random()*confettiColors.length)];
  for(let i=0;i<50;i++){
    const angle = (Math.PI*2*i)/50;
    const speed = 2+Math.random()*3.5;
    fireworkParticles.push({ x,y, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed, color, life:0, maxLife:60+Math.random()*20, size:2.4 });
  }
  if(!fireworkAnimating){ fireworkAnimating=true; requestAnimationFrame(()=>tickFireworks(ctx,canvas)); }
}
function tickFireworks(ctx,canvas){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  fireworkParticles.forEach(p=>{
    p.vy += 0.045; p.x+=p.vx; p.y+=p.vy; p.life++;
    ctx.globalAlpha = Math.max(0, 1-p.life/p.maxLife);
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
  });
  fireworkParticles = fireworkParticles.filter(p=>p.life<p.maxLife);
  if(fireworkParticles.length>0 || fireworkAnimating){ requestAnimationFrame(()=>tickFireworks(ctx,canvas)); }
}
function startFireworkShow(id='fireworks-canvas'){
  const canvas = getCanvas(id);
  if(!canvas) return;
  launchFirework(canvas);
  const t1 = setInterval(()=> launchFirework(canvas), 1100);
  setTimeout(()=>{ clearInterval(t1); fireworkAnimating=false; }, 9000);
}

/* ===== Heart burst (untuk tombol "kirim pelukan") ===== */
let heartParticles = [];
let heartAnimating = false;
function drawHeartPath(ctx, size){
  const t = size*0.3;
  ctx.beginPath();
  ctx.moveTo(0, t);
  ctx.bezierCurveTo(0, 0, -size/2, 0, -size/2, t);
  ctx.bezierCurveTo(-size/2, size*0.6, 0, size*0.8, 0, size);
  ctx.bezierCurveTo(0, size*0.8, size/2, size*0.6, size/2, t);
  ctx.bezierCurveTo(size/2, 0, 0, 0, 0, t);
  ctx.closePath();
}
function burstHearts(x, y, count=26){
  const canvas = document.getElementById('heart-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  for(let i=0;i<count;i++){
    const angle = -Math.PI/2 + (Math.random()*1.6 - 0.8);
    const speed = 2.2 + Math.random()*4.2;
    heartParticles.push({
      x, y, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed,
      size: 8+Math.random()*16,
      color: confettiColors[Math.floor(Math.random()*confettiColors.length)],
      rot: (Math.random()*40-20), vr:(Math.random()*2-1)*1.4,
      life:0, maxLife:110+Math.random()*50
    });
  }
  if(!heartAnimating){ heartAnimating=true; requestAnimationFrame(()=>tickHearts(ctx,canvas)); }
}
function tickHearts(ctx,canvas){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  heartParticles.forEach(p=>{
    p.vy += 0.02; p.vx *= 0.992;
    p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr; p.life++;
    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.rotate(p.rot*Math.PI/180);
    ctx.globalAlpha = Math.max(0, 1-p.life/p.maxLife);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color; ctx.shadowBlur = 12;
    drawHeartPath(ctx, p.size);
    ctx.fill();
    ctx.restore();
  });
  heartParticles = heartParticles.filter(p=>p.life<p.maxLife);
  if(heartParticles.length>0){ requestAnimationFrame(()=>tickHearts(ctx,canvas)); } else { heartAnimating=false; }
}

/* ===== Background audio: autoplay (selalu jalan, terlepas dari ada/tidaknya tombol) ===== */
function initAutoplayAudio(audioId='bgm'){
  const audio = document.getElementById(audioId);
  if(!audio) return;
  const tryPlay = ()=> audio.play().catch(()=>{});
  tryPlay();
  // kalau browser memblokir autoplay, coba lagi begitu ada interaksi pertama dari pengguna
  const retry = ()=>{ tryPlay(); };
  ['click','touchstart','keydown'].forEach(evt=>{
    document.addEventListener(evt, retry, { once:true, passive:true });
  });
}

/* ===== Tombol mute/unmute manual (opsional, hanya aktif kalau tombolnya ada di halaman) ===== */
function initSoundToggle(btnId='soundToggle', audioId='bgm'){
  const btn = document.getElementById(btnId);
  const audio = document.getElementById(audioId);
  if(!btn || !audio) return;
  let playing = false;

  function setPlayingUI(isPlaying){
    playing = isPlaying;
    btn.textContent = isPlaying ? '♪' : '♪̶';
  }
  audio.play().then(()=> setPlayingUI(true)).catch(()=> setPlayingUI(false));

  btn.addEventListener('click', ()=>{
    if(!playing){
      audio.play().then(()=> setPlayingUI(true)).catch(()=> setPlayingUI(false));
    } else {
      audio.pause();
      setPlayingUI(false);
    }
  });
}

/* ===== Scroll reveal ===== */
function initReveal(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('in'); });
  }, { threshold:.2 });
  document.querySelectorAll('.reveal').forEach(el=> io.observe(el));
}

/* ===== boot ambient layers on every page ===== */
document.addEventListener('DOMContentLoaded', ()=>{
  initStars();
  if(!document.body.hasAttribute('data-no-petals')) window.__flowerInterval = startFlowerField();
  initReveal();
  initAutoplayAudio();
  initSoundToggle();
});
