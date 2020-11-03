'use strict';



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

        let name= document.createElement('td');
        name.innerHTML = item.name;
        anItem.appendChild(name);

        let date = document.createElement('td');
        date.innerHTML = item.date;
        anItem.appendChild(date);

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
            //pop up modal with any details, non-editable
        })
        info.appendChild(infoBtn);
        anItem.appendChild(info);

        
        if(thisCal.admin){
            let editable = document.createElement('td');
            let editBtn = document.createElement("button");
            editBtn.setAttribute("data-toggle", "modal");
            editBtn.setAttribute("data-target", "#itemEditCenter");
            editBtn.setAttribute("type", "button");
            editBtn.classList.add("btn", "btn-outline-primary", "btn-sm");
            editBtn.innerHTML = "Edit";
            editBtn.addEventListener("click", ()=> loadModal(item));
            document.getElementById("saveChanges").addEventListener("click", () =>{
                commitChanges();
            });

            let toggleType = document.getElementById("typeItem");
            toggleType.addEventListener('change', setUpdateForm());
            
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
    // document.getElementById("due").value = item.date;
    setUpdateForm(item);
    if(item.details !== undefined){
        document.getElementById("detailsText").value = item.details;
    }
    if(item.links !== undefined){
        document.getElementById("itemLinks").value = item.links;
    }
    
    

}

function newItem(){
    //initialize as an action item
    document.getElementById('typeItem').value = "Action Item";

}

/**
 * Function to switch between date settings in the edit modal
 */
function setUpdateForm(item) {
    let currentType = document.getElementById('typeItem');
    let itemStatus = document.getElementById('showStatus');
    let dueDateShow = document.getElementById('showDueDate');
    let startTimeShow = document.getElementById('showStartTime');
    let endTimeShow = document.getElementById('showEndTime');
    if(currentType.value === 'Action Item') {
        itemStatus.style.display = 'inline-block';
        dueDateShow.style.display = 'inline-block';
        startTimeShow.style.display = 'none';
        endTimeShow.style.display = 'none';
        console.log("tst");
        if(item.dueDate !== undefined){
            console.log("test");
            document.getElementById('dueDate').value = item.dueDate;
        }

    } else if (currentType.value === 'Event') {
        itemStatus.style.display = 'none';
        dueDateShow.style.display = 'none';
        startTimeShow.style.display = 'inline-block';
        endTimeShow.style.display = 'inline-block';
    }
}

/**
 * Closes editing modal and opens a new confirmation modal.
 */
function commitChanges(){
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