const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { response } = require('express');

//Traemos una lista con usuarios
router.get(`/`, async (req, res) =>
{
    //Excluimos en la solicitud el atributo passwordHash para proteccion
    const userList = await User.find().select('-passwordHash');

    if (!userList)
    {
        res.status(500).json({ success: false })
    }
    res.send(userList);
});

//Traemos una lista con usuarios con campos especificos para llenar el admin panel
/* router.get(`/`, async (req, res) =>
{
    //Seleccionamos los datos especificos que queremos traer de nuestros usuarios
    const userList = await User.find().select('name phone email');

    if (!userList)
    {
        res.status(500).json({ success: false })
    }
    res.send(userList);
}); */

//obtener un usuario por ID
router.get(`/:id`, async (req, res) =>
{
    //Excluimos en la solicitud el atributo passwordHash para proteccion
    const user = await User.findById(req.params.id).select('-passwordHash');
    user ? res.status(200).send(user) : res.status(404).send('User not found');
});



//Creamos un nuevo usuario desde el cuerpo de la solicitud HTTP como en todas las peticiones post
router.post(`/`, async (req, res) =>
{
    //Hacemos una validacion de que el correo electronico no este registrado ya.
    const userExists = await User.findOne({ email: req.body.email });
    //Si se encuentra un usuario con esa direccion de correo electronico entonces regresamos un error de usuario ya utilizado.
    if (userExists)
    {
        return res.status(500).send('Email address already registered');
    }
    let user = new User({
        name: req.body.name,
        email: req.body.email,

        //Usamos una libreria llamada bcryptjs para hacer un hash (encriptado) al atributo password que nos mandaran del frontend
        //este encriptado sera el que usemos en el atributo passwordHash de nuestro usuario (nunca usaremos la password sin encriptar)
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });

    const result = await user.save();

    //http code created
    result ? res.status(201).send(result) : res.status(400).send('Error saving user');
});


//Editar usuarios con cambio opcional de password

router.put(`/:id`, async (req, res) =>
{
    //buscarmos al usuario en con el id que pasamos como parametro
    const userExist = await User.findById(req.params.id);
    //creamos una variable llamada newPassword con el valor de la password anterior del usuario
    let newPassword = userExist.passwordHash;
    //Si desde el frontEnd recibimos una nueva password la encriptamos y la guardamos en el newPassword
    if (req.body.password)
    {
        newPassword = bcrypt.hashSync(req.body.password, 10);
    }
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            //asignamos el valos de newPassword a passwordHash
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        }
        , { new: true });
    user ? res.status(201).send(user) : res.status(404).send('user not found');
});


//Inicio de sesion de los usuarions por medio de email y password
router.post('/login', async (req, res) =>
{
    //Buscamos un usuario que contenga ese correo electronico.
    const user = await User.findOne({ email: req.body.email });

    //Si existe el usuario y las passwords coinciden
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash))
    {
        //Traemos de nuestras variables de entorno una string que servira de llave del JWT
        const secret = process.env.SECRET
        //Creamos un Json Web Token(JWT) para validar la identidad del usuario pasando por el momento el id (esto cambiara y pasaremos mas cosas)
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin,
            },
            //pasamos la llave secreta que usamos para firmar el jwt
            secret,
            //Agregamos un tiempo de expiracion del token de 1 dia despues de eso el token ya no sera valido y el usuario debera iniciar sesion de nuevo
            {
                expiresIn: '1d'
            }
        )
        //Regresamos un objeton json con el email del usuario autenticado y su token de acceso.
        return res.status(200).send({ user: user.email, token });
    } else
    {
        return res.status(400).send('Invalid Email or Password')
    }
})

module.exports = router;