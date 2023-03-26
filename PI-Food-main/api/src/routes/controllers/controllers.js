const axios = require("axios");
const  {Recipe, Diet}  = require("../../db");


//     "results": [{
//         "vegetarian": true,
//         "vegan": true,
//         "glutenFree": true,
//         "dairyFree": true,
//         "veryHealthy": true,
//         "cheap": false,
//         "veryPopular": true,
//         "sustainable": false,
//         "lowFodmap": false,
//         "weightWatcherSmartPoints": 4,
//         "gaps": "no",
//         "preparationMinutes": -1,
//         "cookingMinutes": -1,
//         "aggregateLikes": 3689,
//         "healthScore": 76,
//         "creditsText": "Full Belly Sisters",
//         "license": "CC BY-SA 3.0",
//         "sourceName": "Full Belly Sisters",
//         "pricePerServing": 112.39,
//         "id": 716426,
//         "title": "Cauliflower, Brown Rice, and Vegetable Fried Rice",
//         "readyInMinutes": 30,
//         "servings": 8,
//         "sourceUrl": "http://fullbellysisters.blogspot.com/2012/01/cauliflower-fried-rice-more-veggies.html",
//         "image": "https://spoonacular.com/recipeImages/716426-312x231.jpg",
//         "imageType": "jpg",
//         "summary":


//mapeo la api


const BuscApi = async () =>{

    try{   
    const BuscarenApi = await axios.get(`https://run.mocky.io/v3/84b3f19c-7642-4552-b69c-c53742badee5`)
    // const BuscarenApi = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=66aca8f51d11492e84ea329eccc1bd71&addRecipeInformation=true&number=100`,
    //   { headers: { "Accept-Encoding": "gzip,deflate,compress" }}
    //  )
        let info = await BuscarenApi.data.results?.map((ele) =>{ 
            
            return{
                id: ele.id,
                name: ele.title,
                summary: ele.summary,
                healthScore: ele.healthScore,
                image: ele.image,
                dishTypes: ele.dishTypes?.map(ele => ele),
                diets: ele.diets?.map(element => element), 
                steps :ele.analyzedInstructions[0]?.steps.map((ele) => `${ele.number} ${ele.step}`).join(" "),
            } 
        } ) 
        return info
    }
    catch(err){
        return err
    }
    
}




//mapeo la db
const buscarenDb = async () => {
    try{
    const buscardb = await Recipe.findAll({
        include:{
            model: Diet,
            atributes: ['name'],
            through: {
                atributes: [],
            }
        }
    })
    // var dato = JSON.parse(JSON.stringify(dbInfo, null, 2));
    // dato.forEach((el) => (el.diets = el.diets.map((el) => el.name)));

    // return dato;
    let infodb = await buscardb?.map((ele) => {
    return{
        id: ele.id,
        name: ele.name,
        summary: ele.summary,
        healthScore: ele.healthScore,
        image: ele.image,
        steps: ele.steps,
        diets: ele.diets?.map(element => element.name), 
    }
   }) 
return infodb
}
catch(err){
return err
}
}

//junto la api con la db
const dbyApi = async () =>{

   try{
const api = await BuscApi()
const db = await buscarenDb()
const dbapi = api.concat(db)
return dbapi
} 
catch(err) {
    return err
}
}


//receta por query y todas si no ahi query
const rece = async (receta) => { 
try{
    //const agregarlas =  await info.filter((ele) => ele.name === receta)
    //const agregaradb = await Recipe.findOrCreate(agregarlas) ME CAGO EN HENRY ERA MAS FACIL
    if(receta){
   const buscareceta = await dbyApi()
   const resultado = buscareceta.filter((ele) => ele.name.toLowerCase().includes(receta.toLowerCase()) === true) 
   if(resultado.length)  return resultado

}else{
    const todas = await dbyApi()
    return todas
}

    throw ("No tenemos datos sobre esta receta") 
}
catch(error) {
    return error
}
}

//buscar receta por id
const idRece = async (idReceta) =>{
 try{
 const buscareceta = await dbyApi()
const receta =  buscareceta.find((ele) => ele.id == idReceta)
if(receta) {
    return receta
}
 else throw ("Ups, no tenemos una receta con ese id")
}

catch(err) {
    return err
}
}

//Mostrar dietas
const putDietInfo = async () => {
    const dietTypes = [
        "gluten free", //
        "ketogenic", //
        "lacto ovo vegetarian", //
        "vegan", //
        "pescatarian", //
        "paleolithic", //
        "primal",//
        "fodmap friendly", //
        "whole 30", //
        "dairy free", //
    ];
    dietTypes.forEach((d) => {
        Diet.findOrCreate({
            where: {
                name: d,
            }
        })
    })
    return Diet.findAll()

}

const postRecipe = async (objRecipe) => {
    try {
        const { name, summary, healthScore, steps, image, dishTypes, diets } = objRecipe;
        const recipe = {
            name,
            summary,
            healthScore,
            steps,
            image,
            dishTypes,
        }
        const dietInfo = diets ? await Diet.findAll({

                where: {
                    name: diets,
                }
            }) : null;
            const createRecipe = await Recipe.create(recipe)

            createRecipe.addDiets(dietInfo)
    
            return Recipe.findAll()
        
        // Resto del código
    } catch (error) {
        console.error(error);
        throw new Error('Error creating recipe');
    }
};

 
 module.exports = {rece,BuscApi, buscarenDb, idRece, putDietInfo,  postRecipe, BuscApi, buscarenDb }