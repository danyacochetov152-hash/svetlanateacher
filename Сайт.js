// Анимация счетчиков при наведении
function setupCounterHoverAnimation() {
    const aboutSection = document.querySelector('.about');
    const counters = document.querySelectorAll('.stat-number');
    const targetValues = [500, 120, 170];
     const symbols = ['>', '>', '>'];
    let hasAnimated = false; // Флаг, чтобы анимация срабатывала только один раз
    
    aboutSection.addEventListener('mouseenter', function() {
        if (hasAnimated) return; // Если уже анимировали, выходим
        
        hasAnimated = true;
        
        counters.forEach((counter, index) => {
            const countTo = targetValues[index];
            const duration = 2000; // 2 секунды
            const frameDuration = 1000 / 60; // 60 fps
            const totalFrames = Math.round(duration / frameDuration);
            let frame = 0;
            
            const counterAnimation = setInterval(() => {
                frame++;
                const progress = frame / totalFrames;
                const currentCount = Math.round(countTo * progress);
                
                if (parseInt(counter.innerText) !== currentCount) {
                    counter.innerText = currentCount;
                    counter.style.animation = 'countUp 0.3s ease';
                    
                    // Убираем анимацию после завершения
                    setTimeout(() => {
                        counter.style.animation = '';
                    }, 300);
                }
                
                if (frame === totalFrames) {
                    clearInterval(counterAnimation);
                }
            }, frameDuration);
        });
        
        // Добавляем визуальную подсказку, что сработала анимация
        aboutSection.style.boxShadow = '0 0 0 3px rgba(185, 16, 16, 0.5)';
        setTimeout(() => {
            aboutSection.style.boxShadow = '';
        }, 1000);
    });
    aboutSection.addEventListener('click', function() {
        if (!hasAnimated) {
            aboutSection.dispatchEvent(new Event('mouseenter'));
        }
    });
    
}


// Плавная прокрутка к форме
function setupSmoothScroll() {
    const signupButtons = document.querySelectorAll('a[href="#contact-form"]');
    
    signupButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 20,
                    behavior: 'smooth'
                });
                
                // Добавляем небольшой эффект для привлечения внимания
                target.style.boxShadow = '0 0 0 3px rgba(26, 86, 219, 0.3)';
                setTimeout(() => {
                    target.style.boxShadow = '';
                }, 1500);
            }
        });
    });
}

// Эффект при наведении на карточки с занятиями
function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.pricing-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Добавляем подсказку для пользователя
function addCounterHint() {
    
    // Добавляем hint после секции "Обо мне"
    aboutSection.appendChild(hint);
    
    // Удаляем подсказку после 10 секунд
    setTimeout(() => {
        if (hint.parentNode) {
            hint.style.opacity = '0';
            hint.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                if (hint.parentNode) hint.parentNode.removeChild(hint);
            }, 500);
        }
    }, 10000);
}

// Добавляем анимацию пульсации для подсказки
function addPulseAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { opacity: 0.7; }
            50% { opacity: 1; }
            100% { opacity: 0.7; }
        }
    `;
    document.head.appendChild(style);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('lessons-count').textContent = '0';
    document.getElementById('students-count').textContent = '0';
    document.getElementById('homeworks-count').textContent = '0';
    // Настройка анимации счетчиков при наведении
    setupCounterHoverAnimation();
    
    // Добавляем подсказку для пользователя
    addPulseAnimation();
    addCounterHint();
    
    // Настройка обработки формы
    const form = document.getElementById('lesson-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Настройка плавной прокрутки
    setupSmoothScroll();
    
    // Настройка эффектов наведения
    setupCardHoverEffects();
    
    // Добавляем небольшой эффект появления для всех секций
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Анимация для кнопок записи
    const signupButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-card');
    signupButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // Консольное приветствие
    console.log('%c👋 Добро пожаловать на сайт репетитора английского языка!', 'color: #1a56db; font-size: 16px; font-weight: bold;');
});
// Карусель отзывов с управлением только стрелками
function setupReviewsCarousel() {
    const track = document.getElementById('reviews-track');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');
    const reviewCards = document.querySelectorAll('.review-card');
    
    if (!track || !scrollLeftBtn || !scrollRightBtn) return;
    
    const cardWidth = reviewCards[0].offsetWidth + 25; // Ширина карточки + отступ
    const containerWidth = track.parentElement.offsetWidth;
    const visibleCards = Math.floor(containerWidth / cardWidth);
    const totalCards = reviewCards.length;
    let currentPosition = 0;
    const maxPosition = Math.max(0, totalCards - visibleCards);
    
    // Функция обновления состояния кнопок
    function updateButtons() {
        scrollLeftBtn.classList.toggle('disabled', currentPosition === 0);
        scrollRightBtn.classList.toggle('disabled', currentPosition >= maxPosition);
    }
    
    // Функция прокрутки к определенной позиции
    function scrollToPosition(position) {
        currentPosition = Math.max(0, Math.min(position, maxPosition));
        const scrollAmount = currentPosition * cardWidth;
        
        track.style.transform = `translateX(-${scrollAmount}px)`;
        updateButtons();
    }
    
    // Обработчики для кнопок
    scrollLeftBtn.addEventListener('click', () => {
        if (currentPosition > 0) {
            scrollToPosition(currentPosition - 1);
        }
    });
    
    scrollRightBtn.addEventListener('click', () => {
        if (currentPosition < maxPosition) {
            scrollToPosition(currentPosition + 1);
        }
    });
    
    // Инициализация состояния кнопок
    updateButtons();
    
    // Обработчики для клавиатуры
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentPosition > 0) {
            scrollToPosition(currentPosition - 1);
        } else if (e.key === 'ArrowRight' && currentPosition < maxPosition) {
            scrollToPosition(currentPosition + 1);
        }
    });
    
    // Обработка изменения размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Пересчитываем видимое количество карточек
            const newVisibleCards = Math.floor(track.parentElement.offsetWidth / cardWidth);
            const newMaxPosition = Math.max(0, totalCards - newVisibleCards);
            
            // Корректируем текущую позицию, если нужно
            if (currentPosition > newMaxPosition) {
                currentPosition = newMaxPosition;
            }
            
            // Обновляем трансформацию
            const scrollAmount = currentPosition * cardWidth;
            track.style.transform = `translateX(-${scrollAmount}px)`;
            updateButtons();
        }, 250);
    });
}

// В функции инициализации добавьте вызов карусели:
document.addEventListener('DOMContentLoaded', function() {
    // ... существующий код ...
    
    // Настройка карусели отзывов
    setupReviewsCarousel();
    
    // ... остальной код ...

});
