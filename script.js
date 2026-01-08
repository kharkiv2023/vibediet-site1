document.addEventListener('DOMContentLoaded', function () {

    /* 1. ОНОВЛЕННЯ ЗНАЧЕНЬ ПОВЗУНКІВ (Age, Height, Weight) */
    const sliderIds = ['age', 'height', 'weight'];
    sliderIds.forEach(id => {
        const slider = document.getElementById(id);
        const output = document.getElementById(id + '-val');
        if (slider && output) {
            slider.addEventListener('input', () => {
                output.textContent = slider.value;
            });
        }
    });

    /* 2. КАЛЬКУЛЯТОР КАЛОРІЙ */
    const calcForm = document.getElementById('calc-form');

    if (calcForm) {
        calcForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Отримуємо значення
            const age = +document.getElementById('age').value;
            const height = +document.getElementById('height').value;
            const weight = +document.getElementById('weight').value;
            const gender = document.querySelector('input[name="gender"]:checked')?.value || 'male';
            const goal = document.querySelector('input[name="goal"]:checked')?.value || 'lose';
            const activity = parseFloat(document.querySelector('input[name="activity"]:checked')?.value || 1.2);

            // Формула Міффліна-Сан Жеора
            let bmr = (10 * weight) + (6.25 * height) - (5 * age);
            bmr += (gender === 'male') ? 5 : -161;
            
            let calories = Math.round(bmr * activity);
            let advice = '';
            let icon = '⚖️';

            // Логіка цілі
            if (goal === 'lose') {
                calories -= 400;
                advice = 'Дефіцит 400 ккал для здорового схуднення (-0.5 кг/тиждень)';
                icon = '🔥';
            } else if (goal === 'gain') {
                calories += 400;
                advice = 'Профіцит 400 ккал для набору маси (+0.5 кг/тиждень)';
                icon = '💪';
            } else if (goal === 'diabetes') {
                advice = 'Меню з низьким глікемічним індексом підібрано';
                icon = '🩸';
            } else {
                advice = 'Підтримуюча калорійність для стабільної ваги';
                icon = '⚖️';
            }

            // Безпечний мінімум
            calories = Math.max(calories, 1200);

            // Виведення результатів
            const resultDiv = document.getElementById('result');
            if (resultDiv) {
                resultDiv.classList.remove('hidden');
                resultDiv.style.display = 'block';

                if(document.getElementById('res-icon')) document.getElementById('res-icon').textContent = icon;
                if(document.getElementById('calories-out')) document.getElementById('calories-out').textContent = calories;
                
                // БЖВ (Білки 25%, Жири 25%, Вуглеводи 50%)
                if(document.getElementById('p-out')) document.getElementById('p-out').textContent = Math.round((calories * 0.25) / 4) + 'г';
                if(document.getElementById('f-out')) document.getElementById('f-out').textContent = Math.round((calories * 0.25) / 9) + 'г';
                if(document.getElementById('c-out')) document.getElementById('c-out').textContent = Math.round((calories * 0.5) / 4) + 'г';
                if(document.getElementById('advice')) document.getElementById('advice').textContent = advice;

                // Налаштування кнопки переходу
                const ctaBtn = document.getElementById('cta-btn');
                if (ctaBtn) {
                    const pages = {
                        lose: 'lose.html',
                        gain: 'gain.html',
                        diabetes: 'diabetes.html',
                        maintain: 'maintain.html'
                    };
                    ctaBtn.onclick = function() {
                        window.location.href = pages[goal] || 'index.html';
                    };
                }

                resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    /* 3. МОБІЛЬНЕ МЕНЮ */
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sideNav = document.getElementById('side-nav');
    if (menuBtn && sideNav) {
        menuBtn.addEventListener('click', () => {
            sideNav.classList.toggle('active');
        });
    }

    /* 4. ФОРМА ВІДГУКІВ */
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (!reviewForm.action) return;

            const button = reviewForm.querySelector('button');
            if (button) { button.disabled = true; button.textContent = 'Відправка...'; }

            try {
                const response = await fetch(reviewForm.action, {
                    method: 'POST',
                    body: new FormData(reviewForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    reviewForm.reset();
                    reviewForm.style.display = 'none';
                    const msg = document.getElementById('review-message');
                    if (msg) msg.style.display = 'block';
                }
            } catch (err) {
                alert('Помилка відправки.');
                if (button) { button.disabled = false; button.textContent = 'Опублікувати відгук'; }
            }
        });
    }
});

/* 5. ЕФЕКТ ШАПКИ ПРИ СКРОЛІ */
window.addEventListener('scroll', function() {
    const header = document.querySelector('.top-header');
    if (header) {
        if (window.scrollY > 50) {
            header.style.height = '60px';
            header.style.backgroundColor = 'rgba(20, 50, 50, 0.98)';
        } else {
            header.style.height = '70px';
            header.style.backgroundColor = 'rgba(20, 50, 50, 0.95)';
        }
    }
});
function changeLanguage(lang) {
    // 1. Отримуємо назву поточної сторінки (наприклад, diabetes.html)
    let pathParts = window.location.pathname.split("/");
    let currentPage = pathParts.pop() || "index.html";

    // 2. Отримуємо чистий шлях до папки проекту (без мовних підпапок)
    // Видаляємо 'en' або 'fr' з кінця масиву, якщо вони там є
    if (pathParts[pathParts.length - 1] === "en" || pathParts[pathParts.length - 1] === "fr") {
        pathParts.pop();
    }
    
    // Збираємо базовий шлях назад
    let basePath = pathParts.join("/");
    if (!basePath.endsWith("/")) basePath += "/";

    // 3. Формуємо новий шлях
    let newPath;
    if (lang === "") {
        newPath = basePath + currentPage; // Повернення в корінь (UA)
    } else {
        newPath = basePath + lang + "/" + currentPage; // Перехід в папку мови
    }

    window.location.href = newPath;
}
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('side-nav');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function() {
            nav.classList.toggle('active'); // Додає/видаляє клас active при кліку
        });
    }
});