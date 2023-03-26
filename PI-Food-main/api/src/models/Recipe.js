const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  
  sequelize.define('recipe', {
    id: {
      //Acepta numeros y letras para diferenciar los id
      type: DataTypes.UUID,//Es un tipo de dato unico de numeros y letras separadas de guiones
      defaultValue: DataTypes.UUIDV4,//es para que sequelize automaticamente me de un valor
      allowNull: false,// si o si va ser un valor obligatorio
      primaryKey: true// va ser mi llave primaria
    },
    name: {
      type: DataTypes.STRING,// va ser tipo texto
      allowNull: false,// va ser obligatorio
    },
    summary: {
      type: DataTypes.STRING,//es texto
      allowNull: false,// valor obligatorio o un true si lo coloco o no,va ser igual
    },

    healthScore: {
      type: DataTypes.INTEGER //solo aceptara numeros
    },
    steps: {
      type: DataTypes.STRING//acepta solo texto
    },
     createdInDb: {
         type: DataTypes.BOOLEAN,//es true o false
         allowNull: false,//para que se llene el valor automaticamente
         defaultValue: true// si viene de la api es false por que no se creo en la DB
     },
  },
  { timestamps: false }//para que dentro de mi base de datos no me aparezca cuando la actualice
  );
};