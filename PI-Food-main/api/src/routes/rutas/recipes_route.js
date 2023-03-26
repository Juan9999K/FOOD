const router = require('express').Router();
const {rece, idRece, postRecipe} = require ("../controllers/controllers.js") 
const { Recipe, Diets } = require("../../db");

router.get("/", async (req, res) => {//async es cuando hago una petición a una fuente externa
  const {name } = req.query;//traigame esto por nombre
  try{
  if(name){//si la receta existe me va devolver va ser una funcion rece que recibe un name
      const devolver = await rece(name)
      res.status(200).json(devolver)
  }

  else{// si no ingreso ningun name me trae todas las recetas
      const todas = await rece()
      res.status(200).json(todas)
  }
} 
catch(err){// si la receta que pase por name no existe me va mandar error
  res.status(400).send(err)
}
})



router.post("/", async (req, res) => {

  try {
      const objRecipe = req.body;
      if (!objRecipe) res.status(404).send("Missing info")// si no ingresa el nombre a body
      const newRecipe = await postRecipe(objRecipe)

      res.status(201).send(newRecipe)

  } catch (error) {
      res.status(404).send(error);
  }
})


router.get("/:idReceta", async (req, res) => {
    const {idReceta } = req.params;
    try{

        const IdRec = await idRece(idReceta)
        res.status(200).json(IdRec)
    }
catch(err){
    res.status(400).send(err)
}
})






router.put("/:id", async (req, res) => {// el put para modificar la receta 
    const { id } = req.params;
    const { name, summary, steps, healthScore, diets, image } = req.body;
    try {
      const recipe = await Recipe.findByPk(id);
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
  
      await Recipe.update(
        {
          name: name,
          summary: summary,
          image: image,
          steps: steps,
          healthScore: healthScore,
        },
        {
          where: {//teniendo en cuenta el id
            id: id,
          },
        }
      );

      //este código maneja la actualización de una receta en la base de datos y su relación con el modelo de dietas.
      if (diets.length) {//si ahi informacion de la dieta
        await recipe.setDiets([]);
        diets.forEach(async (e) => {
          const diet = await Diets.findOne({
            where: {
              name: e,
            },
          });
          if (diet) {
            await recipe.addDiet(diet);
          }
        });
      }
  
      // Obtener la instancia actualizada de la receta
      const updatedRecipe = await Recipe.findByPk(id, {// para buscar una receta específica 
        include: [{ model: Diets }],
      });
      return res.status(200).json(updatedRecipe);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });
 
module.exports = router;