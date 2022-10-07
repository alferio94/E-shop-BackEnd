const mongoose = require('mongoose');


//Mongoose requiere un schema para poder mandar y recibir peticiones a la BD.
//Igualmente por buenas practicas es correcto siempre trabajar todo del backend bajo esquemas o bajo modelos.
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
    },
    icon: {
        //fa-sharp fa-solid fa-check
        type: String,
    }
})

categorySchema.virtual('id').get(function ()
{
    return this._id.toHexString();
})
categorySchema.set('toJSON', {
    virtuals: true
})

exports.Category = mongoose.model('Category', categorySchema);
