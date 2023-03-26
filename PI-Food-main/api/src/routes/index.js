const { Router } = require('express');
const recipes = require("./rutas/recipes_route")
const diets = require("./rutas/diets_route")


// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();//me ayuda a modularizar

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/recipes", recipes)//hace la conexión a /recipes con el middelware
router.use("/diets", diets)//
module.exports = router;
