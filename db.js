

require("dotenv").config()
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
});

sequelize.authenticate().then(
    function(){
        console.log('Connected to CookingCompanion database');
    },
    function(err){
        console.log(err);
    }
);

User = sequelize.import("./models/user");
Recipe = sequelize.import("./models/recipe");
Ingredient = sequelize.import("./models/ingredient");

User.hasMany(Recipe, {
    foreignKey: 'userID',
});
Recipe.belongsTo(User);



module.exports = sequelize;