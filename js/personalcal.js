'use strict';

window.addEventListener('load', checkForUser());
//console.log(window.localStorage.getItem('userInfo'));

function checkForUser() {
    if(window.localStorage.getItem('userInfo') === null) {
        window.location = '../html/index.html';
    }
}

/*
FOR NOW: -this function updates the DayView Title 
          when a day is clicked on the calendar
         -it also updates the calendar to show which
          date has been clicked
FUTURE:  -will update ALL card date for daily view on date
          button click
*/
function switchDate(day, month, year) {
	//let dayViewTitle = document.getElementById('dayViewTitle');
    let currentDate = document.getElementById(day);
	let lastDate;
	if (lastDay !== 0) {
        lastDate = document.getElementById(lastDay);
        if(lastDay !== currentDay.getDate()) {
            lastDate.classList.remove('btn-secondary');
            if (lastDate.classList.contains('btn-outline-secondary')) {
                lastDate.style.color = 'grey';
            } else {
                lastDate.style.color = 'black';
            }
        }
	}
    setUpDayCard(day, month+1, year);
	if(day === currentDay.getDate() && month === currentMonth && parseInt(year) === currentYear) {
		lastDay = day;
	} else {
        if(lastDate !== currentDay.getDate()) {
            currentDate.classList.add('btn-secondary');
            currentDate.style.color = 'white';
            /*currentDate.className = 'btn-secondary';
            currentDate.classList.add('btn', 'date');*/
		    lastDay = day;
        }
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
		if(i === currentDay.getDate()) {
            newDateDiv.classList.add('btn-danger');
            newDateDiv.style.color = 'white';
		}  else {
            newDateDiv.disabled = true;
        }
    }
    checkForItems(month, year);
}

function checkForItems(month, year) {
    let listOfItems = JSON.parse(window.localStorage.getItem('personalCalItems'));
    console.log(listOfItems);
    for(let i = 1; i < listOfItems.length; i++) {
        let startTime = listOfItems[i].start;
        let itemYear = parseInt(startTime.slice(0, 4));
        let itemMonth = parseInt(startTime.slice(5, 7));
        let itemDay = parseInt(startTime.slice(8, 10));
        if(itemYear === year && itemMonth === month+1) {
            if(parseInt(itemDay) !== currentDay.getDate()) {
                let dateItem = document.getElementById(itemDay.toString(10));
                dateItem.classList.add('btn-outline-secondary');
            }
        }
    } 
}

/*
FOR NOW: assists in generating the correct number of days
         based on the month and year that we are looking for
*/
function daysInMonth(month, year) {
    let thirtyDays = ['April', 'June', 'September', 'November'];
    let thirtyOneDays = ['January', 'March', 'May', 'July', 'August', 'October', 'December'];
    if(thirtyDays.includes(months[month])) {
        return 30;
    } else if (thirtyOneDays.includes(months[month])) {
        return 31;
    } else {
        if(year % 4 === 0) {
            return 29;
        } else {
            return 28;
        }
    }
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
function setUpDayCard(day, month, year) {
	let dayViewTitle = document.getElementById('dayViewTitle');
    dayViewTitle.innerHTML = 'The Day at a Glance: ' + months[month-1] + ' ' + day + ' ' + year;
    let calendarItems = JSON.parse(window.localStorage.getItem('personalCalItems'));
    let dayEvents = [];
    resetDayCard();
    for(let i = 0; i < calendarItems.length; i++) {
        let thisYear = parseInt(calendarItems[i].start.slice(0, 4));
        let thisMonth = parseInt(calendarItems[i].start.slice(5, 7));
        let thisDay = parseInt(calendarItems[i].start.slice(8, 10));
        if(thisYear === parseInt(year) && thisMonth === month && thisDay === day) {
            console.log(calendarItems[i]);
            dayEvents.push(calendarItems[i]);
            let newDayItem = document.createElement('div');
            newDayItem.classList.add('list-group-item', 'list-group-item-action', 'day-item');
            newDayItem.setAttribute('data-toggle', 'modal');
            newDayItem.setAttribute('data-target', '#itemEditCenter');
            newDayItem.innerHTML = calendarItems[i].calendar_title + ': ';
            newDayItem.innerHTML += calendarItems[i].name;
            let thisStatus = calendarItems[i].status;
            let thisType = calendarItems[i].type;
            if(thisType === 'event') {
                let scheduleDiv = document.getElementById('todaysSchedule');
                scheduleDiv.append(newDayItem);
            } else {
                if(thisStatus === 'not started') {
                    let statusDiv = document.getElementById('notStarted');
                    statusDiv.append(newDayItem);
                } else if (thisStatus === 'in progress') {
                    let statusDiv = document.getElementById('inProgress');
                    statusDiv.append(newDayItem);
                } else if (thisStatus === 'completed') {
                    let statusDiv = document.getElementById('completed');
                    statusDiv.append(newDayItem);
                } 
            }
        }
    }
    window.localStorage.setItem('currentDayItemInfo', JSON.stringify(dayEvents));
    console.log(JSON.parse(window.localStorage.getItem('currentDayItemInfo')));
}

function resetDayCard() {
    let scheduleDiv = document.getElementById('todaysSchedule');
    scheduleDiv.innerHTML = '';
    let scheduleHeader = document.createElement('div');
    scheduleHeader.classList.add('list-group-item', 'text-uppercase', 'font-weight-bold', 'bg-light');
    scheduleHeader.innerHTML = 'Today\'s Schedule';
    scheduleDiv.appendChild(scheduleHeader);
    
    let notStartedDiv = document.getElementById('notStarted');
    notStartedDiv.innerHTML = '';
    let notStartedHeader = document.createElement('div');
    notStartedHeader.classList.add('list-group-item', 'text-uppercase', 'font-weight-bold', 'bg-danger');
    notStartedHeader.innerHTML = 'Not Started';
    notStartedDiv.appendChild(notStartedHeader);

    let inProgressDiv = document.getElementById('inProgress');
    inProgressDiv.innerHTML = '';
    let inProgressHeader = document.createElement('div');
    inProgressHeader.classList.add('list-group-item', 'text-uppercase', 'font-weight-bold', 'bg-warning');
    inProgressHeader.innerHTML = 'In Progress';
    inProgressDiv.appendChild(inProgressHeader);

    let completedDiv = document.getElementById('completed');
    completedDiv.innerHTML = '';
    let completedHeader = document.createElement('div');
    completedHeader.classList.add('list-group-item', 'text-uppercase', 'font-weight-bold', 'bg-success');
    completedHeader.innerHTML = 'Complete';
    completedDiv.appendChild(completedHeader);
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
        if(i === currentDay.getDate() && months.indexOf(selectedMonth) === currentMonth && parseInt(selectedYear) === currentYear) {
			newDateDiv.classList.add('btn-danger');
		}
    }
    checkForItems(months.indexOf(selectedMonth), parseInt(selectedYear));
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

/*function switchToDoLocation(toDo) {
    let itemNum = toDo.id;
    console.log(toDo);
    let divForToDo = document.getElementById('toDo'+itemNum);
    divForToDo.remove();
    console.log(divForToDo);
    if(toDo.checked === true) {
    }
}*/

function setUpdateForm() {
    let currentType = document.getElementById('itemType');
    let itemStatus = document.getElementById('showStatus');
    let dueDateShow = document.getElementById('showDueDate');
    let startTimeShow = document.getElementById('showStartTime');
    let endTimeShow = document.getElementById('showEndTime');
    if(currentType.value === 'Action Item') {
        itemStatus.style.display = 'inline-block';
        dueDateShow.style.display = 'inline-block';
        startTimeShow.style.display = 'none';
        endTimeShow.style.display = 'none';
    } else if (currentType.value === 'Event') {
        itemStatus.style.display = 'none';
        dueDateShow.style.display = 'none';
        startTimeShow.style.display = 'inline-block';
        endTimeShow.style.display = 'inline-block';
    }
}

function setNewToDo() {
    let newToDo = document.getElementById('toDoName');
    let currentToDoList = document.getElementById('toDoItems');
    let listGroupItem = document.createElement('div');
    listGroupItem.classList.add('list-group-item', 'list-group-item-action');
    let addedToDo = document.createElement('div');
    addedToDo.classList.add('form-check');
    let formCheckLabel = document.createElement('label');
    formCheckLabel.classList.add('form-check-label');
    let checkBoxInput = document.createElement('input');
    checkBoxInput.classList.add('checkbox');
    checkBoxInput.type = 'checkbox';
    formCheckLabel.appendChild(checkBoxInput);
    formCheckLabel.innerHTML += ' ' + newToDo.value + ' ';
    let inputHelper = document.createElement('i');
    inputHelper.classList.add('input-helper');
    formCheckLabel.appendChild(inputHelper);
    addedToDo.appendChild(formCheckLabel);
    listGroupItem.appendChild(addedToDo);
    currentToDoList.appendChild(listGroupItem);

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
setUpDayCard(currentDay.getDate(), currentMonth+1, currentYear);
setUpCalendarSelection();
setUpdateForm();

const dayItems = document.getElementsByClassName('day-item');

for (let item of dayItems) {
	item.addEventListener('click', () => switchItem(item.textContent));
}

const calSelections = document.getElementsByClassName('calendar-selection');

for (let item of calSelections) {
    item.addEventListener('change', updateCalendar);
}

let dueDateInput = document.getElementById('itemType');

dueDateInput.addEventListener('change', setUpdateForm);

let addToDoItem = document.getElementById('addToDo');

addToDoItem.addEventListener('click', setNewToDo);

let toDoItems = document.getElementsByClassName('to-do-item');

for (let item of toDoItems) {
    item.addEventListener('change', () => switchToDoLocation(item));
}

let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));

async function loadPersonalCalendar() {
    const response = await fetch('/api/calendars');
    if (!response.ok) {
        console.log(response.error);
        return;
    }
    let calendarData = await response.json();
    for(let i = 0; i < calendarData.length; i++) {
        if(calendarData[i].owner_id === userInfo.id && calendarData[i].personal === true) {
            window.localStorage.setItem('personalCalId', JSON.stringify(calendarData[i].id));
        }
    }
}

async function searchForCalendarItems() {
    let personalCalId = window.localStorage.getItem('personalCalId');
    console.log(personalCalId);
    const response = await fetch('/api/calendars/0/items'); 
    if(!response.ok) {
        console.log(response.error);
        return;
    }
    let itemData = await response.json();
    window.localStorage.setItem('personalCalItems', JSON.stringify(itemData));
}

loadPersonalCalendar();
searchForCalendarItems();