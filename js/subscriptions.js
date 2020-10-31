'use strict';



/**
 * Load all of the user's subscription calendars
 * @param {int} userId 
 */
function loadCalendars(userId){
    const cals = [
        {
            id:'01',
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
            id:'02',
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
        let aCal = document.createElement('button');
        aCal.innerHTML=cal.name;
        aCal.classList.add('subscribed', 'btn', 'btn-light');
        aCal.addEventListener('click', () =>{
            while(document.getElementById("subscribed-cals").childNodes.length>0){ ///////TODO why isn't the while breaking?
                console.log(document.getElementById("event-table").childNodes.length);
                document.getElementById("event-table").removeChild
                    (document.getElementById("event-table").childNodes[0]);
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
                {name: 'Zoom meeting', date:'11/3/2020', type:'event'},
                {name: 'Milestone 2', date:'11/6/2020', type:'action'}, 
                {name:'Homework 9', date: '11/2/2020', type:'action'}
            ]
            
        },
        {
            id:'0',
            name:'Greek 200', 
            admin:true,
            items: [
                {name:'Agape Test', date:'10/31/2020', type:'event'},
                {name:'Alpha', date:'11/5/2020', type:'event'},
                {name: 'Reading', date:'11/7/2020', type:'action'}
            ],
          
        }
    ];
    
    // const r = await  db.any('SELECT events, actions FROM (SELECT * FROM cals WHERE id= $1)', calId)
    const thisCal = cals[0]; //TODO temporary -- once i have the db set up, I can figure out how to 
        //make this work with r
    thisCal.items.forEach((item) => {
        let anItem = document.createElement('tr');

        let check = document.createElement('td');
        let box = document.createElement('input');
        box.type ='checkbox';
        anItem.appendChild(check.appendChild(box));

        let name= document.createElement('td');
        name.innerHTML = item.name;
        anItem.appendChild(name);

        let date = document.createElement('td');
        date.innerHTML = item.date;
        anItem.appendChild(date);

        let type = document.createElement('td');
        type.innerHTML = item.type;
        anItem.appendChild(type);

        document.getElementById('event-table').appendChild(anItem);
    });

    

}

function makeAllListners(){

}
// window.onload(loadCalendars());
loadCalendars(0);