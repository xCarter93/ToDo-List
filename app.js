const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

let items = [];


app.get('/', (req, res) => {

    let today = new Date()
    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };
    let currentDay = today.toLocaleString('en-us', options);

    res.render('list', {dayName: currentDay, newListItems: items});

});

app.post('/', (req, res) => {

    let item = req.body.newItem;
    items.push(item);
    res.redirect('/');

});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running`);
});