// import in the Product model
const { Products, Note, Size, Essentialoils, Scent, Usage, Benefit } = require('../models');

const allNotes = async() => {
    return await Note.fetchAll().map((n) => {
        return [n.get('id'), n.get('name')];
    })
}

const allSizes = async() => {
    return await Size.fetchAll().map((s) => {
        return [s.get('id'), s.get('size')];
    })
}

const allEssentialOils = async() => {
    return await Essentialoils.fetchAll().map((e) => {
        return [e.get('id'), e.get('name')];
    })
}

const allScents = async() => {
    return await Scent.fetchAll().map(scent => [scent.get('id'), scent.get('type')]);
}

const allUsages = async() => {
    return await Usage.fetchAll().map(usage => [usage.get('id'), usage.get('type')]);
}

const allBenefits = async() => {
    return await Benefit.fetchAll().map(benefit => [benefit.get('id'), benefit.get('type')]);
}

const getProductByID = async (productId) => {
    return await Products.where({
        'id': productId
    }).fetch({
        require: true,
        withRelated:['essentialoil', 'scent', 'usage', 'benefit', 'note', 'size']
    })
}

const getEssentialOilByID = async (essentialoilId) => {
    return await Essentialoils.where({
        'id': essentialoilId
    }).fetch({
        require: true
    })
}

module.exports = {
    allNotes,
    allSizes,
    allEssentialOils,
    allScents,
    allUsages,
    allBenefits,
    getProductByID,
    getEssentialOilByID
}