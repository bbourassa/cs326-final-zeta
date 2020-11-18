'use strict';
/* eslint-env jquery */ //this tag is needed so that the $in the modal
//calls don't throw an error
const user_id = 0; //PLACEHOLDER
// const user_id  =0;
window.addEventListener('load', loadAll(user_id));

function loadAll(userId){
	loadCalendars(userId);
	loadSettingListeners();
	loadNotifications();
	// console.log()

}
document.getElementById('logoutBtn').addEventListener('click', ()=>{
	fetch('/logout');
});

/**
 * Loads the event listers for each setting button
 */
function loadSettingListeners(){

	//  the header checkbox will cause all other check oxes to check/uncheck
	document.getElementById('checkAll').addEventListener('change', ()=> {
		let rows = document.getElementById('eventTable').childNodes;
		for(let i =0; i<rows.length; i++){
			let checkbox = document.getElementById('eventTable').childNodes[i].childNodes[0].childNodes[0];
			checkbox.checked = checkbox.checked ? false:true;
		}

	});

	//for each selected item, add it to personal cal
	document.getElementById('setAddItems').addEventListener('click', async ()=>{
        //get an array of every itemID that has been checked
        const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
        const checkedItemIds = getCheckedItems();
        let personalCalId = 0;
        //console.log('checkedItemIds', checkedItemIds);
        if(checkedItemIds !== null) {
            const response = await fetch('/api/cals/'+user_id+'/all');
            if (!response.ok) {
                console.log(response.error);
                return;
            }
            let userCalendars = await response.json();
            for(let i = 0; i < userCalendars.length; i++) {
                if(userCalendars[i].personal === 1) {
                    //console.log('userCalendars', userCalendars[i]);
                    personalCalId = userCalendars[i].id;
                }
            }
            for(let i = 0; i < checkedItemIds.length; i++) {
                //console.log(checkedItemIds[i]);
                const itemResponse = await fetch('/api/items/'+cal_id+'/'+checkedItemIds[i]);
                if (!itemResponse.ok) {
                    console.log(itemResponse.error);
                    return;
                }
                let prepItem = await itemResponse.json();
                let addThisItem = prepItem[0];
                let thisPersonalItem = {name: addThisItem.name, itemType: addThisItem.item_type, startTime: addThisItem.start_time, endTime: addThisItem.end_time, description: addThisItem.description, itemStatus: addThisItem.item_status, relatedLinks: addThisItem.related_links, isParent: false, oldId: addThisItem.id};
                console.log(thisPersonalItem);
                addToPersonal(personalCalId, thisPersonalItem);
            }
        }
        
		/*for(let i=0; i<checkedItemIds.length; i++){
			//for each checked item, get the item id
			let itemID=  checkedItemIds[i];

			//pull that item into your cal
			const response = await fetch('/api/users/'+user_id+'/calendar/pull/', {
				method: 'PUT',
				headers:{
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({id:itemID})
			});

			if(!response.ok){
				alert('Error: Unable to add specified item(s) to your personal calendar.');
				return;
			}

		}*/
	});

	//for every action in the calendar, add it to personal
	document.getElementById('setAddAllActions').addEventListener('click', async ()=> {
        console.log('hit add all actions');
		const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
		const response = await fetch('/api/items/'+cal_id);
		if(!response.ok){
			alert('Unable to add selected item(s) to your calendar at this time.');
			return;
        }
        let allCalendarItems = await response.json();
        let personalCalId = 0;
        const calResponse = await fetch('/api/cals/'+user_id+'/all');
                if (!calResponse.ok) {
                    console.log(calResponse.error);
                    return;
                }
                let userCalendars = await calResponse.json();
                for(let i = 0; i < userCalendars.length; i++) {
                    if(userCalendars[i].personal === 1) {
                        //console.log('userCalendars', userCalendars[i]);
                        personalCalId = userCalendars[i].id;
                    }
                }
        for(let i = 0; i < allCalendarItems.length; i++) {
            if (allCalendarItems[i].item_type === 1) {
                const itemResponse = await fetch('/api/items/'+cal_id+'/'+allCalendarItems[i].id);
                if (!itemResponse.ok) {
                    console.log(itemResponse.error);
                    return;
                }
                let prepItem = await itemResponse.json();
                let addThisItem = prepItem[0];
                let thisPersonalItem = {name: addThisItem.name, itemType: addThisItem.item_type, startTime: addThisItem.start_time, endTime: addThisItem.end_time, description: addThisItem.description, itemStatus: addThisItem.item_status, relatedLinks: addThisItem.related_links, isParent: false, oldId: addThisItem.id};
                console.log(thisPersonalItem);
                addToPersonal(personalCalId, thisPersonalItem);
            }
        }
	});

	//for every event in cal, add it to personal
	document.getElementById('setAddAllEvents').addEventListener('click', async()=>{
        console.log('hit add all events');
		const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
		const response = await fetch('/api/items/'+cal_id);
		if(!response.ok){
			alert('Unable to add selected item(s) to your calendar at this time.');
			return;
        }
        let allCalendarItems = await response.json();
        let personalCalId = 0;
        const calResponse = await fetch('/api/cals/'+user_id+'/all');
                if (!calResponse.ok) {
                    console.log(calResponse.error);
                    return;
                }
                let userCalendars = await calResponse.json();
                for(let i = 0; i < userCalendars.length; i++) {
                    if(userCalendars[i].personal === 1) {
                        //console.log('userCalendars', userCalendars[i]);
                        personalCalId = userCalendars[i].id;
                    }
                }
        for(let i = 0; i < allCalendarItems.length; i++) {
            if (allCalendarItems[i].item_type === 2) {
                const itemResponse = await fetch('/api/items/'+cal_id+'/'+allCalendarItems[i].id);
                if (!itemResponse.ok) {
                    console.log(itemResponse.error);
                    return;
                }
                let prepItem = await itemResponse.json();
                let addThisItem = prepItem[0];
                let thisPersonalItem = {name: addThisItem.name, itemType: addThisItem.item_type, startTime: addThisItem.start_time, endTime: addThisItem.end_time, description: addThisItem.description, itemStatus: addThisItem.item_status, relatedLinks: addThisItem.related_links, isParent: false, oldId: addThisItem.id};
                console.log(thisPersonalItem);
                addToPersonal(personalCalId, thisPersonalItem);
            }
        }

	});

	//for each selected item, find corresponding in personal, updare
	document.getElementById('setUpdateSelected').addEventListener('click',async ()=>{
		const checkedItemIds = getCheckedItems();
		// @Milestone3 ADD POPUP
		for(let i=0; i<checkedItemIds.length; i++){
			//Send in the item ids to be pulled across. If any don't resolve, stop trying
			const response = await  fetch('/api/users/'+user_id+'/calendar/pull', {
				method: 'PUT',
				headers: {'Content-type':'application/json'},
				body: JSON.stringify({item_id:checkedItemIds[i]})
			});
			if(!response.ok){
				alert('Unable to update item(s) at this time.');
				//don't then try to do the rest!
				return;
			}

		}
	});


	//make a new event
	document.getElementById('setCreate').addEventListener('click', ()=> {
        $('#itemAdditionCenter').modal('show');
        let currentCalendar = document.getElementById('parentCal');
        let calName = document.getElementById('cal-name').textContent;
        console.log('currentCalendar', currentCalendar, 'calName', calName);
        currentCalendar.placeholder = calName;
        console.log(currentCalendar.placeholder);
        setTimeFields();
        let typeSet = document.getElementById('newItemType');
        typeSet.addEventListener('change', setTimeFields);
		//DO NOT call LoadModal; that requires an existing item
		//instead, set document.getElementById('modalBodyItemId').setAttribute('item-id', to a new value
		//let newID = generateNewId('item');
		/*document.getElementById('modalBodyItemId').setAttribute('item-id', newID);
		let svChanges = document.getElementById('saveChanges');


		//save button should load the commit screen and close the edit modal
		svChanges.addEventListener('click', () =>{
			$('#itemEditCenter').modal('hide');
			commitChanges();
			//make sure the commit message input is visible
			document.getElementById('commitMessage').removeAttribute('hidden');
			document.getElementById('btnsForEdits').removeAttribute('hidden');


		});*/
		//now you are in the commit modal


	});

	//delete selected items
	document.getElementById('setDeleteItem').addEventListener('click', async()=>{
        const checkedItemIds = getCheckedItems();
        //console.log('checkedItemIds', checkedItemIds);
		//assumes the appropriate cal is the one you are on currently
        const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
        for(let i = 0; i < checkedItemIds.length; i++) {
            fetch('/api/items/'+cal_id+'/'+checkedItemIds[i], {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        }
        loadTable(cal_id);
		/*if(document.getElementById('itemList')){
			document.getElementById('itemsToDelete').removeChild(document.getElementById('itemList'));
		}

		let itemList = document.createElement('ul');

		for(let i=0; i<checkedItemIds.length; i++){
			const item_id = checkedItemIds[i];

			//get item
			//print item name as a list item
			//        const response = await db.any('SELECT * FROM gameScores ORDER BY score desc LIMIT 10;').catch((err) => { console.error(err); });
			let itemName = document.createElement('li');
			itemName.innerHTML= item_id;
			itemName.classList.add('list-group-item', 'list-group-item-action');

			itemList.appendChild(itemName);
		}
		//add the items to the modal
		document.getElementById('itemsToDelete').appendChild(itemList);
		$('#deleteWarning').modal('show');

		//delete the items
		document.getElementById('confirmDeleteBtn').addEventListener('click', async ()=>{
			for(let i=0; i<checkedItemIds.length; i++){
				const item_id = checkedItemIds[i];
				try{
					await fetch('/api/items/'+cal_id+'/'+item_id, {
						method: 'DELETE'
					});
				} catch(e){
					console.log('Unable to delete selected item(s) at this time.');
					return;
				}
			}
		});*/

	});

	//Delete current calendar
	document.getElementById('setDeleteCal').addEventListener('click', async ()=>{
		//assumes the appropriate cal is the one you are on currently
		//@Milestone3 make a confirmation screen
        console.log('hit delete cal');
        const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
        console.log('calId', cal_id);
        //FIRST DELETE SUBSCRITPIONS
        const response = await fetch('/api/subscriptionlist/'+cal_id);
        if (!response.ok) {
            console.log(response.error);
            return;
        }
        let listSubscriptions = await response.json();
        console.log('listSubscriptions', listSubscriptions);
        for(let i = 0; i < listSubscriptions.length; i++) {
            fetch('/api/subscriptions/'+listSubscriptions[i].id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        }
        //SECOND DELETE ITEMS
        const itemResponse = await fetch('/api/items/'+cal_id);
        if (!itemResponse.ok) {
            console.log(itemResponse.error);
            return;
        }
        let listItems = await itemResponse.json();
        for(let i = 0; i < listItems.length; i++) {
            fetch('/api/items/'+cal_id+'/'+listItems[i].id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        }
        //THIRD DELETE CALENDAR
        fetch('/api/cals/'+cal_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        loadAll(userId);
		/*alert('Deleting calendars is permanant. Are you sure that you want to delete this calendar?');

		try{
			await fetch('/api/cals/'+cal_id, {
				method: 'DELETE'
			});
		} catch(e){
			console.log('Unable to delete calendar at this time.');
			return;
		}*/


	});

	//if there is already a share code, make it visible, set toggle to checked
	if(document.getElementById('shareCode')){
		document.getElementById('shareCode').setAttribute('hidden', true);
	} else {
		document.getElementById('publicSwitch').setAttribute('checked', false);
	}
	document.getElementById('publicSwitch').addEventListener('change', async ()=>{
		//if you just turned it off, hide the share code
		if(!document.getElementById('publicSwitch').checked){
			document.getElementById('shareCode').setAttribute('hidden', true);

		}
		//otherwise, make and display it
		else {
			if(document.getElementById('shareCode')){
				document.getElementById('shareCode').removeAttribute('hidden');
			} else {
				let shareCode;

				//if you aleady have a code html element, display
				if(document.getElementById(shareCode)){
					document.getElementById(shareCode).removeAttribute('hidden');

				}else {
					//therwise, check for an existing code
					//share code = mapping of ca_id, constant
					shareCode = generateNewId('shareCode');

					//make a list element for the code to live in
					let code = document.createElement('li');
					code.innerText = 'Your sharable code is:  ' + shareCode;
					code.classList.add('list-group-item', 'list-group-item-action');
					code.setAttribute('id', 'shareCode');
					document.getElementById('adminSettings').appendChild(code);
				}
			}
		}
	});

}


/**
 * Generates a new random set of digits, ensures that it does not already exist
 * @param {String} field to generate an id for
 */
function generateNewId(field){
	const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));

	let id = 0;
	//Calendar id's should have 5 digits, for now
	if(field === 'cal'){
		// id = Math.floor(Math.random() * (99999 - 10000) + 10000);
		let unique = false;
		while(!unique){
			try {
				id = Math.floor(Math.random() * (99999 - 10000) + 10000);
				fetch('/api/items/'+id);
			} catch(e){
				unique = false;
			}
			unique = true;

		}

	} //item id's should have 7 digits, for now
	else if(field === 'item'){
		let unique = false;
		while(!unique){
			try {
				id = Math.floor(Math.random() * (9999999 - 1000000) + 1000000);
				fetch('/api/items/'+id);
			} catch(e){
				unique = false;
			}
			unique = true;
		}
	} //insecure mapping of calendar id to a string
	else if(field === 'shareCode'){
		let letterMap = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9, 'j': 0};
		let mappedString ='';
		// console.log(cal_id, JSON.stringify(cal_id).length);
		for(let i=0; i<JSON.stringify(cal_id).length; i++){
			let digit = parseInt(JSON.stringify(cal_id)[i]);
			let enLetter = Object.keys(letterMap).find(key => letterMap[key] === digit);
			mappedString = mappedString+ enLetter;
		}

		id=mappedString;
	}
	return id;
}

/**
 * Returns an array of every item id that has been checked
 */
function getCheckedItems(){
	let checkedBoxes = [];
	let allBoxes = document.getElementsByClassName('itemCheck');
	for (let i=0; i<allBoxes.length; i++){
		if(allBoxes[i].checked){
			const itemID = parseInt(allBoxes[i].parentElement.parentElement.getAttribute('itemid'));

			checkedBoxes.push(itemID);
		}
	}
	return checkedBoxes;
}

/**
 * This will load the notification bell
 * It does not currently work due to API issues
 * For now, it just makes an empty GET request
 * Currently hardcoded with an example
 * @Milestone3
 */
async function loadNotifications(){
	//clear out notifications
	while (document.getElementById('allNotes').childNodes.length>0){
		document.getElementById('allNotes').removeChild(document.getElementById('allNotes').childNodes[0]);
	}
	const GNotifs = await fetch('/api/users/'+user_id+'/notifications');
	if(!GNotifs.ok){
		console.log('Unable to load notifications');
		return;
	}
	//document.getElementById('num-Notifications').value = numNotifs;
	//temporarily hard coded
	document.getElementById('num-Notifications').innerHTML = 1;
	let noti = document.createElement('button');
	noti.innerHTML='Calendar CS 221 updated: This is an example notification';
	noti.classList.add('subscribed', 'btn', 'btn-light');
	noti.addEventListener('click', () =>{
		while( document.getElementById('eventTable').childNodes.length>0){
			document.getElementById('eventTable').removeChild(document.getElementById('eventTable').childNodes[0]);
		}
		//currently hard coded
		loadTable(1); // placeholder
		//should send you to the right cal items);
		noti.parentElement.removeChild(noti);
		//if that was the last notification, hide the notification card
		if(document.getElementById('allNotes').childNodes.length===0){
			document.getElementById('notificationCenter').setAttribute('hidden', true);
			//remove bell notification value
			document.getElementById('num-Notifications').innerHTML ='';

		}

	});
	document.getElementById('allNotes').appendChild(noti);

	//Clear button removes all notifications without redirecting
	document.getElementById('clearNoteCenter').addEventListener('click', ()=>{
		while (document.getElementById('allNotes').childNodes.length>0){
			document.getElementById('allNotes').removeChild(document.getElementById('allNotes').childNodes[0]);

		}
		document.getElementById('num-Notifications').innerHTML ='';
		document.getElementById('notificationCenter').setAttribute('hidden', true);

	});

	//if you have no notifications, hide card
	if(document.getElementById('allNotes').childNodes.length>0){
		document.getElementById('notificationCenter').removeAttribute('hidden');
	}
	else{
		document.getElementById('notificationCenter').setAttribute('hidden', true);

	}

	/*
	//Get all of the notifications, use the number to set the notification bell
	let notifs = GNotifs.json();
	let numNotifs = notifs.length();
	document.getElementById('num-Notifications').value = numNotifs;

	//Make a list of notifications for the dropdown
	let notList = document.createElement('ul');
	for(let i=0; i<numNotifs; i++){
		let noti = document.createElement('button');
		noti.innerHTML=GNotifs[i].cal_id;
		noti.classList.add('subscribed', 'btn', 'btn-light');
		noti.addEventListener('click', () =>{
			while( document.getElementById('eventTable').childNodes.length>0){
				document.getElementById('eventTable').removeChild(document.getElementById('eventTable').childNodes[0]);
			}
			loadTable(=GNotifs[i].cal_id);
		});
		document.getElementById('allNotes').appendChild(noti);
	}

	*/


}

/**
 * Load all of the user's subscription calendars
 * @param {int} userId
 */
async function loadCalendars(){
	//load all the calendars you have a subscription relationship with
	//make the response into the cal list
	//console.log('load fetch');
	//this endpoint actually just gets every calendar the user owns
	const response = await fetch('/api/subscriptions/'+user_id);
	if(!response.ok){
		alert('Unable to load your subscriptions');
		return;
	}
    let cals = await response.json();
	const subs = document.getElementById('subscribed-cals');

	//make the button for each calendar, adding admin button where applicalbe
	//if you click that clanedar, it will load into the item table
	cals.forEach((cal) =>{
		const admin = (cal.owner_id === user_id);
        console.log('admin', admin);
		//makke the button for the calendar
		let aCal = document.createElement('button');
		aCal.innerHTML=cal.name;
		aCal.classList.add('subscribed', 'btn', 'btn-light');
		aCal.setAttribute('cal_id', cal.id);
		//add an event listen to the button to fill in the table of eventsf
		aCal.addEventListener('click', () =>{
			while( document.getElementById('eventTable').childNodes.length>0){
				document.getElementById('eventTable').removeChild(document.getElementById('eventTable').childNodes[0]);
            }
            console.log('hit load table');
			loadTable(cal.id);
		});
		if(admin){
			let adminIndic = document.createElement('btn'); //btn btn-outline-secondary btn-sm float-right
			adminIndic.classList.add('btn', 'btn-outline-secondary', 'btn-sm', 'float-right', 'disabled');
			adminIndic.innerText = 'ADMIN';
			aCal.appendChild(adminIndic);
		}

		subs.appendChild(aCal);

	});
	// If you have been redirected because you have a new subscription,
	// it should redirect you to that events page
	//this function assumes that the new subscription will be at the end
	//of your list of subscriptions
	if(window.localStorage.getItem('newSubscription')){
		loadTable(subs.childNodes[subs.childElementCount].getAttribute('cal_id'));
		window.localStorage.removeItem('newSubscription');
	}

	loadTable(subs.childNodes[1].getAttribute('cal_id'));

}

/**
 * Gets and renders all events and activities in a given calendar
 * @param {int} calId the id number for the calendar
 */
async function loadTable(calId) {
    document.getElementById('eventTable').innerHTML = '';
	const response = await fetch('/api/cals/'+calId+'/');
    let calData = await response.json();
	calData = calData[0];
    console.log('calData', calData);
	// console.log(calData);
	//make this work with r
	const admin = (calData.owner_id === user_id);


	document.getElementById('cal-name').innerHTML = calData.name;
	document.getElementById('cal-name').setAttribute('calID', calId);

	//Add or remove the edit column based on whether you are an admin
	if(!admin){
		if(document.getElementById('table-edit')){
			document.getElementById('table-head').removeChild(document.getElementById('table-edit'));
		}
	}
	//if you are admin, and then edit isn't already there, add it
	else if(!document.getElementById('table-edit')){
		let edit =document.createElement('th');
		edit.setAttribute('id','table-edit');
		edit.innerHTML = 'EDIT';
		edit.classList.add('text-uppercase', 'font-weight-bold');
		document.getElementById('table-head').appendChild(edit);
	}

	//if you are an admin and admin settings are not vsible
	if(admin){
		document.getElementById('adminSettings').hidden = false;
	} else{
		document.getElementById('adminSettings').hidden =true;
	}

	//load the items associated with this calendar
	const items = await fetch('/api/items/'+calId);
	if(!items.ok){
		console.log(items.error);
		return;
	}
	let calItems = await items.json();
	console.log(calItems);

	//load each item in this calendar
	calItems.forEach((item) => {
		console.log(item);
		let anItem = document.createElement('tr');

		anItem.setAttribute('itemID', item.id);

		let check = document.createElement('td');
		let box = document.createElement('input');
		box.type ='checkbox';
		box.classList.add('itemCheck');
		// box.setAttribute('name', 'itemCheck');
		check.appendChild(box);
		anItem.appendChild(check);

		//load name
		let name= document.createElement('td');
		name.innerHTML = item.name;
		anItem.appendChild(name);

		//load duedate/start date
        let date = document.createElement('td');
        console.log('hit start time');
		if(item.start_time !== ''){
            let time = new Date(item.start_time).toDateString();
            console.log('time', time);
			date.innerHTML = time;
        } 
        /*else if(item.end_time !== ''){
			date.innerHTML = item.end_time;
		}*/
		anItem.appendChild(date);

		//load type of Event
        let type = document.createElement('td');
        if(item.item_type === 1) {
            type.innerHTML = 'Action Item';
        } else {
            type.innerHTML = 'Event';
        } 
		//type.innerHTML = item.item_type;
		anItem.appendChild(type);

		//creates status indicator
		let status = document.createElement('td');
		let prog = document.createElement('button');

        prog.classList.add('btn','btn-sm');
        prog.disabled = true;
		if(item.item_status!== null ){
			let low =  (item.item_status);
			if(low === 2){
                prog.classList.add('btn-warning');
                prog.innerHTML = 'In Progress';
			} else if (low === 1){
                prog.classList.add('btn-danger');
                prog.innerHTML = 'Not Started';
			} else if(low === 3){
                prog.classList.add('btn-success');
                prog.innerHTML = 'Completed';
			}
		}
		status.appendChild(prog);
		anItem.appendChild(status);


		//creates detail
		let info = document.createElement('td');
		let infoBtn = document.createElement ('button');
		infoBtn.classList.add('btn', 'btn-sm', 'btn-outline-info');
		infoBtn.innerText = 'Details';
		infoBtn.setAttribute('data-toggle', 'modal');
		infoBtn.setAttribute('data-target', '#editConfirmation');
		infoBtn.addEventListener('click', () =>{
            //pop up modal with any details, non-editable
            console.log('cal-name', document.getElementById('cal-name').value);
			fillModalInfo(item, document.getElementById('cal-name').textContent);
			loadCommit();
			document.getElementById('btnsForEdits').setAttribute('hidden', true);
			document.getElementById('commitMessage').setAttribute('hidden', true);
			document.getElementById('confEditHeader').innerText = 'Details';
			document.getElementById('reviewMessage').setAttribute('hidden', true);


		});
		info.appendChild(infoBtn);
		anItem.appendChild(info);


		if(admin){
			//make cell and button
			let editable = document.createElement('td');
			let editBtn = document.createElement('button');
			//button activates modal
			editBtn.setAttribute('data-toggle', 'modal');
			editBtn.setAttribute('data-target', '#itemEditCenter');
			editBtn.setAttribute('type', 'button');
			editBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
			editBtn.innerHTML = 'Edit';
            console.log('cal-name', document.getElementById('cal-name').textContent);
			editBtn.addEventListener('click', ()=> {
				fillModalInfo(item, document.getElementById('cal-name').textContent);
			});

			editable.appendChild(editBtn);
			anItem.appendChild(editable);

		}

		document.getElementById('eventTable').appendChild(anItem);

	});

}

async function fillModalInfo(item, parentCalendar) {
    //tempId = itemId;
    console.log('itemId', item);
    //let personalCalId = window.localStorage.getItem('personalCalId');
	const response = await fetch('/api/items/'+item.calendar_id+'/'+item.id);
	if (!response.ok) {
		console.log(response.error);
		return;
	}
    let itemData = await response.json();
    let currentItem = itemData[0];
    console.log('currentItem', currentItem);
	let itemName = document.getElementById('itemName');
    itemName.value = currentItem.name;
    let editHeader = document.getElementById('editItemTitle');
    editHeader.innerHTML = 'Edit ' + currentItem.name;
    let calendarName = document.getElementById('calendarName');
    console.log('parentCalendar', parentCalendar);
	calendarName.setAttribute('placeholder', parentCalendar);
	let itemDescription = document.getElementById('itemDescription');
	itemDescription.value = currentItem.description;
    let itemType = document.getElementById('itemType');
    itemType.addEventListener('change', () => setUpdateForm(item));
	if(currentItem.item_type === 1) {
		itemType.value = 'Action Item';
		setUpdateForm(currentItem);
		let itemStatus = document.getElementById('itemStatus');
		if(currentItem.item_status === 1) {
			itemStatus.value = 'Not Started';
		} else if(currentItem.item_status === 2) {
			itemStatus.value = 'In Progress';
		} else if (currentItem.item_status === 3) {
			itemStatus.value = 'Completed';
		}
        let itemDueDate = document.getElementById('itemDueDate');
        console.log('start time', currentItem.start_time);
		itemDueDate.value = currentItem.start_time.slice(0, 16);
	} else {
		itemType.value = 'Event';
		setUpdateForm(currentItem);
		let itemStartTime = document.getElementById('startTime');
		itemStartTime.value = currentItem.start_time.slice(0, 16);
		let itemEndTime = document.getElementById('endTime');
		itemEndTime.value = currentItem.end_time.slice(0, 16);
	}
	let itemLinks = document.getElementById('itemLinks');
	itemLinks.value = currentItem.related_links;
}

/**
 * Fills the Edit center modal with the appropriate information

 * @param {Item object} item
 */
/*
function loadModal(item){
	//set it to confirmation card values
	document.getElementById('confEditHeader').innerText = 'Confirm Edits';
	document.getElementById('reviewMessage').removeAttribute('hidden');

	//make sure there are not extranous values by clearing modal
	clearModals();
	//@Milestone3 Check for null values?
	document.getElementById('modalBodyItemId').setAttribute('item-id', item.id);
	document.getElementById('itemName').value = item.name;
	document.getElementById('statusModal').value = item.item_status;
	document.getElementById('itemType').value = item.item_type;
	document.getElementById('currCal').value = document.getElementById('cal-name').innerHTML;


	//update the date within the form
	setUpdateForm(item);
	//check for details and links to prefill
	if(item.details !== undefined){
		document.getElementById('detailsText').value = item.details;
	}
	if(item.links !== undefined){
		document.getElementById('itemLinks').value = item.links;
	}
	//listener to save
	let svChanges = document.getElementById('saveChanges');

	//save button should load the commit screen and close the edit modal
	svChanges.addEventListener('click', () =>{
		$('#itemEditCenter').modal('hide');
		commitChanges();
		//make sure the commit message input is visible
		document.getElementById('commitMessage').removeAttribute('hidden');
	});

	//event listener to toggle between event and action inputs
	let toggleType = document.getElementById('itemType');
	toggleType.addEventListener('change', () =>{setUpdateForm(item);});


}*/

/**
 * Gets all of the information currently in the edit center,
 * formats it into item JSON, returns
 * to be sent as the body of a request.
 */
function getInfo(){
	let listField = document.getElementsByClassName('modal-editable-area');
	let i, name, type, all_day, start, end, desc, status, cal, cal_title, rel_links;
	let itemInfo = {
		id: i,
		name: name,
		type: type,
		all_day: all_day,
		start: start,
		end: end,
		description: desc,
		status: status,
		calendar_id: cal,
		calendar_title: cal_title,
		related_links: rel_links,
	};
	//name should match the name of the current calendar
	name = document.getElementById('cal-name').childNodes[0].data;
	for(let i=0; i<listField.length; i++){
		if(listField[i].value !== ''){
			let category = listField[i].parentElement.textContent;
			if(category === 'Item Name:'){
				name = listField[i].value;
			}  else if(category === 'Item Description:'){
				desc = listField[i].value;
			} else if(category === 'Item Type:'){
				type = listField[i].value;
			} else if(category === 'Item Status:'){
				status = listField[i].value;
			} else if(category === 'Start Time:'){
				start = listField[i].value;
			} else if(category === 'End Time:'){
				end = listField[i].value;
			}else if(category === 'Related Links:'){
				rel_links = listField[i].value;
			}
			//each non-empty field will be added to the body
		}
	}
	return JSON.stringify(itemInfo);
}

/**
 * Function to switch between date settings in the edit modal
 */
function setUpdateForm(item) {
    console.log('item', item);
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
        document.getElementById('saveChanges').disabled = true;
	} else if (currentType.value === 'Event') {
		itemStatus.style.display = 'none';
		dueDateShow.style.display = 'none';
        startTimeShow.style.display = 'inline-block';
        endTimeShow.style.display = 'inline-block';
        document.getElementById('saveChanges').disabled = true;
	}
    console.log('currentType', item.item_type);
	/*if(item.item_type === 1) {
        console.log('hit');
        currentType.value = 'Action Item';
		itemStatus.style.display = 'inline-block';
		dueDateShow.style.display = 'inline-block';
		startTimeShow.style.display = 'none';
		endTimeShow.style.display = 'none';
		//when we decide whether we are storing duedate in start or end, do that one
		if(item.start_time !== undefined){
			document.getElementById('itemDueDate').value = item.start_time;
		} else if(item.end_time !== undefined){
			document.getElementById('itemDueDate').value = item.end_time;
		} else{
			document.getElementById('itemDueDate').value = '';
		}

	} else if (item.item_type === 2) {
        console.log('hit');
		itemStatus.style.display = 'none';
		dueDateShow.style.display = 'none';
		startTimeShow.style.display = 'inline-block';
		endTimeShow.style.display = 'inline-block';

		//if start time is not a defined value, the html value will
		//still be the value it was last set to; this clears it out
		if(item.start_time !== undefined){
			document.getElementById('startTime').value = item.start_time;
		} else{
			document.getElementById('startTime').value = '';
		}
		if(item.end_time !== undefined){
			document.getElementById('endTime').value = item.end_time;
		} else{
			document.getElementById('endTime').value ='';
		}
	}*/
}

/**
 * Load the information you are about to commit
 * This will reference the information that was just inserted into the
 * edit modal. The database has not been updated, so it has to reference the html
 */
function loadCommit(){

	//clear out any current list
	if(document.getElementById('listOfInfo')){
		document.getElementById('listOfInfo').parentElement.removeChild(document.getElementById('listOfInfo'));
	}

	//make it a list
	let changeList = document.createElement('div');
	changeList.classList.add('list-group');
	changeList.setAttribute('id', 'listOfInfo');

	let listField = document.getElementsByClassName('modal-editable-area');

	//for each field, make a new list item
	for(let i=0; i<listField.length; i++){
		if(listField[i].value !== ''){
			let li = document.createElement('li');
			li.classList.add('list-group-item');
			//the parent's text content is the category name
			let category = (listField[i].parentElement.textContent);
			//end it at the new line char. The select objects would otherwise
			//print every optionss
			category =category.substr(0, category.search('\n') );
			// For unknown reasons, MUST be textContent, not innerText or innerHTML
			li.textContent = category + ' ' + listField[i].value;
			changeList.appendChild(li);
		}
	}
	document.getElementById('editsToConfirm').appendChild(changeList);

}

/**
 * Closes editing modal and opens a new confirmation modal.
 */
async function commitChanges(){
	const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
	const cal_nam = document.getElementById('cal-name').childNodes[0].data;
	document.getElementById('btnsForEdits').removeAttribute('hidden');
	const item_id = document.getElementById('modalBodyItemId').getAttribute('item-id');

	//fill confirmation modal with information values from the edit modal
	loadCommit();
	//opens the confirmation modal
	$('#editConfirmation').modal('show');
	document.getElementById('confirmBtn').addEventListener('click', async ()=> {
		$('#editConfirmation').modal('hide');
		let bodyInfo = getInfo();
		let notMess = document.getElementById('message').value;
		let notification = JSON.stringify({id:user_id, cal_name: cal_nam, notification: notMess});
		//PUT will update or add an item; don't need to check first
		try{
			await fetch('/api/items/'+cal_id+'/'+item_id, {
				method: 'PUT',
				headers:{
					'Content-Type':'application/json'
				},
				body: bodyInfo
			});
			await fetch('/api/users/'+user_id+'/notifications', {
				method: 'POST',
				headers: {
					'Content-Type':'application/json'
				},
				body: notification
			});
		} catch(e){
			console.log(e);
			return;
		}
	});

}

// function newItem

function clearModals(){
	document.getElementById('modalBodyItemId').setAttribute('item-id', '');
	let editFields = document.getElementsByClassName('modal-editable-area');
	for(let i=0; i<editFields.length; i++){
		if(editFields[i].value !== ''){
			editFields[i].value= '';
		}
	}

}

function setTimeFields() {
    let currentType = document.getElementById('newItemType');
	let itemStatus = document.getElementById('showNewStatus');
	let dueDateShow = document.getElementById('showNewDueDate');
	let startTimeShow = document.getElementById('showNewStartTime');
	let endTimeShow = document.getElementById('showNewEndTime');
	if(currentType.value === 'Action Item') {
		itemStatus.style.display = 'inline-block';
		dueDateShow.style.display = 'inline-block';
		startTimeShow.style.display = 'none';
        endTimeShow.style.display = 'none';
        document.getElementById('createItemBtn').disabled = true;
	} else if (currentType.value === 'Event') {
		itemStatus.style.display = 'none';
		dueDateShow.style.display = 'none';
		startTimeShow.style.display = 'inline-block';
        endTimeShow.style.display = 'inline-block';
        document.getElementById('createItemBtn').disabled = true;
	}
}

let itemInputEditElements = document.getElementById('editForm').getElementsByTagName('input');

for(let item of itemInputEditElements) {
    if(item.id === 'itemName') {
        console.log('add keyup');
        item.addEventListener('keyup', checkRequiredFieldsForEdit);
    } else {
        item.addEventListener('change', checkRequiredFieldsForEdit);
    }
}

function checkRequiredFieldsForEdit() {
    console.log('hit check required');
    let itemNameVal = document.getElementById('itemName').value;
    let itemType = document.getElementById('itemType').value;
    console.log('itemNameVal', itemNameVal, 'itemType', itemType);
    if(itemType === 'Action Item') {
        console.log('hit action check');
        let dueDateVal = document.getElementById('itemDueDate').value;
        if(itemNameVal !== '' && dueDateVal !== '') {
            let saveItemChanges = document.getElementById('saveChanges');
            saveItemChanges.disabled = false;
        }
    } else {
        let startTimeVal = document.getElementById('startTime').value;
        let endTimeVal = document.getElementById('endTime').value;
        if(itemNameVal !== '') {
            if(startTimeVal !== '' && endTimeVal !== '') {
                let saveItemChanges = document.getElementById('saveChanges');
                saveItemChanges.disabled = false;
            }
        }
    }
}

let itemInputAddElements = document.getElementById('newItemForm').getElementsByTagName('input');

for(let item of itemInputAddElements) {
    if(item.id === 'newName') {
        console.log('add keyup');
        item.addEventListener('keyup', checkRequiredFieldsForAddition);
    } else {
        item.addEventListener('change', checkRequiredFieldsForAddition);
    }
}

function checkRequiredFieldsForAddition() {
    console.log('hit check required');
    let itemNameVal = document.getElementById('newName').value;
    let itemType = document.getElementById('newItemType').value;
    console.log('itemNameVal', itemNameVal, 'newItemType', itemType);
    if(itemType === 'Action Item') {
        console.log('hit action check');
        let dueDateVal = document.getElementById('newItemDueDate').value;
        if(itemNameVal !== '' && dueDateVal !== '') {
            let createItemChanges = document.getElementById('createItemBtn');
            createItemChanges.disabled = false;
        }
    } else {
        let startTimeVal = document.getElementById('newStartTime').value;
        let endTimeVal = document.getElementById('newEndTime').value;
        if(itemNameVal !== '') {
            if(startTimeVal !== '' && endTimeVal !== '') {
                let createItemChanges = document.getElementById('createItemBtn');
                createItemChanges.disabled = false;
            }
        }
    }
}

async function addNewItem() {
    const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
    console.log('cal id', cal_id);
    let newItemToAdd = {name: '', description: '', itemType: 0, itemStatus: 0, startTime: '', endTime: null, relatedLinks: '', isParent: true};
    newItemToAdd.name = document.getElementById('newName').value;
    newItemToAdd.description = document.getElementById('newDescription').value;
    if(document.getElementById('newItemType').value === 'Action Item') {
        newItemToAdd.itemType = 1;
        newItemToAdd.startTime = document.getElementById('newItemDueDate').value;
        let newStatus = document.getElementById('newItemStatus').value;
        if(newStatus === 'Not Started') {
            newItemToAdd.itemStatus = 1;
        } else if(newStatus === 'In Progress') {
            newItemToAdd.itemStatus = 2;
        } else if (newStatus === 'Completed') {
            newItemToAdd.itemStatus = 3;
        }
    } else {
        newItemToAdd.itemType = 2;
        newItemToAdd.startTime = document.getElementById('newStartTime').value;
        newItemToAdd.endTime = document.getElementById('newEndTime').value;
    }
    newItemToAdd.relatedLinks = document.getElementById('newItemLinks').value;
    console.log('newItemToAdd', newItemToAdd);
    fetch('/api/items/'+cal_id, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newItemToAdd)
    });
    loadTable(cal_id);
    $('#itemAdditionCenter').modal('hide');
}

let createItemChanges = document.getElementById('createItemBtn');
createItemChanges.addEventListener('click', addNewItem);

async function addToPersonal(personalCalId, newPersonalItem) {
    console.log('new hit');
    fetch('/api/items/'+personalCalId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPersonalItem)
    });
}