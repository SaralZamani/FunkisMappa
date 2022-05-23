const IbtImage = require('../models/ibtImage');
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const ibtImages = await IbtImage.find({});
    res.render('ibtimages/index', { IbtImage })
}

module.exports.renderNewForm = (req, res) => {
    res.render('ibtimages/new');
}

module.exports.createIbtImage = async (req, res, next) => {
    const ibtImage = new IbtImage(req.body.ibtImage);
    ibtImage.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    ibtImage.author = req.user._id;
    await ibtImage.save();
    console.log(ibtImage);
    req.flash('success', 'Ny övning tillagd!');
    res.redirect(`/ibtimages/${ibtImage._id}`)
}

module.exports.showIbtImage = async (req, res,) => {
    const ibtImage = await IbtImage.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!ibtImage) {
        req.flash('error', 'Misslyckat!');
        return res.redirect('/ibtimages');
    }
    res.render('ibtimages/show', { ibtImage });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const ibtImage = await ibtImage.findById(id)
    if (!ibtImage) {
        req.flash('error', 'Övning hittas inte!');
        return res.redirect('/ibtimages');
    }
    res.render('ibtimages/edit', { ibtImage });
}

module.exports.updateIbtImage = async (req, res) => {
    const { id } = req.params;
    const ibtImage = await IbtImage.findByIdAndUpdate(id, { ...req.body.ibtImage });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    ibtImage.images.push(...imgs);
    await ibtImage.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await ibtImage.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Uppdaterat Övning!');
    res.redirect(`/ibtimages/${ibtImage._id}`)
}

module.exports.deleteIbtImage = async (req, res) => {
    const { id } = req.params;
    await IbtImage.findByIdAndDelete(id);
    req.flash('success', 'Övning borttagen!')
    res.redirect('/ibtimages');
}