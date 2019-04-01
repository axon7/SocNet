const express =  require("express");
const router = express.Router();
const passport = require('passport');
const validationPostInput = require("../../validation/post");
//require post model
const Post = require("../../models/Post");



//@route    GET api/profile/test
router.get("/test", (req, res) =>{
    res.json({msg: "Posts test Ok!"});
});




//@route    POST api/posts/
//@desc     create new post for current user
//@access   private
router.post("/", passport.authenticate('jwt', {session:false}), (req, res) =>{
    const {errors, isValid} = validationPostInput(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post =>{
        res.status(200).json(post);
    });

});


//@route    GET api/posts/
//@desc     get all posts
//@access   public
router.get("/", (req,res)=>{
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err=> res.status(404).json(err))
});


//@route    GET api/profile/:id
//@desc     get current users profile
//@access   public
router.get("/:id", (req,res)=>{
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err=> res.status(404).json({nopostfound: 'no post found with this id'}))
});
  



//@route    DELETE api/profile/:id
//@desc     delete post by id
//@access   private
router.delete("/:id", passport.authenticate('jwt', {session: false}), (req,res)=>{
    Post.findByIdAndDelete({_id: req.params.id, user: req.user.id})
        .then(post => {
            if(post.user.toString() !== req.user.id){
               return res.status(401).json({notauthorized: "user not authorized to delete post"}) 
            } else {
                return res.json({success: "post deleted successfully"});
            }
        })
        .catch(err=> res.json(err));
});



//@route    POST api/profile/like/:id
//@desc     like post (using id)
//@access   private
router.post("/like/:id", passport.authenticate('jwt', {session: false}), (req,res)=>{
    Post.findById({_id: req.params.id, user: req.user.id})
        .then(post => {
            if(post.likes.filter(like=> like.user.toString() === req.user.id).length >0){
                return res.status(400).json({alreadyliked: "You already liked that post"})
            } 

                post.likes.unshift({user: req.user.id})
                post.save().then(post=> res.json(post))
            
        })
        .catch(err=> res.json(err));
});




//@route    POST api/profile/unlike/:id 
//@desc     unlike post (using id)
//@access   private
router.post("/unlike/:id", passport.authenticate('jwt', {session: false}), (req,res)=>{
    Post.findById({_id: req.params.id, user: req.user.id})
        .then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id)
                         .length === 0){
                return res.status(400).json({notliked: "There is not post to unlike"})
            } 
                const indexToDelete = post.likes.map(item=> item.user.toString())
                    .indexOf(req.user.id);
                post.likes.splice(indexToDelete, 1);
                post.save().then(post=> res.json(post));
        })
        .catch(err=> res.status(404).json({postnotfound: "no post found"}));
});




//@route    POST api/profile/comment/:id 
//@desc     posting comments (using post id)
//@access   private
router.post("/comment/:id", passport.authenticate('jwt', {session: false}), (req, res)=>{
    const {errors, isValid} = validationPostInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }


        Post.findById(req.params.id)
            .then(post =>{
                const newComment = {
                    user: req.user.id,
                    text: req.body.text,
                    name: req.body.name,
                    avatar: req.body.avatar
                }

                post.comments.unshift(newComment);
                post.save().then(post => res.json(post))
            })
            .catch(err=>res.json(err));
});







//@route    DELETE api/profile/comment/:id/:comment_id
//@desc     posting comments (using post id)
//@access   private
router.delete("/comment/:id/:comment_id", passport.authenticate('jwt', {session: false}), (req, res)=>{
        Post.findById(req.params.id)
            .then(post =>{
                //check if comment exist
                    if(post.comments.filter(comment=> comment._id.toString() === req.params.comment_id).length === 0){
                        return res.status(404).status({msg: "Comment which you would like to delete does not exist"})
                    } 

                    const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id)
                    post.comments.splice(removeIndex, 1);
                    post.save().then(post=> res.status(200).json(post))
                })          
            .catch(err=>res.json(err));
});








module.exports = router;
