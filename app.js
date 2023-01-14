const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {

    var today = new Date()
    var options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };
    var currentDay = today.toLocaleString('en-us', options);

    res.render('list', {dayName: currentDay});

})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running`);
});