var current_question = 0;
var score = 0;
var time_left = 61;
var timer;
var high_scores = JSON.parse(localStorage.getItem("high_scores")) || [];

{
  var key = "EsYRiuO5UyJ3IGNWDCggwH54klr9JIi8";
}





var rawDataObject = JSON.parse("https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-09/2023-03-09?adjusted=true&sort=asc&limit=120&apiKey=" + key);

function unixToTimestamp(unix) {

  var timestamp = unix*1000;
  var date = "";

  date = "Date: "+ timestamp.getDate()+
           "/"+(timestamp.getMonth()+1)+
           "/"+timestamp.getFullYear()+
           " "+timestamp.getHours()+
           ":"+timestamp.getMinutes()+
           ":"+timestamp.getSeconds();

}

function displayPrice() {
  var unix = rawDataObject.results[0].t;
  var date = unixToTimestamp(unix);
  console.log(rawDataObject.results[0]);
  console.log(date);

  var div = document.getElementById("display");
  div.innerHTML = rawDataObject.results[0];
}








var questions = [q1, q2, q3, q4, q5];

function display_shift(active_disp) {
  var displays = document.querySelector('#display').children;
  for (let i = 0; i < displays.length; i++) {
    displays[i].style.display = "none";
  }
  document.querySelector('#' + active_disp).style = "display:block;justify-content:center;align-items:center;";
}

function build_high_score_list() {
  clearInterval(timer);
  document.querySelector('#timer_disp').innerHTML = "Timer: --";
  document.querySelector('#scores_table').innerHTML = "";
  var scores = document.createElement("ol");
  var next;
  high_scores.sort(function(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] > b[1]) ? -1 : 1;
    }
  });
  for (let i = 0; i < high_scores.length; i++) {
    next = document.createElement("li")
    next.innerHTML = high_scores[i][0] + " - " + high_scores[i][1];
    scores.appendChild(next);
  }
  document.querySelector('#scores_table').appendChild(scores);
}

function add_score() {
  var initials = document.querySelector('#initials').value;
  high_scores.push([initials, score]);
  localStorage.setItem("high_scores", JSON.stringify(high_scores));
  build_high_score_list();
  display_shift("high_scores");
}

function load_question(q) {
  document.querySelector('#question_content').innerHTML = q[0];
  document.querySelector('#b1').innerHTML = q[1];
  document.querySelector('#b2').innerHTML = q[2];
  document.querySelector('#b3').innerHTML = q[3];
  document.querySelector('#b4').innerHTML = q[4];
}

function start_timer() {
  current_question = 0;
  score = 0;
  time_left = 61;
  display_shift("questions");
  timer = setInterval(function () {
    time_left -= 1;
    if(time_left <= 0){
      clearInterval(timer);
      document.querySelector('#timer_disp').innerHTML = "Timer: --";
      document.querySelector('#final_score').innerHTML = "Your final score is " + score + ".";
      display_shift("all_done");
    }
    else{
      document.querySelector('#timer_disp').innerHTML = "Timer: " + time_left;
    }
  }, 1000);
  load_question(questions[0]);
}

function next_question() {
  current_question += 1;
  if(current_question >= questions.length){
    clearInterval(timer);
    document.querySelector('#timer_disp').innerHTML = "Timer: --";
    document.querySelector('#final_score').innerHTML = "Your final score is " + score + ".";
    display_shift("all_done");
  }
  else{
    load_question(questions[current_question]);
  }
}

function feedback(fdbk) {
  document.querySelector('#question_response').innerHTML = `
    <table>
      <tr>
        <td>
          <div style='borderTop:"thick solid #0000FF"'></div>
        </td>
        <td>
          ` + fdbk + `
        </td>
      </tr>
    </table>`;
    next_question();
}

function answer_chosen(answer) {
  correct_answer = questions[current_question][5];
  if(answer == correct_answer){
    score += 1;
    feedback("Correct!");
  }
  else{
    time_left -= 5;
    feedback("Wrong!");
  }
}

function clear() {
  high_scores = [];
  localStorage.setItem("high_scores", JSON.stringify(high_scores));
  build_high_score_list();
  display_shift("high_scores");
}

function reset() {
  display_shift("start_page");
}

document.querySelector('#start_butt').addEventListener("click", start_timer);
document.querySelector('#go_back').addEventListener("click", reset);
document.querySelector('#clear').addEventListener("click", clear);





/*
// Assignment code here


// Get references to the #generate element
var generateBtn = document.querySelector("#generate");
var specialChars = "!\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~";
var lowerChars = "abcdefghijklmnopqrstuvwxyz";
var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var numberChars = "0123456789";

// Functions
function toggleDisplay() {
  var x = document.getElementById("passwordViewer");
  var y = document.getElementById("options");
  if (x.style.display === "none") {
    x.style.display = "block";
    y.style.display = "none";
    document.querySelector("#generate").innerHTML = "Retry?";
  } else {
    x.style.display = "none";
    y.style.display = "block";
    document.querySelector("#generate").innerHTML = "Generate Password";
  }
}

// Write password to the #password input
function writePassword() {

  console.log("test");

  // setting password length
  var passLength = document.querySelector('#passLength').value;
  if(passLength < 8){passLength = 8;}
  if(passLength > 128){passLength = 128;}

  var chars = "";
  
  // adding character groups to the useable pool based on the checkboxes
  var specialBool = document.querySelector('#specialBool').checked;
  if(specialBool){chars = chars + specialChars;}
  var numbersBool = document.querySelector('#numbersBool').checked;
  if(numbersBool){chars = chars + numberChars;}
  var upperBool = document.querySelector('#upperBool').checked;
  if(upperBool){chars = chars + upperChars;}
  var lowerBool = document.querySelector('#lowerBool').checked;
  if(lowerBool){chars = chars + lowerChars;}

  console.log(chars);

  // mandating a useable character pool
  if(chars === ""){
    chars = chars + lowerChars;
  }

  chars = chars.split("");
  var password = "";

  // concatenating random members of chars to password passLength times
  for (let i = 0; i < passLength; i++) {
    password = password + chars[Math.floor(Math.random() * chars.length)];
  }

  console.log(password);

  toggleDisplay();

  var passwordText = document.querySelector("#password");

  passwordText.value = password;

}

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword);
*/