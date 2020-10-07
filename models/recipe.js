module.exports= (sequelize, DataTypes) => {
    const Recipe = sequelize.define("recipe", {
        recipeName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        servings: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        readyInMinutes: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ingredientList: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        },
        steps: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        },
        calories: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        recipeID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }

    });
    return Recipe;
}