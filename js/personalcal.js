'use strict';

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

function setupCalendar(month, year) {
    let firstDay = (new Date(year, month)).getDay();
    let calendar = document.getElementById('calendarBody');
    ;
    currentMonthAndYear.innerHTML += ' ' + months[month] + ' ' + year;
    
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

function daysInMonth(month, year) {
    return (32 - new Date(month, year, 32).getDate());
}

function setUpDayCard() {
    let dayViewTitle = document.getElementById('dayViewTitle');
    let today = currentDay.getDate();
    dayViewTitle.innerHTML += ' ' + months[currentMonth] + ' ' + today + ' ' + currentYear;
}

let currentDay = new Date();
let currentMonth = currentDay.getMonth();
let currentYear = currentDay.getFullYear();
let lastDay = 0;

let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

setupCalendar(currentMonth, currentYear);
setUpDayCard();