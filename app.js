require('dotenv').config();
let express = require('express');
let app = express();

const sequelize = require("./db");
sequelize.sync();
app.use(require("./middleware/headers"));
app.use(express.json());


let user = require('./controllers/user-controller');
app.use('/user', user);

let recipe = require('./controllers/recipe-controller');
app.use('/recipe', recipe);

let ingredient = require('./controllers/ingredient-controller');
app.use('/ingredient', ingredient);

app.listen(3000, function(){
    console.log('App is listening on port 3000');
})