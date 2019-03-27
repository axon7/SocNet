const express =  require("express");
const router = express.Router();
const passport = require('passport');

//require post model
const Post = require("../../models/Post");


//@route    GET api/profile/test
router.get("/test", (req, res) =>{
    res.json({msg: "Posts test Ok!"});
});


//@route    GET api/profile/
//@desc     get current users profile
//@access   private
router.post("/", (req, res) =>{
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.name,
        user: req.user.id
    });

    newPost.save.then(post =>{
        res.json.json(post);
    })

});

module.exports = router;
