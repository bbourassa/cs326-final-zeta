'use strict';

// const user_id = window.localStorage.getItem('userInfo').id;
const user_id  =0;

function loadAll(userId){
	loadCalendars(userId);
	loadSettingListeners();
	loadNotifications();

}

loadAll(0);


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
		const checkedItemIds = getCheckedItems();

		for(let i=0; i<checkedItemIds.length; i++){
			//for each checked item, get the item id
			let itemID=  checkedItemIds[i];

			//pull that item into your cal
			const response = await fetch(`/api/users/${user_id}/calendar/pull/`, {  
				method: 'POST',
				headers:{
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(itemID)
			});
			
			if(!response.ok){
				alert('Error: Unable to add specified item(s) to your personal calendar.');
				return;
			}
			
		}
	});

	//for every action in the calendar, add it to personal
	document.getElementById('setAddAllActions').addEventListener('click', async ()=>{
		const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
		const response = await fetch(`/api/calendars/${cal_id}/items/`);
		if(!response.ok){
			alert('Unable to add selected item(s) to your calendar at this time.');
			return;
		} 
		else {
			//fetch the item
			let itemList = response.json();
			//if it is an action, add to cal
			for(let i = 0; i<itemList.length; i++){
				if (itemList[i].type === 'Action Item'){
					const addResp = await fetch(`/api/calendars/${cal_id}/items/`, {
						method: 'POST', 
						headers: {
							'Contenct-Type': 'application/json'
						},
						body: itemList[i]
					} );
					if(!addResp.ok){
						alert('Unable to add selected item(s) to your calendar at this time.');
						return;
					}
				}
			}
		}
	});

	//for every event in cal, add it to personal
	document.getElementById('setAddAllEvents').addEventListener('click', async()=>{
		const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
		const response = await fetch(`/api/calendars/${cal_id}/items/`);
		if(!response.ok){
			alert('Unable to add selected item(s) to your calendar at this time.');
			return;
		} 
		else {
			//fetch the item
			let itemList = response.json();
			//if it is an event, add to cal
			console.log(itemList.length);
			for(let i = 0; i<itemList.length; i++){
				if (itemList[i].type === 'Event'){
					const addResp = await fetch(`/api/calendars/${cal_id}/items/`, {
						method: 'POST', 
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(itemList[i])
					} );
					if(!addResp.ok){
						alert('Unable to add selected item(s) to your calendar at this time.');
						return;
					}
				}
			}
		}
        
	});

	//for each selected item, find corresponding in personal, updare
	document.getElementById('setUpdateSelected').addEventListener('click',async ()=>{
		const checkedItemIds = getCheckedItems();
		// TODO ADD POPUP
		for(let i=0; i<checkedItemIds.length; i++){
			//Send in the item ids to be pulled across. If any don't resolve, stop trying
			const response = await  fetch(`/api/users/${user_id}/calendar/pull`, {
				method: 'PUT',
				headers: {'Content-type':'application/json'},
				body:checkedItemIds[i]
			});
			if(!response.ok){
				alert('Unable to update item(s) at this time.');
				//don't then try to do the rest!
				return;
			}
			
		}
	});
	

	//make a new event
	document.getElementById('setCreate').addEventListener('click', ()=>{
		clearModals();
		$('#itemEditCenter').modal('show');
		//DO NOT call LoadModal; that requires an existing item
		//instead, set document.getElementById('modalBodyItemId').setAttribute('item-id', to a new value
		let newID = generateNewId('item');
		document.getElementById('modalBodyItemId').setAttribute('item-id', newID);
		let svChanges = document.getElementById('saveChanges');


		//save button should load the commit screen and close the edit modal
		svChanges.addEventListener('click', () =>{
			$('#itemEditCenter').modal('hide');
			commitChanges();
			//make sure the commit message input is visible
			document.getElementById('commitMessage').removeAttribute('hidden'); 
			document.getElementById('btnsForEdits').removeAttribute('hidden'); 


		}); 
		//now you are in the commit modal
		

	});
	
	//delete selected items
	document.getElementById('setDeleteItem').addEventListener('click', async()=>{
		const checkedItemIds = getCheckedItems();
		//assumes the appropriate cal is the one you are on currently
		const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));

		for(let i=0; i<checkedItemIds.length; i++){
			const item_id = checkedItemIds[i];
			try{
				await fetch(`/api/calendars/${cal_id}/items/${item_id}/`, {
					method: 'DELETE'
				});
			} catch(e){
				console.log('Unable to delete selected item(s) at this time.');
				return;
			}
		}

	});
	
	//Delete current calendar  TODO
	document.getElementById('setDeleteCal').addEventListener('click', async ()=>{
		//assumes the appropriate cal is the one you are on currently
		//TODO make a confirmation screen
		const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
		try{
			await fetch(`/api/calendars/${cal_id}/`, {
				method: 'DELETE'
			});
		} catch(e){
			console.log('Unable to delete calendar at this time.');
			return;
		}
		

	});
	
	//if there is already a share code, make it visible, set toggle to checked
	if(document.getElementById('shareCode')){
		document.getElementById('shareCode').setAttribute('hidden', true);
	} else {
		document.getElementById('publicSwitch').setAttribute('checked', false);
	}
	document.getElementById('publicSwitch').addEventListener('change', async ()=>{
		if(document.getElementById('shareCode')){
			document.getElementById('shareCode').removeAttribute('hidden');
		} else {
			const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
			let shareCode;
			
			//if you aleady have a code html element, display
			if(document.getElementById(shareCode)){
				document.getElementById(shareCode).removeAttribute('hidden');

			}else {
				//therwise, check for an existing code
				try{
					let response = await fetch(`/api/calendars/${cal_id}/`); //TODO change to a new endpoint that checkes
					//for an existing share code
					if(response.ok){
						shareCode = response.json();
					}
				} catch (e) { //if it does not have that attribute, make it
					shareCode = generateNewId('shareCode');
					//save the share code to the calendar
	
				}
				//make a list element for the code to live in
				let code = document.createElement('li');
				code.innerText = 'Your sharable code:' + shareCode;
				code.classList.add('list-group-item', 'list-group-item-action');
				code.setAttribute('id', 'shareCode');
				document.getElementById('adminSettings').appendChild(code);
			}
		}

		
		
	});

}


/** @britney do you need this in personal cal?
 * Generates a new random set of digits, ensures that it does not already exist
 * TODO the cal shareCode is currently a nummber instead of string
 * @param {String} field to generate an id for
 */
function generateNewId(field){
	let id = 0;
	//Calendar id's should have 5 digits, for now
	if(field === 'cal'){ 
		// id = Math.floor(Math.random() * (99999 - 10000) + 10000);
		let unique = false;
		while(!unique){
			try {
				id = Math.floor(Math.random() * (99999 - 10000) + 10000);
				fetch(`/api/items/${id}/`);
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
				fetch(`/api/items/${id}/`);
			} catch(e){
				unique = false;
			}
			unique = true;
		}
	} else if(field === 'shareCode'){
		id = Math.floor(Math.random() * (9999999 - 1000000) + 1000000);
		//
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

function loadNotifications(){
	// close event listener
	// load each notification
	// make each notification load the correct table, pull up details?
}

/**
 * Load all of the user's subscription calendars
 * @param {int} userId 
 */
async function loadCalendars(){
	const cals = [
		
		{
			id:'0',
			name:'CS 221', 
			owner_id : 3,
			items: [
				{id: 120,
					name: 'Zoom meeting',
					type: 'Event',
					all_day: false,
					start:  '11/3/2020T13:30',
					end:  '11/3/2020T15:00',
					status: 'N/A',
					calendar_id: 0,
					calendar_title: 'CS 221'
				},
				{id: 123,
					name: 'Milestone 2',
					type: 'Action Item',
					all_day: false,
					start: '11/6/2020',
					description: 'Us, trying not to fail',
					status: 'In Progress',
					calendar_id: 0,
					calendar_title: 'CS 221',
					related_links: 'help_us',},
				{id: 125,
					name: 'Homework 9',
					type: 'Action Item',
					all_day: true,
					start:  '11/9/2020T13:30',
					status: 'N/A',
					calendar_id: 0,
					calendar_title: 'CS 221',
				}
			]
            
		},
		{
			id:'1',
			name:'Greek 200', 
			owner_id:0,
			items: [
				{id: 395,
					name: 'Agape Test',
					type: 'Event',
					all_day: false,
					start: '11/30/2020T13:30',
					end: '11/30/2020T15:00',
					status: 'N/A',
					calendar_id: 1,
					calendar_title: 'Greek 200',
				},
				{id: 472,
					name: 'Alpha',
					type: 'Event',
					all_day: true,
					start:  '11/3/2020',
					status: 'N/A',
					calendar_id: 1,
					calendar_title: 'Greek 200',
				},	
				{id: 120,
					name: 'Reading',
					type: 'Action Item',
					all_day: true,
					start:  '11/25/2020',
					status: 'In Progress',
					calendar_id: 1,
					calendar_title: 'Greek 200',
				}
			],
          
		}
	];


	//load all the calendars you have a subscription relationship with
	//make the response into the cal list
	console.log('load fetch');
	const response = await fetch(`/api/users/${user_id}/subscriptions/calendars/`);
	if(!response.ok){
		alert('Unable to load your subscriptions');
	} else{
		const cals1 = response.json(); //TODO remove the 1 once I take out data from here.
	}
	//make the button for each calendar, adding admin button where applicalbe
	//if you click that clanedar, it will load into the item table
	cals.forEach((cal) =>{
		const admin = (cal.owner_id === user_id);
		
		//makke the button for the calendar
		let aCal = document.createElement('button');
		aCal.innerHTML=cal.name;
		aCal.classList.add('subscribed', 'btn', 'btn-light');
		//add an event listen to the button to fill in the table of eventsf
		aCal.addEventListener('click', () =>{
			while( document.getElementById('eventTable').childNodes.length>0){
				document.getElementById('eventTable').removeChild(document.getElementById('eventTable').childNodes[0]);
			}
			loadTable(cal.id);
		});
		if(admin){
			let adminIndic = document.createElement('btn'); //btn btn-outline-secondary btn-sm float-right
			adminIndic.classList.add('btn', 'btn-outline-secondary', 'btn-sm', 'float-right', 'disabled');
			adminIndic.innerText = 'ADMIN';
			aCal.appendChild(adminIndic);
		}

		document.getElementById('subscribed-cals').appendChild(aCal);

	});
}

/**
 * Gets and renders all events and activities in a given calendar
 * @param {int} calId the id number for the calendar
 */
function loadTable(calId){
	const cals = [
		
		{
			id:'0',
			name:'CS 221', 
			owner_id : 3,
			items: [
				{id: 120,
					name: 'Zoom meeting',
					type: 'Event',
					all_day: false,
					start:  '11/3/2020',
					end:  '11/3/2020',
					description: '',
					status: 'N/A',
					calendar_id: 0,
					calendar_title: 'CS 221',
					related_links: '',},
				{id: 123,
					name: 'Milestone 2',
					type: 'Action Item',
					all_day: false,
					start: '',
					end:  '11/6/2020',
					description: 'Us, trying not to fail',
					status: 'In Progress',
					calendar_id: 0,
					calendar_title: 'CS 221',
					related_links: 'help_us',},
				{id: 125,
					name: 'Homework 9',
					type: 'Action Item',
					all_day: true,
					start:  '11/9/2020',
					end: '',
					description: '',
					status: 'N/A',
					calendar_id: 0,
					calendar_title: 'CS 221',
					related_links: ''}
			]
            
		},
		{
			id:'1',
			name:'Greek 200', 
			owner_id:0,
			items: [
				{id: 395,
					name: 'Agape Test',
					type: 'Event',
					all_day: false,
					start:  '11/30/2020',
					end:  '11/30/2020',
					description: '',
					status: 'N/A',
					calendar_id: 1,
					calendar_title: 'Greek 200',
					related_links: '',},
				{id: 472,
					name: 'Alpha',
					type: 'Event',
					all_day: true,
					start:  '11/3/2020',
					end: '',
					description: '',
					status: 'N/A',
					calendar_id: 1,
					calendar_title: 'Greek 200',
					related_links: '',},	
				{id: 120,
					name: 'Reading',
					type: 'Action Item',
					all_day: true,
					start:  '11/25/2020',
					end: '',
					description: '',
					status: 'In Progress',
					calendar_id: 1,
					calendar_title: 'Greek 200',
					related_links: '',}
			],
          
		}
	];
	//TODO api find calendar by cal_id
    
	const thisCal = cals[calId]; //TODO temporary -- once i have the db set up, I can figure out how to 
	//make this work with r
	const admin = (thisCal.owner_id === user_id);

	
	document.getElementById('cal-name').innerHTML = thisCal.name;
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
	//load each item in this calendar
	thisCal.items.forEach((item) => {
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
		if(item.start !== ''){
			date.innerHTML = item.start;
		} else if(item.end !== ''){
			date.innerHTML = item.end;
		}
		anItem.appendChild(date);

		//load type of Event
		let type = document.createElement('td');
		type.innerHTML = item.type;
		//(item.type === 'Event' ? 'Event':'Action Item'); //TODO
		anItem.appendChild(type);

		//creates status indicator
		let status = document.createElement('td');
		let prog = document.createElement('button');
		prog.classList.add('btn','btn-sm', 'disabled');
		if(item.status === 'In Progress'){
			prog.classList.add('btn-warning');
		} else if (item.status === 'Not Started'){
			prog.classList.add('btn-danger');
		} else if(item.status === 'Completed'){
			prog.classList.add('btn-success');
		}else{
			prog.classList.add('btn-light');
		}
		prog.innerHTML=item.status;
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
			loadModal(item);
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

			editBtn.addEventListener('click', ()=> {
				loadModal(item);
			});

			editable.appendChild(editBtn);
			anItem.appendChild(editable);

		}

		document.getElementById('eventTable').appendChild(anItem);

	});

    

}

/**
 * Fills the Edit center modal with the appropriate information

 * @param {Item object} item 
 */
function loadModal(item){
	//set it to confirmation card values
	document.getElementById('confEditHeader').innerText = 'Confirm Edits';
	document.getElementById('reviewMessage').removeAttribute('hidden');

	//make sure there are not extranous values by clearing modal
	clearModals();
	//TODO Check for null values
	document.getElementById('modalBodyItemId').setAttribute('item-id', item.id);
	document.getElementById('itemName').value = item.name;
	document.getElementById('statusModal').value = item.status;
	document.getElementById('typeItem').value = item.type;
	document.getElementById('currCal').value = document.getElementById('cal-name').childNodes[0].data;


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
	let toggleType = document.getElementById('typeItem');
	toggleType.addEventListener('change', () =>{setUpdateForm(item);});
    

}

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
	let currentType = document.getElementById('typeItem');
	let itemStatus = document.getElementById('statusModal');
	let dueDateShow = document.getElementById('showDueDate');
	let startTimeShow = document.getElementById('showStartTime');
	let endTimeShow = document.getElementById('showEndTime');
	if(currentType.value === 'Action Item') {
		itemStatus.style.display = 'inline-block';
		dueDateShow.style.display = 'inline-block';
		startTimeShow.style.display = 'none';
		endTimeShow.style.display = 'none';
		//when we decide whether we are storing duedate in start or end, do that one
		if(item.start !== undefined){
			document.getElementById('dueDate').value = item.start;
		} else if(item.end !== undefined){
			document.getElementById('dueDate').value = item.end;
		} else{
			document.getElementById('dueDate').value = '';	
		}

	} else if (currentType.value === 'Event') {
		itemStatus.style.display = 'none';
		dueDateShow.style.display = 'none';
		startTimeShow.style.display = 'inline-block';
		endTimeShow.style.display = 'inline-block';
        
		//if start time is not a defined value, the html value will 
		//still be the value it was last set to; this clears it out
		if(item.start !== undefined){
			document.getElementById('startTime').value = item.start;
		} else{
			document.getElementById('startTime').value = '';
		}
		if(item.end !== undefined){
			document.getElementById('endTime').value = item.end;
		} else{
			document.getElementById('endTime').value ='';
		}
	}
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
 * TODO add to personal cal @britney
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
			await fetch(`/api/calendars/${cal_id}/items/${item_id}/`, {
				method: 'PUT',
				headers:{
					'Content-Type':'application/json'
				},
				body: bodyInfo
			});
			await fetch(`/api/users/${user_id}/notifications`, {
				method: 'POST',
				headers: {
					'Content':'application/json'
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

