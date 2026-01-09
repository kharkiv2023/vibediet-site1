document.addEventListener('DOMContentLoaded', function () {
    // --- 1. МОБІЛЬНЕ МЕНЮ ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const desktopNav = document.querySelector('.desktop-nav');

    if (menuBtn && desktopNav) {
        menuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            desktopNav.classList.toggle('active');
        });

        const navLinks = document.querySelectorAll('.desktop-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                desktopNav.classList.remove('active');
            });
        });

        document.addEventListener('click', function (e) {
            if (!desktopNav.contains(e.target) && !menuBtn.contains(e.target)) {
                desktopNav.classList.remove('active');
            }
        });
    }

    // --- 2. СЛАЙДЕРИ КАЛЬКУЛЯТОРА ---
    const sliderIds = ['age', 'height', 'weight'];
    sliderIds.forEach(id => {
        const slider = document.getElementById(id);
        const output = document.getElementById(id + '-val');
        if (slider && output) {
            output.textContent = slider.value;
            slider.addEventListener('input', function () {
                output.textContent = this.value;
            });
        }
    });

    // Прив'язка кнопки "Розрахувати" (якщо вона всередині форми)
    const calcForm = document.getElementById('calc-form');
    if (calcForm) {
        calcForm.addEventListener('submit', function (e) {
            e.preventDefault();
            calculateCalories();
        });
    }
});

// --- 3. ФУНКЦІЯ РОЗРАХУНКУ КАЛОРІЙ ---
function calculateCalories() {
    // Отримуємо значення
    const ageEl = document.getElementById('age');
    const heightEl = document.getElementById('height');
    const weightEl = document.getElementById('weight');

    if (!ageEl || !heightEl || !weightEl) return;

    const age = parseInt(ageEl.value);
    const height = parseInt(heightEl.value);
    const weight = parseInt(weightEl.value);

    // Отримуємо вибрані радіокнопки
    const gender = document.querySelector('input[name="gender"]:checked')?.value || 'male';
    const goal = document.querySelector('input[name="goal"]:checked')?.value || 'maintain';
    const activity = parseFloat(document.querySelector('input[name="activity"]:checked')?.value || '1.2');

    // Формула Міффліна-Сан Жеора
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    if (gender === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    let calories = Math.round(bmr * activity);

    // Коригування під ціль
    if (goal === 'lose') calories -= 400;
    if (goal === 'gain') calories += 400;
    
    // Мінімальний поріг безпеки
    if (calories < 1200) calories = 1200;

    // Розрахунок БЖВ
    let proteins, fats, carbs;
    if (goal === 'diabetes') {
        proteins = Math.round(calories * 0.30 / 4);
        fats = Math.round(calories * 0.35 / 9);
        carbs = Math.round(calories * 0.35 / 4);
    } else if (goal === 'gain') {
        proteins = Math.round(calories * 0.25 / 4);
        fats = Math.round(calories * 0.30 / 9);
        carbs = Math.round(calories * 0.45 / 4);
    } else {
        proteins = Math.round(calories * 0.25 / 4);
        fats = Math.round(calories * 0.30 / 9);
        carbs = Math.round(calories * 0.45 / 4);
    }

    // Відображення результатів
    const resDiv = document.getElementById('result');
    if (resDiv) {
        document.getElementById('calories-out').textContent = calories;
        document.getElementById('p-out').textContent = proteins + 'г';
        document.getElementById('f-out').textContent = fats + 'г';
        document.getElementById('c-out').textContent = carbs + 'г';

        const resIcon = document.getElementById('res-icon');
        const advice = document.getElementById('advice');

        if (goal === 'lose') {
            resIcon.textContent = '🔥';
            advice.textContent = 'Безпечний дефіцит для схуднення';
        } else if (goal === 'gain') {
            resIcon.textContent = '💪';
            advice.textContent = 'Профіцит для набору маси';
        } else if (goal === 'diabetes') {
            resIcon.textContent = '🩸';
            advice.textContent = 'Контроль вуглеводів — пріоритет';
        } else {
            resIcon.textContent = '⚖️';
            advice.textContent = 'Підтримка поточної ваги';
        }

        resDiv.style.display = 'block';
        resDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// --- 4. ПЕРЕМИКАННЯ МОВ ---
function changeLanguage(lang) {
    let path = window.location.pathname;
    let page = path.split("/").pop() || "index.html";
    if (page === "/") page = "index.html";

    let newPath = "";
    if (lang === "" || lang === "ua") {
        newPath = "/" + page;
    } else {
        newPath = "/" + lang + "/" + page;
    }
    window.location.href = newPath;
}
function goToMenu() {
    // 1. Шукаємо, яка ціль обрана в радіо-кнопках (name="goal")
    const selectedGoal = document.querySelector('input[name="goal"]:checked');

    if (!selectedGoal) {
        alert("Будь ласка, спочатку оберіть ціль (схуднення, діабет тощо)");
        return;
    }

    const goal = selectedGoal.value;

    // 2. Визначаємо шлях залежно від мови (якщо ви використовуєте папки /en/ або /fr/)
    let prefix = "";
    if (window.location.pathname.includes('/en/')) prefix = "/en/";
    else if (window.location.pathname.includes('/fr/')) prefix = "/fr/";

    // 3. Логіка перенаправлення
    if (goal === 'diabetes') {
        window.location.href = prefix + "diabetes.html";
    } else if (goal === 'lose') {
        window.location.href = prefix + "loss.html"; // або ваша назва файлу
    } else if (goal === 'gain') {
        window.location.href = prefix + "gain.html";
    } else {
        window.location.href = prefix + "maintenance.html";
    }
}
function goToMenu() {
    // 1. Отримуємо значення вибраної цілі
    const selectedGoal = document.querySelector('input[name="goal"]:checked');

    if (!selectedGoal) {
        alert("Please select a goal first!");
        return;
    }

    const goal = selectedGoal.value;

    // 2. Логіка назв файлів
    const pages = {
        'lose': 'lose.html',
        'diabetes': 'diabetes.html',
        'gain': 'gain.html',
        'maintain': 'maintain.html'
    };

    const targetPage = pages[goal];

    // 3. РОЗУМНЕ ПЕРЕНАПРАВЛЕННЯ
    const currentPath = window.location.pathname;

    if (currentPath.includes('/en/')) {
        // Якщо ми вже в папці /en/, просто переходимо на файл у цій же папці
        window.location.href = targetPage;
    } else if (currentPath.includes('/fr/')) {
        // Якщо ми в папці /fr/
        window.location.href = targetPage;
    } else {
        // Якщо ми на головній (UA), переходимо від кореня
        window.location.href = "/" + targetPage;
    }
}