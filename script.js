// Зургуудын файлын нэрсийн жагсаалт
const imagesData = {
  classes: [
    "c (2).jpg", "c (3).jpg", "c (4).jpg", "c (5).jpg",
    "c (6).jpg", "c (7).jpg", "c (8).jpg", "c (9).jpg", "c (10).jpg",
    "c (11).jpg", "c (12).jpg", "c (13).jpg", "c (14).jpg", "c (15).jpg",
    "c (16).jpg", "c (17).jpg", "c (18).jpg", "c (19).jpg", "c (20).jpg",
    "c (21).jpg", "c (22).jpg", "c (23).jpg", "c (24).jpg", "c (25).jpg",
    "c (26).jpg", "c (27).jpg", "c (28).jpg", "c (29).jpg", "c (30).jpg",
    "c (31).jpg", "c (32).jpg", "c (33).jpg", "c (34).jpg", "c (35).jpg",
    "c (36).jpg", "c (37).jpg", "c (38).jpg", "c (39).jpg"
  ],
  teachers: [
    "t (1).jpg", "t (2).jpg", "t (3).jpg", "t (4).jpg", "t (5).jpg",
    "t (6).jpg", "t (7).jpg", "t (8).jpg", "t (9).jpg", "t (10).jpg",
    "t (11).jpg", "t (12).jpg", "t (13).jpg", "t (14).jpg", "t (15).jpg",
    "t (16).jpg", "t (17).jpg", "t (18).jpg", "t (19).jpg", "t (20).jpg",
    "t (21).jpg", "t (22).jpg", "t (23).jpg", "t (25).jpg", "t (30).jpg",
    "t (26).jpg", "t (27).jpg", "t (28).jpg", "t (29).jpg",  "t (31).jpg",
    "t (33).jpg", "t (34).jpg", "t (35).jpg", "t (36).jpg", "t (37).jpg",
    "t (38).jpg", "t (39).jpg"
  ],
  cabinets: [
    "k (1).jpg", "k (2).jpg", "k (3).jpg", "k (4).jpg", "k (5).jpg",
    "k (6).jpg", "k (7).jpg", "k (8).jpg", "k (9).jpg", "k (10).jpg",
    "k (11).jpg", "k (12).jpg", "k (13).jpg", "k (14).jpg", "k (15).jpg",
    "k (16).jpg", "k (17).jpg", "k (18).jpg", "k (19).jpg", "k (20).jpg",
    "k (21).jpg", "k (22).jpg", "k (23).jpg", "k (24).jpg", "k (25).jpg"
  ]
};

let currentCategory = null;
let currentPage = 1;
const itemsPerPage = 20;

// DOM Элементүүд
const galleryGrid = document.getElementById('galleryGrid');
const paginationContainer = document.getElementById('pagination');
const navButtons = document.querySelectorAll('.nav-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const imgWrapper = document.getElementById('imgWrapper');
const closeBtn = document.getElementById('closeBtn');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const resetZoomBtn = document.getElementById('resetZoomBtn');
const downloadBtn = document.getElementById('downloadBtn');

let currentScale = 1;
let currentImageSrc = '';
let panX = 0, panY = 0;
let startX = 0, startY = 0;
let isDragging = false;
let initialPinchDistance = null;

// 🎵 WEB AUDIO API - ЗӨӨЛӨН АЯ
function playSoftClickSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch (e) {}
}

// 🌌 Canvas од харвах анимейшн
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
let stars = [];
let shootingStars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
}

function initStars() {
  stars = [];
  const starCount = Math.floor((canvas.width * canvas.height) / 3000);
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.4,
      alpha: Math.random(),
      speed: 0.005 + Math.random() * 0.015
    });
  }
}

function createShootingStar() {
  shootingStars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * (canvas.height / 2),
    length: Math.random() * 80 + 40,
    speed: Math.random() * 10 + 6,
    angle: Math.PI / 4,
    opacity: 1
  });
}

setInterval(createShootingStar, 3500);

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    star.alpha += star.speed;
    if (star.alpha > 1 || star.alpha < 0.2) star.speed = -star.speed;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.fill();
  });

  shootingStars.forEach((sStar, index) => {
    const endX = sStar.x + Math.cos(sStar.angle) * sStar.length;
    const endY = sStar.y + Math.sin(sStar.angle) * sStar.length;

    const grad = ctx.createLinearGradient(sStar.x, sStar.y, endX, endY);
    grad.addColorStop(0, `rgba(255, 255, 255, ${sStar.opacity})`);
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.moveTo(sStar.x, sStar.y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    sStar.x += Math.cos(sStar.angle) * sStar.speed;
    sStar.y += Math.sin(sStar.angle) * sStar.speed;
    sStar.opacity -= 0.015;

    if (sStar.opacity <= 0) {
      shootingStars.splice(index, 1);
    }
  });

  requestAnimationFrame(animateStars);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateStars();

// Эхний санамж харуулах
function renderInitialState() {
  galleryGrid.innerHTML = `
    <div class="welcome-placeholder">
      <div>👇</div>
      <h3>Хуваарь харах төрлөө дээрх 3 товчноос сонгоно уу</h3>
    </div>
  `;
  paginationContainer.innerHTML = '';
}

// Зургуудыг харуулах
function renderGallery() {
  if (!currentCategory) return;

  galleryGrid.innerHTML = '';
  const fullList = imagesData[currentCategory];

  const totalPages = Math.ceil(fullList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, fullList.length);
  const pageItems = fullList.slice(startIndex, endIndex);

  pageItems.forEach((fileName, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${index * 0.03}s`;

    const imageSrc = `images/${currentCategory}/${fileName}`;

    card.innerHTML = `
      <img src="${imageSrc}" alt="Хуваарь" loading="lazy">
      <div class="card-overlay">
        <span class="card-btn">🔍 Харах</span>
      </div>
    `;

    card.addEventListener('click', () => {
      openLightbox(imageSrc, fileName);
    });

    galleryGrid.appendChild(card);
  });

  renderPagination(totalPages);
}

// Хуудаслалт
function renderPagination(totalPages) {
  paginationContainer.innerHTML = '';
  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn';
  prevBtn.innerText = '‹ Өмнөх';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderGallery();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  paginationContainer.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    pageBtn.innerText = i;
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      renderGallery();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    paginationContainer.appendChild(pageBtn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn';
  nextBtn.innerText = 'Дараах ›';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderGallery();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  paginationContainer.appendChild(nextBtn);
}

// Товчлуур дарахад Ая & Гэрэлтүүлэг
navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    playSoftClickSound();

    navButtons.forEach(b => {
      b.classList.remove('active');
      b.classList.remove('glow-pulse');
    });

    btn.classList.add('active');
    btn.classList.add('glow-pulse');

    currentCategory = btn.getAttribute('data-category');
    currentPage = 1;

    galleryGrid.style.opacity = '0.3';
    setTimeout(() => {
      renderGallery();
      galleryGrid.style.opacity = '1';
    }, 150);
  });
});

// 🐧 PENGUIN EASTER EGG
function triggerPenguinEasterEgg() {
  const oldPenguin = document.querySelector('.penguin-easter-egg');
  if (oldPenguin) oldPenguin.remove();

  const penguin = document.createElement('div');
  penguin.className = 'penguin-easter-egg';
  penguin.innerText = '🐧';
  document.body.appendChild(penguin);

  setTimeout(() => {
    if (penguin) penguin.remove();
  }, 8600);
}

// Lightbox
function openLightbox(src, fileName) {
  playSoftClickSound();
  currentImageSrc = src;
  lightboxImg.src = src;
  lightbox.classList.add('active');
  resetZoom();

  if (fileName && fileName.includes('c (14)')) {
    triggerPenguinEasterEgg();
  }
}

function closeLightbox() {
  lightbox.classList.remove('active');
  resetZoom();
}

closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target === imgWrapper) closeLightbox();
});

function downloadImage(imgSrc) {
  const fileName = imgSrc.split('/').pop() || 'huvaari.jpg';
  fetch(imgSrc)
    .then(res => res.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Mandal_4-r_surguuli_${fileName}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(() => {
      const a = document.createElement('a');
      a.href = imgSrc;
      a.download = fileName;
      a.target = '_blank';
      a.click();
    });
}

downloadBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (currentImageSrc) downloadImage(currentImageSrc);
});

// Zoom controls
function updateTransform() {
  lightboxImg.style.transform = `translate(${panX}px, ${panY}px) scale(${currentScale})`;
}

function setZoom(scale) {
  currentScale = Math.min(Math.max(scale, 0.8), 4);
  if (currentScale === 1) { panX = 0; panY = 0; }
  updateTransform();
}

function resetZoom() {
  currentScale = 1;
  panX = 0; panY = 0;
  updateTransform();
}

zoomInBtn.addEventListener('click', () => setZoom(currentScale + 0.4));
zoomOutBtn.addEventListener('click', () => setZoom(currentScale - 0.4));
resetZoomBtn.addEventListener('click', resetZoom);

let lastTap = 0;
imgWrapper.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    const currentTime = new Date().getTime();
    if (currentTime - lastTap < 300 && currentTime - lastTap > 0) {
      if (currentScale > 1) resetZoom();
      else setZoom(2.2);
      e.preventDefault();
    }
    lastTap = currentTime;

    if (currentScale > 1) {
      isDragging = true;
      startX = e.touches[0].clientX - panX;
      startY = e.touches[0].clientY - panY;
    }
  } else if (e.touches.length === 2) {
    isDragging = false;
    initialPinchDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
  }
});

imgWrapper.addEventListener('touchmove', (e) => {
  if (isDragging && e.touches.length === 1 && currentScale > 1) {
    panX = e.touches[0].clientX - startX;
    panY = e.touches[0].clientY - startY;
    updateTransform();
  } else if (e.touches.length === 2 && initialPinchDistance) {
    const currentDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    setZoom(currentScale + (currentDistance - initialPinchDistance) / 200);
    initialPinchDistance = currentDistance;
  }
});

imgWrapper.addEventListener('touchend', () => {
  isDragging = false;
  initialPinchDistance = null;
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});

renderInitialState();
