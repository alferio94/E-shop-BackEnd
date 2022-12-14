const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String,
        default: ''
    }],
    brand: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});
//Generamos un atributo virtual llamado id el cual tendra el mismo valos que el atributo _id que manda mongoDB para hacerlo mas amigable al front end por buenas practicas.
productSchema.virtual('id').get(function ()
{
    return this._id.toHexString();
})

//Hacemos set a la opccion de activar la virtualizacion de el atributo id
productSchema.set('toJSON', {
    virtuals: true
})

exports.Product = mongoose.model('products', productSchema);