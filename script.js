const loadingSpinner = (status) =>{
  if (status) {
    document.getElementById("loading-spinner").classList.remove("hidden")
    document.getElementById("card_container").classList.add("hidden")
  }else{
    document.getElementById("loading-spinner").classList.add("hidden")
    document.getElementById("card_container").classList.remove("hidden")
  }
}

// loading all plants
const loadAllPlants = () => {
  loadingSpinner(true)
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((plants) => displayAllPlants(plants.plants));
};

// loading & showing details modal
const loadPlantDetails = (id) => {
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((details) => displayPLantDetails(details.plants));
};

const displayPLantDetails = (details) => {
  // console.log(details)
  const parentNodeModal = document.getElementById("details-modal");
  parentNodeModal.innerText = ``
  const detailsBox = document.createElement("div");
  detailsBox.innerHTML = `
          <div class="bg-white card p-5 h-full">
            <img class="h-40 object-cover" src="${details.image}" alt ="">
            <h2 class="font-bold text-xl">${details.name}</h2>
            <p class="font-medium text-gray-400"> ${details.description}</p>
            <div class="my-4">
              <span class="bg-green-100 px-2 p-1 rounded-2xl">${details.category}</span>
              <h3 class="mt-2">৳ ${details.price} </h3>
            </div>
          </div>
  `;
  parentNodeModal.appendChild(detailsBox);
  document.getElementById("trees_detail_modal").showModal();
};

// displaying all plants in a card
const displayAllPlants = (plants) => {
  plants.forEach((plant) => {
    const cardsContainer = document.getElementById("card_container");
    const cardParent = document.createElement("div");
    cardParent.innerHTML = `
          <div class="bg-white card p-5 h-full">
            <img class="h-40 object-cover mb-4" src="${plant.image}" alt ="">
            <h2 onclick="loadPlantDetails(${
              plant.id
            })" class="font-bold text-xl">${plant.name}</h2>
            <p class="font-medium text-gray-400 line-clamp-2"> ${
              plant.description
            }</p>
            <div class="flex justify-between items-center my-4">
              <span class="bg-green-100 px-2 p-1 rounded-2xl">${
                plant.category
              }</span>
              <h3>৳ ${plant.price} </h3>
            </div>
            <button onclick="addCart('${encodeURIComponent(
              JSON.stringify(plant)
            )}')" 
            class="btn bg-green-600 w-full">Add to Cart
            </button>
          </div>
        `;
    cardsContainer.appendChild(cardParent);
  });
  loadingSpinner(false)
};

loadAllPlants();

// loading all categories button
const loadCategoriesBtn = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories));
};

// displaying all categories button
const displayCategories = (categories) => {
  categories.forEach((category) => {
    const parentNode = document.getElementById("categories_btn_box");
    const buttonDiv = document.createElement("div");
    const buttonID = category.id;
    buttonDiv.innerHTML = `
    <button id="categories-btn-${buttonID}" onClick="loadCategory(${buttonID})" class="hover:bg-green-600 px-5 py-2 rounded-xl w-full categories-btn"> ${category.category_name} </button>
    `;
    parentNode.appendChild(buttonDiv);
  });
};
loadCategoriesBtn();

// load & display & add active categories by clicking btn
const loadCategory = (id) => {
  loadingSpinner(true)
  //loading
  const url = `https://openapi.programming-hero.com/api/category/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((singleCategory) => {
      const allCategories = document.querySelectorAll(".categories-btn");
      allCategories.forEach((el) => {
        el.classList.remove("active-category");
      });
      const clickedBtn = document.getElementById(`categories-btn-${id}`);
      clickedBtn.classList.add("active-category");
      displayCategory(singleCategory.plants);
    });
};

const displayCategory = (categoryItems) => {
  //displaying
  const categoryCardsContainer = document.getElementById("card_container");
  categoryCardsContainer.innerHTML = ``;
  categoryItems.forEach((items) => {
    const cardParent = document.createElement("div");
    cardParent.innerHTML = `
          <div class="bg-white card p-5 h-full">
            <img class="h-40 object-cover mb-3" src="${items.image}" alt ="">
            <h2 onclick="loadPlantDetails(${
              items.id
            })" class="font-bold text-xl">${items.name}</h2>
            <p class="font-medium text-gray-400 line-clamp-2"> ${
              items.description
            }</p>
            <div class="flex justify-between items-center my-4">
              <span class="bg-green-100 px-2 p-1 rounded-2xl">${
                items.category
              }</span>
              <h3>৳ ${items.price}</h3>
            </div>
            <button onclick="addCart('${encodeURIComponent(
              JSON.stringify(items)
            )}')" class="btn bg-green-600 w-full">Add to Cart
            </button>
          </div>
        `;
    categoryCardsContainer.appendChild(cardParent);
     loadingSpinner(false)
  });
};

let total = 0;
// create and show cart items
const addCart = (itemStr) => {
  const item = JSON.parse(decodeURIComponent(itemStr));
  const name = item.name;
  const price = item.price;
  const cartParent = document.getElementById("cart_container");
  const cartElement = document.createElement("div");
  cartElement.innerHTML = `
              <div  class="bg-[#F0FDF4] px-2 py-3 rounded-lg flex justify-between items-center my-2">
              <div>
                <h2 class="font-bold text-xl">${name}</h2>
                <p class="text-gray-400">৳ ${price}</p>
              </div>
              <button class="remove-btn">
                <i class="fa-solid fa-circle-xmark"></i>
              </button>
            </div>
  `;

  const deleteBtn = cartElement.querySelector(".remove-btn");
  deleteBtn.addEventListener("click", () =>{
    total = total-price;
    updateTotal()
    cartElement.remove()
  })
  cartParent.appendChild(cartElement);
  total = total+price;
  updateTotal()
};

// update total
const updateTotal = () => {
  const totalContainer = document.getElementById("total-container");
  totalContainer.innerHTML = `<h2 class="text-xl font-semibold">৳ ${total}</h2>`;
};



