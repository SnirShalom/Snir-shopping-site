const productContainer = document.getElementById("products-container");
const headerContainer = document.getElementById("header");
const sortDropdown = document.getElementById("sortMenu");
const filterByPriceDropdown = document.getElementById("filterByPriceMenu");
const searchBar = document.getElementById("searchBar");

let sortValue = "price";
let filterByPriceSelectedValue = "-1";
let searchValue = "";
let filterByPriceValueArray = [
  [0, 20],
  [20, 50],
  [50, 100],
];

filterByPriceDropdown.addEventListener("change", (evt) => {
  filterByPriceSelectedValue = evt.target.value;
  console.log(
    "filter by price value changed to: " + filterByPriceSelectedValue
  );
  renderPage();
});

sortDropdown.addEventListener("change", (evt) => {
  sortValue = evt.target.value;
  console.log("sort value changed to: " + sortValue);
  renderPage();
});

searchBar.addEventListener("keyup", (event) => {
  searchValue = event.target.value;
  renderPage();
});

let productsArray = [];
let headerData = {
  title: "loading...",
};

function onDataSuccess(data) {
  originalProductsArray = data;
  productsArray = data;
  renderPage();
}

function onDataFailed(error) {
  // alert('products data failed to arrive');
}

function renderPage() {
  //sort products by price
  let tempProductArray = productsArray;
  tempProductArray.sort(compareByPriceFunction);
  tempProductArray = filterByPrice(
    tempProductArray,
    filterByPriceValueArray[+filterByPriceSelectedValue]
  );
  tempProductArray = filterBySearch(productsArray, searchValue);

  const productsHTML = createProductList(tempProductArray);
  productContainer.innerHTML = "";
  productContainer.appendChild(productsHTML);

  const headerHTML = createHeader(headerData);
  headerContainer.innerHTML = "";
  headerContainer.appendChild(headerHTML);
}

fetch("http://localhost:3000/header")
  .then((res) => res.json())
  .then((data) => {
    headerData = data;
    renderPage();
  })
  .catch(() => {
    alert("Error occured!");
    //TODO: //
  });

const responsePromise = fetch("http://localhost:3000/products");
const dataPromise = responsePromise.then((response) => {
  return response.json();
});
dataPromise
  .then(onDataSuccess)
  .catch(onDataFailed)
  .finally(() => {
    console.log("promise ended");
  });

console.log("code still running");

renderPage();

// for(let i=0; i<productsArray.length;i++) {

//     const productDIV = document.createElement("div");
//     productDIV.classList.add("product");

//     const productNameDIV = document.createElement("div");
//     productNameDIV.innerHTML = productsArray[i].name;
//     productDIV.appendChild(productNameDIV);

//     const productAmountDIV = document.createElement("div");
//     productAmountDIV.innerHTML = "Amount: " + productsArray[i].amount;
//     productDIV.appendChild(productAmountDIV);

//     productContainer.appendChild(productDIV);

// }
