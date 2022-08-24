var timeResult = document.querySelector(".time");
var openedEye = document.querySelector(".opened-eye");
var closedEye = document.querySelector(".closed-eye");
var newTime = document.querySelector(".new-time");
var isHidden = true;

function toggleHiddenState() {
  if (isHidden) {
    isHidden = false;
    openedEye.classList.remove("disabled");
    closedEye.classList.add("disabled");
    timeResult.classList.add("disabled");
  } else {
    isHidden = true;
    openedEye.classList.add("disabled");
    closedEye.classList.remove("disabled");
    timeResult.classList.remove("disabled");
  }
}

closedEye.addEventListener("click", toggleHiddenState);
openedEye.addEventListener("click", toggleHiddenState);
newTime.addEventListener("click", () => document.location.reload(true));

toggleHiddenState();

function randomDate(start, end, startHour, endHour, startMinutes, endMinutes) {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = (startHour + Math.random() * (endHour - startHour)) | 0;
  var minutes =
    (startMinutes + Math.random() * (endMinutes - startMinutes)) | 0;
  date.setHours(hour);
  date.setMinutes(minutes);
  return date;
}

(function createSecondLines() {
  var clock = document.querySelector(".clock");
  var rotate = 0;

  var byFive = function (n) {
    return n / 5 === parseInt(n / 5, 10) ? true : false;
  };

  for (i = 0; i < 30; i++) {
    var span = document.createElement("span");

    if (byFive(i)) {
      span.className = "fives";
    }

    span.style.transform = "translate(-50%,-50%) rotate(" + rotate + "deg)";
    clock.appendChild(span);
    rotate += 6;
  }
})();

(function setClock() {
  var time = randomDate(0, 1, 1, 12, 0, 60);

  var hours = time.getHours();
  var minutes = time.getMinutes();
  var seconds = time.getSeconds();

  var clock = {
    hours: document.querySelector(".hours"),
    minutes: document.querySelector(".minutes"),
    seconds: document.querySelector(".seconds"),
    time: document.querySelector(".time"),
  };

  var deg = {
    hours: 30 * hours + 0.5 * minutes,
    minutes: 6 * minutes + 0.1 * seconds,
    seconds: 6 * seconds,
  };

  clock.hours.style.transform = "rotate(" + deg.hours + "deg)";
  clock.minutes.style.transform = "rotate(" + deg.minutes + "deg)";
  clock.seconds.style.transform = "rotate(" + deg.seconds + "deg)";
  clock.time.textContent = time.toLocaleTimeString();

  var runClock = function () {
    time = new Date(Date.parse(time) + 1000);
    deg.hours += 360 / 43200;
    deg.minutes += 360 / 3600;
    deg.seconds += 360 / 60;

    clock.hours.style.transform = "rotate(" + deg.hours + "deg)";
    clock.minutes.style.transform = "rotate(" + deg.minutes + "deg)";
    clock.seconds.style.transform = "rotate(" + deg.seconds + "deg)";
    clock.time.textContent = time.toLocaleTimeString();
  };

  setInterval(runClock, 1000);

  (function printDate() {
    var months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
    var print = time.getDate() + " / " + months[time.getMonth()];
    var output = document.querySelectorAll("output");

    [].forEach.call(output, function (node) {
      node.innerHTML = print;
    });
  })();
})();
