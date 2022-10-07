const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

//Traemos una lista con usuarios. seguimos trabajando esto es una version beta de la zona de user.
router.get(`/`, async (req, res) =>
{
    const userList = await User.find();

    if (!userList)
    {
        res.status(500).json({ success: false })
    }
    res.send(userList);
})

module.exports = router;