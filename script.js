// Зургуудын файлын нэрсийн жагсаалт[cite: 7]
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
    "t (21).jpg", "t (22).jpg", "t (23).jpg", "t (25).jpg", "t (26).jpg",
    "t (27).jpg", "t (28).jpg", "t (29).jpg", "t (30).jpg", "t (31).jpg",
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

const categoryLabels = {
  classes: 'Анги',
  teachers: 'Багш',
  cabinets: 'Кабинет'
};

let currentCategory = null;
let currentPage = 1;
let searchQuery = '';
const itemsPerPage = 20;

// DOM Элементүүд[cite: 7]
const galleryGrid = document.getElementById('galleryGrid');
const paginationContainer = document.getElementById('pagination');
const navButtons = document.querySelectorAll('.nav-btn');
const searchBarWrapper = document.getElementById('searchBarWrapper');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const resultCountBadge = document.getElementById('resultCountBadge');

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
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

// 🎵 WEB AUDIO API - ЗӨӨЛӨН АЯ[cite: 7]
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

    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch (e) {}
}

// Файлын нэрээс дугаарыг салгах (жишээ нь "c (14).jpg" -> "14")
function extractNumber(fileName) {
  const match = fileName.match(/\((\d+)\)/);
  return match ? match[1] : fileName.replace('.jpg', '');
}

// Эхний санамж харуулах
function renderInitialState() {
  galleryGrid.innerHTML = `
    <div class="welcome-placeholder">
      <div class="welcome-icon">📅</div>
      <h3>Хуваарь харах төрлөө дээрх 3 товчноос сонгоно уу</h3>
      <p>Анги, багш эсвэл кабинетийн хуваарийг сонгон томруулж харах боломжтой</p>
    </div>
  `;
  paginationContainer.innerHTML = '';
}

// Зургуудыг харуулах
function renderGallery() {
  if (!currentCategory) return;

  galleryGrid.innerHTML = '';
  const allItems = imagesData[currentCategory] || [];

  // Хайлтаар шүүх
  const filteredList = searchQuery
    ? allItems.filter((fileName) => {
        const num = extractNumber(fileName);
        return num.includes(searchQuery) || fileName.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : allItems;

  resultCountBadge.textContent = `Нийт ${filteredList.length} хуваарь`;

  if (filteredList.length === 0) {
    galleryGrid.innerHTML = `
      <div class="welcome-placeholder">
        <div class="welcome-icon">🔎</div>
        <h3>"${searchQuery}" дугаартай хуваарь олдсонгүй</h3>
        <p>Өөр дугаар оруулж дахин шалгана уу</p>
      </div>
    `;
    paginationContainer.innerHTML = '';
    return;
  }

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  if (currentPage > totalPages) currentPage = 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredList.length);
  const pageItems = filteredList.slice(startIndex, endIndex);
  const labelPrefix = categoryLabels[currentCategory] || 'Хуваарь';

  pageItems.forEach((fileName, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${index * 0.03}s`;

    const imageSrc = `images/${currentCategory}/${fileName}`;
    const itemNum = extractNumber(fileName);
    const displayTitle = `${labelPrefix} №${itemNum}`;

    card.innerHTML = `
      <div class="card-thumb">
        <img src="${imageSrc}" alt="${displayTitle}" loading="lazy" />
        <span class="card-badge">${displayTitle}</span>
        <div class="card-overlay">
          <span class="card-btn">🔍 Томруулж харах</span>
        </div>
      </div>
      <div class="card-footer">
        <span class="card-label">${displayTitle}</span>
        <span class="card-action-hint">Харах ➔</span>
      </div>
    `;

    card.addEventListener('click', () => {
      openLightbox(imageSrc, fileName, displayTitle);
    });

    galleryGrid.appendChild(card);
  });

  renderPagination(totalPages);
}

// Хуудаслалт[cite: 7]
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
      window.scrollTo({ top: 180, behavior: 'smooth' });
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
      window.scrollTo({ top: 180, behavior: 'smooth' });
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
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  });
  paginationContainer.appendChild(nextBtn);
}

// Төрөл сонгох товчлуурууд[cite: 7]
navButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    playSoftClickSound();

    navButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    currentCategory = btn.getAttribute('data-category');
    currentPage = 1;
    searchQuery = '';
    searchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    searchBarWrapper.classList.remove('hidden');

    galleryGrid.style.opacity = '0.35';
    setTimeout(() => {
      renderGallery();
      galleryGrid.style.opacity = '1';
    }, 150);
  });
});

// Хайлтын талбар
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  currentPage = 1;
  if (searchQuery) clearSearchBtn.classList.remove('hidden');
  else clearSearchBtn.classList.add('hidden');
  renderGallery();
});

clearSearchBtn.addEventListener('click', () => {
  searchQuery = '';
  searchInput.value = '';
  clearSearchBtn.classList.add('hidden');
  currentPage = 1;
  renderGallery();
});

// 🐧 PENGUIN EASTER EGG[cite: 7]
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

// Lightbox[cite: 7]
function openLightbox(src, fileName, displayTitle) {
  playSoftClickSound();
  currentImageSrc = src;
  lightboxImg.src = src;
  if (lightboxTitle) lightboxTitle.textContent = displayTitle || 'Хичээлийн хуваарь';
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
    .then((res) => res.blob())
    .then((blob) => {
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

// Zoom ба чирж хөдөлгөх удирдлага[cite: 7]
function updateTransform() {
  lightboxImg.style.transform = `translate(${panX}px, ${panY}px) scale(${currentScale})`;
}

function setZoom(scale) {
  currentScale = Math.min(Math.max(scale, 0.8), 4);
  if (currentScale === 1) {
    panX = 0;
    panY = 0;
  }
  updateTransform();
}

function resetZoom() {
  currentScale = 1;
  panX = 0;
  panY = 0;
  updateTransform();
}

zoomInBtn.addEventListener('click', () => setZoom(currentScale + 0.4));
zoomOutBtn.addEventListener('click', () => setZoom(currentScale - 0.4));
resetZoomBtn.addEventListener('click', resetZoom);

// Компьютер дээр хулганы дугуйгаар томруулах ба чирэх
imgWrapper.addEventListener('wheel', (e) => {
  e.preventDefault();
  setZoom(currentScale + (e.deltaY < 0 ? 0.25 : -0.25));
}, { passive: false });

imgWrapper.addEventListener('mousedown', (e) => {
  if (currentScale > 1) {
    isDragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
  }
});

window.addEventListener('mousemove', (e) => {
  if (isDragging && currentScale > 1) {
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    updateTransform();
  }
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

// Гар утасны мэдрэгч дэлгэц дээр 2 хуруугаар томруулах[cite: 7]
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
