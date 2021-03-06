//Schéma de données contenant les champs souhaités pour chaque sauce

const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({

  
  //id utilisateur qui ajoute la sauce
userId : {type: String, required : true},

//nom sauce
name :  {type: String, required : true},

//fabriquant sauce
manufacturer :  {type: String, required : true},

//Description sauce
description : {type: String, required : true},

//ppal ingrédient épicé de la sauce
mainPepper :  {type: String, required: true},

//url image sauce téléchargé
imageUrl :  {type: String, required : true},

//note de 1 à 10 
heat :  {type: Number, required: true},

//nb utilisateur qui like la sauce
likes :  {type: Number, default :0},

//nb utilisateurs qui dislike la sauce
dislikes :  {type: Number, default: 0},

//tableau des id des utilisateurs qui ont aimé la sauce 
usersLiked : {type: Array, default :[]},

//tableau des id des utilisateurs qui n'ont pas aimé la sauce
usersDisliked : {type: Array, default: []}

});

//On exporte ce schéma en tant que modele mongoose appelée Sauce
module.exports = mongoose.model('Sauce', sauceSchema);