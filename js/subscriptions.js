'use strict';

function loadAll(userId){
	loadCalendars(userId);
	loadSettingListeners();
	loadNotifications();
}
loadSettingListeners();

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
		const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
		//get an array of every itemID that has been checked
		const checkedItemIds = getCheckedItems();

		for(let i=0; i<checkedItemIds.length; i++){
			let itemID=  checkedItemIds[0];
			//GET the particular item
			//TODO if we are going to pass in the item in the api pull,
			//will need this fetch. Otherwise, just need the contents of the else
			const response = await fetch(`/api/calendars/${cal_id}/items/${itemID}`);
			if(!response.ok){
				alert('Error: Unable to add specified item(s) to your personal calendar.');
				return;
			}
			else{ //TODO are we passing item in as item object or item id?
				const item = response.json();
				// const item_id = item.id;
				//add that item to personal calendar
				fetch(`/api/users/${user_id}/calendar/pull`, {  //TODO find user
					method: 'POST',
					headers:{
						'Content-Type': 'application/json'
					},
					body:item
				});
			}
		}
	});

	//for every action in the calendar, add it to personal
	document.getElementById('setAddAllActions').addEventListener('click', async ()=>{
		const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
		const response = await fetch(`/api/calendars/${cal_id}/items`);
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
					const addResp = await fetch(`/api/calendars/${cal_id}/items`, {
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
		const response = await fetch(`/api/calendars/${cal_id}/items`);
		if(!response.ok){
			alert('Unable to add selected item(s) to your calendar at this time.');
			return;
		} 
		else {
			//fetch the item
			let itemList = response.json();
			//if it is an action, add to cal
			for(let i = 0; i<itemList.length; i++){
				if (itemList[i].type === 'Event'){
					const addResp = await fetch(`/api/calendars/${cal_id}/items`, {
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

	/**  TODO Might be removing this setting
	//for each selected item, find corresponding in personal, updare
	document.getElementById('setUpdateSelected').addEventListener('click', ()=>{
		const checkedItemIds = getCheckedItems();
		checkedItemIds.forEach((ID) => {
			//get from subscription cal
		});
	});
	*/

	//make a new event
	document.getElementById('setCreate').addEventListener('click', ()=>{
		clearModals();
		$('#itemEditCenter').modal('show');
		let confirmBtn = document.getElementById('saveChanges');

		//save button should load the commit screen and close the edit modal
		confirmBtn.addEventListener('click', () =>{
			$('#itemEditCenter').modal('hide');
			commitChanges();
			//make sure the commit message input is visible
			document.getElementById('commitMessage').removeAttribute('hidden');
		}); 
		

	});
	document.getElementById('setDeleteItem').addEventListener('click', ()=>{

	});
	document.getElementById('setDeleteCal').addEventListener('click', ()=>{

	});
	document.getElementById('publicSwitch').addEventListener('toggle', ()=>{

	});

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
function loadCalendars(userId){
	const cals = [
		{
			id:'0',
			name:'CS 221', 
			admin:false,
			items: [
				{name: 'Zoom meeting', date:'11/3/2020', type:'Event', status:'N/A'},
				{name: 'Milestone 2', date:'11/6/2020', type:'Action Item',status : 'In Progress'}, 
				{name:'Homework 9', date: '11/2/2020', type:'Action Item', status:'In Progress'}
			]
            
		},
		{
			id:'1',
			name:'Greek 200', 
			admin:true,
			items: [
				{name:'Agape Test', date:'10/31/2020', type:'Event',status:'N/A'},
				{name:'Alpha', date:'11/5/2020', type:'Event', status:'N/A'},
				{name: 'Reading', date:'11/7/2020', type:'Action Item', status:'In Progress'}
			],
          
		}
	];
    
	//get all of the calendars that the user has
	// renders them into the list
	//SQL request for the user's subscriptions
	// try{
	//     const t = await db.any('SELECT calendar_id FROM subs WHERE user_id = $1', userId);
	// }
	// catch(err){
	//     //TODO
	// }
	//SELECT calendar_id FROM subscriptions WHERE usere_id = userId
	//Some hard coded data, for now
   
	cals.forEach((cal) =>{
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
			admin:false,
			items: [
				{id : '001', name: 'Zoom meeting', start:'11/3/2020', all_day:true, type:'Event', status:'N/A'},
				{id : '002', name: 'Milestone 2', dueDate:'11/6/2020', type:'Action Item',status : 'In Progress'}, 
				{id : '003', name:'Homework 9', dueDate: '11/2/2020', type:'Action Item', status:'In Progress'}
			]
            
		},
		{
			id:'1',
			name:'Greek 200', 
			admin:true,
			items: [
				{id : '004', name:'Agape Test', start:'10/31/2020',  end: '11/5/2020',all_day:false,  type:'Event',status:'N/A'},
				{id : '005', name:'Alpha', start:'11/5/2020', all_day:true, type:'Event', status:'N/A'},
				{id : '006', name: 'Reading', dueDate:'11/7/2020', type:'Action Item', status:'In Progress'}
			],
          
		}
	];
	//TODO api find calendar by cal_id
    
	// const r = await  db.any('SELECT events, Action Items FROM (SELECT * FROM cals WHERE id= $1)', calId)
	const thisCal = cals[calId]; //TODO temporary -- once i have the db set up, I can figure out how to 
	//make this work with r
    
	document.getElementById('cal-name').innerHTML = thisCal.name;
	document.getElementById('cal-name').setAttribute('calID', calId);

	//Add or remove the edit column based on whether you are an admin
	if(!thisCal.admin){
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
	if(thisCal.admin){
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
		if(item.dueDate !== undefined){
			date.innerHTML = item.dueDate;
		} else if(item.start !== undefined){
			date.innerHTML = item.start;
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
			//pop up modal with any details, non-editable TODO 
			loadCommit();
			document.getElementById('commitMessage').setAttribute('hidden', true);
			document.getElementById('confEditHeader').innerText = 'Details';
			document.getElementById('reviewMessage').setAttribute('hidden', true);


		});
		info.appendChild(infoBtn);
		anItem.appendChild(info);

        
		if(thisCal.admin){
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
 * Fills the modal with the appropriate information

 * @param {Item object} item 
 */
function loadModal(item){
	//set it to confirmation card values
	document.getElementById('confEditHeader').innerText = 'Confirm Edits';
	document.getElementById('reviewMessage').removeAttribute('hidden');

	//make sure there are not extranous values by clearing modal
	clearModals();

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
	let confirmBtn = document.getElementById('saveChanges');

	//save button should load the commit screen and close the edit modal
	confirmBtn.addEventListener('click', () =>{
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
 */
function getInfo(){
	let listField = document.getElementsByClassName('modal-editable-area');
	let body ='';
	for(let i=0; i<listField.length; i++){
		if(listField[i].value !== ''){
			//each non-empty field will be added to the body
			//the parent's text content is the category name
			let line = listField[i].parentElement.textContent + ':' + listField[i].value + '\n' ;
			body = body+line;

		}
	}
	return JSON.stringify(body);
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
		if(item.dueDate !== undefined){
			document.getElementById('dueDate').value = item.dueDate;
		}else{
			document.getElementById('dueDate').value = '';
		}

	} else if (currentType.value === 'Event') {
		itemStatus.style.display = 'none';
		dueDateShow.style.display = 'none';
		startTimeShow.style.display = 'inline-block';
		endTimeShow.style.display = 'inline-block';
        
		//if start time is not a defined value, the html value will 
		//still be the value it was last set to
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
 * Closes editing modal and opens a new confirmation modal.
 */
async function commitChanges(){
	const cal_id = parseInt(document.getElementById('cal-name').getAttribute('calID'));
	//fill confirmation modal with information values from the edit modal
	loadCommit();
	//opens the confirmation modal
	$('#editConfirmation').modal('show');
	document.getElementById('confirmBtn').addEventListener('click', ()=> {
		$('#editConfirmation').modal('hide');

	});
	const item_id = document.getElementById('modalBodyItemId').getAttribute('item-id');
	// setAttribute('item-id', item.id);

	let bodyInfo = getInfo();
	console.log(item_id);
	//check if item.id already exists. If so, update. Otherwise, push item TODO
	let itemResp = await fetch(`/api/items/${item_id}`);
	//if it does not already exist, make it
	if(!itemResp.ok){
		await fetch(`/api/calendars/${cal_id}/items`, {
			method: 'POST', 
			headers: {
				'Content-Type': 'application/json'
			},
			body: bodyInfo
		});
	} else {
		await fetch(`/api/calendars/${cal_id}/items/${item_id}`, {
			method: 'PUT',
			headers:{
				'Content-Type':'application/json'
			},
			body: bodyInfo
		});
	}
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



/**
 * Get every calendar that the user is subscribed to
 * @param {} user 
 */
async function getCals(user){
	const response = await fetch(`/api/users/${user}`);
	if(!response.ok){
		console.log(response.error);
		return;
	}
	let allSubCals = await response.json();
	for(let i=0; i<allSubCals.length; i++){
		console.log(JSON.parse(allSubCals[i]));
	}

}



loadCalendars(0);
// getCals(12345);