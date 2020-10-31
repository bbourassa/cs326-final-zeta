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
            events: [
                {name: 'Zoom meeting', date:'11/3/2020'},
                ],
            action: [
                {name: 'Milestone 2', date:'11/6/2020'}, 
                {name:'Homework 9', date: '11/2/2020'}
            ]
        },
        {
            id:'1',
            name:'Greek 200', 
            admin:true,
            events: [
                {name:'Agape Test', date:'10/31/2020'},
                {name:'Alpha', date:'11/5/2020'}
            ],
            action: [
                {name: 'Reading', date:'11/7/2020'}
            ]
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
                {name: 'Zoom meeting', date:'11/3/2020', type:'event', status:"Not Started"},
                {name: 'Milestone 2', date:'11/6/2020', type:'action',status : "In Progress"}, 
                {name:'Homework 9', date: '11/2/2020', type:'action', status:"In Progress"}
            ]
            
        },
        {
            id:'1',
            name:'Greek 200', 
            admin:true,
            items: [
                {name:'Agape Test', date:'10/31/2020', type:'event',status:"Not Started"},
                {name:'Alpha', date:'11/5/2020', type:'event', status:"Not Started"},
                {name: 'Reading', date:'11/7/2020', type:'action', status:"In Progress"}
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

        //creates the progress marker
        let status = document.createElement('td');
        let prog = document.createElement("button");
        prog.classList.add("btn","btn-sm", "disabled");
        prog.classList.add( (item.status === "In Progress" ? "btn-warning":"btn-danger"));
        prog.innerHTML=item.status;
        status.appendChild(prog);
        anItem.appendChild(status);


        if(thisCal.admin){
            let editable = document.createElement('td');
            let editBtn = document.createElement("button");
            editBtn.setAttribute("data-toggle", "modal");
            editBtn.setAttribute("data-target", "#itemEditCenter");
            editBtn.setAttribute("type", "button");
            editBtn.classList.add("btn", "btn-outline-primary", "btn-sm");
            editBtn.innerHTML = "Edit";
            editable.appendChild(editBtn);
            anItem.appendChild(editable);
        }

        document.getElementById('eventTable').appendChild(anItem);
    });

    

}

function makeAllListners(){

}
// window.onload(loadCalendars());
loadCalendars(0);