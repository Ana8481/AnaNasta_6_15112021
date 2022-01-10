//CONTROLEUR FINAL- stocke toute la logique de métier , exporte des méthodes qui sont ensuite attribuées aux routes pour améliorer la maintenabilité de l'appli 

//importation du modèle d'une sauce
const Sauce = require('../models/sauce');

//importation du package fs de node
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  console.log(req.body.sauce)
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => {
		console.log(error)
	
		res.status(400).json({ error })
	});

};


//route pour récupérer une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

//route pour modifier une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

      const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`,()=> {

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
})};

//route pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      //fonction callback - agit qd action précédente terminée
      fs.unlink(`images/${filename}`, () => {

        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//route pour récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
 
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

/*FAIRE METHODE LIKE SAUCE en reprenant l'exemple fait 

exports.likeOrDislikeSauce = (req, res, next) => {
  
if (likes = 1) {
  
  sauce.likes += 1;
  sauce.userLiked.push(userId);

} else if (like = 0) {
  
    
    for (let i=0; i< sauce.userLiked.length; i++) {
      
      if  (sauce.userLiked[i] == userId) {
        sauce.likes -= 1;
        sauce.userLiked.splice(i,1)
      }

    }

// METTRE PAREIL POUR DISLIKE

   for (let i=0; i< sauce.userDisliked.length; i++) {
      
      if  (sauce.userdisLiked[i] == userId) {
        sauce.likes -= 1;
        sauce.userdisLiked.splice(i,1)
      }

    }
  


} else if (likes = -1) {

      sauce.dislikes += 1;
      sauce.userDisliked.push(userId);

    }


*/