'use strict';

/*
FOR NOW: -this function updates the DayView Title 
          when a day is clicked on the calendar
         -it also updates the calendar to show which
          date has been clicked
FUTURE:  -will update ALL card date for daily view on date
          button click
*/
function switchDate(day) {
	let dayViewTitle = document.getElementById('dayViewTitle');
	let currentDate = document.getElementById(day);
	let lastDate;
	if (lastDay !== 0) {
		lastDate = document.getElementById(lastDay);
		lastDate.classList.remove('btn-secondary');
	}
	dayViewTitle.innerHTML = 'The Day at a Glance: ' + months[currentMonth] + ' ' + day + ' ' + currentYear;
	if(day !== currentDay.getDate()) {
		currentDate.classList.add('btn-secondary');
		lastDay = day;
	}
}

/*
FOR NOW: -sets calendar body based on the current day 
          information which comes from getting the current
          date as well as accounting for the number of days
          in the current month (daysInMonth() accounts for
          this)
FUTURE:  -will associate appropriate item data with each 
          day on calendar
*/
function setupCalendar(month, year) {
    let firstDay = (new Date(year, month)).getDay();
    console.log(firstDay);
    
	let currentMonthAndYear = document.getElementById('currentMonthAndYear');
    //currentMonthAndYear.innerHTML += ' ' + months[month] + ' ' + year;
    
	let days = document.getElementById('days');
	let totalDays = daysInMonth(month, year);
	for(let i = 1; i < firstDay+1; i++) {
		let newDateItem = document.createElement('li');
		let newDateDiv = document.createElement('div');
		newDateDiv.classList.add('btn');
		newDateDiv.classList.add('date');
		newDateItem.appendChild(newDateDiv);
		days.appendChild(newDateItem); 
	}
	for(let i = 1; i < totalDays+1; i++) {
		let newDateItem = document.createElement('li');
		let newDateDiv = document.createElement('div');
		newDateDiv.classList.add('btn');
		newDateDiv.classList.add('date');
		newDateDiv.id = i;
		newDateDiv.innerHTML = i;
		newDateDiv.addEventListener('click', () => switchDate(i));
		newDateItem.appendChild(newDateDiv);
		days.appendChild(newDateItem);
		if(i == currentDay.getDate()) {
			newDateDiv.classList.add('btn-danger');
		}
	}
    
}

/*
FOR NOW: assists in generating the correct number of days
         based on the month and year that we are looking for
*/
function daysInMonth(month, year) {
	return (32 - new Date(month, year, 32).getDate());
}

/*
FOR NOW: updates the Daily view with correct date header
         for initial date --> anymore updates to the card 
         happen in switchDate() as of now but some of that
         code may be pulled out to another method
FUTURE:  will update item information based on status in 
         order to demonstrate the correct information
         for what is due on which day
*/
function setUpDayCard() {
	let dayViewTitle = document.getElementById('dayViewTitle');
	let today = currentDay.getDate();
	dayViewTitle.innerHTML += ' ' + months[currentMonth] + ' ' + today + ' ' + currentYear;
}

/*
FOR NOW: only updates modal title
FUTURE:  will update all modal information to reflect
         the information for the item being stored
*/
function switchItem(itemName) {
	let itemTitle = document.getElementById('modalTitle');
	itemTitle.innerHTML = itemName;
}

/*
helper variables to pass information about the date
*/
let currentDay = new Date();
let currentMonth = currentDay.getMonth();
let currentYear = currentDay.getFullYear();
let lastDay = 0;

/*
months array is used to quickly access the correct
month for the calendar in order to set month name
as the part of calendar header appropriately
*/
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/*initial page setup for calendar and
daily view
*/
setupCalendar(currentMonth, currentYear);
setUpDayCard();

const dayItems = document.getElementsByClassName('day-item');

for (let item of dayItems) {
	item.addEventListener('click', () => switchItem(item.textContent));
}