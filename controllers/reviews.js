const IbtImage = require('../models/ibtImage');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const ibtImage = await IbtImage.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    ibtImage.reviews.push(review);
    await review.save();
    await ibtImage.save();
    req.flash('success', 'Ny kommentar har lagts till');
    res.redirect(`/ibtimages/${ibtImage._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await IbtImage.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Kommentar borttagen!')
    res.redirect(`/ibtimages/${id}`);
}