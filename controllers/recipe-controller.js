const router = require("express").Router();
const Recipe = require("../db").import('../models/recipe');
const validateSession = require('../middleware/validateSession');
const Ingredient = require("../db").import('../models/ingredient');
// const RecipeIngredients = require("../db").import('../models/recipeIngredients');
const fetch = require("node-fetch");
const {Op} = require("sequelize");

//Recipe Create
router.post('/', validateSession, (req, res) => {
    Recipe.create({
        recipeName: req.body.recipeName,
        servings: req.body.servings,
        readyInMinutes: req.body.readyInMinutes,
        ingredientList: req.body.ingredientList,
        steps: req.body.steps,
        calories: req.body.calories,
        userID: req.user.id
    })
    .then((recipe) => res.status(200).json({message: "Recipe successfully created!", recipe}))
    .catch(err => res.status(500).json({error: err}))
})

//Recipe Search
router.get("/:searchTerm", (req, res) => {
    const apiKey = process.env.API_KEY;

    const headers = {
        "Content-Type": "application/json",
    };

    const searchTerm = req.params.searchTerm;

    const searchURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${searchTerm}&number=5&addRecipeInformation=true&addRecipeNutrition=true&fillIngredients=true&instructionsRequired=true`;

    fetch(searchURL, {
        method: "GET",
        headers: headers
        
    })
    .then(result => result.json())
    .then(result => res.status(200).json(result))
    .catch((err) => res.status(500).json({ error: err}));
});

//Save a recipe from Spoonacular
router.post("/:recipeID", validateSession, (req, res) => {
    const apiKey = process.env.API_KEY;

    const headers = {
        "Content-Type": "application/json",
    };

    const recipeID = req.params.recipeID;

    const recipeURL = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${apiKey}&includeNutrition=true`

    fetch(recipeURL, {
        method: "GET",
        headers: headers
    })
    .then(result => result.json())
    .then(recipe => {
        let ingredientsArray = [];
        recipe.extendedIngredients.forEach(ingredient => ingredientsArray.push(ingredient.originalString))
        let stepsArray = [];
        stepsArray = (recipe.instructions).split("\n");
        // console.log(stepsArray);
    Recipe.create({
        recipeName: recipe.title,
        servings: recipe.servings,
        readyInMinutes: recipe.readyInMinutes,
        ingredientList: ingredientsArray,
        steps: stepsArray,
        calories: recipe.nutrition.nutrients[0].amount,
        userID: req.user.id
    })})
    .then(savedRecipe => console.log(savedRecipe))
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({ error: err}));
})

//Get a specific recipe from Spoonacular
router.get("/recipe/:recipeID", (req, res) => {
    const apiKey = process.env.API_KEY;

    const headers = {
        "Content-Type": "application/json",
    };

    const recipeID = req.params.recipeID;

    const recipeURL = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${apiKey}&includeNutrition=true`

    fetch(recipeURL, {
        method: "GET",
        headers: headers
    })
    .then(result => result.json())
    .then((result) => res.status(200).json({message: "successful retrieval", result}))
    .catch((err) => res.status(500).json({ error: err}));
})

//Update a saved recipe
router.put('/:id', validateSession, (req, res) => {
    Recipe.update(
        req.body, {where: {
            recipeID: req.params.id
        }}
    )
    .then((recipe) => res.status(200).json({message: `${recipe.recipeName} was updated.`}))
    .catch(err => res.status(500).json({error: err}))
})

//Delete a saved recipe
router.delete('/:id', validateSession, (req, res) => {
    Recipe.destroy(
        {where: {recipeID: req.params.id}}
    )
    .then(() => res.status(200).json({message: `A recipe was removed.`}))
    .catch(err => res.status(500).json({error: err}))
})

//View a saved recipe
router.get('/saved/:id', validateSession, (req, res) => {
    let userid = req.user.id
    Recipe.findOne({where: {
        [Op.and]: [
            {userID: userid},
            {recipeID: req.params.id}
        ]
    }
    })
    .then(recipe => res.status(200).json(recipe))
    .catch(err => res.status(500).json({error: err}))
})

module.exports = router;
