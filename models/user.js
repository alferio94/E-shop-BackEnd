const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    image: String,
})

//Generamos un atributo virtual llamado id el cual tendra el mismo valos que el atributo _id que manda mongoDB para hacerlo mas amigable al front end por buenas practicas.
userSchema.virtual('id').get(function ()
{
    return this._id.toHexString();
})
//Hacemos set a la opccion de activar la virtualizacion de el atributo id
userSchema.set('toJSON', {
    virtuals: true
})
exports.User = mongoose.model('User', userSchema);
