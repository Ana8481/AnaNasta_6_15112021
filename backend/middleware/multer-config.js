//Middleware qui va configurer multer pour gérer les fichiers entrants

//importation du package multer
const multer = require ('multer');

//objet dictionnaire appelé mime type et traduit les extentions reçues
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg':'jpg',
    'image/png': 'png'
}

//objet de configuration pour multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        //nom généré
        const name = file.originalname.split('').join('_');
        const extention = MIME_TYPES(file.mimetype);
        //timestamp pour le rendre unique
        callback(null, name + Date.now() + '.' + extention);
    }
});

module.exports = multer({ storage }).single('image');