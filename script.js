
{
  var key = "EsYRiuO5UyJ3IGNWDCggwH54klr9JIi8";
}


var ticker = "AAPL";


var url = "https://api.polygon.io/v2/aggs/ticker/" + ticker + "/range/1/day/2023-01-09/2023-03-09?adjusted=true&sort=asc&limit=120&apiKey=" + key;




function unixToTimestamp(unix) {

  var timestamp = new Date(unix*1000);

  var date = timestamp.toLocaleDateString("en-US");

  /*
  var date = "Date: "+ timestamp.getDate()+
           "/"+(timestamp.getMonth()+1)+
           "/"+timestamp.getFullYear()+
           " "+timestamp.getHours()+
           ":"+timestamp.getMinutes()+
           ":"+timestamp.getSeconds();
           */

  return date;

}


var array = [2];

function parse(data) {
  console.log(data);
  array[0] = data.results[0].t;
  console.log(array[0]);
  console.log(unixToTimestamp(array[0]));
}

function displayPrice() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => parse(data));
}

