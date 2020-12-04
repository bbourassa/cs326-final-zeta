
/* eslint-disable linebreak-style */

'use strict';
//calls don't throw an error
let currentItemId = 0;
let newItemId = true;
async function getSession(){
	try{
		let user = await fetch('/user');
		let us = await user.json();
		let mID = await fetch('/api/username/'+us);
		let id = await mID.json();
		loadAll(id[0].id);
	} catch (e){

		window.location.replace('./index.html');
	}

}


window.addEventListener('load', getSession());
window.localStorage.clear();
let sendChanges = true;

function loadAll(userId){
	document.getElementById('logoutBtn').addEventListener('click', ()=>{
		fetch('/logout');
	});
	loadCalendars(userId);
	loadSettingListeners(userId);
	setUpReqFields();
}


function setUpReqFields(){
	let itemInputEditElements = document.getElementById('editForm').getElementsByTagName('input');
	document.getElementById('itemType').addEventListener('change', checkRequiredFieldsForEdit);
	document.getElementById('itemStatus').addEventListener('change', checkRequiredFieldsForEdit);
	document.getElementById('itemDescription').addEventListener('keyup', checkRequiredFieldsForEdit);
	document.getElementById('itemLinks').addEventListener('keyup', checkRequiredFieldsForEdit);
	for(let item of itemInputEditElements) {
		if(item.id === 'itemName') {
			item.addEventListener('keyup', checkRequiredFieldsForEdit);
		} else {
			item.addEventListener('change', checkRequiredFieldsForEdit);
		}
	}
}

/**
 * Loads the event listers for each setting button
 */
function loadSettingListeners(user_id){

	//  the header checkbox will cause all other check oxes to check/uncheck
	document.getElementById('checkAll').addEventListener('change', ()=> {
		let mainCheck = document.getElementById('checkAll');
		let rows = document.getElementById('eventTable').childNodes;
		for(let i =0; i<rows.length; i++){
			//if it is not checked, go through and uncheck everything
			//if it is checked, go through and check everything
			let checkbox = document.getElementById('eventTable').childNodes[i].childNodes[0].childNodes[0];
			checkbox.checked = mainCheck.checked ? true:false;
		}
	});

	//for each selected item, add it to personal cal
	document.getElementById('setAddItems').addEventListener('click', async ()=>{
		//get an array of every itemID that has been checked
		const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
		const checkedItemIds = getCheckedItems();
		document.getElementById('setAddItems').setAttribute('data-toggle', 'modal');
		document.getElementById('setAddItems').setAttribute('data-target', '#additionConfirmation');
		document.getElementById('confirmAddBtn').addEventListener('click', async ()=> {
			document.getElementById('confirmAddBtn').setAttribute('data-dismiss', 'modal');
			let personalCalId = 0;
			if(checkedItemIds !== null) {
				const response = await fetch('/api/cals/'+user_id+'/all');
				if (!response.ok) {
					console.log(response.error);
					return;
				}
				let userCalendars = await response.json();
				for(let i = 0; i < userCalendars.length; i++) {
					if(userCalendars[i].personal === 1) {
						personalCalId = userCalendars[i].id;
					}
				}
				for(let i = 0; i < checkedItemIds.length; i++) {
					const itemResponse = await fetch('/api/items/'+cal_id+'/'+checkedItemIds[i]);
					if (!itemResponse.ok) {
						console.log(itemResponse.error);
						return;
					}
					let prepItem = await itemResponse.json();
					let addThisItem = prepItem[0];
					let thisPersonalItem = {name: addThisItem.name, itemType: addThisItem.item_type, startTime: addThisItem.start_time, endTime: addThisItem.end_time, description: addThisItem.description, itemStatus: addThisItem.item_status, relatedLinks: addThisItem.related_links, isParent: false, oldId: addThisItem.id};

					addToPersonal(parseInt(personalCalId), thisPersonalItem);
					//setTimeout(function(){addToPersonal(personalCalId, thisPersonalItem);}, 500);
				}
			}
			//uncheck everything
			let rows = document.getElementById('eventTable').childNodes;
			for(let i =0; i<rows.length; i++){
				let checkbox = document.getElementById('eventTable').childNodes[i].childNodes[0].childNodes[0];
				checkbox.checked = false;
			}
		});
	});

	//for every action in the calendar, add it to personal
	document.getElementById('setAddAllActions').addEventListener('click', async ()=> {
		const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
		document.getElementById('setAddAllActions').setAttribute('data-toggle', 'modal');
		document.getElementById('setAddAllActions').setAttribute('data-target', '#additionConfirmation');
		document.getElementById('confirmAddBtn').addEventListener('click', async ()=> {
			document.getElementById('confirmAddBtn').setAttribute('data-dismiss', 'modal');
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
					setTimeout(function(){addToPersonal(personalCalId, thisPersonalItem);}, 500);
				}
			}
		});
	});

	//for every event in cal, add it to personal
	document.getElementById('setAddAllEvents').addEventListener('click', async()=>{
		const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
		document.getElementById('setAddAllEvents').setAttribute('data-toggle', 'modal');
		document.getElementById('setAddAllEvents').setAttribute('data-target', '#additionConfirmation');
		document.getElementById('confirmAddBtn').addEventListener('click', async ()=> {
			document.getElementById('confirmAddBtn').setAttribute('data-dismiss', 'modal');
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
					setTimeout(function(){addToPersonal(personalCalId, thisPersonalItem);}, 500);
				}
			}
		});

	});

	//for each selected item, find corresponding in personal, updare
	document.getElementById('setUpdateSelected').addEventListener('click',async ()=>{
		const checkedItemIds = getCheckedItems();
		for(let i=0; i< checkedItemIds.length; i++){
			let currentParent = checkedItemIds[i];
			//Send in the item ids to be pulled across. If any don't resolve, stop trying
			//FIND THE USER'S PERSONAL CALENDAR
			const personalResponse = await fetch('/api/cals/'+user_id+'/all');
			if (!personalResponse.ok) {
				console.log(personalResponse.error);
				return;
			}
			let listCalendars = await personalResponse.json();
			let personalCalendar = listCalendars[0];
			for(let calendar of listCalendars) {
				if(calendar.personal === 1) {
					personalCalendar = calendar;
				}
			}
			//FIND THE CHECKED ITEM
			const itemResponse = await fetch('/api/item/'+currentParent);
			if (!itemResponse.ok) {
				console.log(itemResponse.error);
				return;
			}
			let itemData = await itemResponse.json();
			let currentItem = itemData[0];
			//FIND THE ITEMS ON THE PERSONAL CALENDAR
			const personItemsResponse = await fetch('/api/items/'+personalCalendar.id);
			if(!personItemsResponse.ok) {
				console.log(personItemsResponse.error);
				return;
			}
			let allCalItems = await personItemsResponse.json();
			for(let i = 0; i < allCalItems.length; i++) {
				if(allCalItems[i].parent_id === currentParent) {
					let updatedInfo = {name: currentItem.name, type: currentItem.item_type, start: currentItem.start_time, end: currentItem.end_time, description: currentItem.description, status: currentItem.item_status, related_links: currentItem.related_links};
					await fetch('/api/items/'+personalCalendar.id+'/'+allCalItems[i].id, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(updatedInfo)
					});
				}
			}
			//FIND THE ITEM FROM THE PERSONAL CALENDAR WHO'S PARENT ID MATCHES THE ID OF THE CHECKED ITEM
			//FOR A MATCH, UPDATE THE ITEM FROM THE PERSONAL CALENDAR WITH THE INFORMATION FROM THE PARENT ITEM
		}
		//uncheck everything
		let rows = document.getElementById('eventTable').childNodes;
		for(let i =0; i<rows.length; i++){
			let checkbox = document.getElementById('eventTable').childNodes[i].childNodes[0].childNodes[0];
			checkbox.checked = false;
		}
	});


	//make a new event
	document.getElementById('setCreate').addEventListener('click', ()=> {
		let sent  = false;
		document.getElementById('setCreate').setAttribute('data-toggle', 'modal');
		document.getElementById('setCreate').setAttribute('data-target', '#itemEditCenter');
		//clear out old values, set title and button to new item values
		document.getElementById('editItemTitle').innerHTML = 'ADD NEW ITEM';
		document.getElementById('saveChanges').innerHTML = 'Create New Item';
		clearModals();
		document.getElementById('calendarName').setAttribute('placeholder', document.getElementById('cal-name').innerHTML);
		//fill appropriately w/ calendar name
		let currentCalendar = document.getElementById('calendarName');
		let calName = document.getElementById('cal-name').textContent;
		currentCalendar.placeholder = calName;
		setUpdateForm();
		let typeSet = document.getElementById('itemType');
		typeSet.addEventListener('change', setUpdateForm);

		let saveChangesBtn = document.getElementById('saveChanges');
		saveChangesBtn.innerHTML = 'Save Changes';
		saveChangesBtn.addEventListener('click', () => {
			if(sent){
                console.log('hit');
				return;
			} else {
                //currentItemId = null;
                newItemId = true;
                sendItemChanges(null, user_id);
                sent = true;
			}
		} );


	});

	//delete selected items
	document.getElementById('setDeleteItem').addEventListener('click', async()=>{
		const checkedItemIds = getCheckedItems();
		//assumes the appropriate cal is the one you are on currently
		const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
		document.getElementById('setDeleteItem').setAttribute('data-toggle', 'modal');
		document.getElementById('setDeleteItem').setAttribute('data-target', '#editConfirmation');
		document.getElementById('confirmBtn').addEventListener('click', async ()=> {
			document.getElementById('confirmBtn').setAttribute('data-dismiss', 'modal');
			for(let i = 0; i < checkedItemIds.length; i++) {
				fetch('/api/items/'+cal_id+'/'+checkedItemIds[i], {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					},
				});
				document.getElementById(checkedItemIds[i]).remove();
			}
		});

	});

	//Delete current calendar
	document.getElementById('setDeleteCal').addEventListener('click', async ()=>{
		//assumes the appropriate cal is the one you are on currently
		const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
		document.getElementById('setDeleteCal').setAttribute('data-toggle', 'modal');
		document.getElementById('setDeleteCal').setAttribute('data-target', '#editConfirmation');
		document.getElementById('confirmBtn').addEventListener('click', async ()=> {
			document.getElementById('confirmBtn').setAttribute('data-dismiss', 'modal');
			//FIRST DELETE SUBSCRITPIONS
			const response = await fetch('/api/subscriptionlist/'+cal_id);
			if (!response.ok) {
				console.log(response.error);
				return;
			}
			let listSubscriptions = await response.json();
			for(let i = 0; i < listSubscriptions.length; i++) {
				fetch('/api/subscription/'+listSubscriptions[i].id, {
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
			loadAll(user_id);
		});
	});

	//if there is already a share code, make it visible, set toggle to checked

	document.getElementById('publicSwitch').addEventListener('click', async ()=>{
		//if you just turned it off, hide the share code
		if(!document.getElementById('publicSwitch').checked){
			document.getElementById('shareCode').setAttribute('hidden', true);

		}
		//otherwise, make and display it
		else {
			if(document.getElementById('shareCode')){
				document.getElementById('shareCode').removeAttribute('hidden');
				let shareCode;
				document.getElementById('shareCode').remove();
				//otherwise, check for an existing code
				//share code = mapping of ca_id, constant
				shareCode = generateNewId('shareCode');

				//make a list element for the code to live in
				let code = document.createElement('li');
				code.innerText = 'Your sharable code is:  ' + shareCode;
				code.classList.add('list-group-item', 'list-group-item-action');
				code.setAttribute('id', 'shareCode');
				document.getElementById('adminSettings').appendChild(code);
			} else {
				let shareCode;
				//otherwise, check for an existing code
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
	});

}


/**
 * Generates a sharable string for calendar
 * @param {String} field to generate an id for
 * @returns {String} String of letters that map to the cal id
 */
function generateNewId(field){
	const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
	let id = 0;
	//insecure mapping of calendar id to a string
	if(field === 'shareCode'){
		let letterMap = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9, 'j': 0};
		let mappedString ='';
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
 * This function looks at each checkbox, and if it is checked, it adds
 * the id of the item to an array
 * @returns {Int Array} array of item ids
 */
function getCheckedItems(){
	let checkedBoxes = [];
	let allBoxes = document.getElementsByClassName('itemCheck');
	for (let i=0; i<allBoxes.length; i++){
		if(allBoxes[i].checked){
			const itemID = parseInt(allBoxes[i].parentElement.parentElement.getAttribute('id'));
			checkedBoxes.push(itemID);
		}
	}
	return checkedBoxes;
}

function clearModals(){
	document.getElementById('modalBodyItemId').setAttribute('item-id', '');
	let editFields = document.getElementsByClassName('modal-editable-area');
	for(let i=0; i<editFields.length; i++){
		if(editFields[i].value !== ''){
			editFields[i].value= '';
		}
	}
	let itemStatus = document.getElementById('itemStatus');
	itemStatus.value = 'Not Started';
	let itemType = document.getElementById('itemType');
	itemType.value = 'Action Item';
}


/**
 * Load all of the user's subscription calendars
 * @param {int} userId
 */
async function loadCalendars(user_id){
	//load all the calendars you have a subscription relationship with
	//make the response into the cal list
	const response = await fetch('/api/subscriptions/'+user_id);
	if(!response.ok){
		alert('Unable to load your subscriptions');
		return;
	}
	let cals = await response.json();
	const subs = document.getElementById('subscribed-cals');

	//make the button for each calendar, adding admin indicator where applicable
	//if you click that calendar, it will load into the item table
	document.getElementById('subscribed-cals').innerHTML = '';
	cals.forEach((cal) =>{
		if(document.getElementById('calId'+cal.id) === null) {
			//determine if admin
			const admin = (cal.owner_id === user_id);
			//makke the button for the calendar
			let aCal = document.createElement('button');
			aCal.innerHTML=cal.name;
			aCal.classList.add('subscribed', 'btn', 'btn-light');
			aCal.setAttribute('id', 'calId'+cal.id);
			//add an event listen to the button to fill in the table of eventsf
			aCal.addEventListener('click', () =>{
				//load the new table
				loadTable(cal.id, true, user_id);
			});
			if(admin){ //TODO need to find a compromise here
				aCal.innerHTML += ' - ADMIN';
			}
			subs.appendChild(aCal);
		}

	});
	// If you have been redirected because you have a new subscription,
	// it should redirect you to that events page
	//this function assumes that the new subscription will be at the end
	//of your list of subscriptions
	//TODO do we still do this w/the local storage? I don't think so
	if(window.localStorage.getItem('newSubscription')){
		loadTable(subs.childNodes[subs.childElementCount].getAttribute('cal_id'), true, user_id);
		window.localStorage.removeItem('newSubscription');
	}
	//TODO what does this do?
	let idPrep = subs.childNodes[0].getAttribute('id');
	let idNum = parseInt(idPrep.substring(5));
	loadTable(idNum, true, user_id);

}

/**
 * Gets and renders all events and activities in a given calendar
 * @param {int} calId the id number for the calendar
 */
/**
 * Retrieves and renders all items in a given calendar
 * @param {Int} calId of the calendar to render
 * @param {Boolean} rebuild whether cal should have changed, and needs to rebuild
 * @param {Int} user_id User to reference
 */
async function loadTable(calId, rebuild, user_id) {
    console.log('hit load table');
	//fetch specific calendar's data
	const response = await fetch('/api/cals/'+calId+'/');
	let calData = await response.json();
	calData = calData[0];
	//dtermine if admin
	const admin = (calData.owner_id === user_id);

	//load the items associated with this calendar
	const items = await fetch('/api/items/'+calId);
	if(!items.ok){
		console.log(items.error);
		return;
	}
	let calItems = await items.json();

	//If this calendar needs to be rebuilt, do so
	if(rebuild === true) {
		//clear out whatever is already in the table
		while( document.getElementById('eventTable').childNodes.length>0){
			document.getElementById('eventTable').removeChild(document.getElementById('eventTable').childNodes[0]);
		}
		//set cal-name and id to appropriate cal
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
	}


	//load each item in this calendar
	if(rebuild === true) {
		calItems.forEach((item) => {
			//the row will hold itmID
			let anItem = document.createElement('tr');
			anItem.setAttribute('id', item.id);

			//checkbox
			let check = document.createElement('td');
			let box = document.createElement('input');
			box.type ='checkbox';
			box.classList.add('itemCheck');
			check.appendChild(box);
			anItem.appendChild(check);

			//load name
			let name= document.createElement('td');
			name.innerHTML = item.name;
			anItem.appendChild(name);

			//load duedate/start date
			let date = document.createElement('td');
			if(item.start_time !== ''){
				let time = new Date(item.start_time).toDateString();
				date.innerHTML = time;
			}
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
			infoBtn.classList.add('btn', 'btn-sm', 'btn-outline-info', 'detail-button');
			infoBtn.innerText = 'Details';
			infoBtn.id = 'DetailsFor'+item.id;
			infoBtn.setAttribute('data-toggle', 'modal');
			infoBtn.setAttribute('data-target', '#itemDetailsModal');
			infoBtn.addEventListener('click', () =>{
				//pop up modal with any details, non-editable
				fillConfirmationModal(item);
				document.getElementById('confEditHeader').innerText = 'Details';
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
				editBtn.addEventListener('click', ()=> {
					fillModalInfo(item, document.getElementById('cal-name').textContent, user_id);
				});

				editable.appendChild(editBtn);
				anItem.appendChild(editable);

			}

			document.getElementById('eventTable').appendChild(anItem);

		});
	} else if (rebuild === false) {
        console.log('hit rebuild as false');
		//if you only need to add one item to the table?
		let newItem = calItems[0];
		for(let i = 0; i < calItems.length; i++) {
			if(calItems[i].id > newItem.id) {
                console.log('hit new item id');
				newItem = calItems[i];
			}
		}
		let anItem = document.createElement('tr');

		anItem.setAttribute('id', 'item'+newItem.id);

		let check = document.createElement('td');
		let box = document.createElement('input');
		box.type ='checkbox';
		box.classList.add('itemCheck');
		check.appendChild(box);
		anItem.appendChild(check);

		//load name
		let name= document.createElement('td');
		name.innerHTML = newItem.name;
		anItem.appendChild(name);

		//load duedate/start date
		let date = document.createElement('td');
		if(newItem.start_time !== ''){
			let time = new Date(newItem.start_time).toDateString();
			date.innerHTML = time;
		}
		anItem.appendChild(date);

		//load type of Event
		let type = document.createElement('td');
		if(newItem.item_type === 1) {
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
		if(newItem.item_status!== null ){
			let low =  (newItem.item_status);
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

		//TODO replace w/ my detail modal
		//creates detail
		let info = document.createElement('td');
		let infoBtn = document.createElement ('button');
		infoBtn.classList.add('btn', 'btn-sm', 'btn-outline-info', 'detail-button');
		infoBtn.innerText = 'Details';
		infoBtn.id = 'DetailsFor'+newItem.id;
		infoBtn.setAttribute('data-toggle', 'modal');
		infoBtn.setAttribute('data-target', '#itemDetailsModal');
		infoBtn.addEventListener('click', () =>{
			//pop up modal with any details, non-editable
			fillConfirmationModal(newItem);
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
			editBtn.addEventListener('click', ()=> {
				fillModalInfo(newItem, document.getElementById('cal-name').innerHTML, user_id);
			});
			editable.appendChild(editBtn);
			anItem.appendChild(editable);

		}

		document.getElementById('eventTable').appendChild(anItem);
	}

}

/**
 * This will fill the confirmation modal based on contents of edit modal
 * The confirmation modal should be used for both
 * confirmaiton and to display details
 * @param {<Object Item>} item to display
 */
function fillConfirmationModal(item){
	let type;
	let status;

	let allDetails = [( 'ITEM NAME: '+ item.name)];
	if(item.description !== ''){
		allDetails.push('ITEM DESCRIPTION: '+item.description);
	}
	if(item.type == 1){
		type = 'Action Item';
		switch (item.status) {
		case 1:
			status = 'Not Started';
			break;
		case 2:
			status = 'In Progress';
			break;
		default:
			status = 'Completed';
			break;
		}
		allDetails.push('ITEM TYPE: '+type);
		allDetails.push('ITEM STATUS: '+status);
	} else {
		type = 'Event';
		status = 'N/A';
		allDetails.push('ITEM TYPE: '+type);
	}
	// console.log(item.start_time);
	allDetails.push('START TIME: ' + new Date(item.start_time).toDateString());
	if(item.end_time !== null){
		allDetails.push('END TIME: '+ new Date(item.end_time).toDateString());
	}
	if(item.related_links !== null && item.related_links !== '' ){
		allDetails.push('ITEM RELATED LINKS: '+item.related_links);
	}

	//clear out any current list
	if(document.getElementById('listOfInfo')){
		document.getElementById('listOfInfo').parentElement.removeChild(document.getElementById('listOfInfo'));
	}
	//make it a list
	let changeList = document.createElement('div');
	changeList.classList.add('list-group');
	changeList.setAttribute('id', 'listOfInfo');

	//for each field, make a new list item
	for(let i=0; i<allDetails.length; i++){
		if(allDetails[i].value !== ''){
			let li = document.createElement('li');
			li.classList.add('list-group-item');
			li.textContent = allDetails[i];

			changeList.appendChild(li);
		}
	}
	document.getElementById('detailsBody').appendChild(changeList);

}

/**
 * Fills the edit modal with info
 * @param {Object} item
 * @param {String} parentCalendar
 * @param {Int} userId
 */
async function fillModalInfo(item, parentCalendar, userId) {
	let sent = false;
	currentItemId = item.id;
	let thisItemId = item.id;

	const response = await fetch('/api/items/'+item.calendar_id+'/'+item.id);
	if (!response.ok) {
		console.log(response.error);
		return;
	}
	let itemData = await response.json();
	let currentItem = itemData[0];
	let itemName = document.getElementById('itemName');
	itemName.value = currentItem.name;
	let editHeader = document.getElementById('editItemTitle');
	editHeader.innerHTML = 'Edit: ' + currentItem.name;
	let calendarName = document.getElementById('calendarName');
	calendarName.setAttribute('placeholder', parentCalendar);
	let itemDescription = document.getElementById('itemDescription');
	itemDescription.value = currentItem.description;
	let itemType = document.getElementById('itemType');
	itemType.addEventListener('change', () => setUpdateForm(item));
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
    console.log('itemLinks.value', itemLinks.value);

	let saveChangesBtn = document.getElementById('saveChanges');
	saveChangesBtn.innerHTML = 'Save Changes';
	saveChangesBtn.addEventListener('click', () => {
		if(sent){
			return;
		}else {
            sendItemChanges(thisItemId, userId);
            sent = true;
        }} );
    //currentItemId = null;
}

/**
 * Function to switch between date settings in the edit modal
 * deals with edit item modal
 */
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
		document.getElementById('saveChanges').disabled = true;
	} else if (currentType.value === 'Event') {
		itemStatus.style.display = 'none';
		dueDateShow.style.display = 'none';
		startTimeShow.style.display = 'inline-block';
		endTimeShow.style.display = 'inline-block';
		document.getElementById('saveChanges').disabled = true;
	}
}


/**
 * Check whether the field has a value before enabling the save button
 */
function checkRequiredFieldsForEdit() {
	let itemNameVal = document.getElementById('itemName').value;
	let itemType = document.getElementById('itemType').value;
	let saveItemChanges = document.getElementById('saveChanges');

	if(itemType === 'Action Item') {
		//an action item will have a due date and name that need to be set
		let dueDateVal = document.getElementById('itemDueDate').value;
		if(itemNameVal === '' || dueDateVal === '') {
			saveItemChanges.disabled = true;
		} else {
			saveItemChanges.disabled = false;
		}
	} else {
		//an event has a start time, end time, and a name that need to be set
		let startTimeVal = document.getElementById('startTime').value;
		let endTimeVal = document.getElementById('endTime').value;
		if(itemNameVal === '' || startTimeVal === '' || endTimeVal === '') {
			saveItemChanges.disabled = true;
		} else {
			saveItemChanges.disabled = false;
		}
	}
}

/**
 * POST/PUTs the item data, dependent on whether it is new or edited
 * @param {int} itemId Current item; null for newly created
 * @param {int} userId
 */
async function sendItemChanges(itemId, userId) {
    //console.log('send changes');
	document.getElementById('saveChanges').setAttribute('data-dismiss', 'modal');
	const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
	let updatedItem = {name: null, itemType: null, startTime: null, endTime: null, description: null, itemStatus: null, calendarId: cal_id, related_links: null};
	//collect info from modal
	updatedItem.name = document.getElementById('itemName').value;
	updatedItem.description = document.getElementById('itemDescription').value;
	let itemType = document.getElementById('itemType');
	if(itemType.value === 'Action Item') {
		updatedItem.itemType = 1;
		let itemStatus = document.getElementById('itemStatus');
		if(itemStatus.value === 'Not Started') {
			updatedItem.itemStatus = 1;
		} else if(itemStatus.value === 'In Progress') {
			updatedItem.itemStatus = 2;
		} else if (itemStatus.value === 'Completed') {
			updatedItem.itemStatus = 3;
		}
		updatedItem.startTime = new Date(document.getElementById('itemDueDate').value);
	} else {
		updatedItem.itemType = 2;
		updatedItem.startTime = new Date(document.getElementById('startTime').value);
		updatedItem.endTime = new Date(document.getElementById('endTime').value);
	}
    updatedItem.related_links = document.getElementById('itemLinks').value;
    console.log('the related links are', updatedItem.related_links);
	// console.log(itemId);
	if(itemId === currentItemId) { //if you should be updating an item
		updatedItem.itemId = itemId;
		// the edit endpoint uses different req keys than the create one
		let updateItemRedo = {id: itemId, name: updatedItem['name'], start: updatedItem['startTime'], type: updatedItem['itemType'], end:updatedItem['endTime'], description:updatedItem['description'],
			status: updatedItem['itemStatus'], cal: cal_id, related_links: updatedItem['related_links'] };

		await fetch('/api/items/'+cal_id+'/'+itemId, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updateItemRedo)
		});
        itemId = null;
        currentItemId = 0;
        loadTable(cal_id, true, userId);
        
	}

	else if(itemId === null && newItemId === true){ //new item, post
		await fetch('/api/items/'+cal_id, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updatedItem)
		});
        // new row, don't rebuild table
        newItemId = false;
		loadTable(cal_id, false, userId);
	}
}

/**
 * Function that adds a given item to users' personal cal
 */
async function addToPersonal(personalCalId, newPersonalItem) {
	await fetch('/api/items/'+personalCalId, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newPersonalItem)
	});
}