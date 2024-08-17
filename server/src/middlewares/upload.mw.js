const multer = require('multer');
const path = require('path');
const { staticConfig: { actors, directors, studios, movies } } = require('../config/staticConfig');

const storageActorPhoto = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, actors);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const storageDirectorPhoto = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, directors);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const storageStudioLogo = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, studios);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const storageMoviePoster = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, movies);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const filterImage = (req, file, cb) => {
    const mimeTypeRegex = /^image\/(png|jpeg|gif)$/;
    if(mimeTypeRegex.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error('Invalid file type. Only PNG, JPEG, and GIF are allowed.'), 
            false
        );
    }
}

module.exports.uploadActorPhoto = multer({
    storage: storageActorPhoto,
    fileFilter: filterImage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports.uploadDirectorPhoto = multer({
    storage: storageDirectorPhoto,
    fileFilter: filterImage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports.uploadStudioLogo = multer({
    storage: storageStudioLogo,
    fileFilter: filterImage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports.uploadMoviePoster = multer({
    storage: storageMoviePoster,
    fileFilter: filterImage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports.MulterError = multer.MulterError;