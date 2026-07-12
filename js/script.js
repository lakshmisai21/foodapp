// Dashboard Totals
let totalCalories = 0;
let totalProtein = 0;
let totalCarbs = 0;
let totalFat = 0;
let water = Number(localStorage.getItem("water")) || 0;
// Daily Goals
const goals = {
    calories: 2200,
    protein: 60,
    carbs: 300,
    fat: 60,
    water: 8
};

// Food Database
let foods = [];

// Meals Array
let meals = [];

// History Object
let history = JSON.parse(localStorage.getItem("history")) || {};

// HTML Elements
const addFoodBtn = document.getElementById("addFoodBtn");
const mealList = document.getElementById("mealList");

// Load Food Database
fetch("data/foods.json")
    .then(response => response.json())
    .then(data => {
        foods = data;
        console.log("Food database loaded!");
    })
    .catch(error => {
        console.error("Error loading foods.json:", error);
    });

// Add Food
addFoodBtn.addEventListener("click", () => {

    const foodName = document.getElementById("foodName").value.trim();
    const quantity = parseFloat(document.getElementById("quantity").value);
    const unit = document.getElementById("unit").value;
    const meal = document.getElementById("meal").value;

    if (!foodName || !quantity) {
        alert("Please enter food name and quantity.");
        return;
    }

    const food = foods.find(f =>
        f.name.toLowerCase() === foodName.toLowerCase()
    );

    if (!food) {
        alert("Food not found in database.");
        return;
    }

    let calories, protein, carbs, fat;

if (food.unit === "piece") {

    calories = Number((food.calories * quantity).toFixed(1));
    protein = Number((food.protein * quantity).toFixed(1));
    carbs = Number((food.carbs * quantity).toFixed(1));
    fat = Number((food.fat * quantity).toFixed(1));

} else {

    calories = Number((food.calories * quantity / 100).toFixed(1));
    protein = Number((food.protein * quantity / 100).toFixed(1));
    carbs = Number((food.carbs * quantity / 100).toFixed(1));
    fat = Number((food.fat * quantity / 100).toFixed(1));

}

    const mealData = {
        food: food.name,
        quantity: quantity,
        unit: unit,
        meal: meal,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat,
        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
    };

   meals.push(mealData);

totalCalories += calories;
totalProtein += protein;
totalCarbs += carbs;
totalFat += fat;

const today = new Date().toLocaleDateString("en-CA");

history[today] = {
    meals: meals,
    calories: totalCalories,
    protein: totalProtein,
    carbs: totalCarbs,
    fat: totalFat,
    water: water
};

localStorage.setItem("history", JSON.stringify(history));

    updateDashboard();

    if (mealList.innerHTML.includes("No food added yet.")) {
        mealList.innerHTML = "";
    }

    addMealToScreen(mealData, meals.length - 1);

    document.getElementById("foodName").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("foodName").focus();

});

// Function to Add Meal to Screen
function addMealToScreen(meal, index) {

    mealList.innerHTML += `
        <div class="meal-item">
            <div>
                                <h3>${meal.food}</h3>

                <p>${meal.quantity} ${meal.unit} • ${meal.meal}</p>

                <p class="meal-time">
                    🕒 ${meal.time}
                </p>

                <p>
                    🔥 ${meal.calories} kcal |
                    💪 ${meal.protein} g |
                    🍚 ${meal.carbs} g |
                    🥑 ${meal.fat} g
                </p>

                <button class="delete-btn" onclick="deleteMeal(${index})">
                    🗑️ Delete
                </button>

            </div>
        </div>
    `;
}

// Update Dashboard
function updateDashboard() {

    document.getElementById("totalCalories").textContent =
`${totalCalories.toFixed(1)} / ${goals.calories} kcal`;

    document.getElementById("totalProtein").textContent =
`${totalProtein.toFixed(1)} / ${goals.protein} g`;

    document.getElementById("totalCarbs").textContent =
`${totalCarbs.toFixed(1)} / ${goals.carbs} g`;

    document.getElementById("totalFat").textContent =
`${totalFat.toFixed(1)} / ${goals.fat} g`;
updateStatus("calorieStatus",totalCalories,goals.calories);
updateStatus("proteinStatus",totalProtein,goals.protein);
updateStatus("carbsStatus",totalCarbs,goals.carbs);
updateStatus("fatStatus",totalFat,goals.fat);
updateStatus("waterStatus",water,goals.water);
updateDailyRating();




}
function updateStatus(id,current,goal){

    const element=document.getElementById(id);

    const percent=(current/goal)*100;

    element.className="status";

    if(percent<60){

        element.textContent="🔴 Very Low";

        element.classList.add("red");

    }

    else if(percent<90){

        element.textContent="🟡 Good";

        element.classList.add("yellow");

    }

    else if(percent<=110){

        element.textContent="🟢 Excellent";

        element.classList.add("green");

    }

    else{

        element.textContent="🟠 Above Goal";

        element.classList.add("orange");

    }

}



function updateDailyRating(){

    const calorieScore=Math.min((totalCalories/goals.calories)*100,100);

    const proteinScore=Math.min((totalProtein/goals.protein)*100,100);

    const carbScore=Math.min((totalCarbs/goals.carbs)*100,100);

    const fatScore=Math.min((totalFat/goals.fat)*100,100);

    const waterScore=Math.min((water/goals.water)*100,100);

    const average=Math.round(

        (calorieScore+
        proteinScore+
        carbScore+
        fatScore+
        waterScore)/5

    );

    document.getElementById("dailyScore").textContent=
    average+"%";

    let stars="";

    if(average>=95){

        stars="⭐⭐⭐⭐⭐";

    }

    else if(average>=80){

        stars="⭐⭐⭐⭐☆";

    }

    else if(average>=60){

        stars="⭐⭐⭐☆☆";

    }

    else if(average>=40){

        stars="⭐⭐☆☆☆";

    }

    else{

        stars="⭐☆☆☆☆";

    }

   document.getElementById("dailyStars").textContent = stars;

let message = "";

if (average >= 95) {

    message = "🏆 Excellent! Perfect nutrition today.";

}
else if (average >= 80) {

    message = "😊 Great job! You're on track.";

}
else if (average >= 60) {

    message = "🙂 Good. Try eating a little more tomorrow.";

}
else if (average >= 40) {

    message = "⚠️ Your nutrition is below the target.";

}
else {

    message = "❗ Eat more nutritious food today.";

}

document.getElementById("ratingMessage").textContent = message;
}

// Load Today's Meals
window.onload = function () {

    const today = new Date().toLocaleDateString("en-CA");
if (history[today]) {

    console.log(history[today]);

    meals = history[today].meals || [];

  meals = history[today].meals || [];
water = history[today].water || 0;

totalCalories = 0;
totalProtein = 0;
totalCarbs = 0;
totalFat = 0;

meals.forEach((meal, index) => {

    addMealToScreen(meal, index);

    totalCalories += meal.calories;
    totalProtein += meal.protein;
    totalCarbs += meal.carbs;
    totalFat += meal.fat;

});
    water = history[today].water || 0;
        if (meals.length > 0) {
            mealList.innerHTML = "";
        }

      meals.forEach((meal, index) => {

    addMealToScreen(meal, index);

});
        

        

    }updateDashboard();
updateWater();

};

// --------------------
// Food Search
// --------------------

const foodInput = document.getElementById("foodName");
const unitSelect = document.getElementById("unit");
const suggestions = document.getElementById("suggestions");

foodInput.addEventListener("input", () => {

    const value = foodInput.value.toLowerCase().trim();

    suggestions.innerHTML = "";

    if (value === "") {
        suggestions.style.display = "none";
        return;
    }

    const matchedFoods = foods.filter(food =>
        food.name.toLowerCase().includes(value)
    );

    if (matchedFoods.length === 0) {
        suggestions.style.display = "none";
        return;
    }

    matchedFoods.forEach(food => {

        const div = document.createElement("div");

        div.className = "suggestion-item";

        div.textContent = food.name;

        div.onclick = function(){

    foodInput.value = food.name;

    unitSelect.value = food.unit;

    suggestions.style.display = "none";

};

        suggestions.appendChild(div);

    });

    suggestions.style.display = "block";

});
foodInput.addEventListener("change", () => {

    const selectedFood = foods.find(food =>
        food.name.toLowerCase() === foodInput.value.toLowerCase()
    );

    if(selectedFood){

        unitSelect.value = selectedFood.unit;

    }

});

document.addEventListener("click", function (e) {

    if (!e.target.closest(".search-container")) {
        suggestions.style.display = "none";
    }

});

// --------------------
// Delete Meal
// --------------------

function deleteMeal(index) {

    meals.splice(index, 1);

    // Reset totals
    totalCalories = 0;
    totalProtein = 0;
    totalCarbs = 0;
    totalFat = 0;

    // Calculate totals again
    meals.forEach(meal => {
        totalCalories += meal.calories;
        totalProtein += meal.protein;
        totalCarbs += meal.carbs;
        totalFat += meal.fat;
    });

    const today = new Date().toLocaleDateString("en-CA");

    history[today] = {
        meals: meals,
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        water: water
    };

    localStorage.setItem("history", JSON.stringify(history));

    mealList.innerHTML = "";

    if (meals.length === 0) {
        mealList.innerHTML = "<p>No food added yet.</p>";
    } else {
        meals.forEach((meal, index) => {
            addMealToScreen(meal, index);
        });
    }

    updateDashboard();
}

const waterCount = document.getElementById("waterCount");
const addWaterBtn = document.getElementById("addWaterBtn");

function updateWater() {

    waterCount.textContent = `${water} / ${goals.water} Glasses`;

const progress = (water / goals.water) * 100;

    document.getElementById("waterProgress").style.width =
        progress + "%";

    updateDashboard();

}

updateWater();

addWaterBtn.addEventListener("click", () => {

   if (water < goals.water) { 

        water++;
// No need to save separately.
// Water is already saved inside history[today].
const today = new Date().toLocaleDateString("en-CA");

history[today] = {
    meals: meals,
    calories: totalCalories,
    protein: totalProtein,
    carbs: totalCarbs,
    fat: totalFat,
    water: water
};

localStorage.setItem("history", JSON.stringify(history));
        updateWater();

    }

});
const resetWaterBtn = document.getElementById("resetWaterBtn");

resetWaterBtn.addEventListener("click", () => {

    water = 0;

    
    const today = new Date().toLocaleDateString("en-CA");

history[today] = {
    meals: meals,
    calories: totalCalories,
    protein: totalProtein,
    carbs: totalCarbs,
    fat: totalFat,
    water: water
};

localStorage.setItem("history", JSON.stringify(history));

    updateWater();

}); 
// Theme Toggle

const themeToggle = document.getElementById("themeToggle");

if(localStorage.getItem("theme") === "dark"){

    document.body.classList.add("dark");
    themeToggle.textContent = "☀ Light";

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