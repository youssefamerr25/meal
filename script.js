const mealSelect = document.getElementById("meal-select");
const cardsContainer = document.querySelector(".cards");
const mealCountElement = document.getElementById("meal-count");


function fetchCategories() {
  const fetchMeal = new XMLHttpRequest();
  fetchMeal.open(
    "GET",
    `https://www.themealdb.com/api/json/v1/1/list.php?c=list`
  );

  fetchMeal.send();

  fetchMeal.addEventListener("readystatechange", function () {
    try {
      if (this.readyState === 4 && this.status === 200) {
        const data = JSON.parse(this.responseText);
        const categories = data.meals;
        console.log(categories);

        // Clear existing options except the first one
        while (mealSelect.options.length > 1) {
          mealSelect.remove(1);
        }

        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.strCategory;
          option.textContent = category.strCategory;
          mealSelect.appendChild(option);
        });

        mealSelect.addEventListener("change", function () {
          const selectedCategory = mealSelect.value;
          if (selectedCategory) {
            filterCategory(selectedCategory);
          } else {
            cardsContainer.innerHTML = "";
            mealCountElement.textContent = "No category selected";
          }
        });
      } else {
        throw new Error("Request failed with status: " + fetchMeal.status);
      }
    } catch (error) {
      console.error(error);
    }
  });
}

console.log(mealSelect.value);

function filterCategory(selectedCategory) {
  const filteredMeals = new XMLHttpRequest();
  filteredMeals.open(
    "GET",
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
  );

  filteredMeals.send();

  filteredMeals.addEventListener("readystatechange", function () {
    try {
      cardsContainer.innerHTML = "";
      if (this.readyState === 4 && this.status === 200) {
        const data = JSON.parse(this.responseText);
        const meals = data.meals;
        if (meals) {
          mealCountElement.textContent = `Found ${meals.length} meals in ${selectedCategory} category`;

          meals.forEach((meal) => {
            cardsContainer.innerHTML += `
                  <div class="card">
                    <div class="image">
                      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    </div>
                    <p>${meal.strMeal}</p>
                  </div>
                `;
          });
        } else {
          mealCountElement.textContent = `No meals found in ${selectedCategory} category`;
        }
      } else {
        throw new Error("Request failed with status: " + filteredMeals.status);
      }
    } catch (error) {
      console.error(error);
    }
  });
}

fetchCategories();
