document.getElementById('calc-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const goal = document.getElementById('goal').value;

    // Формула Міффліна-Сан Жеора
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr = (gender === 'male') ? bmr + 5 : bmr - 161;
    
    let calories = bmr * 1.375; // Середня активність
    let advice = "";

    if (goal === 'lose') {
        calories -= 400;
        advice = "Порада: Сфокусуйтеся на клітковині та білках.";
    } else if (goal === 'gain') {
        calories += 500;
        advice = "Порада: Додайте складні вуглеводи та силові тренування.";
    } else if (goal === 'diabetes') {
        advice = "Важливо: Обмежте швидкі вуглеводи. Розрахунок Хлібних Одиниць: " + Math.round((calories * 0.5) / 48) + " ХО на добу.";
    }

    document.getElementById('result').classList.remove('hidden');
    document.getElementById('calories-out').innerText = Math.round(calories);
    document.getElementById('p-out').innerText = Math.round((calories * 0.25) / 4);
    document.getElementById('f-out').innerText = Math.round((calories * 0.25) / 9);
    document.getElementById('c-out').innerText = Math.round((calories * 0.5) / 4);
    document.getElementById('advice').innerText = advice;
});// Після розрахунків додаємо кнопку переходу
const resultDiv = document.getElementById('result');
const detailBtn = document.createElement('button');
detailBtn.innerText = "Отримати персональні рекомендації";
detailBtn.style.backgroundColor = "#ff9f43";
detailBtn.style.marginTop = "15px";

detailBtn.onclick = function() {
    if (goal === 'lose') window.location.href = 'lose.html';
    else if (goal === 'gain') window.location.href = 'gain.html';
    else if (goal === 'diabetes') window.location.href = 'diabetes.html';
    else window.location.href = 'maintain.html';
};

// Перевіряємо, чи кнопка вже є, щоб не дублювати
if (!document.getElementById('detail-link')) {
    detailBtn.id = 'detail-link';
    resultDiv.appendChild(detailBtn);
}