const express =  require("express");
const router = express.Router();

router.get("/test", (req, res) =>
    res.json({msg: "Profile test Ok!"})
);

module.exports=  router;