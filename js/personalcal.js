'use strict';

/*
FOR NOW: -this function updates the DayView Title 
          when a day is clicked on the calendar
         -it also updates the calendar to show which
          date has been clicked
FUTURE:  -will update ALL card date for daily view on date
          button click
*/
function switchDate(day, month, year) {
	let dayViewTitle = document.getElementById('dayViewTitle');
	let currentDate = document.getElementById(day);
	let lastDate;
	if (lastDay !== 0) {
		lastDate = document.getElementById(lastDay);
		lastDate.classList.remove('btn-secondary');
	}
    dayViewTitle.innerHTML = 'The Day at a Glance: ' + months[month] + ' ' + day + ' ' + year;
    console.log(month);
    console.log(currentMonth);
	if(day === currentDay.getDate() && month === currentMonth && year === currentYear) {
		lastDay = day;
	} else {
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
function setUpCalendar(month, year) {
    let firstDay = (new Date(year, month)).getDay();
    
	//let currentMonthAndYear = document.getElementById('currentMonthAndYear');
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
		newDateDiv.addEventListener('click', () => switchDate(i, month, year));
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

function setUpCalendarSelection() {
    let thisMonth = document.getElementById('currentMonth');
    thisMonth.innerHTML += months[currentMonth];
    let thisYear = document.getElementById('currentYear');
    thisYear.innerHTML += currentYear;
    let monthSelection = document.getElementById('monthSelection');
    for(let i = 0; i < 12; i++) {
        let addMonth = document.createElement('option');
        addMonth.innerHTML = months[i];
        addMonth.value = months[i];
        if(i === currentMonth) {
            addMonth.selected = 'selected';
        }
        monthSelection.appendChild(addMonth);
    }
    let yearSelection = document.getElementById('yearSelection');
    for(let i = currentYear; i <= currentYear+3; i++) {
        let addYear = document.createElement('option');
        addYear.innerHTML = i;
        addYear.value = i;
        if(i === currentYear) {
            addYear.selected = 'selected';
        }
        yearSelection.appendChild(addYear);
    }
}

function switchCalendar(selectedMonth, selectedYear) {
    let firstDay = (new Date(selectedYear, months.indexOf(selectedMonth))).getDay();
    let days = document.getElementById('days');
    days.innerHTML = '';
    let totalDays = daysInMonth(months.indexOf(selectedMonth), selectedYear);
    console.log(totalDays);
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
		newDateDiv.addEventListener('click', () => switchDate(i, months.indexOf(selectedMonth), selectedYear));
		newDateItem.appendChild(newDateDiv);
		days.appendChild(newDateItem);
	}
}

function updateCalendar() {
    let monthValue = document.getElementById('monthSelection');
    let viewMonth = document.getElementById('currentMonth');
    viewMonth.innerHTML = monthValue.value;
    let yearValue = document.getElementById('yearSelection');
    let viewYear = document.getElementById('currentYear');
    viewYear.innerHTML = yearValue.value;
    if(monthValue.value === months[currentMonth] && yearValue.value === currentYear) {
        setUpCalendar(currentMonth, currentYear);
    } else {
        switchCalendar(monthValue.value, yearValue.value);
    }
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
setUpCalendar(currentMonth, currentYear);
setUpDayCard();
setUpCalendarSelection();

const dayItems = document.getElementsByClassName('day-item');

for (let item of dayItems) {
	item.addEventListener('click', () => switchItem(item.textContent));
}

const calSelections = document.getElementsByClassName('calendar-selection');

for (let item of calSelections) {
    item.addEventListener('change', updateCalendar);
}