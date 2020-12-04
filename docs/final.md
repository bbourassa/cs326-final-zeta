# Zeta
## Life On Track
Fall Semester 2020

### Overview  
---
Our web application is called "Life On Track" and is a scheduling app geared towards teachers and students but has full capabilities to be used for daily planning purposes and everyday use. "Life on Track" allows you to create shareable "calendars" that allow you to create action items or events to share with yourself and others. It also provides you with your own personal calendar that you can customize to include the information that pertains the most to you. This is where "Life On Track" stands out from other scheduling web apps. With many platforms like Google Calendars, Apple Calendars, etc., most of the time if you edit an item on your calendar, if others are associated with this event, they will get these updates. "Life On Track" allows you to pick and choose the updates that pertain the most to you. It also allows you to add those events or items to your personal calendar and customize them to your liking without affecting other users' personal items. Each calendar you create in the Calendar Gallery places you as an admin of that particular calendar and you have the ability to customize these calendars under "Subscriptions" as well. This is where your subscribers will see your admin updates and will have the ability to pull in the changes or not - whichever they may choose. Another aspect that sets "Life On Track" apart is the To-Do List feature on your Personal Calendar page. This option has been provided to allow the user to maintain productivity and create small quick lists with the option to archive items based on how they see fit. The "Life On Track" admins have also provided you with a few curated calendars you may choose to subscribe to in order to allow you to expand and explore new interests. We have worked to put together four premade calendars that will change and be updated monthly - "Song of the Day", "Daily Mantra", "Daily Podcast", and "Daily Updates". These calendars are available to you and you can add them to your personal as you see fit. This gives you the opportunity to expand your horizons or check out some new interests if you would like. Overall, the thing that sets "Life On Track" apart from others is it is built to be a customizable calendar and productivity app such that you can track your own items and events in your own way as well as keep track of your personal completion of events without overstepping others' changes. It also allows you to stay up to date with any possible changes to events or items from others you may need to know about.
### Team Members  
---
Britney Bourassa, git alias: bbourassa  
Meghan Arnold, git alias: arnol24m  
Sara Whitlock, git alias: nimwhit  
### User Interface  
---
The User Interface is broken into three main sections - Personal Calendar, Subscriptions, and Calendar Gallery. 

## Personal Calendar
The personal calendar is the section of the user interface that holds your completely personalized items. These are items or events that you have added to your calendar from the Subscriptions page. Here is where you can edit and customize these items to your liking as well as track your progress by switching the status. The action items you have are set to their status when you click on a day from the calendar. The events are simply under today's schedule. The calendar on the left shows days that have items on them outlined in grey. The current day is in red and is the default "Day at a Glance" view. The personal calendar interface also has a "To-Do" list that allows you to create quick to-dos for yourself. Checking off the to-dos archives them for 24 hours so that on the off chance that something is archived before it is meant to be, it can be recovered for up to 24 hours.

## Subscriptions
The subscriptions page interface is where your calendars - both created and subscribed - are stored in table form. This provides a list of all action items and events that have been added by the owner and allow for users to pick and choose what they want to add from the overall calendar to be added to their presonal calendar. The settings portion on the right side of the page are different depending on whether or not you are an "Admin" or owner of a calendar. You know which calendars you are an "Admin" of by looking at the subscriptions navigation pane which lists "- ADMIN" next to the calendar names you own.

# Subscriptions - Subscriber View
When you are a "subscriber" to the calendar you have the ability to add selected items, add all action items, or add events to your personal calendar. You can also select items that have been updated by the owner and apply those updates to the events and action items on your personal. It is important to note that the current implementation is that updating an item on your personal will replace any edits you have made with the owner's updates. This is the current implementation as there are many user cases where this could be helpful. 

# Subscriptions - Admin View
When you are an "admin" of a calendar your settings change. As an admin, you have an edit capability on the table that allows you to update items as you see fit and will provide your subscribers with those updates. You are also able to add items to the table on your subscription page. You have two deltion capabilities - you can delete selected items or choose to delete your whole calendar which would then delete it for your subscribers as well. You also are able to generate a letter code for your calendar on this page to share with other users to allow them to subscribe to your calendar.

## Calendar Gallery
The calendar gallery is where calendar creation and subscription happens. The first section contains the admin curated calendars that are free for you to subscribe to. Hitting "Add Calendar" redirects you to your Subscriptions page and places you on the calendar you just added. These calendars are monthly calendars that will be updated by the admins for each month. The second portion allows you to create your own calendar. You simply enter the name of your calendar and hit the "Create New Calendar" button and will be redirected to the Subscriptions page under your new calendar. The third portion allows you to subscribe to another user's calendar using a code they give you. All codes are case sensitive and must be lowercase. You enter your code and hit "Subscribe to Calendar" to be redirected to the subscriptions page under your newly subscribed calendar. You cannot subscribe to a calendar more than once.  

## Login/Sign Up
Login and sign-up interfaces are very generic. To sign up you give your first and last name, an email, and create a username and passowrd. You are required to confirm your password. Your information is used to connect you up to your personal calendar and subscriptions/created calendars. Your username and password are also used on the login page to log you in as you would normally do on any other website.

### API  
---
### Database  
---

Our database was create with Postges.

#### Users table
| Column| Data Type| Description|
|---|---|---|
| id| Integer Primary Key  | Identifying number used as reference |
| username| Varchar| Name the users logs in with|
| firstname| Varchar| First name the user registered with  |
| lastname| Varchar| Last name the user registered with   |
| email| Varchar| Email the user registered with       |
| calendar_id| Integer Unique| Id for the user's personal calendar  |
| salt| Varchar| Salt code associated with the user's password |
| hash| Varchar| Hash code associated with the user's password  |

#### Todos Table
| Column| Data Type | Description |
|---|---|---|
| id | Integer Primary Key  | Id used as ref. for todo item |
| content | Varchar | Content of the todo item |
| user_id | Integer | User that the todo item belongs to |
| archived | Integer | Indicator of whether item has been archived |
| time_of_archive | Varchar | Time that the item was archived, if applicable |

#### Subscriptions table
| Column| Data Type | Description |
|---|---|---|
| id | Integer Primary Key  | Identifying number used as reference |
| user_id | Integer | User that is subscribed to given cal |
| calendar_id | Integer | Id of calendar user s subscribed to  |

#### Items table
| Column | Data Type | Description |
|---|---|---|
| id | Integer Primary Key  | Id used as ref. to item |
| name | Varchar | Name of the item |
| item_type | Integer | Item is either 1=action item or 2=event |
| start_time | Varchar | Time at which an event starts or an action is due |
| end_time | Varchar | Time at which the event should end |
| description | Text | Description listed in the item |
| item_status | Integer | 0= no status(event),  1= not started, 2= in progress, 3= completed |
| calendar_id | Integer | Calendar that the item is on |
| related_links | TEXT | Links that are related to this item |
| parent_id | Integer | Id of the calendar this item came from. Used to fetch updates to an item already on personal calendar |

#### Calendars table
| Column| Data Type| Description|
|---|---|---|
| id | Integer Primary Key  | Id used as ref. to calendar |
| name | Varchar | Name of the calendar |
| owner_id | Integer | User id of the user that created the cal |
| personal | Integer | Whether the calendar is a personal cal; 1= personal |
| description | Text | Description of the calendar |

### URL Routes/Mappings  
---
### Authentication/Authorization  
---
### Division of Labor  
---
**Britney Bourassa** -- Personal Calendar creation and implementation; front-end of login and sign up; Database set up and implementation; API functionality; Pre-made calendars; Debugging; documentation  
**Meghan Arnold** -- Subscriptions creation and implementation; Item creation; back-end of login authentication; Database set up; API functionality; Pre-made calendars; Debugging; Documentation  
**Sara Whitlock** -- API stubs; API functionality; Fake data generation

### Conclusion  
