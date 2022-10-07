const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({

})
//Generamos un atributo virtual llamado id el cual tendra el mismo valos que el atributo _id que manda mongoDB para hacerlo mas amigable al front end por buenas practicas.
orderSchema.virtual('id').get(function ()
{
    return this._id.toHexString();
})
//Hacemos set a la opccion de activar la virtualizacion de el atributo id
orderSchema.set('toJSON', {
    virtuals: true
})

exports.Order = mongoose.model('Order', orderSchema);
