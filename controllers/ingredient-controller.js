const router = require("express").Router();
const validateSession = require('../middleware/validateSession');
const Ingredient = require("../db").import('../models/ingredient');

//Ingredient Create
router.post('/', validateSession, (req, res) => {
    Ingredient.create({
        ingredientName: req.body.ingredientName,
        quantity: req.body.quantity,
        userID: req.user.id
    })
    .then((ingredient) => res.status(200).json({message: "Ingredient successfully created!", ingredient}))
    .catch(err => res.status(500).json({error: err}))
})

//Get All Ingredients for User
router.get('/', validateSession, (req, res) => {
    let userid = req.user.id
    Ingredient.findAll({
        where: {userID: userid}
    })
    .then(ingredients => res.status(200).json(ingredients))
    .catch(err => res.status(500).json({error: err}))
})

//Update Ingredient
router.put('/:id', validateSession, (req, res) => {
    Ingredient.update(
        req.body, {where:
            {id: req.params.id}
        }
    )
    .then((ingredient) => res.status(200).json({message: "Ingredient updated."}))
    .catch(err => res.status(500).json({error: err}))
});

//Delete Ingredient
router.delete('/:id', validateSession, (req, res) => {
    Ingredient.destroy({
        where: {id: req.params.id}
    })
    .then((ingredient) => res.status(200).json({message: `${ingredient.ingredientName} was removed.`}))
    .catch(err => res.status(500).json({error: err}))
})


module.exports = router;