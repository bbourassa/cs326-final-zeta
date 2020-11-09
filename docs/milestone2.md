
<title>Zeta Group: Milestone 2</title>
<br>
<h1>Contributions</h1>
<p>Britney Bourussa: Personal Cal implementation, login & sign up, api functionality </p>
<p>Meghan Arnold: Subscriptions page, calendar and item creation, api functionailty</p>
<p>Sara Whitlock: Api stubs, api functionality, faker stubs</p>

<br>

<h1>Front-End Information</h1>
<p>User interface for: Personal Calendar</p>
<p>User interface for: Creating a calendar</p>
<p>User interface for: Subscrptions Page</p>

<br>

<h1>API</h1>
<ul>
    <li>
        <meta charset="utf-8">
    </li>
    <li dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;">API Endpoints:</li>
</ul>
<ul style="margin-top:0;margin-bottom:0;">
    <li>
        <p>/api/login</p>
        <ul>
            <li>
                <p>POST: Handles user login. The request data should contain all the information needed to verify (email, password).</p>
            </li>
        </ul>
    </li>
    <li>
        <p>/api/users</p>
        <ul>
            <li>
                <p>GET: Returns all the users.</p>
            </li>
            <li>
                <p>POST: Handles user registration. Creates a new user from the request data and adds it to the database. The request data should contain all the information needed to create a new user (first name, last name, email, username, password).</p>
            </li>
        </ul>
    </li>
    <li>
        <p>/api/users/{user_id}</p>
        <ul>
            <li>
                <p>GET: Returns the specified user.</p>
            </li>
            <li>
                <p>DELETE: Deletes the specified user.</p>
            </li>
        </ul>
    </li>
    <li>
        <p>/api/users/{user_id}/todos</p>
        <ul>
            <li>
                <p>GET: Returns the user&apos;s todo list, including any archived items.</p>
            </li>
            <li>
                <p>POST: Creates a new todo item for the specified user. The request body should contain the string that the user wants to make into a todo item.</p>
            </li>
        </ul>
    </li>
    <li>
        <p>/api/users/{user_id}/todos/{todo_id}</p>
        <ul>
            <li>
                <p>GET: Returns the specified todo item.</p>
            </li>
            <li>
                <p>PUT: Edits the specified todo item. The request body should contain the item properties to be modified.</p>
            </li>
            <li>
                <p>DELETE: Deletes the specified todo item.</p>
            </li>
        </ul>
    </li>
    <li>
        <p>/api/users/{user_id}/subscriptions</p>
        <ul>
            <li>
                <p>GET: Returns all the user&apos;s subscriptions.</p>
            </li>
            <li>
                <p>POST: Create a new subscription for the user. This allows a user to subscribe to a calendar. The request data should contain the ID of the calendar that the user wants to subscribe to.</p>
            </li>
        </ul>
    </li>
    <li>
        <p>/api/users/{user_id}/subscriptions/calendars</p>
        <ul>
            <li>
                <p>GET: Returns all the user&apos;s subscribed calendars, including ones they created. This does not include the user&apos;s personal calendar.</p>
            </li>
        </ul>
    </li>
    <li>
        <p>/api/users/{user_id}/subscriptions/calendars/items</p>
        <ul>
            <li>
                <p>GET: Returns all the user&apos;s subscribed calendars as a list of objects. Each object contains a calendar ID, name, owner ID, and a list of items in that calendar.</p>
            </li>
            <li>
                <p>Example output&nbsp;(using the fake data for User 3)</p>
            </li>
        </ul>
    </li>
    <li>
        <p>/api/users/{user_id}/subscriptions/{sub_id}</p>
        <ul>
            <li>
                <p>GET: Returns the specified subscription.</p>
            </li>
            <li>
                <p>DELETE: Deletes the specified subscription. Allows a user to unsubscribe from a calendar.</p>
            </li>
        </ul>
    </li>
    <li>
        <p>/api/users/{user_id}/calendar/pull</p>
        <ul>
            <li>
                <p>PUT: Updates the user&apos;s personal calendar to include the items that the user wants to add from their subscriptions. The request data should contain (???).</p>
            </li>
        </ul>
    </li>
    <li>
        <p>/api/calendars</p>
        <ul>
            <li>
                <p>GET: Returns all the calendars in the database.</p>
            </li>
            <li>
                <p>POST: Creates a new calendar and adds it to the database. The request data should contain all the information needed to create a new calendar.</p>
            </li>
        </ul>
    </li>
    <li >
        <p>/api/calendars/ours</p>
        <ul>
            <li>
                <p>GET: Returns all the premade calendars offered by the site.</p>
            </li>
        </ul>
    </li>
    <li>
        <p>/api/calendars/{cal_id}</p>
        <ul>
            <li>
                <p>GET: Returns the calendar specified by the ID.</p>
            </li>
            <li>
                <p>PUT: Updates the specified calendar. The request data should contain the calendar properties to be modified. (probably only the name can be changed?)</p>
            </li>
            <li>
                <p>DELETE: Deletes the specified calendar.</p>
            </li>
        </ul>
    </li>
    <li>
        <p>/api/calendars/{cal_id}/subscriptions</p>
        <ul>
            <li>
                <p>GET: Returns all the subscriptions that involve the specified calendar.</p>
            </li>
        </ul>
    </li>
    <li>
        <p>/api/calendars/{cal_id}/subscriptions/users</p>
        <ul>
            <li>
                <p>GET: Returns all the users that subscribe to the specified calendar.</p>
            </li>
        </ul>
    </li>
    <li>
        <p>/api/calendars/{cal_id}/items</p>
        <ul>
            <li>
                <p>GET: Returns all the items in the specified calendar.</p>
            </li>
            <li>
                <p>POST: Creates a new item and adds it to the specified calendar. The request data should contain all the information needed to create a new item.</p>
            </li>
        </ul>
    </li>
    <li>
        <p>/api/calendars/{cal_id}/items/{item_id}</p>
        <ul>
            <li>
                <p>GET: Returns the specified item.</p>
            </li>
            <li>
                <p>PUT: Updates the specified item. The request data should contain the item properties to be modified.&nbsp;**Right now, it will take all item data, changed or unchanged. If we have time, will adjust subscriptions commitChanges to only send changed data</p>
            </li>
            <li>
                <p>DELETE: Deletes the specified item.</p>
            </li>
        </ul>
    </li>
    <li >
        <p>/api/calendars/{cal_id}/items?year={year}&amp;month={month}</p>
        <ul>
            <li>
                <p>GET: Returns all the items in the calendar that occur within the given month. Includes any events that start or end in the month.</p>
            </li>
        </ul>
    </li>
    <li>
        <p>/api/calendars/{cal_id}/items?year={year}&amp;month={month}&amp;day={day}</p>
        <ul>
            <li>
                <p>GET: Returns all the items in the calendar that occur on the given day.</p>
            </li>
        </ul>
    </li>
    <li>
        <p>/api/subscriptions</p>
        <ul>
            <li>
                <p>GET: Returns all the subscriptions in the database.</p>
            </li>
        </ul>
    </li>
    <li>
        <p>/api/todos</p>
        <ul>
            <li>
                <p>GET: Returns all the todo items in the database.</p>
            </li>
        </ul>
    </li>
    <li >
        <p >/api/items</p>
        <ul>
            <li>
                <p >GET: Returns all the items in the database</p>
            </li>
        </ul>
    </li>
</ul>