const {auth, users, todos, calendars, items} = require('./controllers');

const express = require('express');
const path = require('path');
const app = express();

// serve static files
const dir = __dirname;
app.use('/images', express.static(path.join(dir, 'images')));
app.use('/css', express.static(path.join(dir, 'css')));
app.use('/js', express.static(path.join(dir, 'js')));
app.use(express.static(path.join(dir, 'html')));

app.set('json spaces', '\t');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router(); // routes API requests

// router.get('/calendars/ours', calendars.ours);

router.post('/login', auth.login);  // done
router.post('/signup', auth.signup);  // done

router.use('/user', auth.checkToken);  // done

router.get('/user', users.find);  // done
router.delete('/user', users.remove);  // done

router.get('/user/todos', todos.list);  // done
router.post('/user/todos', todos.add);  // done
router.get('/user/todos/:todo', todos.find);  // done
router.put('/user/todos/:todo', todos.edit);  // done
router.delete('/user/todos/:todo', todos.remove);  // done
router.put('/user/todos/:todo/archive', todos.archive);  // done
router.put('/user/todos/:todo/unarchive', todos.unarchive);  // done

// // OWNED CALENDARS
// router.get('/user/calendars', calendars.list);
// router.post('/user/calendars', calendars.add);

// router.get('/user/calendars/items', calendars.listItems); // query string, order by closest in time

// router.get('/user/calendars/:cal', calendars.find);
// router.put('/user/calendars/:cal', calendars.edit);
// router.delete('/user/calendars/:cal', calendars.remove);

// router.get('/user/calendars/:cal/items', items.list);
// router.post('/user/calendars/:cal/items', items.add);
// router.get('/user/calendars/:cal/items/:item', items.find);
// router.put('/user/calendars/:cal/items/:item', items.edit);
// router.delete('/user/calendars/:cal/items/:item', items.remove);

// // SUBSCRIPTIONS
// // router.get('/user/subscriptions', subscriptions.list); // contains source items for comparison
// router.get('/user/subscriptions/diff', subscriptions.findUpdated); // find any new or changed items from source
//                                                                     // any items in source not referenced by an item in branch
//                                                                     // or any items in source different from the item that references it
// router.put('/user/subscriptions/pull', subscriptions.pull);

app.use('/api', router);

const port = process.env.port || 3000; 
app.listen(port, () => {
	console.log('Listening on http://localhost:' + port);
});

// Generic GET handler;
function GET(url, handler) {
    router.get(url, async (req, res) => {
        try {
            const data = await handler(req);
            res.json({
                success: true,
                data
            });
        } catch (error) {
            res.json({
                success: false,
                error: error.message || error
            });
        }
    });
}