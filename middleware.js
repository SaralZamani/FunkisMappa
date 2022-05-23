const { ibtSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const IbtImage = require('./models/ibtImage');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Du måste vara inloggad!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateIbtImage = (req, res, next) => {
    const { error } = ibtSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const ibtImage = await IbtImage.findById(id);
    if (!ibtImage.author.equals(req.user._id)) {
        req.flash('error', 'Du saknar behörighet');
        return res.redirect(`/ibtimages/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Du saknar behörighet');
        return res.redirect(`/ibtimages/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}