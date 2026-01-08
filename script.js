document.addEventListener('DOMContentLoaded', function () {

    /* --- 1. МОБІЛЬНЕ МЕНЮ (ОДИН ОБРОБНИК) --- */
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sideNav = document.getElementById('side-nav');
    const navLinks = document.querySelectorAll('.desktop-nav a, #side-nav a');

    if (menuBtn && sideNav) {
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            sideNav.classList.toggle('active');
        });

        // Закривати при кліку на посилання
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                sideNav.classList.remove('active');
            });
        });

        // Закривати, якщо клікнули повз меню
        document.addEventListener('click', (e) => {
            if (!sideNav.contains(e.target) && !menuBtn.contains(e.target)) {
                sideNav.classList.remove('active');
            }
        });
    }

    /* --- 2. КАЛЬКУЛЯТОР ТА ПОВЗУНКИ --- */
    const sliderIds = ['age', 'height', 'weight'];
    sliderIds.forEach(id => {
        const slider = document.getElementById(id);
        const output = document.getElementById(id + '-val');
        if (slider && output) {
            slider.addEventListener('input', () => { output.textContent = slider.value; });
        }
    });

    const calcForm = document.getElementById('calc-form');
    if (calcForm) {
        calcForm.addEventListener('submit', function (e) {
            e.preventDefault();
            calculateCalories();
        });
    }

    /* --- 3. ФОРМА ВІДГУКІВ --- */
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const btn = reviewForm.querySelector('button');
            btn.disabled = true;
            btn.textContent = 'Відправка...';
            try {
                const response = await fetch(reviewForm.action, {
                    method: 'POST',
                    body: new FormData(reviewForm),
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    reviewForm.reset();
                    reviewForm.style.display = 'none';
                    document.getElementById('review-message').style.display = 'block';
                }
            } catch (err) {
                alert('Помилка відправки.');
                btn.disabled = false;
            }
        });
    }
});

/* --- 4. ПЕРЕМИКАННЯ МОВ (ГЛОБАЛЬНА ФУНКЦІЯ) --- */
function changeLanguage(lang) {
    let path = window.location.pathname;
    let page = path.split("/").pop() || "index.html";
    
    // Отримуємо масив частин шляху, видаляючи порожні елементи
    let pathParts = path.split("/").filter(part => part !== "");
    
    // Видаляємо поточну мовну мітку (en або fr), якщо вона є перед назвою файлу
    if (pathParts.length > 0 && (pathParts[pathParts.length - 2] === "en" || pathParts[pathParts.length - 2] === "fr")) {
        pathParts.splice(pathParts.length - 2, 1);
    } else if (pathParts.length > 0 && (pathParts[pathParts.length - 1] === "en" || pathParts[pathParts.length - 1] === "fr")) {
         pathParts.pop();
    }

    // Будуємо новий шлях
    let newPath = "/";
    
    // Якщо вибрано не українську (корінь)
    if (lang !== "") {
        newPath += lang + "/";
    }
    
    // Додаємо назву сторінки (якщо ми не в корені сайту)
    newPath += page;

    window.location.href = newPath;
}

/* --- 5. ЕФЕКТ ШАПКИ --- */
window.addEventListener('scroll', function() {
    const header = document.querySelector('.top-header');
    if (header) {
        header.style.height = window.scrollY > 50 ? '60px' : '70px';
        header.style.backgroundColor = window.scrollY > 50 ? 'rgba(20, 50, 50, 0.98)' : 'rgba(20, 50, 50, 0.95)';
    }
});

// Функція розрахунку (винесена для чистоти)
function calculateCalories() {
    const age = +document.getElementById('age').value;
    const height = +document.getElementById('height').value;
    const weight = +document.getElementById('weight').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value || 'male';
    const goal = document.querySelector('input[name="goal"]:checked')?.value || 'lose';
    const activity = parseFloat(document.querySelector('input[name="activity"]:checked')?.value || 1.2);

    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += (gender === 'male') ? 5 : -161;
    let calories = Math.round(bmr * activity);

    if (goal === 'lose') calories -= 400;
    if (goal === 'gain') calories += 400;
    calories = Math.max(calories, 1200);

    const resDiv = document.getElementById('result');
    if (resDiv) {
        resDiv.style.display = 'block';
        document.getElementById('calories-out').textContent = calories;
        resDiv.scrollIntoView({ behavior: 'smooth' });
    }
}