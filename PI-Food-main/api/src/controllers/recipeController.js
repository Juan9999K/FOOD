const axios = require('axios');
const { API_KEY } = process.env;

const recipeController = {
  // Obtener una receta por ID
  async getRecipeById(req, res) {
    const { idRecipe } = req.params;

    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/${idRecipe}/information?apiKey=${API_KEY}`);
      const recipe = response.data;

      res.json(recipe);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la receta.' });
    }
  },

  // Obtener una lista de recetas por nombre
  async getRecipeByName(req, res) {
    const { name } = req.query;

    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${name}&apiKey=${API_KEY}`);
      const recipes = response.data.results;

      res.json(recipes);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las recetas.' });
    }
  },

  // Crear una receta
  async createRecipe(req, res) {
    const { title, summary, ingredients, steps, diets, image } = req.body;

    try {
      const response = await axios.post(`https://api.spoonacular.com/recipes?apiKey=${API_KEY}`, {
        title,
        summary,
        extendedIngredients: ingredients,
        analyzedInstructions: steps.map((step) => ({ steps: [step] })),
        diets,
        image,
      });
      const recipe = response.data;

      res.json(recipe);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la receta.' });
    }
  },

  // Obtener una lista de dietas
  async getAllDiets(req, res) {
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=1`);
      const diets = response.data.nutrition.nutrients
        .filter((nutrient) => nutrient.title === 'Carbohydrates')
        .flatMap((nutrient) => nutrient.bad.map((diet) => diet.toLowerCase()));

      res.json(diets);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las dietas.' });
    }
  },
};

module.exports = recipeController;
