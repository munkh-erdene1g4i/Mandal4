// Зургуудын файлын нэрсийн жагсаалт
const imagesData = {
  // 1. Ангиар харах (38 зураг)
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

  // 2. Багшаар харах (37 зураг)
  teachers: [
  "t (1).jpg", "t (2).jpg", "t (3).jpg", "t (4).jpg", "t (5).jpg",
"t (6).jpg", "t (7).jpg", "t (8).jpg", "t (9).jpg", "t (10).jpg",
"t (11).jpg", "t (12).jpg", "t (13).jpg", "t (14).jpg", "t (15).jpg",
"t (16).jpg", "t (17).jpg", "t (18).jpg", "t (19).jpg", "t (20).jpg",
"t (21).jpg", "t (22).jpg", "t (23).jpg", "t (24).jpg", "t (25).jpg",
"t (26).jpg", "t (27).jpg", "t (28).jpg", "t (29).jpg", "t (30).jpg",
"t (31).jpg", "t (32).jpg", "t (33).jpg", "t (34).jpg", "t (35).jpg",
"t (36).jpg", "t (37).jpg"
  ],

  // 3. Танхимаар харах (25 зураг)
  cabinets: [
 "k (1).jpg", "k (2).jpg", "k (3).jpg", "k (4).jpg", "k (5).jpg",
"k (6).jpg", "k (7).jpg", "k (8).jpg", "k (9).jpg", "k (10).jpg",
"k (11).jpg", "k (12).jpg", "k (13).jpg", "k (14).jpg", "k (15).jpg",
"k (16).jpg", "k (17).jpg", "k (18).jpg", "k (19).jpg", "k (20).jpg",
"k (21).jpg", "k (22).jpg", "k (23).jpg", "k (24).jpg", "k (25).jpg"
  ]
};

// DOM Элементүүд
const galleryGrid = document.getElementById('galleryGrid');
const navButtons = document.querySelectorAll('.nav-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.querySelector('.close-btn');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const resetZoomBtn = document.getElementById('resetZoomBtn');

let currentScale = 1;

// Ангиллын дагуу зургуудыг ачаалах
function loadCategory(category) {
  galleryGrid.innerHTML = '';
  const fileList = imagesData[category];

  fileList.forEach((fileName) => {
    const card = document.createElement('div');
    card.className = 'card';
    const imageSrc = `images/${category}/${fileName}`;

    card.innerHTML = `
      <img src="${imageSrc}" alt="Хуваарь" loading="lazy">
      <div class="card-overlay">
        <span class="zoom-hint">🔍 Томсгож харах</span>
      </div>
    `;

    // Зураг дээр дарахад Lightbox нээх
    card.addEventListener('click', () => {
      openLightbox(imageSrc);
    });

    galleryGrid.appendChild(card);
  });
}

// Навигацийн товчлуур солих
navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const category = btn.getAttribute('data-category');
    loadCategory(category);
  });
});

// Lightbox нээх
function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add('active');
  resetZoom();
}

// Lightbox хаах
function closeLightbox() {
  lightbox.classList.remove('active');
  resetZoom();
}

closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Zoom Удирдлага
function setZoom(scale) {
  currentScale = Math.min(Math.max(scale, 0.8), 3.5);
  lightboxImg.style.transform = `scale(${currentScale})`;
  if (currentScale > 1) {
    lightboxImg.classList.add('zoomed');
  } else {
    lightboxImg.classList.remove('zoomed');
  }
}

function resetZoom() {
  currentScale = 1;
  setZoom(1);
}

zoomInBtn.addEventListener('click', () => setZoom(currentScale + 0.4));
zoomOutBtn.addEventListener('click', () => setZoom(currentScale - 0.4));
resetZoomBtn.addEventListener('click', resetZoom);

// Зураг дээр дарахад шууд 2х томруулах / жижигрүүлэх
lightboxImg.addEventListener('click', (e) => {
  e.stopPropagation();
  if (currentScale === 1) {
    setZoom(2);
  } else {
    resetZoom();
  }
});

// ESC товчоор хаах
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});

// Эхний ачаалалтаар "Ангиар харах" хэсгийг харуулах
loadCategory('classes');
