
const container = document.getElementById('shader');
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d', { alpha: true });

function fitCanvas() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const rect = container.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
fitCanvas();
window.addEventListener('resize', fitCanvas);

/* -----------------------------
   3) Helpers
------------------------------ */
function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function rand(min, max){ return Math.random() * (max - min) + min; }

function loadImage(src){
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
function averageColor(img){
  const off = document.createElement('canvas');
  const s = 8;
  off.width = s; off.height = s;
  const octx = off.getContext('2d');
  const r = Math.min(s / img.width, s / img.height);
  const w = img.width * r, h = img.height * r;
  const x = (s - w) / 2, y = (s - h) / 2;
  octx.drawImage(img, x, y, w, h);
  const data = octx.getImageData(0,0,s,s).data;
  let R=0,G=0,B=0,A=0;
  for(let i=0;i<data.length;i+=4){
    const a = data[i+3];
    if(a>10){ R+=data[i]; G+=data[i+1]; B+=data[i+2]; A++; }
  }
  if(!A) return {r:255,g:255,b:255};
  return { r: (R/A)|0, g:(G/A)|0, b:(B/A)|0 };
}
const rgb = (c,a=1)=>`rgba(${c.r|0},${c.g|0},${c.b|0},${a})`;

/* -----------------------------
   4) Particle class
------------------------------ */
class Particle {
  constructor(img, tech, bounds) {
    this.size = rand(26, 48);
    this.radius = this.size * 0.5;

    const pad = this.radius + 4;
    this.x = rand(pad, bounds.width - pad);
    this.y = rand(pad, bounds.height - pad);

    const speed = rand(0.4, 1.4);
    const angle = rand(0, Math.PI*2);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.img = img;
    this.tech = tech;
    this.avg = averageColor(img);
    this.isHovered = false;

    this.glow = { radiusMult: 0.9, blur: 28, alpha: 0.50 };
  }

  contains(px, py){
    const dx = px - this.x;
    const dy = py - this.y;
    return (dx*dx + dy*dy) <= (this.radius*this.radius);
  }

  draw(ctx){
    const cx = this.x, cy = this.y;

    // BLOOM
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.filter = `blur(${this.glow.blur}px)`;
    ctx.globalAlpha = this.glow.alpha;
    ctx.beginPath();
    ctx.fillStyle = rgb(this.avg, 1);
    ctx.arc(cx, cy, this.radius * this.glow.radiusMult, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // IMAGE
    ctx.save();
    ctx.shadowColor = rgb(this.avg, 0.9);
    ctx.shadowBlur = 24;
    ctx.globalAlpha = this.isHovered ? 1 : 0.95;
    const w = this.size, h = this.size;
    ctx.drawImage(this.img, cx - w/2, cy - h/2, w, h);
    ctx.restore();
  }

  update(bounds){
    if (!this.isHovered){
      this.x += this.vx;
      this.y += this.vy;
    }
    // bounce
    if (this.x - this.radius < 0){ this.x = this.radius; this.vx *= -1; }
    if (this.x + this.radius > bounds.width){ this.x = bounds.width - this.radius; this.vx *= -1; }
    if (this.y - this.radius < 0){ this.y = this.radius; this.vy *= -1; }
    if (this.y + this.radius > bounds.height){ this.y = bounds.height - this.radius; this.vy *= -1; }
  }
}

/* -----------------------------
   5) Collisions (elastic)
------------------------------ */
function resolveCollision(p1, p2){
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) return;

  const overlap = (p1.radius + p2.radius) - dist;
  if (overlap > 0){
    const nx = dx / dist, ny = dy / dist;
    const sep = overlap / 2 + 0.1;
    p1.x -= nx * sep; p1.y -= ny * sep;
    p2.x += nx * sep; p2.y += ny * sep;

    const rvx = p2.vx - p1.vx;
    const rvy = p2.vy - p1.vy;
    const velAlongNormal = rvx * nx + rvy * ny;
    if (velAlongNormal < 0){
      const j = -(1 + 1) * velAlongNormal / 2;
      const ix = j * nx, iy = j * ny;
      p1.vx -= ix; p1.vy -= iy;
      p2.vx += ix; p2.vy += iy;
    }
  }
}

/* -----------------------------
   6) Build particles (each once)
------------------------------ */
const particles = [];
let bounds = container.getBoundingClientRect();

(async function init(){
  const chosen = shuffle([...techStack]); // use all once
  const loaded = await Promise.all(
    chosen.map(t =>
      loadImage(t.img).then(img => ({img, tech: {
        name: t.name,
        img: t.img,
        link: t.link || '#',
        desc: t.desc || `${t.name}: quick overview and key traits.`,
        list: t.list || defaultFacts(t.name)
      }})).catch(()=>null)
    )
  );
  const valid = loaded.filter(Boolean);
  if (!valid.length) return;

  bounds = container.getBoundingClientRect();
  for (const {img, tech} of valid){
    particles.push(new Particle(img, tech, bounds));
  }

  requestAnimationFrame(loop);
})();

/* -----------------------------
   7) Animation
------------------------------ */
function loop(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'lighter';

  const w = container.clientWidth, h = container.clientHeight;
  const localBounds = { width: w, height: h };

  // update (with hover freeze)
  for (let i=0;i<particles.length;i++){
    particles[i].update(localBounds);
  }
  // collisions
  for (let i=0;i<particles.length;i++){
    for (let j=i+1;j<particles.length;j++){
      const p1 = particles[i], p2 = particles[j];
      const dx = p2.x - p1.x, dy = p2.y - p1.y;
      const rr = (p1.radius + p2.radius);
      if (dx*dx + dy*dy < rr*rr) resolveCollision(p1, p2);
    }
  }
  // draw
  for (let i=0;i<particles.length;i++){
    particles[i].draw(ctx);
  }
  requestAnimationFrame(loop);
}

/* -----------------------------
   8) Hover to freeze
------------------------------ */
function pointerPos(evt){
  const rect = canvas.getBoundingClientRect();
  const x = (evt.clientX - rect.left);
  const y = (evt.clientY - rect.top);
  return {x, y};
}
canvas.addEventListener('mousemove', (e)=>{
  const {x, y} = pointerPos(e);
  let anyHover = false;
  for(const p of particles){
    const inside = p.contains(x, y);
    p.isHovered = inside;
    if (inside) anyHover = true;
  }
  canvas.style.cursor = anyHover ? 'pointer' : 'default';
});
canvas.addEventListener('mouseleave', ()=>{
  for(const p of particles) p.isHovered = false;
  canvas.style.cursor = 'default';
});

/* -----------------------------
   9) Click → Popup with avatar letter
------------------------------ */
const popupBackdrop = document.getElementById('popupBackdrop');
const popupAvatar = document.getElementById('popupAvatar');
const popupTitle = document.getElementById('popupTitle');
const popupDesc  = document.getElementById('popupDesc');
const popupList  = document.getElementById('popupList');
const popupVisit = document.getElementById('popupVisit');
const popupClose = document.getElementById('popupClose');

function openPopup(tech, avgColor){
  // unique initial letter badge
  const letter = (tech.name?.trim()?.[0] || '?').toUpperCase();
  popupAvatar.textContent = letter;
  popupAvatar.style.background = `linear-gradient(135deg, ${rgb(avgColor,0.95)}, ${rgb(avgColor,0.75)})`;
  popupAvatar.style.boxShadow = `0 0 36px ${rgb(avgColor,0.45)} inset, 0 0 42px ${rgb(avgColor,0.35)}`;

  popupTitle.textContent = tech.name || 'Unknown';
  popupDesc.textContent  = tech.desc || '';
  popupList.innerHTML = '';
  (tech.list || []).forEach(item=>{
    const li = document.createElement('li');
    li.textContent = item;
    popupList.appendChild(li);
  });
  popupVisit.onclick = ()=> window.open(tech.link || '#', '_blank', 'noopener');

  popupBackdrop.style.display = 'flex';
}
function closePopup(){
  popupBackdrop.style.display = 'none';
}

canvas.addEventListener('click', (e)=>{
  const {x, y} = pointerPos(e);
  for(const p of particles){
    if (p.contains(x,y)){
      openPopup(p.tech, p.avg);
      break;
    }
  }
});
popupClose.addEventListener('click', closePopup);
popupBackdrop.addEventListener('click', (e)=>{
  if (e.target === popupBackdrop) closePopup();
});
document.addEventListener('keydown', (e)=>{
  if (e.key === 'Escape') closePopup();
});