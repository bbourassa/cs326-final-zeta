'use strict';
/* eslint-env jquery */ //this tag is needed so that the $in the modal
//calls don't throw an error
//window.addEventListener('load', checkForUser());
//console.log(window.localStorage.getItem('userInfo'));
//window.localStorage.removeItem('personalCalId');
//window.localStorage.removeItem('personalCalItems');
/*function checkForUser() {
	console.log(window.localStorage.getItem('userInfo'));
}*/

document.getElementById('logoutBtn').addEventListener('click', ()=>{
	fetch('/logout');
});

/*
TEMP ID TO USE
*/
//let userInfo = {'id': 0};
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
    window.localStorage.setItem('dayCardInfo', JSON.stringify({'day': day, 'month': month+1, 'year': year}));
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

async function checkForItems(month, year) {
    console.log('hit');
    let listOfItems = await searchForCalendarItems();
    console.log('list of items', listOfItems);
    //(JSON.parse(window.localStorage.getItem('personalCalItems')));
	for(let i = 0; i < listOfItems.length; i++) {
        let startTime = listOfItems[i].start_time;
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
async function setUpDayCard(day, month, year) {
	let dayViewTitle = document.getElementById('dayViewTitle');
	dayViewTitle.innerHTML = 'The Day at a Glance: ' + months[month-1] + ' ' + day + ' ' + year;
	let calendarItems = await searchForCalendarItems();
    let dayEvents = [];
    //console.log('personalCalItems', JSON.parse(window.localStorage.getItem('personalCalItems')));
	resetDayCard();
	for(let i = 0; i < calendarItems.length; i++) {
        console.log(calendarItems[i]);
		let thisYear = parseInt(calendarItems[i].start_time.slice(0, 4));
		let thisMonth = parseInt(calendarItems[i].start_time.slice(5, 7));
        let thisDay = parseInt(calendarItems[i].start_time.slice(8, 10));
        console.log(thisYear, thisMonth, thisDay);
		if(thisYear === parseInt(year) && thisMonth === month && thisDay === day) {
			dayEvents.push(calendarItems[i].id);
			let newDayItem = document.createElement('div');
			newDayItem.classList.add('list-group-item', 'list-group-item-action', 'day-item');
			newDayItem.setAttribute('data-toggle', 'modal');
            newDayItem.setAttribute('data-target', '#itemEditCenter');
            const response = await fetch('/api/calendars/'+calendarItems[i].parent_id);
	        if (!response.ok) {
		        console.log(response.error);
		    return;
	        }
            let parentCalendar = await response.json();
			newDayItem.innerHTML = parentCalendar[0].name + ': ';
			newDayItem.innerHTML += calendarItems[i].name;
            newDayItem.addEventListener('click', () => fillModalInfo(calendarItems[i].id, parentCalendar[0].name));
			let thisStatus = calendarItems[i].item_status;
			let thisType = calendarItems[i].item_type;
			if(thisType === 2) {
				let scheduleDiv = document.getElementById('todaysSchedule');
				scheduleDiv.append(newDayItem);
			} else {
				if(thisStatus === 1) {
					let statusDiv = document.getElementById('notStarted');
					statusDiv.append(newDayItem);
				} else if (thisStatus === 2) {
					let statusDiv = document.getElementById('inProgress');
					statusDiv.append(newDayItem);
				} else if (thisStatus === 3) {
					let statusDiv = document.getElementById('completed');
					statusDiv.append(newDayItem);
				}
			}
		}
	}
    window.localStorage.setItem('currentDayItemInfo', JSON.stringify(dayEvents));
}

async function fillModalInfo(itemId, parentCalendar) {
	tempId = itemId;
    let personalCalId = window.localStorage.getItem('personalCalId');
	const response = await fetch('/api/items/'+personalCalId+'/'+itemId);
	if (!response.ok) {
		console.log(response.error);
		return;
	}
    let itemData = await response.json();
    let currentItem = itemData[0];
	let itemName = document.getElementById('itemName');
	itemName.value = currentItem.name;
	let calendarName = document.getElementById('calendarName');
	calendarName.setAttribute('placeholder', parentCalendar);
	let itemDescription = document.getElementById('itemDescription');
	itemDescription.value = currentItem.description;
	let itemType = document.getElementById('itemType');
	if(currentItem.item_type === 1) {
		itemType.value = 'Action Item';
		setUpdateForm();
		let itemStatus = document.getElementById('itemStatus');
		if(currentItem.item_status === 1) {
			itemStatus.value = 'Not Started';
		} else if(currentItem.item_status === 2) {
			itemStatus.value = 'In Progress';
		} else if (currentItem.item_status === 3) {
			itemStatus.value = 'Completed';
		}
		let itemDueDate = document.getElementById('itemDueDate');
		itemDueDate.value = currentItem.start_time.slice(0, 16);
	} else {
		itemType.value = 'Event';
		setUpdateForm();
		let itemStartTime = document.getElementById('startTime');
		itemStartTime.value = currentItem.start_time.slice(0, 16);
		let itemEndTime = document.getElementById('endTime');
		itemEndTime.value = currentItem.end_time.slice(0, 16);
	}
	let itemLinks = document.getElementById('itemLinks');
	itemLinks.value = currentItem.related_links;
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

function switchToDoLocation(toDo) {
	console.log(toDo);
	/*let itemNum = toDo.id;
    console.log(toDo);
    let divForToDo = document.getElementById('toDo'+itemNum);
    divForToDo.remove();
    console.log(divForToDo);
    if(toDo.checked === true) {
    }*/
}

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

async function setNewToDo() {
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
	fetch('/api/todos/'+userInfo.id, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({content: newToDo.value, userId: userInfo.id, archived: false})
	});
	$('#addToDoItem').modal('hide');
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
window.addEventListener('load', () => setUpCalendar(currentMonth, currentYear));
window.addEventListener('load', () => setUpDayCard(currentDay.getDate(), currentMonth+1, currentYear));
window.addEventListener('load', setUpCalendarSelection);
window.addEventListener('load', setUpdateForm);

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

let userInfo = {'id': 0, 'username': 'LifeOnTrack', 'password': 'password'}; //placeholder
console.log(userInfo);

let saveItemChanges = document.getElementById('saveItemChanges');
let deleteItemBtn = document.getElementById('deleteItemBtn');

let tempId = 0;

saveItemChanges.addEventListener('click', () => updateItemChanges(tempId));
deleteItemBtn.addEventListener('click', () => deleteItem(tempId));

async function updateItemChanges(itemId) {
    let personalCalId = window.localStorage.getItem('personalCalId');
	let updatedItem = {name: null, type: null, start: null, end: null, description: null, status: null, calendar_id: personalCalId, related_links: null};
	updatedItem.name = document.getElementById('itemName').value;
	updatedItem.description = document.getElementById('itemDescription').value;
	let itemType = document.getElementById('itemType');
	if(itemType.value === 'Action Item') {
		updatedItem.type = 1;
		let itemStatus = document.getElementById('itemStatus');
		if(itemStatus.value === 'Not Started') {
			updatedItem.status = 1;
		} else if(itemStatus.value === 'In Progress') {
			updatedItem.status = 2;
		} else if (itemStatus.value === 'Completed') {
			updatedItem.status = 3;
		}
		updatedItem.start = document.getElementById('itemDueDate').value;
	} else {
		updatedItem.type = 2;
		updatedItem.start = document.getElementById('startTime').value;
		updatedItem.end = document.getElementById('endTime').value;
	}
    updatedItem.related_links = document.getElementById('itemLinks').value;
    console.log(updatedItem);
	fetch('/api/items/'+personalCalId+'/'+itemId, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(updatedItem)
    });
    searchForCalendarItems();
    let dayInfo = JSON.parse(window.localStorage.getItem('dayCardInfo'));
    console.log(dayInfo);
    setUpDayCard(dayInfo.day, dayInfo.month, dayInfo.year);
    $('#itemEditCenter').modal('hide');
    //setUpDayCard();
}

async function deleteItem(itemId) {
    let personalCalId = window.localStorage.getItem('personalCalId');
    fetch('/api/items/'+personalCalId+'/'+itemId, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		//body: JSON.stringify(updatedItem)
    });
    searchForCalendarItems();
    let dayInfo = JSON.parse(window.localStorage.getItem('dayCardInfo'));
    console.log(dayInfo);
    setUpDayCard(dayInfo.day, dayInfo.month, dayInfo.year);
    $('#itemEditCenter').modal('hide');
} 

async function loadPersonalCalendar() {
	const response = await fetch('/api/calendars/'+userInfo.id);
	if (!response.ok) {
		console.log(response.error);
		return;
	}
    let calendarData = await response.json();
	for(let i = 0; i < calendarData.length; i++) {
		if(calendarData[i].owner_id === userInfo.id && calendarData[i].personal === 1) {
			window.localStorage.setItem('personalCalId', JSON.stringify(calendarData[i].id));
		}
    }
}

async function searchForCalendarItems() {
	let personalCalId = window.localStorage.getItem('personalCalId');
	const response = await fetch('/api/items/'+personalCalId);
	if(!response.ok) {
		console.log(response.error);
		return;
	}
    let itemData = await response.json();
    console.log(itemData);
    return itemData;
    //window.localStorage.setItem('personalCalItems', JSON.stringify(itemData));
    //console.log('items is ' + JSON.stringify(window.localStorage.getItem('personalCalItems')));
}

async function populateToDoList() {
	const response = await fetch('/api/todos/'+userInfo.id);
	if(!response.ok) {
		console.log(response.error);
		return;
	}
    let toDoData = await response.json();
	buildCurrentToDos(toDoData);
	buildArchivedToDos(toDoData);
}

function buildCurrentToDos(toDoData) {
	let toDoItems = document.getElementById('toDoItems');
	toDoItems.innerHTML = '';
	for(let i = 0; i < toDoData.length; i++) {
		if(toDoData[i].archived === 0) {
			let newToDoDiv = document.createElement('div');
			newToDoDiv.classList.add('list-group-item', 'list-group-item-action');
			let newToDoFormCheck = document.createElement('div');
			newToDoFormCheck.classList.add('form-check');
			let newToDoLabel = document.createElement('label');
			newToDoLabel.classList.add('form-check-label');
			let newToDoInput = document.createElement('input');
			newToDoInput.classList.add('checkbox', 'to-do-item');
			newToDoInput.setAttribute('type', 'checkbox');
			let newInputHelper = document.createElement('i');
			newInputHelper.classList.add('input-helper');
			newToDoLabel.appendChild(newToDoInput);
			newToDoLabel.innerHTML += ' ' + toDoData[i].content;
			newToDoLabel.appendChild(newInputHelper);
			newToDoFormCheck.appendChild(newToDoLabel);
			newToDoDiv.appendChild(newToDoFormCheck);
			toDoItems.appendChild(newToDoDiv);
		}
	}
}

function buildArchivedToDos(toDoData) {
	let archivedToDos = document.getElementById('archivedToDos');
	archivedToDos.innerHTML = '';
	for(let i = 0; i < toDoData.length; i++) {
		if(toDoData[i].archived === 1) {
			let newToDoDiv = document.createElement('div');
			newToDoDiv.classList.add('list-group-item');
			let newToDoFormCheck = document.createElement('div');
			newToDoFormCheck.classList.add('form-check');
			let newToDoLabel = document.createElement('label');
			newToDoLabel.classList.add('form-check-label', 'item-checked', 'text-muted');
			let newToDoInput = document.createElement('input');
			newToDoInput.classList.add('checkbox', 'to-do-item');
			newToDoInput.setAttribute('type', 'checkbox');
			newToDoInput.setAttribute('checked', true);
			let newInputHelper = document.createElement('i');
			newInputHelper.classList.add('input-helper');
			newToDoLabel.appendChild(newToDoInput);
			newToDoLabel.innerHTML += ' ' + toDoData[i].content;
			newToDoLabel.appendChild(newInputHelper);
			newToDoFormCheck.appendChild(newToDoLabel);
			newToDoDiv.appendChild(newToDoFormCheck);
			archivedToDos.appendChild(newToDoDiv);
		}
	}
}

/**
 * This function loads the notification bell with the correct number
 * of notifications.
 * It is currently hard coded to be set to 1, as the GET response does
 * not yet hold the information we need it to.
 */
async function loadNotificationBell(){
	const user_id = userInfo.id;
	const GNotifs = await fetch(`/api/users/${user_id}/notifications`);
	if(!GNotifs.ok){
		console.log('Unable to load notifications');
		return;
	}
	//document.getElementById('num-Notifications').value = numNotifs;
	//temporarily hard coded
	document.getElementById('num-Notifications').innerHTML = 1;
}

window.addEventListener('load', loadPersonalCalendar);
window.addEventListener('load', searchForCalendarItems);
window.addEventListener('load', populateToDoList);
window.addEventListener('load', loadNotificationBell());
window.localStorage.setItem('dayCardInfo', JSON.stringify({'day': currentDay.getDate(), 'month': currentMonth, 'year': currentYear}));