document.addEventListener('DOMContentLoaded', function() {

    // --- 1. ОНОВЛЕННЯ ПОВЗУНКІВ ---
    const sliderIds = ['age', 'height', 'weight'];
    sliderIds.forEach(id => {
        const slider = document.getElementById(id);
        const output = document.getElementById(id + '-val');
        if (slider && output) {
            slider.oninput = function() {
                output.innerHTML = this.value;
            };
        }
    });

    // --- 2. ЛОГІКА КАЛЬКУЛЯТОРА (ВИПРАВЛЕНО) ---
    const calcForm = document.getElementById('calc-form');
    if (calcForm) {
        calcForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Зупиняємо перезавантаження сторінки

            // Отримуємо дані з полів
            const age = parseInt(document.getElementById('age').value);
            const height = parseInt(document.getElementById('height').value);
            const weight = parseInt(document.getElementById('weight').value);
            
            // Отримуємо вибрану стать
            const gender = document.querySelector('input[name="gender"]:checked').value;
            
            // Отримуємо вибрану мету (ВАЖЛИВО: новий спосіб зчитування)
            const goalElement = document.querySelector('input[name="goal"]:checked');
            const goal = goalElement ? goalElement.value : 'lose';

            // Основна формула калорій (Міффлін-Сан Жеор)
            // 1.2 — це мінімальна активність (навіть якщо людина просто ходить по дому)
             let calories = ((10 * weight) + (6.25 * height) - (5 * age)) * 1.2;
            if (gender === 'male') {
                calories += 5;
            } else {
                calories -= 161;
            }

            // Коригування під мету
            let advice = "";
            if (goal === 'lose') {
                calories -= 400;
                advice = "Ваш персональний план для схуднення готовий!";
            } else if (goal === 'gain') {
                calories += 400;
                advice = "Ваш план для набору м'язової маси сформовано!";
            } else if (goal === 'diabetes') {
                advice = "Меню з низьким глікемічним індексом підібрано.";
            } else {
                advice = "Ваш баланс калорій для підтримки форми.";
            }

            // Виведення результатів на екран
            const resultDiv = document.getElementById('result');
            if (resultDiv) {
                resultDiv.classList.remove('hidden'); // Показуємо блок результатів
                
                document.getElementById('calories-out').innerText = Math.round(calories);
                document.getElementById('p-out').innerText = Math.round((calories * 0.25) / 4);
                document.getElementById('f-out').innerText = Math.round((calories * 0.25) / 9);
                document.getElementById('c-out').innerText = Math.round((calories * 0.5) / 4);
                document.getElementById('advice').innerText = advice;

                // Налаштування кнопки переходу (cta-btn)
                const ctaBtn = document.getElementById('cta-btn');
                if (ctaBtn) {
                    ctaBtn.onclick = function() {
                        window.location.href = goal + '.html'; // Перехід на сторінку мети
                    };
                }

                // Прокручуємо вниз до результату
                resultDiv.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- 3. МОБІЛЬНЕ МЕНЮ ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sideNav = document.getElementById('side-nav');
    if (menuBtn && sideNav) {
        menuBtn.onclick = function() {
            sideNav.classList.toggle('active');
        };
    }
});const reviewForm = document.getElementById('review-form');
if (reviewForm) {
    reviewForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        const button = form.querySelector('button');
        
        button.disabled = true;
        button.innerText = "Відправка...";

        const response = await fetch(form.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            form.style.display = 'none';
            document.getElementById('review-message').style.display = 'block';
        } else {
            alert('Помилка відправки. Спробуйте пізніше.');
            button.disabled = false;
            button.innerText = "Опублікувати відгук";
        }
    });
}