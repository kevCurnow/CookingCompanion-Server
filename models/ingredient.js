module.exports= (sequelize, DataTypes) => {
    const Ingredient = sequelize.define("ingredient", {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ingredientName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    });
    return Ingredient;
};