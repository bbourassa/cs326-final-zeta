# Zeta Group: Milestone 3

## Contributions
Britney Bourassa: database set up; database implementation; 2 pre-made calendars; debugging

Meghan Arnold: Authentication; 2 pre-made calendars; debugging. Please note that authentication ended up being very difficult, and Meghan spent most of a week trying to get it to work.

## Database Collections


### Users table
| Column     | Data Type            | Description                          |
|------------|----------------------|--------------------------------------|
| id         | Integer Primary Key  | Identifying number used as reference |
| username   | Varchar              | Name the users logs in with          |
| firstname  | Varchar              | First name the user registered with  |
| lastname   | Varchar              | Last name the user registered with   |
| email      | Varchar              | Email the user registered with       |
| calendar_id| Integer Unique       | Id for the user's personal calendar  |
| salt       | Varchar              | Salt code assoc. with the user passw |
| hash       | Varchar              | Hash code assoc. with user password  |

### Todos Table
| Column          | Data Type            | Description                                    |
|-----------------|----------------------|------------------------------------------------|
| id              | Integer Primary Key  | Id used as ref. for todo item                  |
| content         | Varchar              | Content of the todo item                       |
| user_id         | Integer              | User that the todo item belongs to             |
| archived        | Integer              | Indicator of whether item has been archived    |
| time_of_archive | Varchar              | Time that the item was archived, if applicable |

### Subscriptions table
| Column      | Data Type            | Description                          |
|-------------|----------------------|--------------------------------------|
| id          | Integer Primary Key  | Identifying number used as reference |
| user_id     | Integer              | User that is subscribed to given cal |
| calendar_id | Integer              | Id of calendar user s subscribed to  |

### Items table
| Column        | Data Type            | Description                                          |
|---------------|----------------------|-----------------------------------------------------|
| id            | Integer Primary Key  | Id used as ref. to item                              |
| name          | Varchar              | Name of the item                                     |
| item_type     | Integer              | Item is either 1=action item or 2=event              |
| start_time    | Varchar              | Time at which an event starts or an action is due    |
| end_time      | Varchar              | Time at which the event should end                   |
| description   | Text                 | Description listed in the item                       |
| item_status   | Integer              | 0= no status(event),  1= not started, 2= in progress, 3= completed|
| calendar_id   | Integer              | Calendar that the item is on                         |
| related_links | TEXT                 | Links that are related to this item                  |
| parent_id     | Integer              | Id of the calendar this item came from. Used to fetch updates to an item already on personal calendar |

### Calendars table
| Column        | Data Type            | Description                                         |
|---------------|----------------------|-----------------------------------------------------|
| id            | Integer Primary Key  | Id used as ref. to calendar                         |
| name          | Varchar              | Name of the calendar                                |
| owner_id      | Integer              | User id of the user that created the cal            |
| personal      | Integer              | Whether the calendar is a personal cal; 1= personal |
| description   | Text                 | Description of the calendar                         |

