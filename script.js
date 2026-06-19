// ============================================
// АУДИО ПЛЕЕР - ПОЛНАЯ ЛОГИКА
// ============================================

// ============================================
// 1. ДАННЫЕ ТРЕКОВ
// ============================================

const tracks = [
  {
    title: 'Underwater Love',
    version: '(Sped Up)',
    src: 'audio/Underwater Love (Sped Up).mp3',
    duration: '3:45'
  },
  {
    title: 'Fruits & Passion',
    version: '(Downtempo Slowed Mix)',
    src: 'audio/Fruits & Passion (Downtempo Slowed Mix).mp3',
    duration: '4:20'
  }
];

// ============================================
// 2. DOM ЭЛЕМЕНТЫ
// ============================================

const audio = new Audio();
let currentTrackIndex = 0;
let isPlaying = false;
let isLooping = false;

const cover = document.getElementById('cover');
const trackName = document.getElementById('trackName');
const trackVersion = document.getElementById('trackVersion');
const trackIcon = document.getElementById('trackIcon');
const progressFill = document.getElementById('progressFill');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const loopBtn = document.getElementById('loopBtn');
const volumeSlider = document.getElementById('volumeSlider');
const volumeBtn = document.getElementById('volumeBtn');
const playlistItems = document.querySelectorAll('.playlist-item');

// ============================================
// 3. ЗАГРУЗКА ТРЕКА
// ============================================

function loadTrack(index) {
  const track = tracks[index];
  audio.src = track.src;
  audio.load();
  
  // Обновляем заголовок
  trackName.textContent = track.title;
  trackVersion.textContent = track.version;
  
  // Обновляем плейлист
  playlistItems.forEach((item, i) => {
    item.classList.toggle('active', i === index);
    item.classList.remove('playing');
  });
  
  // Сбрасываем прогресс
  progressFill.style.width = '0%';
  currentTimeEl.textContent = '0:00';
  totalTimeEl.textContent = track.duration;
  
  // Убираем анимацию иконки
  trackIcon.classList.remove('playing');
  
  currentTrackIndex = index;
}

// ============================================
// 4. УПРАВЛЕНИЕ ВОСПРОИЗВЕДЕНИЕМ
// ============================================

function togglePlay() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function playTrack() {
  audio.play().catch(() => {});
}

function pauseTrack() {
  audio.pause();
}

function prevTrack() {
  const index = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
  loadTrack(index);
  if (isPlaying) playTrack();
}

function nextTrack() {
  const index = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
  loadTrack(index);
  if (isPlaying) playTrack();
}

function toggleLoop() {
  isLooping = !isLooping;
  audio.loop = false; // Используем свою логику
  loopBtn.classList.toggle('active', isLooping);
  loopBtn.textContent = isLooping ? '🔂' : '🔁';
}

// ============================================
// 5. СОБЫТИЯ АУДИО
// ============================================

// Воспроизведение
audio.addEventListener('play', () => {
  isPlaying = true;
  playBtn.textContent = '⏸';
  trackIcon.classList.add('playing');
  
  // Отмечаем активный трек в плейлисте
  playlistItems.forEach((item, i) => {
    if (i === currentTrackIndex) {
      item.classList.add('playing');
    }
  });
  
  // Свечение обложки
  cover.style.boxShadow = '0 0 40px rgba(232, 169, 109, 0.3), 0 6px 24px rgba(0, 0, 0, 0.55)';
});

// Пауза
audio.addEventListener('pause', () => {
  isPlaying = false;
  playBtn.textContent = '▶';
  trackIcon.classList.remove('playing');
  
  playlistItems.forEach(item => {
    item.classList.remove('playing');
  });
  
  cover.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.55)';
});

// Завершение трека
audio.addEventListener('ended', () => {
  if (isLooping) {
    audio.currentTime = 0;
    audio.play();
  } else if (currentTrackIndex < tracks.length - 1) {
    nextTrack();
  } else {
    isPlaying = false;
    playBtn.textContent = '▶';
    trackIcon.classList.remove('playing');
    playlistItems.forEach(item => item.classList.remove('playing'));
    cover.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.55)';
  }
});

// Обновление времени
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${progress}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    totalTimeEl.textContent = formatTime(audio.duration);
  }
});

// Загрузка метаданных
audio.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = formatTime(audio.duration);
});

// Ошибка
audio.addEventListener('error', (e) => {
  console.error('Ошибка воспроизведения:', e);
  alert('Не удалось загрузить трек. Проверьте файлы.');
});

// ============================================
// 6. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================
// 7. ОБРАБОТЧИКИ СОБЫТИЙ UI
// ============================================

// Кнопки управления
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);
loopBtn.addEventListener('click', toggleLoop);

// Клик по прогресс-бару
progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  if (audio.duration) {
    audio.currentTime = x * audio.duration;
  }
});

// Drag прогресс-бара
let isDragging = false;
progressBar.addEventListener('mousedown', () => {
  isDragging = true;
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const rect = progressBar.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audio.duration) {
      audio.currentTime = x * audio.duration;
      progressFill.style.width = `${x * 100}%`;
    }
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

// Громкость
volumeSlider.addEventListener('input', (e) => {
  audio.volume = parseFloat(e.target.value);
  volumeBtn.textContent = audio.volume > 0.5 ? '🔊' : audio.volume > 0 ? '🔉' : '🔇';
});

volumeBtn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  volumeBtn.textContent = audio.muted ? '🔇' : audio.volume > 0.5 ? '🔊' : '🔉';
});

// Клик по плейлисту
playlistItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    if (currentTrackIndex !== index) {
      loadTrack(index);
      if (isPlaying) playTrack();
    } else if (audio.paused) {
      playTrack();
    } else {
      pauseTrack();
    }
  });
});

// ============================================
// 8. ГОРЯЧИЕ КЛАВИШИ
// ============================================

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  
  switch (e.code) {
    case 'Space':
      e.preventDefault();
      togglePlay();
      break;
    case 'ArrowRight':
      e.preventDefault();
      audio.currentTime = Math.min(audio.currentTime + 5, audio.duration || 0);
      break;
    case 'ArrowLeft':
      e.preventDefault();
      audio.currentTime = Math.max(audio.currentTime - 5, 0);
      break;
    case 'KeyM':
      audio.muted = !audio.muted;
      volumeBtn.textContent = audio.muted ? '🔇' : audio.volume > 0.5 ? '🔊' : '🔉';
      break;
  }
});

// ============================================
// 9. СОХРАНЕНИЕ ПОЗИЦИИ
// ============================================

audio.addEventListener('timeupdate', () => {
  if (audio.duration && !isNaN(audio.duration)) {
    localStorage.setItem('audioPosition', String(audio.currentTime));
    localStorage.setItem('audioTrack', String(currentTrackIndex));
  }
});

window.addEventListener('load', () => {
  const savedTrack = parseInt(localStorage.getItem('audioTrack') || '0');
  const savedPos = parseFloat(localStorage.getItem('audioPosition') || '0');
  
  loadTrack(savedTrack);
  
  if (savedPos > 0) {
    audio.currentTime = savedPos;
  }
});

// ============================================
// 10. ИНИЦИАЛИЗАЦИЯ
// ============================================

loadTrack(0);
console.log('🎵 Плеер загружен!');
console.log(`📀 Треков: ${tracks.length}`);
console.log('⌨️ Горячие клавиши: Space, →, ←, M');
