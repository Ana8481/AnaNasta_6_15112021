//CONTROLEUR FINAL- stocke toute la logique de métier , exporte des méthodes qui sont ensuite attribuées aux routes pour améliorer la maintenabilité de l'appli

//importation du modèle d'une sauce
const Sauce = require("../models/sauce");

//importation du package fs de node
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  console.log(req.body.sauce);
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => {
      console.log(error);

      res.status(400).json({ error });
    });
};

//route pour récupérer une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

//route pour modifier une sauce

exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1]; 
      fs.unlink(`images/${filename}`, () => {
        const sauceObject = req.file
          ? {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`,
            }
          : { ...req.body };
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//route pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      //fonction callback - agit qd action précédente terminée
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//route pour récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.evaluateSauce = (req, res, next) => {
  if (req.body.like === 1) {
    // si l'utilisateur aime la sauce //
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: req.body.like++ },
        $push: { usersLiked: req.body.userId },
      }
    ) // on ajoute 1 like et on le push l'array usersLiked //
      .then((sauce) => res.status(200).json({ message: "Like" }))
      .catch((error) => res.status(400).json({ error }));
  } else if (req.body.like === -1) {
    // sinon si il aime pas la sauce //
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: req.body.like++ * -1 },
        $push: { usersDisliked: req.body.userId },
      }
    ) // on ajoute 1 dislike et on le push l'array usersDisliked //
      .then((sauce) => res.status(200).json({ message: "Dislike" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    // si l'utilisateur enleve son vote
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          // si l'array userLiked contient le id de like //
          Sauce.updateOne(
            { _id: req.params.id },
            { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
          ) // $pull : ça vide l'array userLiked et ça enleve un like sinon le meme utilisateur pourrai ajouter plusieurs like//
            .then((sauce) => {
              res.status(200).json({ message: "Annulation du Like !" });
            })
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          //// si l'array userDisliked contient le id de like //
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          ) // $pull : ça vide l'array userDisliked et ça enleve un like sinon le meme utilisateur pourrai ajouter plusieurs like//
            .then((sauce) => {
              res.status(200).json({ message: "Annulation du Dislike !" });
            })
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};
