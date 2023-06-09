async function returnStockData(ticker) {
  {
    var key = "EsYRiuO5UyJ3IGNWDCggwH54klr9JIi8";
  }

  var today = new Date();
  let day = today.getDay();
  var adj = 1;
  if(day == 0) {
    adj = 2;
  }
  if(day == 1) {
    adj = 3;
  }
  var dd = String(today.getDate() - adj).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  var url =
    "https://api.polygon.io/v2/aggs/ticker/" +
    ticker +
    "/range/1/day/" +
    today +
    "/" +
    today +
    "?adjusted=true&sort=asc&limit=120&apiKey=" +
    key;

  let response = await fetch(url);
  let temp = await response.json();
  var dat = temp.results[0];
  var data = {
    price: dat.c,
    prevPrice: dat.o,
    pointsChanged: (dat.c - dat.o).toFixed(2),
    percChanged: (((dat.c - dat.o) / dat.o) * 100).toFixed(2) + "%",
  };
  return data;
}

// Get the search input and button elements
const searchInput = document.querySelector("#searchStocksInput");
const searchButton = document.querySelector("#button-addon2");

// Get the element to update with the search text
const tickerName = document.getElementById("ticker-name");

// Get the "Add to My Stocks" button and the "My Stocks" table body
const addToMyStocksButton = document.querySelector(".btn-success");
const myStocksTableBody = document.querySelector(".table tbody");
const myStocksList = JSON.parse(localStorage.getItem("history"));
if (myStocksList) {
  myStocksList.forEach(async function (stock) {
    await display_results(stock);
  });
}
display_results();

// Add a click event listener to the search button
searchButton.addEventListener("click", function () {
  // Get the value of the search input
  const searchText = searchInput.value;

  // // Puts search into local storage
  // localStorage.setItem("searchText", searchText);
  // // const varible to pull search text history
  // const getSearch = localStorage.getItem("searchText");

  
  // Update the ticker name element with the search text
  tickerName.textContent = `Search results for "${searchText}"`;
});

function store(newStock) {
  var historyArray = JSON.parse(window.localStorage.getItem('history')) || [];
  if (historyArray.indexOf(newStock) === -1) {
    historyArray.push(newStock);
    window.localStorage.setItem('history', JSON.stringify(historyArray));
  }
}

// Add a click event listener to the "Add to My Stocks" button
addToMyStocksButton.addEventListener("click", async function () {
  const searchText = searchInput.value;
  await display_results(searchText);
  store(searchText);
  searchInput.value = "";
});

// // Add a click event listener to the "Add to My Stocks" button
// addToMyStocksButton.addEventListener("click", function () {
//   // Create a new table row and table cells
//   const newRow = document.createElement("tr");
//   const tickerCell = document.createElement("td");
//   const valueCell = document.createElement("td");
//   const valueChangeCell = document.createElement("td");
//   const percentChangeCell = document.createElement("td");
//   const removeButtonCell = document.createElement("td");

//   // Set the text content of the table cells
//   tickerCell.textContent = tickerName.textContent
//     .replace('Search results for "', "")
//     .replace('"', "");
//   valueCell.textContent = "$0";
//   valueChangeCell.textContent = "0";
//   percentChangeCell.textContent = "0%";

//   // Create a remove button
//   const removeButton = document.createElement("button");
//   removeButton.textContent = "Remove";
//   removeButton.classList.add("btn", "btn-danger");
//   removeButton.addEventListener("click", function () {
//     newRow.remove();
//   });

//   // Append the remove button to its table cell
//   removeButtonCell.appendChild(removeButton);

//   // Append the table cells to the new table row
//   newRow.appendChild(tickerCell);
//   newRow.appendChild(valueCell);
//   newRow.appendChild(valueChangeCell);
//   newRow.appendChild(percentChangeCell);
//   newRow.appendChild(removeButtonCell);

//   // Append the new row to the "My Stocks" table body
//   myStocksTableBody.appendChild(newRow);
// });

function removeLocalStorage (valueToRemove) {
  var history =JSON.parse(window.localStorage.getItem('history'));
  const filteredValue = history.filter(function(item) {
    return item !== valueToRemove;
  });
  window.localStorage.setItem('history', JSON.stringify(filteredValue));
}

async function display_results(ticker) {
  const data = await returnStockData(ticker);

  // Create a new table row and table cells
  const newRow = document.createElement("tr");
  const tickerCell = document.createElement("td");
  const valueCell = document.createElement("td");
  const valueChangeCell = document.createElement("td");
  const percentChangeCell = document.createElement("td");
  const removeButtonCell = document.createElement("td");

    // Determine whether arrow should be up or down
  var arrow = '';
  if(data['pointsChanged'] > 0) {
    arrow = '<i class="arrow fas fa-arrow-up text-success"></i>' + data["percChanged"];
  }
  if(data['pointsChanged'] < 0) {
    console.log("down");
    arrow = '<i class="arrow fas fa-arrow-down text-danger"></i>' + data["percChanged"];
  }

  // Set the text content of the table cells
  tickerCell.textContent = ticker;
  valueCell.textContent = `${data.price}`;
  valueChangeCell.textContent = `${data.pointsChanged}`;
  percentChangeCell.innerHTML = arrow;

  // Create a remove button
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.classList.add("btn", "btn-danger");
  removeButton.addEventListener("click", function () {
    newRow.remove();
    removeLocalStorage(ticker);
  });

  // Append the remove button to its table cell
  removeButtonCell.appendChild(removeButton);

  // Append the table cells to the new table row
  newRow.appendChild(tickerCell);
  newRow.appendChild(valueCell);
  newRow.appendChild(valueChangeCell);
  newRow.appendChild(percentChangeCell);
  newRow.appendChild(removeButtonCell);

  // Append the new row to the "My Stocks" table body
  myStocksTableBody.appendChild(newRow);
}



//   var newStock = document.createElement('li');
//   newStock.innerHTML = `
  
//   <td id="myTicker" class="my-ticker-name">` + ticker + `</td>
//   <td id="myValue" class="value">` + data['price'] + `</td>
//   <td id="myValueChange" class="value-change">` + data['pointsChanged'] + `
//     <!-- <i class="arrow fas fa-arrow-down text-danger"></i>  -->
//   </td>
//   <td id="myPercChange" class="percent-change">` + data['percChanged'] + `</td>
//   <td>
//     <!-- <button onclick="clearHistory()" class="btn btn-danger" type="button">Remove</button> -->
//   </td>`;
//   document.getElementById("list_of_stocks").append(newStock);
// }
async function display_results_temp(ticker) {
  data = await returnStockData(ticker);
  
  var arrow = '';

  if(data['pointsChanged'] > 0) {
    arrow = '<i class="arrow fas fa-arrow-up text-success"></i>' + data["percChanged"];
  }
  if(data['pointsChanged'] < 0) {
    console.log("down");
    arrow = '<i class="arrow fas fa-arrow-down text-danger"></i>' + data["percChanged"];
  }

  var newStock = document.createElement('div');
  newStock.innerHTML = `
  <h5 id="ticker-name" class="rdm-ticker-name">
              Random Stock of the Day
            </h5>
            <p id="stock-name" class="rdm-value">Stock name: ` + ticker + `</p>
            <p id="value" class="rdm-value-change">Value: $` + data['price'] + `</p>
            <p id="percent" class="rdm-percent-change">
              Points changed:
              ` + arrow + `
            </p>`;
            
  document.getElementById("rando_stock").innerHTML = newStock.innerHTML;
}
