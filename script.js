// ============================================
// АУДИО ПЛЕЕР - УПРАВЛЕНИЕ АНИМАЦИЯМИ
// ============================================

// Получаем элементы
const audio = document.querySelector('audio');
const trackIcon = document.querySelector('.track-icon');
const cover = document.querySelector('.cover');

// ============================================
// 1. УПРАВЛЕНИЕ АНИМАЦИЕЙ ИКОНКИ
// ============================================

// Воспроизведение - запускаем анимацию
audio.addEventListener('play', () => {
  trackIcon.classList.add('playing');
});

// Пауза - останавливаем анимацию
audio.addEventListener('pause', () => {
  trackIcon.classList.remove('playing');
});

// Завершение трека - останавливаем анимацию
audio.addEventListener('ended', () => {
  trackIcon.classList.remove('playing');
});

// ============================================
// 2. ДОПОЛНИТЕЛЬНЫЕ ЭФФЕКТЫ НА ОБЛОЖКЕ
// ============================================

// Эффект свечения на обложке при проигрывании
audio.addEventListener('play', () => {
  cover.style.transition = 'box-shadow 0.5s ease';
  cover.style.boxShadow = '0 0 40px rgba(232, 169, 109, 0.3), 0 6px 24px rgba(0, 0, 0, 0.55)';
});

audio.addEventListener('pause', () => {
  cover.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.55)';
});

audio.addEventListener('ended', () => {
  cover.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.55)';
});

// ============================================
// 3. СМЕНА ИКОНКИ В ЗАВИСИМОСТИ ОТ СОСТОЯНИЯ
// ============================================

// Меняем иконку на разные символы
audio.addEventListener('play', () => {
  trackIcon.textContent = '💿'; // Компакт-диск
});

audio.addEventListener('pause', () => {
  trackIcon.textContent = '🎵'; // Обратно на ноту
});

audio.addEventListener('ended', () => {
  trackIcon.textContent = '🎵';
});

// ============================================
// 4. ОБРАБОТКА ОШИБОК
// ============================================

audio.addEventListener('error', (e) => {
  console.error('Ошибка воспроизведения:', e);
  trackIcon.textContent = '⚠️';
  trackIcon.classList.remove('playing');
});

// ============================================
// 5. ДОПОЛНИТЕЛЬНО: ПРОГРЕСС ВОСПРОИЗВЕДЕНИЯ
// ============================================

audio.addEventListener('timeupdate', () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  // console.log(`Прогресс: ${progress.toFixed(1)}%`);
  
  // Динамическое изменение свечения в зависимости от прогресса
  if (audio.duration && !isNaN(audio.duration)) {
    const intensity = 0.3 + (progress / 100) * 0.4;
    if (trackIcon.classList.contains('playing')) {
      trackIcon.style.filter = `drop-shadow(0 2px ${20 + progress * 0.1}px rgba(232, 169, 109, ${intensity}))`;
    }
  }
});

// ============================================
// 6. СОХРАНЕНИЕ ПОЗИЦИИ
// ============================================

// Сохраняем позицию при каждом обновлении времени
audio.addEventListener('timeupdate', () => {
  if (audio.duration && !isNaN(audio.duration)) {
    localStorage.setItem('audioPosition', String(audio.currentTime));
  }
});

// Восстанавливаем позицию при загрузке
window.addEventListener('load', () => {
  const savedPos = parseFloat(localStorage.getItem('audioPosition') || '0');
  if (savedPos > 0 && audio.duration) {
    audio.currentTime = savedPos;
    console.log(`Позиция восстановлена: ${savedPos.toFixed(1)}с`);
  }
});

// ============================================
// 7. ГОРЯЧИЕ КЛАВИШИ
// ============================================

document.addEventListener('keydown', (e) => {
  // Игнорируем, если пользователь вводит текст в поле
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  
  // Пробел - play/pause
  if (e.code === 'Space') {
    e.preventDefault();
    audio.paused ? audio.play() : audio.pause();
  }
  
  // Стрелка вправо - перемотка вперёд на 5 секунд
  if (e.code === 'ArrowRight') {
    e.preventDefault();
    audio.currentTime = Math.min(audio.currentTime + 5, audio.duration || 0);
  }
  
  // Стрелка влево - перемотка назад на 5 секунд
  if (e.code === 'ArrowLeft') {
    e.preventDefault();
    audio.currentTime = Math.max(audio.currentTime - 5, 0);
  }
  
  // Клавиша M - mute/unmute
  if (e.code === 'KeyM') {
    audio.muted = !audio.muted;
  }
});

// ============================================
// 8. ДИНАМИЧЕСКАЯ СКОРОСТЬ АНИМАЦИИ
// ============================================

// Адаптируем скорость анимации под скорость воспроизведения
audio.addEventListener('ratechange', () => {
  const rate = audio.playbackRate;
  const duration = 2.5 / rate;
  trackIcon.style.animationDuration = `${duration}s`;
  console.log(`Скорость анимации адаптирована: ${duration.toFixed(2)}с`);
});

// ============================================
// 9. ДОПОЛНИТЕЛЬНО: ЭФФЕКТ ПРИ ПЕРЕМОТКЕ
// ============================================

let seekTimeout;
audio.addEventListener('seeking', () => {
  // Усиливаем свечение при перемотке
  if (trackIcon.classList.contains('playing')) {
    trackIcon.style.filter = 'drop-shadow(0 2px 40px rgba(232, 169, 109, 0.9))';
    trackIcon.style.transform = 'scale(1.1)';
  }
  
  clearTimeout(seekTimeout);
  seekTimeout = setTimeout(() => {
    if (trackIcon.classList.contains('playing')) {
      trackIcon.style.filter = '';
      trackIcon.style.transform = '';
    }
  }, 300);
});

// ============================================
// 10. ИНФОРМАЦИЯ В КОНСОЛЬ
// ============================================

console.log('🎵 Аудиоплеер загружен!');
console.log('📀 Трек: Underwater Love (Sped Up)');
console.log('✨ Активировано свечение иконки при проигрывании');
console.log('⌨️ Горячие клавиши:');
console.log('  Space - Play/Pause');
console.log('  → - Перемотка +5с');
console.log('  ← - Перемотка -5с');
console.log('  M - Mute/Unmute');

// ============================================
// 11. АДАПТАЦИЯ ПОД МОБИЛЬНЫЕ
// ============================================

// Автоматическое воспроизведение при касании на мобильных
document.addEventListener('touchstart', () => {
  if (audio.paused && audio.currentTime === 0) {
    // Раскомментируйте, если нужно автовоспроизведение
    // audio.play().catch(() => {});
  }
}, { once: true });

console.log('✅ Все системы готовы!');