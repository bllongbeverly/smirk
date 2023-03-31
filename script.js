async function returnStockData(ticker) {

  {
    var key = "EsYRiuO5UyJ3IGNWDCggwH54klr9JIi8";
  }

  var today = new Date();
  var dd = String(today.getDate() - 1).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;

  var url = "https://api.polygon.io/v2/aggs/ticker/" + ticker + "/range/1/day/" + today + "/" + today + "?adjusted=true&sort=asc&limit=120&apiKey=" + key;

  let response = await fetch(url);
  let temp = await response.json();
  var dat = temp.results[0];
  var data = {
  'price' : dat.c,
  'prevPrice' : dat.o,
  'pointsChanged' : dat.c - dat.o,
  'percChanged' : (dat.c - dat.o) / dat.o,
  };
  return data;

}
