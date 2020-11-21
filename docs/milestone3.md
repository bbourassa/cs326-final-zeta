<h1>Zeta Group: Milestone 3</h1>
<br>
<h2>Contributions</h2>
<p>Britney Bourassa: database set up; database implementation; 2 pre-made calendars; debugging </p>
<p>Meghan Arnold: Authentication; 2 pre-made calendars; debugging. Please note that authentication ended up being very difficult, and Meghan spent most of a week trying to get it to work. </p>
<br>
<h2>Database Collections</h2>

<br>
<p>Users table </p>
<p>| Column     | Data Type            | Description                          |</p>
<p>---------------------------------------------------------------------------|</p>
<p>| id         | Integer Primary Key  | Identifying number used as reference |</p>
<p>| username   | Varchar              | Name the users logs in with          |</p>
<p>| firstname  | Varchar              | First name the user registered with  |</p>
<p>| lastname   | Varchar              | Last name the user registered with   |</p>
<p>| email      | Varchar              | Email the user registered with       |</p>
<p>| calendar_id| Integer Unique       | Id for the user's personal calendar  |</p>
<p>| salt       | Varchar              | Salt code assoc. with the user passw |</p>
<p>| hash       | Varchar              | Hash code assoc. with user password  |</p>
<br>
<p>Todos Table</p>
<p>| Column          | Data Type            | Description                                    | </p>
<p>-------------------------------------------------------------------------------------------</p>
<p>| id              | Integer Primary Key  | Id used as ref. for todo item                  |</p>
<p>| content         | Varchar              | Content of the todo item                       |</p>
<p>| user_id         | Integer              | User that the todo item belongs to             |</p>
<p>| archived        | Integer              | Indicator of whether item has been archived    |</p>
<p>| time_of_archive | Varchar              | Time that the item was archived, if applicable |</p>

<p>Subscriptions table </p>
<p>| Column      | Data Type            | Description                          |</p>
<p>----------------------------------------------------------------------------|</p>
<p>| id          | Integer Primary Key  | Identifying number used as reference |</p>
<p>| user_id     | Integer              | User that is subscribed to given cal |</p>
<p>| calendar_id | Integer              | Id of calendar user s subscribed to  |</p>
<br>
<p>Items table</p>
<p>| Column        | Data Type            | Description                                          |</p>
<p>----------------------------------------------------------------------------------------------|</p>
<p>| id            | Integer Primary Key  | Id used as ref. to item                              |</p>
<p>| name          | Varchar              | Name of the item                                     |</p>
<p>| item_type     | Integer              | Item is either 1=action item or 2=event              |</p>
<p>| start_time    | Varchar              | Time at which an event starts or an action is due    |</p>
<p>| end_time      | Varchar              | Time at which the event should end                   |</p>
<p>| description   | Text                 | Description listed in the item                       |</p>
<p>| item_status   | Integer              | 0= no status(event),  1= not started, 2= in progress |</p>
<p>|               |                      | 3= completed                                         |</p>
<p>| calendar_id   | Integer              | Calendar that the item is on                         |</p>
<p>| related_links | TEXT                 | Links that are related to this item                  |</p>
<p>| parent_id     | Integer              | Id of the calendar this item came from. Used to fetch|</p>
<p>|               |                      | updates to an item already on personal calendar      |
<br>
<p>Calendars table</p>
<p>| Column        | Data Type            | Description                                         |</p>
<p>---------------------------------------------------------------------------------------------|</p>
<p>| id            | Integer Primary Key  | Id used as ref. to calendar                         |</p>
<p>| name          | Varchar              | Name of the calendar                                |</p>
<p>| owner_id      | Integer              | User id of the user that created the cal            |</p>
<p>| personal      | Integer              | Whether the calendar is a personal cal; 1= personal |</p>
<p>| description   | Text                 | Description of the calendar                         |</p>

