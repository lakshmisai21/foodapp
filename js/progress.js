
const progressContainer = document.getElementById("progressContainer");

const history = JSON.parse(localStorage.getItem("history")) || {};

const dates = Object.keys(history).sort();

const labels = [];
const caloriesData = [];

if (dates.length === 0) {

    progressContainer.innerHTML = "<h3>No progress available.</h3>";

} else {

    dates.forEach(date => {

        const day = history[date];

        labels.push(date);
        caloriesData.push(day.calories);

        let mealsHTML = "";

        if (day.meals) {
    day.meals.forEach(meal => {
        mealsHTML += `
            <li>
                ${meal.food} (${meal.quantity} ${meal.unit}) - ${meal.calories} kcal
            </li>
        `;
    });
}

           

        progressContainer.innerHTML += `

        <div class="history-card">

            <h2>📅 ${date}</h2>

            <p>🔥 Calories: ${day.calories} kcal</p>
            <p>💪 Protein: ${day.protein} g</p>
            <p>🍚 Carbs: ${day.carbs} g</p>
            <p>🥑 Fat: ${day.fat} g</p>
            <p>💧 Water: ${day.water} / 8 Glasses</p>

            <h3>Meals</h3>

            <ul>
                ${mealsHTML}
            </ul>

        </div>

        <br>

        `;

    });

    const ctx = document.getElementById("calorieChart");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Calories",
                data: caloriesData
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Daily Calories"
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}
const themeToggle = document.getElementById("themeToggle");

if(themeToggle){

    if(localStorage.getItem("theme")==="dark"){

        document.body.classList.add("dark");
        themeToggle.textContent="☀ Light";

    }

    themeToggle.addEventListener("click",()=>{

        document.body.classList.toggle("dark");

        if(document.body.classList.contains("dark")){

            localStorage.setItem("theme","dark");
            themeToggle.textContent="☀ Light";

        }else{

            localStorage.setItem("theme","light");
            themeToggle.textContent="🌙 Dark";

        }

    });

}