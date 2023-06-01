// Get references to HTML elements
const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#submitButton");
const alarmContainer = document.querySelector("#alarms-container");

// Adding Hours, Minutes, Seconds in DropDown Menu
// When the DOM is fully loaded, populate the drop-down menus for hours, minutes, and seconds
window.addEventListener("DOMContentLoaded", (event) => {
  dropDownMenu(1, 12, setHours);
  dropDownMenu(0, 59, setMinutes);
  dropDownMenu(0, 59, setSeconds);

  // Update the current time every second and fetch saved alarms
  setInterval(getCurrentTime, 1000);
  fetchAlarm();
});

// Event Listener added to Set Alarm Button
// When the "Set Alarm" button is clicked, retrieve the selected values and set the alarm
setAlarmButton.addEventListener("click", getInput);

// Function for adding hours, minutes, and seconds to the drop-down menu
function dropDownMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDown = document.createElement("option");
    dropDown.value = i < 10 ? "0" + i : i;
    dropDown.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(dropDown);
  }
}

// Function to retrieve the current time and update the display
function getCurrentTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currentTime.innerHTML = time;

  return time;
}

// Function for setting the alarm for the given user input
function getInput(e) {
  e.preventDefault();
  const hourValue = setHours.value;
  const minuteValue = setMinutes.value;
  const secondValue = setSeconds.value;
  const amPmValue = setAmPm.value;

  const alarmTime = convertToTime(hourValue, minuteValue, secondValue, amPmValue);
  setAlarm(alarmTime);
}

// Function for converting time to 24-hour format
function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

// Function for setting the alarm
function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getCurrentTime()) {
      alert("Alarm Ringing");
    }
    console.log("running");
  }, 500);

  addAlarmToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}

// Function for displaying the alarms set by the user in the HTML
function addAlarmToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "flex");
  alarm.innerHTML = `
    <div class="time">${time}</div>
    <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
  `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));

  alarmContainer.prepend(alarm);
}

// Function to check if alarms are saved in Local Storage
function checkAlarms() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) {
    alarms = JSON.parse(isPresent);
  }

  return alarms;
}

// Function for saving the alarm to local storage
function saveAlarm(time) {
  const alarms = checkAlarms();

  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

// Function for fetching alarms from local storage
function fetchAlarm() {
  const alarms = checkAlarms();

  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}

// Function for deleting the alarm time
function deleteAlarm(event, time, intervalId) {
  const self = event.target;

  clearInterval(intervalId);

  const alarm = self.parentElement;
  console.log(time);

  deleteAlarmFromLocal(time);
  alarm.remove();
}

// Function for deleting the alarm from local storage
function deleteAlarmFromLocal(time) {
  const alarms = checkAlarms();

  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}