const express = require('express');
const router = express.Router();
const ibtImages = require('../controllers/ibtImages');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateIbtImage } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const IbtImage = require('../models/ibtImage');

router.route('/')
    .get(catchAsync(ibtImages.index))
    .post(isLoggedIn, isAuthor, upload.array('image'), validateIbtImage, catchAsync(ibtImages.updateIbtImage))


router.get('/new', isLoggedIn, ibtImages.renderNewForm)

router.route('/:id')
    .get(catchAsync(ibtImages.showIbtImage))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateIbtImage, catchAsync(ibtImages.updateIbtImage))
    .delete(isLoggedIn, isAuthor, catchAsync(ibtImages.deleteIbtImage));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(ibtImages.renderEditForm))



module.exports = router;
