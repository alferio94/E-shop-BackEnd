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
//Generamos un atributo virtual llamado id el cual tendra el mismo valos que el atributo _id que manda mongoDB para hacerlo mas amigable al front end por buenas practicas.
categorySchema.virtual('id').get(function ()
{
    return this._id.toHexString();
})
//Hacemos set a la opccion de activar la virtualizacion de el atributo id
categorySchema.set('toJSON', {
    virtuals: true
})

exports.Category = mongoose.model('Category', categorySchema);
