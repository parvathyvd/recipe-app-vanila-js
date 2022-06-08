const mealsEl = document.querySelector("#meals");
const favList = document.querySelector("#fav-list");
const favContainer = document.querySelector(".fav-container");
const searchIcon = document.getElementById("search-icon");
const searchValue = document.getElementById("search");

//Get and set and remove meals to and from the Local Storage
const addMealLS = (mealId) => {
  const mealIds = getMealLs();
  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
};

const getMealLs = () => {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));
  return mealIds === null ? [] : mealIds;
};

const removeMealLS = (mealId) => {
  const mealIds = getMealLs();
  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
};

// fetching a random meal
const getRandomMeal = async () => {
  const result = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const data = await result.json();
  const randomMeal = data.meals[0];

  //   console.log(data.meals[0]);
  // add the fetched random meal to the UI
  adddMeal(randomMeal, true);
};

const getMealById = async (id) => {
  const result = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await result.json();
  //   const randomMeal = data.meals;

  //   console.log(data.meals[0]);
  // add the fetched random meal to the UI
  return data.meals[0];
};

const getMealsBySearch = async (term) => {
  const result = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  const data = await result.json();
  //   const randomMeal = data.meals;

  console.log("by search", data.meals);
  // add the fetched random meal to the UI
  return data.meals;
};

const addMealsToFav = (meal) => {
  // Add it to the UI
  //   console.log("add this to fav", meal);
  favList.innerHTML += `
      <li>
      <img src=${meal.strMealThumb} alt=${meal.strMeal}>
      <span>${meal.strMeal}</span>
      <button class="clear"><i class="fas fa-window-close" id=${meal.idMeal}></i></button>
    </li>`;

  const btn = favList.querySelectorAll(".clear");

  btn.forEach((bt) => {
    bt.addEventListener("click", (e) => {
      console.log("clicked fav meal is", e.target.id);
      removeMealLS(e.target.id);
      const favBtn = document.querySelector(".fav-btn");
      if (favBtn.id === e.target.id) {
        favBtn.classList.remove("active");
      }
      favMeals();
    });
  });
};

//Fetch favourit meals

const favMeals = async () => {
  favList.innerHTML = "";

  const mealsIds = getMealLs();

  for (let i = 0; i < mealsIds.length; i++) {
    const mealId = mealsIds[i];
    console.log("meal by id", mealId);

    const meal = await getMealById(mealId);
    addMealsToFav(meal);
  }
};

const adddMeal = (mealData, random = false) => {
  const mealEl = document.createElement("div");
  mealEl.classList.add("meal");
  mealEl.innerHTML += `<div class="meal-header">
   ${random ? "<h3>Random Recipe</h3>" : ""}
    <img src=${mealData.strMealThumb} alt=${mealData.strMeal}>
</div>
<div class="meal-body">
    <h4>${mealData.strMeal}</h4>
    <button class="fav-btn" id=${mealData.idMeal}>
        <i class="fa fa-heart"></i>
    </button>
</div>`;
  const favBtn = mealEl.querySelector(".meal-body .fav-btn");

  if (favBtn) {
    favBtn.addEventListener("click", () => {
      if (favBtn.classList.contains("active")) {
        removeMealLS(mealData.idMeal);
        favBtn.classList.remove("active");
        // call fav meals so that it shows just added fav item before that clean the fav list
      } else {
        addMealLS(mealData.idMeal);
        favBtn.classList.add("active");
      }
      favMeals();
    });
  }
  mealsEl.appendChild(mealEl);
};

// Get a random meal when the app loads
getRandomMeal();
//Get the favourite meals when the app loads
favMeals();

// Get a meal based on Search

searchIcon.addEventListener("click", async () => {
  //get the search term and getMealsby Search
  const searchTerm = searchValue.value;
  console.log(searchTerm);
  const meals = await getMealsBySearch(searchTerm);
  console.log(meals);
  if (meals) {
    meals.forEach((meal) => {
      adddMeal(meal);
    });
  }
});
