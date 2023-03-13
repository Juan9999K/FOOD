const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { Recipe } = require('../db');

router.get('/recipes', async (req, res) => {
  try {
    const { page, limit } = req.query;
    const offset = (page - 1) * limit;
    const recipes = await Recipe.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: Diet,
    });
    const totalRecipes = recipes.count;
    const totalPages = Math.ceil(totalRecipes / limit);
    res.status(200).json({
      currentPage: parseInt(page),
      totalPages: totalPages,
      totalRecipes: totalRecipes,
      recipes: recipes.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving recipes' });
  }
});


// Ruta para obtener el detalle de una receta
router.get('/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;

  try {
    // Buscar la receta por ID
    const recipe = await Recipe.findOne({
      where: { id: recipeId },
    });

    // Si no se encuentra la receta, devolver un mensaje de error
    if (!recipe) {
      return res.status(404).json({ error: 'No se encontró la receta.' });
    }

    // Obtener los tipos de dieta asociados a la receta
    const diets = await recipe.getDiets();

    // Devolver el detalle de la receta
    return res.json({
      id: recipe.id,
      name: recipe.name,
      summary: recipe.summary,
      score: recipe.score,
      healthScore: recipe.healthScore,
      instructions: recipe.instructions,
      image: recipe.image,
      diets: diets.map((diet) => diet.name),
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el detalle de la receta.' });
  }
});

// Rutas para el controlador de recetas
router.get('/name', recipeController.getRecipeByName);
router.post('/', recipeController.createRecipe);
router.get('/diets', recipeController.getAllDiets);

module.exports = router;
