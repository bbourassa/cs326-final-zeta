'use strict';

function loadAll(userId){
    loadCalendars(userId);
    loadSettingListeners();
    loadNotifications();
}

function loadSettingListeners(){

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
                {name: 'Zoom meeting', date:'11/3/2020', type:'event', status:"N/A"},
                {name: 'Milestone 2', date:'11/6/2020', type:'action',status : "In Progress"}, 
                {name:'Homework 9', date: '11/2/2020', type:'action', status:"In Progress"}
            ]
            
        },
        {
            id:'1',
            name:'Greek 200', 
            admin:true,
            items: [
                {name:'Agape Test', date:'10/31/2020', type:'event',status:"N/A"},
                {name:'Alpha', date:'11/5/2020', type:'event', status:"N/A"},
                {name: 'Reading', date:'11/7/2020', type:'action', status:"In Progress"}
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
            while( document.getElementById("eventTable").childNodes.length>0){
                document.getElementById("eventTable").removeChild
                    (document.getElementById("eventTable").childNodes[0]);
            }
            loadTable(cal.id)
        });
        document.getElementById("subscribed-cals").appendChild(aCal);

    })
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
                {name: 'Zoom meeting', start:'11/3/2020', all_day:true, type:'event', status:"N/A"},
                {name: 'Milestone 2', dueDate:'11/6/2020', type:'action',status : "In Progress"}, 
                {name:'Homework 9', dueDate: '11/2/2020', type:'action', status:"In Progress"}
            ]
            
        },
        {
            id:'1',
            name:'Greek 200', 
            admin:true,
            items: [
                {name:'Agape Test', start:'10/31/2020',  end: "11/5/2020",all_day:false,  type:'event',status:"N/A"},
                {name:'Alpha', start:'11/5/2020', all_day:true, type:'event', status:"N/A"},
                {name: 'Reading', dueDate:'11/7/2020', type:'action', status:"In Progress"}
            ],
          
        }
    ];
    
    // const r = await  db.any('SELECT events, actions FROM (SELECT * FROM cals WHERE id= $1)', calId)
    const thisCal = cals[calId]; //TODO temporary -- once i have the db set up, I can figure out how to 
        //make this work with r

    document.getElementById("cal-name").innerHTML = thisCal.name;

    //Add or remove the edit column based on whether you are an admin
    if(!thisCal.admin){
        if(document.getElementById("table-edit")){
            document.getElementById("table-head").removeChild(document.getElementById("table-edit"));
        }
    }
    else if(!document.getElementById("table-edit")){
        let edit =document.createElement("th");
        edit.setAttribute("id","table-edit")
        edit.innerHTML = 'EDIT';
        edit.classList.add("text-uppercase", "font-weight-bold");
        document.getElementById("table-head").appendChild(edit);
    }
    //load each item in this calendar
    thisCal.items.forEach((item) => {
        let anItem = document.createElement('tr');

        let check = document.createElement('td');
        let box = document.createElement('input');
        box.type ='checkbox';
        check.appendChild(box)
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

        //load type of event
        let type = document.createElement('td');
        type.innerHTML = (item.type === 'event' ? 'Event':'Action Item');
        anItem.appendChild(type);

        //creates status indicator
        let status = document.createElement('td');
        let prog = document.createElement("button");
        prog.classList.add("btn","btn-sm", "disabled");
        if(item.status === "In Progress"){
            prog.classList.add("btn-warning");
        } else if (item.status === "Not Started"){
            prog.classList.add("btn-danger");
        } else if(item.status === "Completed"){
            prog.classList.add("btn-success");
        }else{
            prog.classList.add("btn-light");
        }
        prog.innerHTML=item.status;
        status.appendChild(prog);
        anItem.appendChild(status);


        //creates detail
        let info = document.createElement("td");
        let infoBtn = document.createElement ("button");
        infoBtn.classList.add("btn", "btn-sm", "btn-outline-info");
        infoBtn.innerText = "Details"
        infoBtn.addEventListener("click", () =>{
            //pop up modal with any details, non-editable TODO 
        })
        info.appendChild(infoBtn);
        anItem.appendChild(info);

        
        if(thisCal.admin){
            //make cell and button
            let editable = document.createElement('td');
            let editBtn = document.createElement("button");
            //button activates modal
            editBtn.setAttribute("data-toggle", "modal");
            editBtn.setAttribute("data-target", "#itemEditCenter");
            editBtn.setAttribute("type", "button");
            editBtn.classList.add("btn", "btn-outline-primary", "btn-sm");
            editBtn.innerHTML = "Edit";

            editBtn.addEventListener("click", ()=> {loadModal(item)});
            

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
    document.getElementById("itemName").value = item.name;
    document.getElementById("statusModal").value = item.status;
    document.getElementById("typeItem").value = item.type;
    //update the date within the form
    setUpdateForm(item);
    //check for details and links to prefill
    if(item.details !== undefined){
        document.getElementById("detailsText").value = item.details;
    }
    if(item.links !== undefined){
        document.getElementById("itemLinks").value = item.links;
    }
    //listener to save
    let confirmBtn = document.getElementById("saveChanges");

    confirmBtn.addEventListener("click", () =>{
        $("#itemEditCenter").modal('hide');
        commitChanges();
    });
    //make the save button a toggle for the confirmation modal? TODO check if this works
    //If it doesn't go back to using event listener
    // confirmBtn.setAttribute("data-toggle", "modal");
    // confirmBtn.setAttribute("data-target", "#editConfirmation");

    //event listener to toggle between event and action inputs
    let toggleType = document.getElementById("typeItem");
    toggleType.addEventListener('change', () =>{setUpdateForm(item)});
    

}


function newItem(){
    //initialize as an action item
    document.getElementById('typeItem').value = "Action Item";
    //Make sure it is all empty values TODO

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
    if(currentType.value === 'action') {
        itemStatus.style.display = 'inline-block';
        dueDateShow.style.display = 'inline-block';
        startTimeShow.style.display = 'none';
        endTimeShow.style.display = 'none';
        if(item.dueDate !== undefined){
            document.getElementById('dueDate').value = item.dueDate;
        }else{
            document.getElementById('dueDate').value = "";
        }

    } else if (currentType.value === 'event') {
        itemStatus.style.display = 'none';
        dueDateShow.style.display = 'none';
        startTimeShow.style.display = 'inline-block';
        endTimeShow.style.display = 'inline-block';
        //TODO this is loading another item's times if it is undefined. I think it is just 
//being written somewhere else and not getting overridden TODO CHECK
        if(item.start !==undefined){
            document.getElementById("startTime").value = item.start;
        } else{
            //if there is not a defined value, the html value will 
            //still be the value it was last set to
            document.getElementById("startTime").value = "";
        }
        if(item.end !== undefined){
            document.getElementById("endTime").value = item.end;
        } else{
            document.getElementById("endTime").value ="";
        }
    }
}

/**
 * Closes editing modal and opens a new confirmation modal.
 */
function commitChanges(){
    //fill confirmation modal with information
    //open confirmation modal
    $("#editConfirmation").modal('show');

    //close modal and open confirmation modal
}

loadCalendars(0);
/**
 * {
            id:'1',
            name:'Greek 200', 
            admin:true,
            items: [
                {name:'Agape Test', date:'10/31/2020', type:'event',status:"Not Started"},
                {name:'Alpha', date:'11/5/2020', type:'event', status:"Not Started"},
                {name: 'Reading', date:'11/7/2020', type:'action', status:"In Progress"}
            ],
          
        }
 */