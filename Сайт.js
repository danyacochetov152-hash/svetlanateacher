// Анимация счетчиков при наведении и касании
function setupCounterHoverAnimation() {
    const aboutSection = document.querySelector('.about');
    const counters = document.querySelectorAll('.stat-number');
    const targetValues = [500, 20, 100];
    let hasAnimated = false;
    
    // Функция запуска анимации
    function startAnimation(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        if (hasAnimated) return;
        
        hasAnimated = true;
        
        counters.forEach((counter, index) => {
            const countTo = targetValues[index];
            const duration = 2000;
            const frameDuration = 1000 / 60;
            const totalFrames = Math.round(duration / frameDuration);
            let frame = 0;
            
            // Получаем текущее значение (убираем знак > если есть)
            let currentValue = counter.innerText;
            if (currentValue.includes('>') || currentValue.includes('&gt;')) {
                currentValue = currentValue.replace(/>|&gt;/g, '').trim();
            }
            
            const counterAnimation = setInterval(() => {
                frame++;
                const progress = frame / totalFrames;
                const currentCount = Math.round(countTo * progress);
                
                if (parseInt(currentValue) !== currentCount) {
                    counter.innerHTML = `&gt;${currentCount}`;
                    counter.style.animation = 'countUp 0.3s ease';
                    
                    setTimeout(() => {
                        counter.style.animation = '';
                    }, 300);
                }
                
                if (frame === totalFrames) {
                    clearInterval(counterAnimation);
                    counter.innerHTML = `&gt;${countTo}`;
                }
            }, frameDuration);
        });
        
        // Визуальный эффект
        aboutSection.style.boxShadow = '0 0 0 3px #0067a5';
        setTimeout(() => {
            aboutSection.style.boxShadow = '';
        }, 1000);
        
        // Добавляем класс, что анимация завершена
        setTimeout(() => {
            aboutSection.classList.add('animated');
        }, 2100);
        
        // Убираем подсказку если есть
        const mobileHint = document.querySelector('.mobile-hint');
        if (mobileHint) {
            mobileHint.style.opacity = '0';
            mobileHint.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                if (mobileHint.parentNode) {
                    mobileHint.parentNode.removeChild(mobileHint);
                }
            }, 500);
        }
        
        return false;
    }
    
    // Для десктопов - mouseenter
    aboutSection.addEventListener('mouseenter', startAnimation);
    
    // Для мобильных - touchstart с предотвращением распространения
    aboutSection.addEventListener('touchstart', function(e) {
        // Если это не прокрутка (маленькое движение)
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.startY = touch.clientY;
            this.isScrolling = false;
        }
    }, { passive: true });
    
    aboutSection.addEventListener('touchmove', function(e) {
        if (e.touches.length === 1 && this.startY !== undefined) {
            const touch = e.touches[0];
            const deltaY = Math.abs(touch.clientY - this.startY);
            
            // Если движение больше 10px, считаем это прокруткой
            if (deltaY > 10) {
                this.isScrolling = true;
            }
        }
    }, { passive: true });
    
    aboutSection.addEventListener('touchend', function(e) {
        if (this.isScrolling) {
            // Это была прокрутка, не запускаем анимацию
            this.isScrolling = false;
            return;
        }
        
        // Это было касание, запускаем анимацию
        startAnimation(e);
        this.isScrolling = false;
    }, { passive: false });
    
    // Для клика (резервный вариант)
    aboutSection.addEventListener('click', function(e) {
        // Проверяем, не был ли это клик по прокрутке
        if (e.target === this || e.target.closest('.mobile-hint')) {
            startAnimation(e);
        }
    });
    
    // Добавляем подсказку для мобильных
    addMobileHint();
    
    // Восстанавливаем возможность прокрутки после анимации
    aboutSection.addEventListener('wheel', function(e) {
        // Позволяем прокрутку всегда
        e.stopPropagation();
    }, { passive: true });
}

// Добавляем подсказку для мобильных устройств
function addMobileHint() {
    const aboutSection = document.querySelector('.about');
    if (!aboutSection) return;
    
    // Проверяем, мобильное ли устройство
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Проверяем, нет ли уже подсказки
        if (document.querySelector('.mobile-hint')) return;
        
        const hint = document.createElement('div');
        hint.className = 'mobile-hint';
        hint.innerHTML = '👆 Нажмите на эту секцию, чтобы увидеть статистику';
        
        // Добавляем hint в секцию "Обо мне"
        aboutSection.appendChild(hint);
        
        // При нажатии на подсказку запускаем анимацию
        hint.addEventListener('click', function(e) {
            e.stopPropagation();
            const aboutSection = document.querySelector('.about');
            aboutSection.dispatchEvent(new Event('mouseenter'));
        });
        
        // Удаляем подсказку через 100 секунд
        setTimeout(() => {
            if (hint.parentNode && !document.querySelector('.about').hasAnimated) {
                hint.style.opacity = '0';
                hint.style.transition = 'opacity 0.5s';
                setTimeout(() => {
                    if (hint.parentNode) hint.parentNode.removeChild(hint);
                }, 500);
            }
        }, 100000);
    }
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
    console.log('%c👋 Добро пожаловать на сайт репетитора английского языка!', 'color: #9B2D30 font-size: 16px; font-weight: bold;');
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
    
    // Настройка карусели отзывов
    setupReviewsCarousel();
    
  
});

// Простой плавный скролл к форме
function setupSmoothScroll() {
    // Находим все кнопки "записаться на урок"
    const signupButtons = document.querySelectorAll('a.btn, button.btn');
    
    signupButtons.forEach(button => {
        // Проверяем, содержит ли текст кнопки "записаться"
        if (button.textContent.toLowerCase().includes('записаться')) {
            // Добавляем обработчик клика
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Находим форму контактов
                const contactForm = document.getElementById('contact-form');
                
                if (contactForm) {
                    // Плавная прокрутка к форме
                    contactForm.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    setupSmoothScroll();
});



// Карусель отзывов с управлением стрелками и свайпом
function setupReviewsCarousel() {
    const track = document.getElementById('reviews-track');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');
    const reviewCards = document.querySelectorAll('.review-card');
    
    if (!track || !scrollLeftBtn || !scrollRightBtn) return;
    
    const cardWidth = reviewCards[0].offsetWidth + 25;
    const containerWidth = track.parentElement.offsetWidth;
    const visibleCards = Math.floor(containerWidth / cardWidth);
    const totalCards = reviewCards.length;
    let currentPosition = 0;
    const maxPosition = Math.max(0, totalCards - visibleCards);
    
    // Для свайпа
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    let startDragX = 0;
    let currentTranslate = 0;
    
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
        track.style.transition = 'transform 0.5s ease';
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
    
    // ===== СВАЙП ДЛЯ МОБИЛЬНЫХ =====
    
    // Начало касания
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        startDragX = touchStartX;
        currentTranslate = currentPosition * cardWidth;
        
        // Отключаем transition во время драга
        track.style.transition = 'none';
    }, { passive: true });
    
    // Движение пальцем
    track.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        const touchX = e.touches[0].clientX;
        const diffX = startDragX - touchX;
        
        // Вычисляем новую позицию с ограничениями
        let newTranslate = currentTranslate + diffX;
        const maxTranslate = maxPosition * cardWidth;
        
        // Ограничиваем прокрутку
        if (newTranslate < 0) newTranslate = 0;
        if (newTranslate > maxTranslate) newTranslate = maxTranslate;
        
        // Применяем трансформацию
        track.style.transform = `translateX(-${newTranslate}px)`;
        
        e.preventDefault();
    }, { passive: false });
    
    // Конец касания
    track.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        
        touchEndX = e.changedTouches[0].clientX;
        const diffX = touchStartX - touchEndX;
        const swipeThreshold = 50; // Минимальное расстояние для свайпа
        
        // Включаем transition обратно
        track.style.transition = 'transform 0.5s ease';
        
        // Определяем направление свайпа
        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0 && currentPosition < maxPosition) {
                // Свайп влево - следующий отзыв
                scrollToPosition(currentPosition + 1);
            } else if (diffX < 0 && currentPosition > 0) {
                // Свайп вправо - предыдущий отзыв
                scrollToPosition(currentPosition - 1);
            } else {
                // Возвращаем на текущую позицию
                scrollToPosition(currentPosition);
            }
        } else {
            // Если свайп был слишком коротким, возвращаем на место
            scrollToPosition(currentPosition);
        }
        
        isDragging = false;
    }, { passive: true });
    
    // ===== СВАЙП МЫШЬЮ (для десктопов) =====
    
    track.addEventListener('mousedown', function(e) {
        touchStartX = e.clientX;
        isDragging = true;
        startDragX = touchStartX;
        currentTranslate = currentPosition * cardWidth;
        
        track.style.transition = 'none';
        track.style.cursor = 'grabbing';
        
        e.preventDefault();
    });
    
    track.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const mouseX = e.clientX;
        const diffX = startDragX - mouseX;
        
        let newTranslate = currentTranslate + diffX;
        const maxTranslate = maxPosition * cardWidth;
        
        if (newTranslate < 0) newTranslate = 0;
        if (newTranslate > maxTranslate) newTranslate = maxTranslate;
        
        track.style.transform = `translateX(-${newTranslate}px)`;
    });
    
    document.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        
        touchEndX = e.clientX;
        const diffX = touchStartX - touchEndX;
        const swipeThreshold = 30;
        
        track.style.transition = 'transform 0.5s ease';
        track.style.cursor = 'grab';
        
        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0 && currentPosition < maxPosition) {
                scrollToPosition(currentPosition + 1);
            } else if (diffX < 0 && currentPosition > 0) {
                scrollToPosition(currentPosition - 1);
            } else {
                scrollToPosition(currentPosition);
            }
        } else {
            scrollToPosition(currentPosition);
        }
        
        isDragging = false;
    });
    
    // Для предотвращения выделения текста при драге
    track.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });
    
    // Клавиатура
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentPosition > 0) {
            scrollToPosition(currentPosition - 1);
        } else if (e.key === 'ArrowRight' && currentPosition < maxPosition) {
            scrollToPosition(currentPosition + 1);
        }
    });
    
    // Инициализация
    updateButtons();
    
    // Ресайз
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newVisibleCards = Math.floor(track.parentElement.offsetWidth / cardWidth);
            const newMaxPosition = Math.max(0, totalCards - newVisibleCards);
            
            if (currentPosition > newMaxPosition) {
                currentPosition = newMaxPosition;
            }
            
            const scrollAmount = currentPosition * cardWidth;
            track.style.transform = `translateX(-${scrollAmount}px)`;
            updateButtons();
        }, 250);
    });
}

// Добавьте в инициализацию
document.addEventListener('DOMContentLoaded', function() {
    setupReviewsCarousel();
});


// Аккордеон для FAQ
function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Закрываем все остальные элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Открываем/закрываем текущий
            item.classList.toggle('active');
        });
        
        // Добавляем поддержку клавиатуры
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.classList.toggle('active');
            }
        });
        
        // Делаем вопрос доступным для фокуса
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', `answer-${item.dataset.id || Math.random()}`);
        
        // Обновляем aria-атрибуты при клике
        question.addEventListener('click', () => {
            const isExpanded = item.classList.contains('active');
            question.setAttribute('aria-expanded', isExpanded);
        });
    });
    
    // Открываем первый вопрос по умолчанию (опционально)
    // if (faqItems.length > 0) {
    //     faqItems[0].classList.add('active');
    //     faqItems[0].querySelector('.faq-question').setAttribute('aria-expanded', 'true');
    // }
}

// Инициализация FAQ
document.addEventListener('DOMContentLoaded', function() {
    setupFAQAccordion();
});


