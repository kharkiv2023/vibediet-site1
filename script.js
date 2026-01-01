document.addEventListener('DOMContentLoaded', function () {

    /* ===============================
       1. ОНОВЛЕННЯ ПОВЗУНКІВ
    =============================== */
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

    /* ===============================
       2. КАЛЬКУЛЯТОР КАЛОРІЙ
    =============================== */
    const calcForm = document.getElementById('calc-form');
    if (calcForm) {
        calcForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const age = +document.getElementById('age').value;
            const height = +document.getElementById('height').value;
            const weight = +document.getElementById('weight').value;

            const gender = document.querySelector('input[name="gender"]:checked')?.value || 'male';
            const goal = document.querySelector('input[name="goal"]:checked')?.value || 'lose';

            // Формула Міффліна — Сан Жеора
            let calories = (10 * weight + 6.25 * height - 5 * age) * 1.2;
            calories += (gender === 'male') ? 5 : -161;

            let advice = '';

            if (goal === 'lose') {
                calories -= 400;
                advice = 'Ваш персональний план для схуднення готовий!';
            } else if (goal === 'gain') {
                calories += 400;
                advice = 'Ваш план для набору мʼязової маси сформовано!';
            } else if (goal === 'diabetes') {
                advice = 'Меню з низьким глікемічним індексом підібрано.';
            } else {
                advice = 'Ваш баланс калорій для підтримки форми.';
            }

            calories = Math.max(calories, 1200);

            const resultDiv = document.getElementById('result');
            if (!resultDiv) return;

            resultDiv.classList.remove('hidden');

            document.getElementById('calories-out').textContent = Math.round(calories);
            document.getElementById('p-out').textContent = Math.round((calories * 0.25) / 4);
            document.getElementById('f-out').textContent = Math.round((calories * 0.25) / 9);
            document.getElementById('c-out').textContent = Math.round((calories * 0.5) / 4);
            document.getElementById('advice').textContent = advice;

            const ctaBtn = document.getElementById('cta-btn');
            if (ctaBtn) {
                const pages = {
                    lose: 'lose.html',
                    gain: 'gain.html',
                    diabetes: 'diabetes.html',
                    maintain: 'maintain.html'
                };
                ctaBtn.onclick = () => window.location.href = pages[goal];
            }

            resultDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }

    /* ===============================
       3. МОБІЛЬНЕ МЕНЮ
    =============================== */
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sideNav = document.getElementById('side-nav');
    if (menuBtn && sideNav) {
        menuBtn.addEventListener('click', () => {
            sideNav.classList.toggle('active');
        });
    }

    /* ===============================
       4. ФОРМА ВІДГУКІВ (БЕЗ ПОМИЛОК)
    =============================== */
    const reviewForm = document.getElementById('review-form');
    const reviewMessage = document.getElementById('review-message');

    if (reviewForm) {
        reviewForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Якщо action не заданий — не ламаємось
            if (!reviewForm.action) {
                alert('Форма не налаштована (відсутній action)');
                return;
            }

            const button = reviewForm.querySelector('button');
            if (button) {
                button.disabled = true;
                button.textContent = 'Відправка...';
            }

            try {
                const response = await fetch(reviewForm.action, {
                    method: 'POST',
                    body: new FormData(reviewForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (!response.ok) throw new Error();

                reviewForm.reset();
                reviewForm.style.display = 'none';
                if (reviewMessage) reviewMessage.style.display = 'block';

            } catch (err) {
                alert('Помилка відправки. Спробуйте пізніше.');
                if (button) {
                    button.disabled = false;
                    button.textContent = 'Опублікувати відгук';
                }
            }
        });
    }

});
