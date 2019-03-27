const express =  require("express");
const router = express.Router();
const mongoose = require('mongoose');
router.get("/test", (req, res) =>{
    res.json({msg: "Posts test Ok!"});
});


module.exports = router;
