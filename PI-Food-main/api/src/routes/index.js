const { Router } = require('express');
const recipeRouter = require('./recipeRouter');


// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/recipes', recipeRouter);

module.exports = router;
